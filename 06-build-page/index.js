const fs = require('fs');
const path = require('path');
const util = require('util');

const promisifiedRm = util.promisify(fs.rm);
const filePath = path.join(__dirname, 'template.html');
const newFolderPath = path.join(__dirname, 'project-dist');
const componentsFolderPath = path.join(__dirname, 'components');
const stylesFolderPath = path.join(__dirname, 'styles');
const assetsFolderPath = path.join(__dirname, 'assets');

const templateReadStream = fs.createReadStream(filePath,'utf-8');

async function mergeStyles () {
  try {
    const outputCss = fs.createWriteStream(path.join(newFolderPath, 'style.css'));
    const stylesContent = await fs.promises.readdir(stylesFolderPath, {withFileTypes: true});
    for await (const elem of stylesContent) {
      if (!elem.isDirectory() && path.extname(`${elem.name}`) === '.css') {
        const readableStyles = fs.createReadStream(path.join(stylesFolderPath, elem.name), 'utf-8');
        readableStyles.pipe(outputCss);
      }
    }
  } catch (err) {
    console.log(err);
  }
}

async function copyFolder (pathForAssets, copyPathForAssets) {
  try{
    await fs.promises.mkdir(copyPathForAssets);
    const assetsContent = await fs.promises.readdir(pathForAssets, {withFileTypes: true});
    for (const elem of assetsContent) {
      if (!elem.isDirectory()) {
        await fs.promises.copyFile(path.join(pathForAssets, elem.name), path.join(copyPathForAssets, elem.name));
      } else {
        copyFolder(path.join(pathForAssets, elem.name), path.join(copyPathForAssets, elem.name));
      }
    }
  } catch (err) {
    console.log(err);
  }
};

async function buildPage () {
  try {
    await promisifiedRm(newFolderPath, {force: true, recursive: true});
    await fs.promises.mkdir(newFolderPath);
    const outputHtml = fs.createWriteStream(path.join(newFolderPath, 'index.html'));
    outputHtml.write(htmlContent);
    mergeStyles();
    const copyAssetsPath = path.join(newFolderPath, 'assets');
    copyFolder(assetsFolderPath, copyAssetsPath);
  } catch (err){
    console.log(err);
  }
}

async function replaceTags () {
  try {
    const componentsContent = await fs.promises.readdir(componentsFolderPath, {withFileTypes: true});
    for (const elem of componentsContent) {
      if (!elem.isDirectory()) {
        if (htmlContent.match(`{{${path.parse(elem.name).name}}}`) !== null) {
          let component = await fs.promises.readFile(path.join(componentsFolderPath, elem.name), 'utf-8');
          let replacedPart = htmlContent.replaceAll(`{{${path.parse(elem.name).name}}}`, component);
          htmlContent = replacedPart;
        } else {
          continue;
        }
      }
    }
    buildPage();
  } catch (err) {
    console.log(err);
  }
}

let htmlContent = '';
templateReadStream.on('data', chunk => htmlContent += chunk);
templateReadStream.on('end', replaceTags);



