const fs = require('fs');
const path = require('path');

const getAllFiles = (directory, foldersOnly = false) => {
  let fileNames = [];

  const files = fs.readdirSync(directory, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(directory, file.name);

    if (file.isDirectory()) {
      if (foldersOnly) {
        fileNames.push(filePath);
      } else {
        fileNames = [...fileNames, ...getAllFiles(filePath, foldersOnly)];
      }
    } else {
      if (!foldersOnly && file.isFile()) {
        fileNames.push(filePath);
      }
    }
  }

  return fileNames;
};

module.exports = getAllFiles;
