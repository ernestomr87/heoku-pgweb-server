const fs = require("fs");
const Path = require("path");

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

    default:
      return "Waiting";
  }
};

const saveFile = async (file, folderName, fileName, fileType) => {
  try {
    let ff = file.split(";base64,").pop();
    let buff = Buffer.from(ff, "base64");

    return new Promise((resolve, reject) => {
      fs.writeFile(
        `uploads/${folderName}/${fileName}`,
        buff,
        "base64",
        async err => {
          if (err) {
            return reject(err);
          } else {
            return resolve(true);
          }
        }
      );
    });
  } catch (error) {
    console.log(error);
    return false;
  }
};

const deleteFolderRecursive = path => {
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
};

module.exports = {
  getStatus,
  saveFile,
  deleteFolderRecursive
};
