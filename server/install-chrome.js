#!/usr/bin/env node

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔧 Installing Chrome for Puppeteer...');

try {
  // Try to install Chrome using puppeteer browsers
  console.log('📦 Installing Chrome via puppeteer browsers...');
  execSync('npx puppeteer browsers install chrome', { 
    stdio: 'inherit',
    cwd: __dirname 
  });
  console.log('✅ Chrome installed successfully!');
} catch (error) {
  console.log('❌ puppeteer browsers install failed, trying alternative methods...');
  
  try {
    // Try to install Chrome using apt (Ubuntu/Debian)
    console.log('📦 Trying apt install...');
    execSync('apt-get update && apt-get install -y google-chrome-stable', { 
      stdio: 'inherit',
      cwd: __dirname 
    });
    console.log('✅ Chrome installed via apt!');
  } catch (aptError) {
    console.log('❌ apt install failed, trying yum (CentOS/RHEL)...');
    
    try {
      execSync('yum install -y google-chrome-stable', { 
        stdio: 'inherit',
        cwd: __dirname 
      });
      console.log('✅ Chrome installed via yum!');
    } catch (yumError) {
      console.log('❌ All installation methods failed.');
      console.log('📋 Manual installation required:');
      console.log('   1. Install Chrome manually on your system');
      console.log('   2. Set CHROME_BIN environment variable to Chrome path');
      console.log('   3. Or the system will use HTML fallback for PDF generation');
    }
  }
}

console.log('🏁 Chrome installation script completed.');
