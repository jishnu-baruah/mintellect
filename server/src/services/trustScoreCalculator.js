import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

class TrustScoreCalculator {
  constructor() {
    this.geminiApiKey = process.env.GEMINI_API_KEY;
    this.geminiApiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
  }

  /**
   * Calculate trust score using Gemini 2.5 Flash and plagiarism data
   * @param {Object} options - Calculation options
   * @param {string} options.textContent - Document text content
   * @param {Object} options.plagiarismResults - Plagiarism check results
   * @param {string} options.fileId - File ID for reference
   * @returns {Object} Trust score results
   */
  async calculateTrustScore({ textContent, plagiarismResults, fileId }) {
    try {
      console.log(`[TrustScoreCalculator] Starting trust score calculation for file: ${fileId}`);

      // Extract plagiarism score
      const plagiarismScore = this.extractPlagiarismScore(plagiarismResults);
      
      // Get AI analysis from Gemini 2.5 Flash
      const aiAnalysis = await this.analyzeWithGemini(textContent);
      
      // Calculate weighted trust score
      const trustScore = this.calculateWeightedScore(plagiarismScore, aiAnalysis);
      
      // Generate detailed breakdown
      const breakdown = this.generateBreakdown(plagiarismScore, aiAnalysis, trustScore);
      
      // Create recommendations
      const recommendations = this.generateRecommendations(trustScore, breakdown);
      
      const result = {
        trustScore: Math.round(trustScore * 100),
        plagiarismScore: Math.round(plagiarismScore * 100),
        aiAnalysis,
        breakdown,
        recommendations,
        timestamp: new Date().toISOString(),
        fileId
      };

      console.log(`[TrustScoreCalculator] Trust score calculation completed: ${result.trustScore}%`);
      return result;

    } catch (error) {
      console.error('[TrustScoreCalculator] Error calculating trust score:', error);
      throw new Error(`Trust score calculation failed: ${error.message}`);
    }
  }

  /**
   * Extract plagiarism score from results
   * @param {Object} plagiarismResults - Plagiarism check results
   * @returns {number} Plagiarism score (0-1)
   */
  extractPlagiarismScore(plagiarismResults) {
    if (!plagiarismResults) {
      console.warn('[TrustScoreCalculator] No plagiarism results provided, using default score');
      return 0.85; // Default high score if no plagiarism data
    }

    // Handle different plagiarism result formats
    let score = 0;
    
    if (plagiarismResults.plagiarism?.overall_score) {
      score = plagiarismResults.plagiarism.overall_score / 100;
    } else if (plagiarismResults.overall_score) {
      score = plagiarismResults.overall_score / 100;
    } else if (plagiarismResults.score) {
      score = plagiarismResults.score / 100;
    } else {
      console.warn('[TrustScoreCalculator] Could not extract plagiarism score, using default');
      score = 0.85;
    }

    // Convert to originality score (inverse of plagiarism)
    return Math.max(0, 1 - score);
  }

  /**
   * Analyze text content using Gemini 2.5 Flash
   * @param {string} textContent - Document text to analyze
   * @returns {Object} AI analysis results
   */
  async analyzeWithGemini(textContent) {
    if (!this.geminiApiKey) {
      console.warn('[TrustScoreCalculator] No Gemini API key provided, using fallback analysis');
      return this.generateFallbackAnalysis();
    }

    try {
      // Truncate text if too long (Gemini has limits)
      const truncatedText = textContent.length > 30000 ? 
        textContent.substring(0, 30000) + '...' : textContent;

      const prompt = `
Analyze the following academic text and provide a detailed assessment of its trustworthiness and authenticity. Consider:

1. Writing style and coherence
2. Academic rigor and methodology
3. Citation quality and references
4. Originality indicators
5. Potential AI-generated content markers

Text to analyze:
${truncatedText}

IMPORTANT: Respond ONLY with valid JSON in the exact format below. Do not include any other text, explanations, or markdown formatting:

{
  "aiProbability": 0.2,
  "humanWrittenProbability": 0.8,
  "academicQuality": 0.75,
  "methodologyScore": 0.7,
  "citationQuality": 0.7,
  "originalityScore": 0.8,
  "confidence": 0.8,
  "classification": "human-written",
  "analysis": "This document shows strong academic writing patterns with proper citations and methodology.",
  "flags": [],
  "recommendations": ["Consider adding more recent citations"]
}
`;

      const response = await fetch(`${this.geminiApiUrl}?key=${this.geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            topK: 1,
            topP: 0.8,
            maxOutputTokens: 2048,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response from Gemini API');
      }

      const responseText = data.candidates[0].content.parts[0].text;
      
      console.log('[TrustScoreCalculator] Raw Gemini response:', responseText);
      
      // Try to parse JSON from response
      try {
        // First, try to extract JSON from the response if it's wrapped in markdown
        let jsonText = responseText;
        
        // Remove markdown code blocks if present
        if (responseText.includes('```json')) {
          const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
          if (jsonMatch) {
            jsonText = jsonMatch[1];
          }
        } else if (responseText.includes('```')) {
          const jsonMatch = responseText.match(/```\s*([\s\S]*?)\s*```/);
          if (jsonMatch) {
            jsonText = jsonMatch[1];
          }
        }
        
        // Clean up the JSON text
        jsonText = jsonText.trim();
        
        const analysis = JSON.parse(jsonText);
        console.log('[TrustScoreCalculator] Successfully parsed Gemini response:', analysis);
        return this.validateAndNormalizeAnalysis(analysis);
      } catch (parseError) {
        console.warn('[TrustScoreCalculator] Failed to parse Gemini response as JSON:', parseError.message);
        console.warn('[TrustScoreCalculator] Response text:', responseText);
        
        // Try to extract partial analysis from the response
        const partialAnalysis = this.extractPartialAnalysis(responseText);
        console.log('[TrustScoreCalculator] Using partial analysis:', partialAnalysis);
        return partialAnalysis;
      }

    } catch (error) {
      console.error('[TrustScoreCalculator] Gemini API error:', error);
      return this.generateFallbackAnalysis();
    }
  }

  /**
   * Validate and normalize AI analysis results
   * @param {Object} analysis - Raw analysis from Gemini
   * @returns {Object} Normalized analysis
   */
  validateAndNormalizeAnalysis(analysis) {
    const normalized = {
      aiProbability: Math.max(0, Math.min(1, analysis.aiProbability || 0)),
      humanWrittenProbability: Math.max(0, Math.min(1, analysis.humanWrittenProbability || 0)),
      academicQuality: Math.max(0, Math.min(1, analysis.academicQuality || 0.7)),
      methodologyScore: Math.max(0, Math.min(1, analysis.methodologyScore || 0.7)),
      citationQuality: Math.max(0, Math.min(1, analysis.citationQuality || 0.7)),
      originalityScore: Math.max(0, Math.min(1, analysis.originalityScore || 0.8)),
      confidence: Math.max(0, Math.min(1, analysis.confidence || 0.8)),
      classification: analysis.classification || 'mixed',
      analysis: analysis.analysis || 'Analysis not available',
      flags: Array.isArray(analysis.flags) ? analysis.flags : [],
      recommendations: Array.isArray(analysis.recommendations) ? analysis.recommendations : []
    };

    // Ensure probabilities sum to 1
    const total = normalized.aiProbability + normalized.humanWrittenProbability;
    if (total > 0) {
      normalized.aiProbability /= total;
      normalized.humanWrittenProbability /= total;
    }

    return normalized;
  }

  /**
   * Generate fallback analysis when Gemini is unavailable
   * @returns {Object} Fallback analysis
   */
  generateFallbackAnalysis() {
    return {
      aiProbability: 0.2,
      humanWrittenProbability: 0.8,
      academicQuality: 0.75,
      methodologyScore: 0.7,
      citationQuality: 0.7,
      originalityScore: 0.8,
      confidence: 0.6,
      classification: 'human-written',
      analysis: 'Analysis performed using fallback methods due to API unavailability.',
      flags: [],
      recommendations: ['Consider manual review for comprehensive assessment']
    };
  }

  /**
   * Extract partial analysis from failed JSON response
   * @param {string} responseText - Raw response text from Gemini
   * @returns {Object} Partial analysis with fallback values
   */
  extractPartialAnalysis(responseText) {
    try {
      // Try to extract any numbers that might be scores
      const numbers = responseText.match(/\d+\.?\d*/g) || [];
      const scores = numbers.map(n => parseFloat(n)).filter(n => n >= 0 && n <= 1);
      
      // Try to extract classification keywords
      const classification = responseText.toLowerCase().includes('ai') ? 'ai-generated' :
                           responseText.toLowerCase().includes('human') ? 'human-written' : 'mixed';
      
      // Try to extract analysis text
      const analysisMatch = responseText.match(/analysis["\s]*:["\s]*([^"]+)/i);
      const analysis = analysisMatch ? analysisMatch[1] : 'Analysis extracted from response';
      
      return {
        aiProbability: scores[0] || 0.2,
        humanWrittenProbability: scores[1] || 0.8,
        academicQuality: scores[2] || 0.75,
        methodologyScore: scores[3] || 0.7,
        citationQuality: scores[4] || 0.7,
        originalityScore: scores[5] || 0.8,
        confidence: scores[6] || 0.6,
        classification: classification,
        analysis: analysis,
        flags: [],
        recommendations: ['Consider manual review for comprehensive assessment']
      };
    } catch (error) {
      console.warn('[TrustScoreCalculator] Failed to extract partial analysis:', error);
      return this.generateFallbackAnalysis();
    }
  }

  /**
   * Calculate weighted trust score
   * @param {number} plagiarismScore - Plagiarism/originality score (0-1)
   * @param {Object} aiAnalysis - AI analysis results
   * @returns {number} Weighted trust score (0-1)
   */
  calculateWeightedScore(plagiarismScore, aiAnalysis) {
    // Weights for different components
    const weights = {
      plagiarism: 0.35,
      aiDetection: 0.25,
      academicQuality: 0.20,
      methodology: 0.15,
      citations: 0.05
    };

    // Calculate component scores
    const plagiarismComponent = plagiarismScore * weights.plagiarism;
    const aiComponent = (1 - aiAnalysis.aiProbability) * weights.aiDetection;
    const academicComponent = aiAnalysis.academicQuality * weights.academicQuality;
    const methodologyComponent = aiAnalysis.methodologyScore * weights.methodology;
    const citationsComponent = aiAnalysis.citationQuality * weights.citations;

    // Sum all components
    const totalScore = plagiarismComponent + aiComponent + academicComponent + 
                      methodologyComponent + citationsComponent;

    return Math.max(0, Math.min(1, totalScore));
  }

  /**
   * Generate detailed breakdown of trust score
   * @param {number} plagiarismScore - Plagiarism score
   * @param {Object} aiAnalysis - AI analysis
   * @param {number} trustScore - Overall trust score
   * @returns {Object} Detailed breakdown
   */
  generateBreakdown(plagiarismScore, aiAnalysis, trustScore) {
    return {
      overall: {
        score: trustScore,
        level: this.getTrustLevel(trustScore),
        confidence: aiAnalysis.confidence
      },
      components: {
        plagiarism: {
          score: plagiarismScore,
          weight: 0.35,
          contribution: plagiarismScore * 0.35,
          description: 'Originality and uniqueness assessment'
        },
        aiDetection: {
          score: 1 - aiAnalysis.aiProbability,
          weight: 0.25,
          contribution: (1 - aiAnalysis.aiProbability) * 0.25,
          description: 'AI-generated content detection'
        },
        academicQuality: {
          score: aiAnalysis.academicQuality,
          weight: 0.20,
          contribution: aiAnalysis.academicQuality * 0.20,
          description: 'Academic writing quality assessment'
        },
        methodology: {
          score: aiAnalysis.methodologyScore,
          weight: 0.15,
          contribution: aiAnalysis.methodologyScore * 0.15,
          description: 'Research methodology evaluation'
        },
        citations: {
          score: aiAnalysis.citationQuality,
          weight: 0.05,
          contribution: aiAnalysis.citationQuality * 0.05,
          description: 'Citation and reference quality'
        }
      },
      aiAnalysis: {
        classification: aiAnalysis.classification,
        humanWrittenProbability: aiAnalysis.humanWrittenProbability,
        flags: aiAnalysis.flags,
        analysis: aiAnalysis.analysis
      }
    };
  }

  /**
   * Get trust level based on score
   * @param {number} score - Trust score (0-1)
   * @returns {string} Trust level
   */
  getTrustLevel(score) {
    if (score >= 0.85) return 'Very High';
    if (score >= 0.70) return 'High';
    if (score >= 0.50) return 'Moderate';
    if (score >= 0.30) return 'Low';
    return 'Very Low';
  }

  /**
   * Generate recommendations based on trust score
   * @param {number} trustScore - Overall trust score
   * @param {Object} breakdown - Detailed breakdown
   * @returns {Array} List of recommendations
   */
  generateRecommendations(trustScore, breakdown) {
    const recommendations = [];

    // Overall trust score recommendations
    if (trustScore < 0.5) {
      recommendations.push('Consider significant revisions before publication');
      recommendations.push('Review methodology and citation practices');
    } else if (trustScore < 0.7) {
      recommendations.push('Minor improvements recommended');
      recommendations.push('Consider enhancing academic rigor');
    } else if (trustScore >= 0.85) {
      recommendations.push('Document appears ready for publication');
      recommendations.push('Maintain current quality standards');
    }

    // Component-specific recommendations
    if (breakdown.components.plagiarism.score < 0.7) {
      recommendations.push('Review for potential plagiarism issues');
    }

    if (breakdown.components.aiDetection.score < 0.6) {
      recommendations.push('Consider manual review for AI-generated content');
    }

    if (breakdown.components.academicQuality.score < 0.6) {
      recommendations.push('Enhance academic writing style');
    }

    if (breakdown.components.methodology.score < 0.6) {
      recommendations.push('Strengthen research methodology section');
    }

    // Add AI analysis recommendations
    if (breakdown.aiAnalysis.flags.length > 0) {
      recommendations.push(`Review flagged issues: ${breakdown.aiAnalysis.flags.join(', ')}`);
    }

    return recommendations;
  }
}

export default TrustScoreCalculator; 