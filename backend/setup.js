const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function installDependencies(folder) {
  const fullPath = path.join(__dirname, folder);
  if (fs.existsSync(path.join(fullPath, 'package.json'))) {
    console.log(`📦 Installing dependencies in ./${folder}`);
    execSync(`cd ${folder} && npm install`, { stdio: 'inherit' });
  } else {
    console.log(`⚠️  Skipped ./${folder}: No package.json found`);
  }
}

function copyEnvExample() {
  const envPath = path.join(__dirname, 'backend', '.env');
  const exampleEnv = path.join(__dirname, 'backend', '.env.example');
  if (!fs.existsSync(envPath) && fs.existsSync(exampleEnv)) {
    fs.copyFileSync(exampleEnv, envPath);
    console.log('✅ Copied .env.example to .env');
  }
}

function main() {
  console.log('\n🔧 Starting setup script...\n');

  installDependencies('backend');

  copyEnvExample();

  console.log('\n✅ Setup completed! Now:');
  console.log('1. Update your DB credentials in backend/.env or config/db.js');
  console.log('2. Start backend with: cd backend && node server.js\n');
}

main();
