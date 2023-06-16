const { Storage } = require("@google-cloud/storage");

// Load the service account key JSON fil

const keyFilename = `service-account-key.json`;
const storage = new Storage({ keyFilename });

const bucketName = "air-park-api";
function uploadImage(file) {
  return new Promise((resolve, reject) => {
    // Upload the file directly to Google Cloud Storage
    const gcsFileName = `${Date.now()}_${file.originalname}`;
    const gcsFile = storage.bucket(bucketName).file(gcsFileName);

    const stream = gcsFile.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
      resumable: false,
    });

    stream.on("error", (err) => {
      reject(err);
      // res.status(500).json({ error: "Failed to upload image" });
    });

    stream.on("finish", () => {
      let publicUrl = `https://storage.googleapis.com/${bucketName}/${encodeURIComponent(
        gcsFileName
      )}`;

      console.log("file uploaded succesfully");
      resolve(publicUrl);
    });

    stream.end(file.buffer);
  });
}

module.exports = { uploadImage };
