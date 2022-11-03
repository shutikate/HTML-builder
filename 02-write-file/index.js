const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface(process.stdin, process.stdout);

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));

rl.setPrompt('Введите текст для записи в файл:\n');
rl.prompt();
rl.on('line', (data) => {
  if (data.toString().trim() === 'exit') {
    rl.close();
  } else {
    output.write(`${data}\n`);
  }
});

rl.on('close', () => process.stdout.write('\nУдачи!'));
