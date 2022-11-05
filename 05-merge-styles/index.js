const fs = require('fs');
const path = require('path');

const readableFolderPath = path.join(__dirname, 'styles');
const destinationFolder = path.join(__dirname, 'project-dist');
const createdFile = fs.createWriteStream(path.join(destinationFolder, 'bundle.css'));

(async () => {
  try {
    const folderContent = await fs.promises.readdir(readableFolderPath, {withFileTypes: true});
    for await (const elem of folderContent) {
      if (!elem.isDirectory() && path.extname(`${elem.name}`) === '.css') {
        const readableFile = fs.createReadStream(path.join(readableFolderPath, elem.name), 'utf-8');
        readableFile.pipe(createdFile);
      }
    }
  } catch (err) {
    console.err(err);
  }
})()