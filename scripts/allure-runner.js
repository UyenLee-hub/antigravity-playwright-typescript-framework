const { spawn } = require('child_process');
const path = require('path');

// Auto-correct JAVA_HOME if user mistakenly appended \bin
if (process.env.JAVA_HOME && (process.env.JAVA_HOME.endsWith('\\bin') || process.env.JAVA_HOME.endsWith('/bin'))) {
  process.env.JAVA_HOME = path.dirname(process.env.JAVA_HOME);
}

const args = process.argv.slice(2);
const allureBin = path.resolve(
  __dirname,
  '../node_modules/.bin',
  process.platform === 'win32' ? 'allure.cmd' : 'allure'
);

const child = spawn(`"${allureBin}"`, args, {
  stdio: 'inherit',
  shell: true,
  env: process.env,
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
