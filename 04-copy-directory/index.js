const fs = require('fs');
const path = require('path');
const util = require('util');

const promisifiedRm = util.promisify(fs.rm);
const newFolderPath = path.join(__dirname, 'files-copy');
const folderPath = path.join(__dirname, 'files');

(async() => {
  try{
    await promisifiedRm(newFolderPath, {force: true, recursive: true});
    await fs.promises.mkdir(newFolderPath);
    const folderContent = await fs.promises.readdir(folderPath, {withFileTypes: true});
    for (const elem of folderContent) {
      await fs.promises.copyFile(path.join(folderPath, elem.name), path.join(newFolderPath, elem.name));
    }
  } catch (err) {
    console.err(err);
  }
})();
