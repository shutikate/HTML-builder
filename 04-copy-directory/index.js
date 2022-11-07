const fs = require('fs');
const path = require('path');

const newFolderPath = path.join(__dirname, 'files-copy');
const folderPath = path.join(__dirname, 'files');

async function copyFolder (pathFiles, pathCopyFiles) {
  try{
    await fs.promises.mkdir(pathCopyFiles);
    const folderContent = await fs.promises.readdir(pathFiles, {withFileTypes: true});
    for (const elem of folderContent) {
      if (!elem.isDirectory()) {
        await fs.promises.copyFile(path.join(pathFiles, elem.name), path.join(pathCopyFiles, elem.name));
      } else {
        copyFolder(path.join(pathFiles, elem.name), path.join(pathCopyFiles, elem.name));
      }
    }
  } catch (err) {
    console.log(err);
  }
};

(async() => {
  try{
    await fs.promises.rm(newFolderPath, {force: true, recursive: true});
    copyFolder(folderPath, newFolderPath);
    } catch (err) {
      console.log(err);
    }
})();
