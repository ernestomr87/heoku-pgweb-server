const fs = require("fs");
const Path = require("path");
var winston = require("./../../config/winston");

const getStatus = status => {
  switch (status) {
    case 0:
      return "Waiting";
    case 5:
      return "Waiting Quoting";
    case 6:
      return "Quoting";
    case 7:
      return "Quote Ready";
    case 17:
      return "Pending Accept/Reject";
    case 20:
      return "Preprocessing";
    case 30:
      return "Processing";
    case 40:
      return "PostProcessing";
    case 100:
      return "Finished";
    case 110:
      return "Downloaded";
    case 120:
      return "Downloaded";
    case -10:
      return "Processing Error";

    default:
      return "Waiting";
  }
};

const saveFile = async (file, path) => {
  return new Promise((resolve, reject) => {
    try {
      file.mv(path, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

const deleteFolderRecursive = async path => {
  try {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach((file, index) => {
        const curPath = Path.join(path, file);
        if (fs.lstatSync(curPath).isDirectory()) {
          // recurse
          deleteFolderRecursive(curPath);
        } else {
          // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
  } catch (error) {
    console.log(error);
  }
};

const logsConsole = data => {
  const { message, method, line } = data;

  console.log("\n");
  console.log("\x1b[33m%s\x1b[0m", "***************MODELS****************");
  console.log("\x1b[33m%s\x1b[0m", JSON.stringify(message));
  console.log("\x1b[33m%s\x1b[0m", JSON.stringify(method));
  console.log("\x1b[33m%s\x1b[0m", ` ${JSON.stringify(line)}`);
  console.log("\x1b[33m%s\x1b[0m", "*************************************");
  console.log("\n");
  
  winston.error(`message: ${message}`); 
  winston.error(`method: ${method}`); 
  winston.error(`line: ${line}`); 




  // logger.info('What rolls down stairs');
  // logger.info('alone or in pairs,');
  // logger.info('and over your neighbors dog?');
  // logger.warn('Whats great for a snack,');
  // logger.info('And fits on your back?');
  // logger.error('Its log, log, log');
};

module.exports = {
  getStatus,
  saveFile,
  deleteFolderRecursive,
  logsConsole
};
