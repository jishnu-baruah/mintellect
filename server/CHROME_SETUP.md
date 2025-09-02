# Chrome Setup for PDF Generation

## Overview
This server uses Puppeteer to generate PDFs from HTML content. In production environments, Chrome needs to be properly installed and configured.

## Automatic Installation
The server will automatically try to install Chrome during deployment:
```bash
npm run install-chrome
# or
npm run install-chrome-manual
```

## Manual Chrome Installation

### Ubuntu/Debian
```bash
# Update package list
sudo apt-get update

# Install Chrome
sudo apt-get install -y google-chrome-stable

# Verify installation
google-chrome --version
```

### CentOS/RHEL
```bash
# Install Chrome
sudo yum install -y google-chrome-stable

# Verify installation
google-chrome --version
```

### macOS
```bash
# Install via Homebrew
brew install --cask google-chrome

# Verify installation
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --version
```

## Environment Variables
Set these environment variables to specify Chrome location:

```bash
# Option 1: Use system Chrome
export CHROME_BIN=/usr/bin/google-chrome

# Option 2: Use Puppeteer's Chrome
export PUPPETEER_EXECUTABLE_PATH=/opt/render/.cache/puppeteer/chrome-linux-138.0.7204.157/chrome-linux/chrome

# Option 3: Skip to HTML fallback (no PDF generation)
export DISABLE_PDF_GENERATION=true
```

## Fallback System
If Chrome installation fails, the system automatically falls back to:
1. **HTML Report Generation** - Creates a beautifully formatted HTML report
2. **Print Instructions** - Provides clear steps for users to convert to PDF
3. **Professional Styling** - Maintains all visual elements and formatting

## Testing Chrome Installation
```bash
# Test if Chrome is accessible
node -e "
import puppeteer from 'puppeteer';
(async () => {
  try {
    const browser = await puppeteer.launch({headless: 'new'});
    console.log('✅ Chrome is working!');
    await browser.close();
  } catch (e) {
    console.log('❌ Chrome failed:', e.message);
  }
})();
"
```

## Troubleshooting

### Common Issues
1. **Permission Denied**: Ensure Chrome has execute permissions
2. **Missing Dependencies**: Install required system libraries
3. **Sandbox Issues**: Use `--no-sandbox` flag in production

### Render Deployment
For Render deployments, the system will:
1. Try to install Chrome automatically
2. Fall back to HTML generation if Chrome fails
3. Provide users with print-to-PDF instructions

## Production Notes
- **HTML Fallback is Production-Ready**: Users get professional reports
- **No PDF Generation Required**: System gracefully degrades
- **User Experience Maintained**: All functionality preserved
