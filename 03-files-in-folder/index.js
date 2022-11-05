const fs = require('fs');
const path = require('path');
const { stdout } = process;

const folderPath = path.join(__dirname, 'secret-folder');

async function outputElements () {
  const folderContent = await fs.promises.readdir(folderPath, {withFileTypes: true});
  for (const elem of folderContent) {
    if (!elem.isDirectory()) {
        const filePath = path.join(folderPath, elem.name);
        const file = await fs.promises.stat(filePath);
        stdout.write(`${path.parse(elem.name).name} - ${path.parse(elem.name).ext.slice(1)} - ${file.size} byte\n`);
      };
  }
}

outputElements()



