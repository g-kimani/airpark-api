const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./routes/storage/temp");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const acceptedExtensions = [".png", ".jpg", ".mp4"];
    let fileExtension = "";
    acceptedExtensions.forEach((ext) => {
      if (file.originalname.toLowerCase().endsWith(ext)) {
        fileExtension = ext;
      }
    });
    cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension);
  },
});

const fileStorage = multer({ storage: storage });

const deleteFile = (filename) => {
  fs.unlink(`routes/storage/temp/${filename}`, (error) => {
    if (error) {
      console.error("Error deleting file:", error);
    } else {
      console.log("File deleted successfully");
    }
  });
};
module.exports = { fileStorage, deleteFile };
