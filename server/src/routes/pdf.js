import express from 'express';
import puppeteer from 'puppeteer';
import AWS from 'aws-sdk';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Skip Puppeteer if SKIP_PUPPETEER is set to true
const SKIP_PUPPETEER = process.env.SKIP_PUPPETEER === 'true';

// Handle preflight requests for PDF endpoints
router.options('*', (req, res) => {
  setCorsHeaders(req, res);
  res.status(200).end();
});

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'mintellect-pdfs';

// Helper function to set CORS headers
const setCorsHeaders = (req, res) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'https://app.mintellect.xyz',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001'
  ];
  
  res.setHeader('Access-Control-Allow-Origin', allowedOrigins.includes(origin) ? origin : 'https://app.mintellect.xyz');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

// Helper function to get logo as base64
const getLogoBase64 = () => {
  try {
    const logoPath = path.join(process.cwd(), 'src', 'public', 'img', 'Mintellect_logo.png');
      console.log('Looking for logo at:', logoPath);
      if (fs.existsSync(logoPath)) {
        console.log('Logo file found!');
        const logoBuffer = fs.readFileSync(logoPath);
        const base64Logo = `data:image/png;base64,${logoBuffer.toString('base64')}`;
        console.log('Logo converted to base64, length:', base64Logo.length);
        return base64Logo;
    } else {
      console.log('Logo file not found at:', logoPath);
      }
  } catch (error) {
    console.error('Error reading logo file:', error);
  }
  // Fallback to a simple text logo if file not found
  console.log('Using fallback text logo');
  return null;
};

// Test endpoint for PDF generation
router.get('/test', async (req, res) => {
  try {
    console.log('Testing PDF generation...');
    
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent('<h1>Test PDF</h1><p>This is a test PDF generation.</p>');
    
    const pdf = await page.pdf({ format: 'A4' });
    await browser.close();
    
    console.log('Test PDF generated, size:', pdf.length, 'bytes');
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="test.pdf"');
    res.end(pdf);
    
  } catch (error) {
    console.error('Test PDF generation failed:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test endpoint to verify logo loading
router.get('/test-logo', (req, res) => {
  try {
    const logoBase64 = getLogoBase64();
    if (logoBase64) {
      res.json({
        success: true,
        message: 'Logo loaded successfully',
        logoLength: logoBase64.length,
        logoPreview: logoBase64.substring(0, 100) + '...'
      });
    } else {
      res.json({
        success: false,
        message: 'Logo not found, using fallback'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error loading logo',
      error: error.message
    });
  }
});

// Direct PDF generation (sends PDF directly to client)
router.post('/generate-plagiarism-report-direct', async (req, res) => {
  try {
    console.log('Generating PDF and sending directly to client...');
    
    const { plagiarismData, documentName, sources } = req.body;
    
    console.log('Received data:', {
      hasPlagiarismData: !!plagiarismData,
      documentName,
      sourcesCount: sources ? sources.length : 0,
      sources: sources
    });
    
    if (!plagiarismData || !documentName) {
      return res.status(400).json({ error: 'Missing required data' });
    }
    
    // Generate HTML content for the PDF
    const htmlContent = generatePlagiarismReportHTML(plagiarismData, documentName, sources);
    
    console.log('HTML content generated, length:', htmlContent.length);
    
    // Skip Puppeteer if flag is set
    if (SKIP_PUPPETEER) {
      console.log('Skipping Puppeteer - returning HTML URL for manual PDF conversion');
      const timestamp = Date.now();
      const sanitizedName = documentName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const filename = `${sanitizedName}_plagiarism_report_${timestamp}.html`;
      
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      setCorsHeaders(req, res);
      
      return res.send(htmlContent);
    }
    
    // Generate PDF using Puppeteer
    let pdf;
    
    try {
      // Launch Puppeteer with production-ready settings
      console.log('Launching Puppeteer...');
      
      const possibleChromePaths = [
        process.env.CHROME_BIN,
        process.env.PUPPETEER_EXECUTABLE_PATH,
        '/usr/bin/google-chrome',
        '/usr/bin/chromium-browser',
        '/usr/bin/chromium',
        '/opt/google/chrome/chrome',
        '/usr/bin/google-chrome-stable'
      ].filter(Boolean);
      
      console.log('Possible Chrome paths:', possibleChromePaths);
      
      let executablePath;
      for (const path of possibleChromePaths) {
        try {
          if (fs.existsSync(path)) {
            executablePath = path;
            console.log('Found Chrome at:', executablePath);
            break;
          }
        } catch (e) {
          console.log('Could not check path:', path);
        }
      }
      
    const browser = await puppeteer.launch({
      headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ],
        ...(executablePath && { executablePath })
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
      pdf = await page.pdf({
      format: 'A4',
      margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
      printBackground: false,
      displayHeaderFooter: false,
      preferCSSPageSize: false,
      omitBackground: true
    });
    
    await browser.close();
      console.log('PDF generated successfully, size:', pdf.length, 'bytes');
      
    } catch (puppeteerError) {
      console.error('Puppeteer error:', puppeteerError);
      console.log('Attempting alternative PDF generation...');
      
      // Fallback: Return HTML content for manual PDF conversion
      const fallbackHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Plagiarism Report - ${documentName}</title>
          <style>
            ${getCSSContent()}
            
            @media print {
              body { margin: 0; padding: 20px; }
              .no-print { display: none; }
              .page-break { page-break-before: always; }
            }
            
            body { 
              font-family: Arial, sans-serif; 
              padding: 20px; 
              margin: 0;
              background: white;
              color: #333;
            }
            
            .instructions {
              background: #f8f9fa;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 20px;
              border-left: 4px solid #6366f1;
              text-align: center;
            }
            
            .instructions h3 {
              margin-top: 0;
              color: #6366f1;
              font-size: 18px;
            }
            
            .instructions ol {
              text-align: left;
              max-width: 500px;
              margin: 0 auto;
            }
            
            .instructions li {
              margin-bottom: 8px;
              color: #555;
            }
            
            .print-button {
              background: #6366f1;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 6px;
              cursor: pointer;
              font-size: 16px;
              margin: 10px;
              transition: background-color 0.2s;
            }
            
            .print-button:hover {
              background: #4f46e5;
            }
            
            .print-button:active {
              background: #3730a3;
            }
            
            .keyboard-shortcut {
              background: #e0e7ff;
              padding: 4px 8px;
              border-radius: 4px;
              font-family: monospace;
              font-size: 14px;
              color: #3730a3;
              font-weight: bold;
            }
            
            .note {
              background: #fef3c7;
              border: 1px solid #f59e0b;
              padding: 12px;
              border-radius: 6px;
              margin: 15px 0;
              color: #92400e;
            }
            
            .note strong {
              color: #78350f;
            }
            
            @media print {
              .print-button, .instructions {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="instructions">
            <h3>📄 How to Save as PDF</h3>
            <ol>
              <li><strong>Press Ctrl+P (Windows) or Cmd+P (Mac)</strong></li>
              <li>Select "Save as PDF" as the destination</li>
              <li>Choose your preferred settings</li>
              <li>Click "Save" to download the PDF</li>
            </ol>
            <button class="print-button" onclick="window.print()">🖨️ Print/Save as PDF</button>
            <button class="print-button" onclick="window.close()">❌ Close</button>
          </div>
          
          <div class="report-content">
            ${htmlContent}
          </div>
        </body>
        </html>
      `;
      
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Content-Disposition', `inline; filename="${documentName}_plagiarism_report.html"`);
      setCorsHeaders(req, res);
      
      return res.send(fallbackHtml);
    }
    
    // Verify PDF was generated correctly
    if (!pdf || pdf.length === 0) {
      throw new Error('PDF generation failed - empty result');
    }
    
    // Check if PDF starts with the correct magic number
    const pdfHeader = pdf.slice(0, 4).toString('ascii');
    if (pdfHeader !== '%PDF') {
      console.error('Invalid PDF header:', pdfHeader);
      throw new Error('Generated file is not a valid PDF');
    }
    
    console.log('PDF verification passed, sending to client...');
    
    // Set response headers
    const timestamp = Date.now();
    const sanitizedName = documentName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const filename = `${sanitizedName}_plagiarism_report_${timestamp}.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Access-Control-Allow-Origin', 'https://app.mintellect.xyz');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Send PDF directly as Buffer
    res.end(pdf);
    
  } catch (error) {
    console.error('Direct PDF generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate PDF', 
      details: error.message 
    });
  }
});

// Generate PDF and upload to S3
router.post('/generate-plagiarism-report-s3', async (req, res) => {
  try {
    console.log('Generating PDF for S3 storage...');
    
    const { plagiarismData, documentName, sources } = req.body;
    
    if (!plagiarismData || !documentName) {
      return res.status(400).json({ error: 'Missing required data' });
    }
    
    // Generate HTML content for the PDF
        const htmlContent = generatePlagiarismReportHTML(plagiarismData, documentName, sources);
        
    // Skip Puppeteer if flag is set
    if (SKIP_PUPPETEER) {
      console.log('Skipping Puppeteer - returning HTML URL for manual PDF conversion');
        const timestamp = Date.now();
        const sanitizedName = documentName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const filename = `${sanitizedName}_plagiarism_report_${timestamp}.html`;
      
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      setCorsHeaders(req, res);
      
      return res.send(htmlContent);
    }
    
    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate PDF
    const pdf = await page.pdf({
      format: 'A4',
      margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
      printBackground: false,
      displayHeaderFooter: false,
      preferCSSPageSize: false,
      omitBackground: true
    });
    
    await browser.close();
    
    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = documentName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const filename = `${sanitizedName}_plagiarism_report_${timestamp}.pdf`;
    
    // Upload to S3
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: `plagiarism-reports/${filename}`,
      Body: pdf,
      ContentType: 'application/pdf',
      ContentDisposition: `attachment; filename="${filename}"`,
      Metadata: {
        'document-name': documentName,
        'generated-at': new Date().toISOString(),
        'plagiarism-score': plagiarismData.plagiarism?.toString() || '0',
        'originality-score': plagiarismData.originality?.toString() || '0'
      }
    };
    
    console.log('Uploading PDF to S3...');
    const uploadResult = await s3.upload(uploadParams).promise();
    
    // Generate presigned URL for download (expires in 1 hour)
    const downloadParams = {
      Bucket: BUCKET_NAME,
      Key: `plagiarism-reports/${filename}`,
      Expires: 3600 // 1 hour
    };
    
    const downloadUrl = await s3.getSignedUrlPromise('getObject', downloadParams);
    
    console.log('PDF uploaded successfully to S3');
    
    res.json({
      success: true,
      message: 'PDF generated and uploaded successfully',
      downloadUrl: downloadUrl,
      filename: filename,
      s3Key: `plagiarism-reports/${filename}`
    });
    
  } catch (error) {
    console.error('S3 PDF generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate and upload PDF', 
      details: error.message 
    });
  }
});

// Generate Trust Score Report and upload to S3
router.post('/generate-trust-score-report-s3', async (req, res) => {
  try {
    console.log('Generating Trust Score Report for S3 storage...');
    
    const { trustScoreData, documentName, fileId } = req.body;
    
    if (!trustScoreData || !documentName || !fileId) {
      return res.status(400).json({ error: 'Missing required data' });
    }
    
    // Generate HTML content for the Trust Score Report
    const htmlContent = generateTrustScoreReportHTML(trustScoreData, documentName, fileId);
    
    // Skip Puppeteer if flag is set
    if (SKIP_PUPPETEER) {
      console.log('Skipping Puppeteer - returning HTML URL for manual PDF conversion');
      const timestamp = Date.now();
      const sanitizedName = documentName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const filename = `${sanitizedName}_trust_score_report_${timestamp}.html`;
      
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      setCorsHeaders(req, res);
      
      return res.send(htmlContent);
    }
    
    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate PDF
    const pdf = await page.pdf({
      format: 'A4',
      margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
      printBackground: false,
      displayHeaderFooter: false,
      preferCSSPageSize: false,
      omitBackground: true
    });
    
    await browser.close();
    
    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = documentName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const filename = `${sanitizedName}_trust_score_report_${timestamp}.pdf`;
    
    // Upload to S3
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: `trust-score-reports/${filename}`,
      Body: pdf,
      ContentType: 'application/pdf',
      ContentDisposition: `attachment; filename="${filename}"`,
      Metadata: {
        'document-name': documentName,
        'file-id': fileId,
        'generated-at': new Date().toISOString(),
        'trust-score': trustScoreData.trustScore?.toString() || '0'
      }
    };
    
    console.log('Uploading Trust Score Report to S3...');
    const uploadResult = await s3.upload(uploadParams).promise();
    
    // Generate presigned URL for download (expires in 1 hour)
    const downloadParams = {
      Bucket: BUCKET_NAME,
      Key: `trust-score-reports/${filename}`,
      Expires: 3600 // 1 hour from now
    };
    
    const downloadUrl = await s3.getSignedUrlPromise('getObject', downloadParams);
    
    console.log('Trust Score Report uploaded successfully to S3');
    
    res.json({
      success: true,
      message: 'Trust Score Report generated and uploaded successfully',
      downloadUrl: downloadUrl,
      filename: filename,
      s3Key: `trust-score-reports/${filename}`
    });
    
  } catch (error) {
    console.error('S3 Trust Score Report generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate and upload Trust Score Report', 
      details: error.message 
    });
  }
});

// Helper function to generate HTML content for plagiarism report
function generatePlagiarismReportHTML(plagiarismData, documentName, sources) {
  const plagiarismScore = plagiarismData.plagiarism || plagiarismData.similarity || 0;
  const originalityScore = plagiarismData.originality || (100 - plagiarismScore);
  const logoBase64 = getLogoBase64();
  
  // Helper functions
  const formatPercentage = (value) => Number(value).toFixed(2);
  const getScoreLevel = (score, isOriginality = false) => {
    if (isOriginality) {
      if (score >= 80) return 'Excellent';
      if (score >= 60) return 'Good';
      if (score >= 40) return 'Fair';
      if (score >= 20) return 'Poor';
      return 'Very Poor';
    } else {
      if (score <= 20) return 'Excellent';
      if (score <= 40) return 'Good';
      if (score <= 60) return 'Fair';
      if (score <= 80) return 'Poor';
      return 'Very Poor';
    }
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Plagiarism Report</title>
      <style>
        ${getCSSContent()}
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo-section">
          ${logoBase64 ? `<img src="${logoBase64}" alt="Mintellect Logo" class="logo">` : ''}
          <div class="brand-name">Mintellect</div>
        </div>
        <h1 class="report-title">Plagiarism Detection Report</h1>
        <p class="document-name">Document: ${documentName}</p>
      </div>
      
      <div class="scores-section">
        <div class="score-item">
          <div class="score-label">Plagiarism Score</div>
          <div class="score-value plagiarism-score">${formatPercentage(plagiarismScore)}%</div>
          <div class="score-level plagiarism-score">${getScoreLevel(plagiarismScore)}</div>
        </div>
        <div class="score-item">
          <div class="score-label">Originality Score</div>
          <div class="score-value originality-score">${formatPercentage(originalityScore)}%</div>
          <div class="score-level originality-score">${getScoreLevel(originalityScore, true)}</div>
        </div>
      </div>
      
      <div class="progress-section">
        <div class="progress-labels">
          <span>Original</span>
          <span>Plagiarized</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${plagiarismScore}%"></div>
        </div>
      </div>
      
      ${sources && sources.length > 0 ? `
        <div class="sources-section">
          <h2>Similarity Sources</h2>
          <div class="sources-list">
            ${sources.map((source, index) => `
              <div class="source-item">
                <div class="source-header">
                  <span class="source-title">${source.title || `Source ${index + 1}`}</span>
                  <span class="source-similarity">${formatPercentage(source.similarity || 0)}% similar</span>
                </div>
                <div class="source-url">${source.url || 'No URL available'}</div>
                ${source.excerpt ? `<div class="source-excerpt">${source.excerpt}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
      
      <div class="footer">
        <p>Generated by Mintellect on ${new Date().toLocaleDateString()}</p>
        <p>This report is for informational purposes only.</p>
      </div>
    </body>
    </html>
  `;
}

// Helper function to generate HTML content for trust score report
function generateTrustScoreReportHTML(trustScoreData, documentName, fileId) {
  const trustScore = trustScoreData.trustScore || 0;
  const logoBase64 = getLogoBase64();
  
  const formatPercentage = (value) => Number(value).toFixed(2);
  const getTrustLevel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    if (score >= 20) return 'Poor';
    return 'Very Poor';
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Trust Score Report</title>
      <style>
        ${getCSSContent()}
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo-section">
          ${logoBase64 ? `<img src="${logoBase64}" alt="Mintellect Logo" class="logo">` : ''}
          <div class="brand-name">Mintellect</div>
        </div>
        <h1 class="report-title">Trust Score Report</h1>
        <p class="document-name">Document: ${documentName}</p>
        <p class="document-name">File ID: ${fileId}</p>
      </div>
      
      <div class="scores-section">
        <div class="score-item">
          <div class="score-label">Trust Score</div>
          <div class="score-value originality-score">${formatPercentage(trustScore)}%</div>
          <div class="score-level originality-score">${getTrustLevel(trustScore)}</div>
        </div>
      </div>
      
      <div class="progress-section">
        <div class="progress-labels">
          <span>Low Trust</span>
          <span>High Trust</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${trustScore}%; background: linear-gradient(90deg, #10b981, #059669);"></div>
        </div>
      </div>
      
      <div class="footer">
        <p>Generated by Mintellect on ${new Date().toLocaleDateString()}</p>
        <p>This report is for informational purposes only.</p>
      </div>
    </body>
    </html>
  `;
}

// Helper function to get CSS content
function getCSSContent() {
  return `
        body {
          font-family: Arial, sans-serif;
          font-size: 14px;
          line-height: 1.6;
          color: #333;
          background: white;
          padding: 20px;
          margin: 0;
        }
        
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #6366f1;
          padding-bottom: 20px;
        }
        
        .logo-section {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 15px;
          padding: 10px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        
        .logo {
          width: 60px;
          height: 60px;
          margin-right: 15px;
          border-radius: 8px;
          border: 2px solid rgba(255, 255, 255, 0.2);
        }
        
        .brand-name {
          font-size: 28px;
          font-weight: bold;
          color: #6366f1;
        }
        
        .report-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        
        .document-name {
          color: #6b7280;
          font-size: 16px;
        }
        
        .scores-section {
          display: flex;
          justify-content: space-around;
          margin: 30px 0;
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }
        
        .score-item {
          text-align: center;
          flex: 1;
        }
        
        .score-value {
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        
        .score-label {
          color: #6b7280;
          margin-bottom: 8px;
          font-size: 14px;
        }
        
        .score-level {
          font-weight: bold;
          margin-top: 8px;
        }
        
        .plagiarism-score {
          color: #ef4444;
        }
        
        .originality-score {
          color: #10b981;
        }
        
        .progress-section {
          margin: 25px 0;
        }
        
        .progress-labels {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 14px;
        }
        
        .progress-bar {
          height: 20px;
          background: #e5e7eb;
          border-radius: 10px;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #ef4444, #dc2626);
      width: 0%;
      transition: width 0.3s ease;
        }
        
        .sources-section {
      margin: 30px 0;
    }
    
    .sources-section h2 {
      color: #374151;
      margin-bottom: 20px;
      font-size: 20px;
    }
    
    .sources-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
        }
        
        .source-item {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 15px;
    }
    
    .source-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
      margin-bottom: 8px;
    }
    
    .source-title {
      font-weight: bold;
      color: #374151;
    }
    
    .source-similarity {
      background: #fef3c7;
      color: #92400e;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
          font-weight: bold;
        }
        
        .source-url {
          color: #6b7280;
      font-size: 12px;
      margin-bottom: 8px;
          word-break: break-all;
    }
    
    .source-excerpt {
      background: #f3f4f6;
      padding: 10px;
      border-radius: 4px;
      font-size: 13px;
      color: #4b5563;
      border-left: 3px solid #6366f1;
        }
        
        .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 12px;
    }
    
    .footer p {
      margin: 5px 0;
    }
  `;
}

export default router; 