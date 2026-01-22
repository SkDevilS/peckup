#!/usr/bin/env node

/**
 * Simple script to help start the Peckup backend
 * This checks if the backend is running and provides helpful instructions
 */

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const BACKEND_URL = 'http://localhost:5000';
const BACKEND_DIR = path.join(__dirname, 'backend');

async function checkBackendStatus() {
  return new Promise((resolve) => {
    const http = require('http');
    const req = http.get(BACKEND_URL + '/api/health', (res) => {
      resolve(res.statusCode === 200);
    });
    
    req.on('error', () => {
      resolve(false);
    });
    
    req.setTimeout(3000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function checkPythonInstallation() {
  return new Promise((resolve) => {
    exec('python --version', (error, stdout, stderr) => {
      if (error) {
        exec('python3 --version', (error, stdout, stderr) => {
          resolve(!error);
        });
      } else {
        resolve(true);
      }
    });
  });
}

async function checkBackendFiles() {
  const requiredFiles = ['app.py', 'models.py', 'config.py'];
  const backendPath = path.join(__dirname, 'backend');
  
  if (!fs.existsSync(backendPath)) {
    return { exists: false, missing: ['backend directory'] };
  }
  
  const missing = requiredFiles.filter(file => 
    !fs.existsSync(path.join(backendPath, file))
  );
  
  return { exists: missing.length === 0, missing };
}

async function main() {
  console.log('🔍 Checking Peckup Backend Status...\n');
  
  // Check if backend is already running
  const isRunning = await checkBackendStatus();
  if (isRunning) {
    console.log('✅ Backend is already running at', BACKEND_URL);
    console.log('🌐 You can now use the frontend at http://localhost:5173');
    return;
  }
  
  console.log('❌ Backend is not running');
  
  // Check Python installation
  const hasPython = await checkPythonInstallation();
  if (!hasPython) {
    console.log('❌ Python is not installed or not in PATH');
    console.log('💡 Please install Python 3.8+ from https://python.org');
    return;
  }
  console.log('✅ Python is installed');
  
  // Check backend files
  const { exists, missing } = await checkBackendFiles();
  if (!exists) {
    console.log('❌ Backend files missing:', missing.join(', '));
    console.log('💡 Make sure you\'re in the Peckup project directory');
    return;
  }
  console.log('✅ Backend files found');
  
  // Instructions to start backend
  console.log('\n📋 To start the backend:');
  console.log('1. Open a new terminal');
  console.log('2. Navigate to the backend directory:');
  console.log('   cd backend');
  console.log('3. Install dependencies (if not done):');
  console.log('   pip install flask flask-sqlalchemy flask-jwt-extended flask-cors reportlab');
  console.log('4. Initialize database (if not done):');
  console.log('   python init_db.py');
  console.log('5. Start the server:');
  console.log('   python app.py');
  
  console.log('\n🔧 Alternative: Auto-start backend');
  console.log('Would you like to try starting the backend automatically? (y/n)');
  
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on('data', (key) => {
    const input = key.toString().toLowerCase();
    
    if (input === 'y' || input === '\r') {
      console.log('\n🚀 Starting backend...');
      
      const backend = spawn('python', ['app.py'], {
        cwd: BACKEND_DIR,
        stdio: 'inherit'
      });
      
      backend.on('error', (err) => {
        console.log('❌ Failed to start backend:', err.message);
        console.log('💡 Try starting manually with the instructions above');
        process.exit(1);
      });
      
      backend.on('close', (code) => {
        console.log(`Backend process exited with code ${code}`);
        process.exit(code);
      });
      
      // Handle Ctrl+C
      process.on('SIGINT', () => {
        console.log('\n🛑 Stopping backend...');
        backend.kill('SIGINT');
        process.exit(0);
      });
      
    } else {
      console.log('\n👍 Please start the backend manually using the instructions above');
      process.exit(0);
    }
  });
}

main().catch(console.error);