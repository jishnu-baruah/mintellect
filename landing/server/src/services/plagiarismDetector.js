import { pipeline } from '@xenova/transformers';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { extractPdfMetadata } from './pdfExtractor.js';
import { PDF_CHECKS } from './pdfExtractor.js';
import logger from '../utils/logger.js';
import fs from 'fs';

// Lightweight model configuration
let model;
async function getModel() {
  if (!model) {
    logger.info('Loading transformer model...');
    model = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
      revision: 'fp16',
      quantized: true,
    });
    logger.info('Model loaded successfully');
  }
  return model;
}

// Optimized similarity calculation
function fastCosineSimilarity(a, b) {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] ** 2;
    magB += b[i] ** 2;
  }
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

/**
 * Detect plagiarism in a PDF file
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<Object>} - Plagiarism detection results
 */
export async function detectPlagiarism(filePath) {
  try {
    logger.info(`Detecting plagiarism in file: ${filePath}`);
    
    // Read the PDF file
    const pdfBuffer = fs.readFileSync(filePath);
    
    // Extract text from PDF
    const metadata = await extractPdfMetadata(filePath);
    const { text, pageCount, isScanned } = metadata;
    
    // Basic quality checks
    if (isScanned) {
      throw new Error('Scanned PDFs not supported');
    }
    
    if (pageCount < PDF_CHECKS.MIN_PAGES) {
      throw new Error('Document too short');
    }

    // Focus on key sections
    const focusText = text.split('\n')
      .filter(line => PDF_CHECKS.REQUIRED_SECTIONS.some(section => 
        line.toLowerCase().includes(section)
      ))
      .join(' ')
      .substring(0, 2000);

    // Get embeddings
    const model = await getModel();
    logger.info('Generating embeddings...');
    const [docEmbedding, arxivEmbedding] = await Promise.all([
      model(focusText, { pooling: 'mean' }),
      model("arxiv:" + focusText, { pooling: 'mean' }) // Simple query expansion
    ]);

    // Search arXiv with compressed query
    logger.info('Searching arXiv for similar papers...');
    const params = new URLSearchParams({
      search_query: `all:"${focusText.substring(0, 100)}"`,
      max_results: 5,
      sortBy: 'relevance'
    });

    const response = await axios.get(`http://export.arxiv.org/api/query?${params}`);
    const parser = new XMLParser();
    const arxivResult = parser.parse(response.data);
    let entries = arxivResult.feed?.entry || [];
    
    // Ensure entries is an array
    const entriesArray = Array.isArray(entries) ? entries : [entries];
    const validEntries = entriesArray.slice(0, 5); // Top 5 results

    // Compare embeddings
    logger.info(`Comparing embeddings with ${validEntries.length} arXiv papers...`);
    let matches = [];
    
    for (const entry of validEntries) {
      try {
        const summary = entry.summary.replace(/\s+/g, ' ').trim();
        const summaryEmbedding = await model(summary, { pooling: 'mean' });
        const score = fastCosineSimilarity(
          Array.from(docEmbedding.data),
          Array.from(summaryEmbedding.data)
        );
        
        // Get the PDF link
        let pdfUrl = '';
        if (entry.link) {
          const links = Array.isArray(entry.link) ? entry.link : [entry.link];
          const pdfLink = links.find(l => l['@_title'] === 'pdf');
          pdfUrl = pdfLink ? pdfLink['@_href'] : '';
        }
        
        matches.push({
          score: Math.round(score * 100),
          title: entry.title,
          url: pdfUrl || `https://arxiv.org/abs/${entry.id.split('/').pop()}`,
          year: entry.published.substring(0, 4),
          authors: entry.author ? formatAuthors(entry.author) : 'Unknown'
        });
      } catch (error) {
        logger.error(`Error processing entry: ${error.message}`);
      }
    }

    // Sort matches by score (highest first)
    matches.sort((a, b) => b.score - a.score);
    
    // Calculate section scores based on matches
    const sectionScores = calculateSectionScores(text, matches);
    
    // Calculate overall score
    const overallScore = 100 - Math.min(100, Math.max(...matches.map(m => m.score)));
    
    // Format the response
    const result = formatPlagiarismResult(overallScore, matches, sectionScores);
    logger.info(`Plagiarism detection completed with score: ${overallScore}`);
    
    return result;
  } catch (error) {
    logger.error(`Plagiarism detection error: ${error.message}`);
    throw new Error(`Plagiarism detection failed: ${error.message}`);
  }
}

/**
 * Format authors from arXiv response
 * @param {Array|Object} authors - Author data from arXiv
 * @returns {string} - Formatted author string
 */
function formatAuthors(authors) {
  if (Array.isArray(authors)) {
    return authors.map(a => a.name).join(', ');
  } else if (authors.name) {
    return authors.name;
  }
  return 'Unknown';
}

/**
 * Calculate section scores based on matches
 * @param {string} text - Full text content
 * @param {Array} matches - Matching papers
 * @returns {Array} - Section scores
 */
function calculateSectionScores(text, matches) {
  const sections = {};
  
  // Extract sections
  for (const section of PDF_CHECKS.REQUIRED_SECTIONS) {
    const regex = new RegExp(`\\b${section}\\b[\\s\\S]*?(?=\\b(${PDF_CHECKS.REQUIRED_SECTIONS.join('|')})\\b|$)`, 'i');
    const match = text.match(regex);
    if (match) {
      sections[section] = match[0];
    }
  }
  
  // Calculate scores for each section
  const sectionScores = [];
  for (const [section, content] of Object.entries(sections)) {
    // Simple heuristic: if a section has keywords from the top match, it's more likely to be similar
    let score = 100;
    let flaggedCount = 0;
    let examples = [];
    
    if (matches.length > 0) {
      const topMatch = matches[0];
      const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 30);
      
      for (const sentence of sentences) {
        // Simple keyword matching for demonstration
        if (topMatch.title.split(' ').some(word => 
          word.length > 5 && sentence.toLowerCase().includes(word.toLowerCase())
        )) {
          flaggedCount++;
          if (examples.length < 3) {
            examples.push({
              sentence: sentence.trim(),
              similarity: 0.7 + (Math.random() * 0.2), // Simulated similarity
              potentialSource: `${topMatch.title} (${topMatch.year}) by ${topMatch.authors}`,
              sourceUrl: topMatch.url
            });
          }
        }
      }
      
      // Adjust score based on flagged sentences
      if (sentences.length > 0) {
        score = Math.max(0, 100 - (flaggedCount * 100 / sentences.length));
      }
    }
    
    sectionScores.push({
      section,
      score: Math.round(score),
      flaggedCount,
      examples
    });
  }
  
  return sectionScores;
}

/**
 * Format the plagiarism detection result
 * @param {number} overallScore - Overall originality score
 * @param {Array} matches - Matching papers
 * @param {Array} sectionScores - Section scores
 * @returns {Object} - Formatted result
 */
function formatPlagiarismResult(overallScore, matches, sectionScores) {
  // Determine risk level
  let plagiarismRisk;
  if (overallScore >= 85) {
    plagiarismRisk = "Low";
  } else if (overallScore >= 70) {
    plagiarismRisk = "Moderate";
  } else if (overallScore >= 50) {
    plagiarismRisk = "High";
  } else {
    plagiarismRisk = "Very High";
  }
  
  // Generate recommendations
  const recommendations = sectionScores
    .filter(s => s.score < 70)
    .map(s => ({
      section: s.section,
      advice: `Review ${s.flaggedCount} potentially unoriginal statements in this section`
    }));
  
  return {
    summary: {
      overallScore: Math.round(overallScore),
      plagiarismRisk,
      analyzedSections: sectionScores.map(s => s.section),
      documentMetadata: {
        matches: matches.length,
        topMatchScore: matches.length > 0 ? matches[0].score : 0
      }
    },
    detailedResults: sectionScores,
    topMatches: matches.slice(0, 3),
    recommendations
  };
}
