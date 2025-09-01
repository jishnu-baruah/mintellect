import express from 'express';
import puppeteer from 'puppeteer';
import AWS from 'aws-sdk';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Handle preflight requests for PDF endpoints
router.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'https://app.mintellect.xyz');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(200).end();
});

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'mintellect-pdfs';

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



// Test endpoint for simple PDF generation
router.get('/test-pdf', async (req, res) => {
  try {
    console.log('Testing simple PDF generation...');
    
    const browser = await puppeteer.launch({
      headless: 'new',
      executablePath: process.env.CHROME_BIN || process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
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
    
    if (!plagiarismData || !documentName) {
      return res.status(400).json({ error: 'Missing required data' });
    }
    
    // Generate HTML content for the PDF
    const htmlContent = generatePlagiarismReportHTML(plagiarismData, documentName, sources);
    
    console.log('HTML content generated, length:', htmlContent.length);
    console.log('HTML content preview:', htmlContent.substring(0, 500));
    
    let pdf;
    
    try {
      // Launch Puppeteer with production-ready settings
      console.log('Chrome paths:', {
        CHROME_BIN: process.env.CHROME_BIN,
        PUPPETEER_EXECUTABLE_PATH: process.env.PUPPETEER_EXECUTABLE_PATH
      });
      
      // Try to find Chrome in common locations
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
          const fs = await import('fs');
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
        executablePath: executablePath,
        args: [
          '--no-sandbox', 
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--no-first-run',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor',
          '--disable-extensions',
          '--disable-plugins',
          '--disable-images',
          '--disable-javascript',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding',
          '--disable-field-trial-config',
          '--disable-ipc-flooding-protection'
        ]
      });
    
    const page = await browser.newPage();
      
      try {
        console.log('Setting viewport...');
        // Set viewport for consistent rendering
        await page.setViewport({ width: 1200, height: 800 });
        
        console.log('Setting content...');
        // Set content and wait for it to be fully rendered
        await page.setContent(htmlContent, { 
          waitUntil: ['networkidle0', 'domcontentloaded', 'load']
        });
        
        console.log('Waiting for rendering...');
        // Additional wait to ensure everything is rendered
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('Generating PDF...');
        // Generate PDF with production-optimized settings
        pdf = await page.pdf({
      format: 'A4',
      margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
          printBackground: true,
      displayHeaderFooter: false,
          preferCSSPageSize: true,
          omitBackground: false,
          timeout: 30000
        });
        
        console.log('PDF generation completed successfully');
        
        console.log('PDF generated, size:', pdf.length, 'bytes');
        console.log('PDF first 100 bytes:', pdf.slice(0, 100).toString('hex'));
        console.log('PDF header check:', pdf.slice(0, 4).toString('ascii'));
      } catch (browserError) {
        console.error('Browser error:', browserError);
        throw new Error(`PDF generation failed: ${browserError.message}`);
      } finally {
        try {
          await browser.close();
        } catch (closeError) {
          console.error('Error closing browser:', closeError);
        }
      }
    } catch (puppeteerError) {
      console.error('Puppeteer error:', puppeteerError);
      
             // Try alternative PDF generation method
       try {
         console.log('Attempting alternative PDF generation...');
         
    const browser = await puppeteer.launch({
      headless: 'new',
           executablePath: process.env.CHROME_BIN || process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
           args: [
             '--no-sandbox', 
             '--disable-setuid-sandbox',
             '--disable-dev-shm-usage',
             '--disable-gpu',
             '--no-first-run'
           ]
         });
         
         console.log('Alternative browser launched successfully');
    const page = await browser.newPage();
         console.log('Alternative page created');
         
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
         console.log('Alternative content set');
         
         await new Promise(resolve => setTimeout(resolve, 3000));
         console.log('Alternative rendering wait completed');
         
         pdf = await page.pdf({
      format: 'A4',
      margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
      printBackground: false,
      displayHeaderFooter: false,
      preferCSSPageSize: false,
      omitBackground: true
    });
    
         console.log('Alternative PDF generated, size:', pdf.length, 'bytes');
    await browser.close();
         console.log('Alternative browser closed');
         
         console.log('Alternative PDF generation successful, size:', pdf.length, 'bytes');
         
         // Verify PDF
         const pdfHeader = pdf.slice(0, 4).toString('ascii');
         console.log('Alternative PDF header:', pdfHeader);
         if (pdfHeader !== '%PDF') {
           throw new Error('Alternative PDF generation also failed');
         }
        
      } catch (alternativeError) {
        console.error('Alternative PDF generation failed:', alternativeError);
        
                 // Final fallback: Return enhanced HTML content that can be easily converted to PDF
         res.setHeader('Content-Type', 'text/html; charset=utf-8');
         res.setHeader('Content-Disposition', `inline; filename="${documentName}_report.html"`);
         res.setHeader('Access-Control-Allow-Origin', 'https://app.mintellect.xyz');
         res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
         res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
         
         // Extract CSS and body content from the generated HTML
         const cssMatch = htmlContent.match(/<style>([\s\S]*)<\/style>/i);
         const cssContent = cssMatch ? cssMatch[1] : '';
         const bodyContentMatch = htmlContent.match(/<body[^>]*>([\s\S]*)<\/body>/i);
         const bodyContent = bodyContentMatch ? bodyContentMatch[1] : htmlContent;
         
         const fallbackHtml = `
           <!DOCTYPE html>
           <html>
           <head>
             <title>Plagiarism Report - ${documentName}</title>
             <meta charset="UTF-8">
             <style>
               ${cssContent}
               
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
               }
               
               .instructions ol {
                 margin: 10px 0;
                 padding-left: 20px;
                 text-align: left;
               }
               
               .instructions li {
                 margin: 5px 0;
               }
               
               .print-button {
                 background: #6366f1;
                 color: white;
                 border: none;
                 padding: 10px 20px;
                 border-radius: 5px;
                 cursor: pointer;
                 font-size: 16px;
                 margin: 10px 5px;
               }
               
               .print-button:hover {
                 background: #4f46e5;
               }
               
               .no-print {
                 margin: 20px 0;
               }
               
               .report-content {
                 margin-top: 30px;
               }
             </style>
           </head>
           <body>
             <div class="no-print">
               <div class="instructions">
                 <h3>📄 How to Save as PDF:</h3>
                 <ol>
                   <li><strong>Press Ctrl+P (Windows) or Cmd+P (Mac)</strong></li>
                   <li>Select "Save as PDF" as the destination</li>
                   <li>Choose your preferred settings</li>
                   <li>Click "Save" to download the PDF</li>
                 </ol>
                 <button class="print-button" onclick="window.print()">🖨️ Print/Save as PDF</button>
                 <button class="print-button" onclick="window.close()">❌ Close</button>
               </div>
             </div>
             
             <div class="report-content">
               ${bodyContent}
             </div>
             
             <script>
               // Auto-print dialog on load (optional)
               // window.onload = function() {
               //   setTimeout(() => {
               //     window.print();
               //   }, 1000);
               // }
             </script>
           </body>
           </html>
         `;
         
         return res.send(fallbackHtml);
      }
    }
    
    // Verify PDF was generated correctly
    if (!pdf || pdf.length === 0) {
      throw new Error('PDF generation failed - empty result');
    }
    
    // Check if PDF starts with the correct magic number
    const pdfHeader = pdf.slice(0, 4).toString('ascii');
    if (pdfHeader !== '%PDF') {
      console.error('Invalid PDF header:', pdfHeader);
      throw new Error('PDF generation failed - invalid PDF format');
    }
    
    console.log('PDF generated successfully, size:', pdf.length, 'bytes');
    console.log('PDF header:', pdfHeader);
    
    // Generate filename
        const timestamp = Date.now();
        const sanitizedName = documentName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const filename = `${sanitizedName}_plagiarism_report_${timestamp}.pdf`;
        
    console.log('PDF generated, sending directly to client:', filename);
        
    // Set headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdf.length);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
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
      expiresAt: new Date(Date.now() + 3600000).toISOString() // 1 hour from now
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
    
    const { trustScoreData, documentName, plagiarismData } = req.body;
    
    if (!trustScoreData || !documentName) {
      return res.status(400).json({ error: 'Missing required data' });
    }
    
    // Generate HTML content for the PDF
    const htmlContent = generateTrustScoreReportHTML(trustScoreData, documentName, plagiarismData);
    
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
        'generated-at': new Date().toISOString(),
        'trust-score': trustScoreData.trustScore?.toString() || trustScoreData.overallScore?.toString() || '0',
        'trust-level': trustScoreData.trustLevel || 'Unknown'
      }
    };
    
    console.log('Uploading Trust Score Report to S3...');
    const uploadResult = await s3.upload(uploadParams).promise();
    
    // Generate presigned URL for download (expires in 1 hour)
    const downloadParams = {
      Bucket: BUCKET_NAME,
      Key: `trust-score-reports/${filename}`,
      Expires: 3600 // 1 hour
    };
    
    const downloadUrl = await s3.getSignedUrlPromise('getObject', downloadParams);
    
    console.log('Trust Score Report uploaded successfully to S3');
    
    res.json({
      success: true,
      message: 'Trust Score Report generated and uploaded successfully',
      downloadUrl: downloadUrl,
      filename: filename,
      expiresAt: new Date(Date.now() + 3600000).toISOString() // 1 hour from now
    });
    
  } catch (error) {
    console.error('S3 Trust Score Report generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate and upload Trust Score Report', 
      details: error.message 
    });
  }
});

// Helper function to generate HTML content
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
          width: ${plagiarismScore}%;
        }
        
        .sources-section {
          background: white;
          padding: 20px;
          border-radius: 8px;
          margin-top: 25px;
          border: 1px solid #e5e7eb;
        }
        
        .sources-title {
          margin: 0 0 20px 0;
          color: #ef4444;
          font-size: 18px;
          border-bottom: 1px solid #ef4444;
          padding-bottom: 10px;
        }
        
        .source-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #f3f4f6;
        }
        
        .source-item:last-child {
          border-bottom: none;
        }
        
        .source-info {
          flex: 1;
        }
        
        .source-name {
          font-weight: bold;
          font-size: 14px;
        }
        
        .source-url {
          color: #6b7280;
          font-size: 11px;
          word-break: break-all;
          margin-top: 5px;
        }
        
        .source-percentage {
          color: #ef4444;
          font-weight: bold;
          margin-left: 15px;
          font-size: 16px;
        }
        
        .footer {
          text-align: center;
          margin-top: 30px;
          color: #6b7280;
          font-size: 12px;
          border-top: 1px solid #e5e7eb;
          padding-top: 15px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo-section">
          ${logoBase64 ? `<img src="${logoBase64}" alt="Mintellect" class="logo">` : '<div class="logo" style="background: linear-gradient(135deg, #6366f1, #8b5cf6); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 24px;">M</div>'}
          <div class="brand-name">Mintellect</div>
        </div>
        <div class="report-title">Plagiarism Report</div>
        <div class="document-name">${documentName}</div>
      </div>
      
      <div class="scores-section">
        <div class="score-item">
          <div class="score-value plagiarism-score">${formatPercentage(plagiarismScore)}%</div>
          <div class="score-label">Plagiarism Score</div>
          <div class="score-level plagiarism-score">${getScoreLevel(plagiarismScore)}</div>
        </div>
        <div class="score-item">
          <div class="score-value originality-score">${formatPercentage(originalityScore)}%</div>
          <div class="score-label">Originality Score</div>
          <div class="score-level originality-score">${getScoreLevel(originalityScore, true)}</div>
        </div>
      </div>
      
      <div class="progress-section">
        <div class="progress-labels">
          <span>Plagiarism</span>
          <span>Originality</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill"></div>
        </div>
      </div>
      
      ${sources && sources.length > 0 ? `
        <div class="sources-section">
          <h3 class="sources-title">Plagiarism Sources (${sources.length})</h3>
          ${sources.map((source, index) => `
            <div class="source-item">
              <div class="source-info">
                <div class="source-name">${index + 1}. ${source.title || source.name || `Source ${index + 1}`}</div>
                ${source.url ? `<div class="source-url">${source.url}</div>` : ''}
              </div>
              <div class="source-percentage">${formatPercentage(source.similarity || source.score || 0)}%</div>
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      <div class="footer">
        <div>Generated by Mintellect</div>
        <div style="margin-top: 8px;">${new Date().toLocaleString()}</div>
      </div>
    </body>
    </html>
  `;
}

// Helper function to generate Trust Score Report HTML content
function generateTrustScoreReportHTML(trustScoreData, documentName, plagiarismData) {
  const overallScore = trustScoreData.trustScore || trustScoreData.overallScore || 0;
  const trustLevel = trustScoreData.trustLevel || 'Unknown';
  const breakdown = trustScoreData.breakdown?.components || {};
  const aiAnalysis = trustScoreData.aiAnalysis || {};
  const recommendations = trustScoreData.recommendations || [];
  const logoBase64 = getLogoBase64();
  
  // Helper functions
  const formatPercentage = (value) => Number(value).toFixed(2);
  const getScoreLevel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    if (score >= 20) return 'Poor';
    return 'Very Poor';
  };
  
  const getTrustLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case 'high': return '#10b981';
      case 'moderate': return '#f59e0b';
      case 'low': return '#ef4444';
      case 'very low': return '#dc2626';
      default: return '#6b7280';
    }
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Trust Score Report - ${documentName}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 20px;
          background: #f8f9fa;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 10px;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
        }
        .header p {
          margin: 10px 0 0 0;
          opacity: 0.9;
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
          color: white;
        }
        .score-section {
          background: white;
          padding: 25px;
          margin: 20px 0;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .overall-score {
          text-align: center;
          margin-bottom: 30px;
        }
        .score-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 15px;
          font-size: 24px;
          font-weight: bold;
          color: white;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .trust-level {
          display: inline-block;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          color: white;
          background-color: ${getTrustLevelColor(trustLevel)};
        }
        .breakdown-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin: 20px 0;
        }
        .breakdown-item {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
        }
        .breakdown-item h4 {
          margin: 0 0 10px 0;
          color: #495057;
          font-size: 14px;
        }
        .breakdown-score {
          font-size: 24px;
          font-weight: bold;
          color: #667eea;
        }
        .ai-analysis {
          background: white;
          padding: 25px;
          margin: 20px 0;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .ai-analysis h3 {
          color: #495057;
          margin-bottom: 20px;
          border-bottom: 2px solid #e9ecef;
          padding-bottom: 10px;
        }
        .ai-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }
        .ai-metric {
          text-align: center;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 6px;
        }
        .ai-metric-label {
          font-size: 12px;
          color: #6c757d;
          margin-bottom: 5px;
        }
        .ai-metric-value {
          font-size: 18px;
          font-weight: bold;
          color: #495057;
        }
        .recommendations {
          background: white;
          padding: 25px;
          margin: 20px 0;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .recommendations h3 {
          color: #495057;
          margin-bottom: 20px;
          border-bottom: 2px solid #e9ecef;
          padding-bottom: 10px;
        }
        .recommendation-item {
          background: #e3f2fd;
          padding: 15px;
          margin: 10px 0;
          border-radius: 6px;
          border-left: 4px solid #2196f3;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding: 20px;
          color: #6c757d;
          font-size: 12px;
        }
        .page-break {
          page-break-before: always;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo-section">
          ${logoBase64 ? `<img src="${logoBase64}" alt="Mintellect" class="logo">` : '<div class="logo" style="background: linear-gradient(135deg, #6366f1, #8b5cf6); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 24px;">M</div>'}
          <div class="brand-name">Mintellect</div>
        </div>
        <h1>Trust Score Report</h1>
        <p>Document: ${documentName}</p>
        <p>Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
      </div>

      <div class="score-section">
        <div class="overall-score">
          <div class="score-circle">${overallScore}%</div>
          <div class="trust-level">${trustLevel}</div>
          <p style="margin-top: 10px; color: #6c757d;">Overall Trust Score</p>
        </div>
      </div>

      <div class="score-section">
        <h3 style="color: #495057; margin-bottom: 20px; border-bottom: 2px solid #e9ecef; padding-bottom: 10px;">
          Component Breakdown
        </h3>
        <div class="breakdown-grid">
          ${Object.entries(breakdown).map(([key, component]) => `
            <div class="breakdown-item">
              <h4>${key.charAt(0).toUpperCase() + key.slice(1)}</h4>
              <div class="breakdown-score">${component.score || 0}%</div>
              <div style="font-size: 12px; color: #6c757d; margin-top: 5px;">
                Weight: ${component.weight ? (component.weight * 100).toFixed(0) : 0}%
              </div>
              <div style="font-size: 12px; color: #6c757d;">
                Contribution: ${component.contribution ? (component.contribution * 100).toFixed(1) : 0}%
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      ${aiAnalysis.aiProbability !== undefined ? `
        <div class="ai-analysis">
          <h3>AI Analysis Results</h3>
          <div class="ai-metrics">
            <div class="ai-metric">
              <div class="ai-metric-label">AI Probability</div>
              <div class="ai-metric-value">${formatPercentage(aiAnalysis.aiProbability)}%</div>
            </div>
            <div class="ai-metric">
              <div class="ai-metric-label">Human Written</div>
              <div class="ai-metric-value">${formatPercentage(aiAnalysis.humanWrittenProbability)}%</div>
            </div>
            <div class="ai-metric">
              <div class="ai-metric-label">Academic Quality</div>
              <div class="ai-metric-value">${formatPercentage(aiAnalysis.academicQuality)}%</div>
            </div>
            <div class="ai-metric">
              <div class="ai-metric-label">Methodology Score</div>
              <div class="ai-metric-value">${formatPercentage(aiAnalysis.methodologyScore)}%</div>
            </div>
            <div class="ai-metric">
              <div class="ai-metric-label">Citation Quality</div>
              <div class="ai-metric-value">${formatPercentage(aiAnalysis.citationQuality)}%</div>
            </div>
            <div class="ai-metric">
              <div class="ai-metric-label">Originality Score</div>
              <div class="ai-metric-value">${formatPercentage(aiAnalysis.originalityScore)}%</div>
            </div>
            <div class="ai-metric">
              <div class="ai-metric-label">Confidence</div>
              <div class="ai-metric-value">${formatPercentage(aiAnalysis.confidence)}%</div>
            </div>
            <div class="ai-metric">
              <div class="ai-metric-label">Classification</div>
              <div class="ai-metric-value">${aiAnalysis.classification || 'N/A'}</div>
            </div>
          </div>
          ${aiAnalysis.analysis ? `
            <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin-top: 20px;">
              <strong>Analysis:</strong> ${aiAnalysis.analysis}
            </div>
          ` : ''}
          ${aiAnalysis.flags && aiAnalysis.flags.length > 0 ? `
            <div style="margin-top: 20px;">
              <strong>Flags:</strong>
              <ul style="margin: 10px 0; padding-left: 20px;">
                ${aiAnalysis.flags.map(flag => `<li>${flag}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
      ` : ''}

      ${recommendations.length > 0 ? `
        <div class="recommendations">
          <h3>Recommendations</h3>
          ${recommendations.map(rec => `
            <div class="recommendation-item">
              ${rec}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${plagiarismData ? `
        <div class="score-section">
          <h3 style="color: #495057; margin-bottom: 20px; border-bottom: 2px solid #e9ecef; padding-bottom: 10px;">
            Plagiarism Analysis Summary
          </h3>
          <div class="breakdown-grid">
            <div class="breakdown-item">
              <h4>Plagiarism Score</h4>
              <div class="breakdown-score">${plagiarismData.plagiarism || plagiarismData.similarity || 0}%</div>
            </div>
            <div class="breakdown-item">
              <h4>Originality Score</h4>
              <div class="breakdown-score">${plagiarismData.originality || (100 - (plagiarismData.plagiarism || plagiarismData.similarity || 0))}%</div>
            </div>
            <div class="breakdown-item">
              <h4>Matches Found</h4>
              <div class="breakdown-score">${plagiarismData.matches?.length || 0}</div>
            </div>
          </div>
        </div>
      ` : ''}

      <div class="footer">
        <p>Generated by Mintellect Trust Score System</p>
        <p>This report provides a comprehensive analysis of document trustworthiness and academic integrity.</p>
      </div>
    </body>
    </html>
  `;
}

export default router; 