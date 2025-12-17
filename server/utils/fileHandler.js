const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { promisify } = require('util');
const { pipeline } = require('stream');

const pipelineAsync = promisify(pipeline);

/**
 * File handling utilities demonstrating fs, streams, and zlib modules
 */

// Ensure uploads directory exists
const ensureUploadDir = (dir = 'uploads') => {
  const uploadPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  return uploadPath;
};

// Read file using streams (for large files)
const readFileStream = (filePath) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const readStream = fs.createReadStream(filePath);

    readStream.on('data', (chunk) => chunks.push(chunk));
    readStream.on('end', () => resolve(Buffer.concat(chunks)));
    readStream.on('error', reject);
  });
};

// Write file using streams
const writeFileStream = (filePath, data) => {
  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(filePath);
    writeStream.write(data);
    writeStream.end();
    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
  });
};

// Compress file using zlib (gzip)
const compressFile = async (inputPath, outputPath) => {
  const gzip = zlib.createGzip();
  const source = fs.createReadStream(inputPath);
  const destination = fs.createWriteStream(outputPath || `${inputPath}.gz`);

  await pipelineAsync(source, gzip, destination);
  return outputPath || `${inputPath}.gz`;
};

// Decompress file using zlib
const decompressFile = async (inputPath, outputPath) => {
  const gunzip = zlib.createGunzip();
  const source = fs.createReadStream(inputPath);
  const destination = fs.createWriteStream(outputPath || inputPath.replace('.gz', ''));

  await pipelineAsync(source, gunzip, destination);
  return outputPath || inputPath.replace('.gz', '');
};

// Delete file
const deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err && err.code !== 'ENOENT') {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Get file info
const getFileInfo = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stats) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime,
          isFile: stats.isFile(),
          isDirectory: stats.isDirectory()
        });
      }
    });
  });
};

// List files in directory
const listFiles = (dirPath) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
      if (err) {
        reject(err);
      } else {
        const fileList = files.map(file => ({
          name: file.name,
          isFile: file.isFile(),
          isDirectory: file.isDirectory()
        }));
        resolve(fileList);
      }
    });
  });
};

// Copy file using streams (efficient for large files)
const copyFile = async (sourcePath, destPath) => {
  const source = fs.createReadStream(sourcePath);
  const destination = fs.createWriteStream(destPath);

  await pipelineAsync(source, destination);
  return destPath;
};

module.exports = {
  ensureUploadDir,
  readFileStream,
  writeFileStream,
  compressFile,
  decompressFile,
  deleteFile,
  getFileInfo,
  listFiles,
  copyFile
};
