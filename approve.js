const { spawn } = require('child_process');

const p = spawn('pnpm', ['approve-builds'], { shell: true });

let sentToggle = false;

p.stdout.on('data', (data) => {
  const output = data.toString();
  process.stdout.write(output);
  
  if (output.includes('invert selection') && !sentToggle) {
    sentToggle = true;
    setTimeout(() => {
      p.stdin.write('a\r\n');
    }, 500);
  } 
  
  if (output.includes('Do you approve?')) {
    setTimeout(() => {
      p.stdin.write('y\r\n');
    }, 500);
  }
});

p.stderr.on('data', (data) => process.stderr.write(data.toString()));
p.on('close', (code) => console.log('Exited with', code));
