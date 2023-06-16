const { Storage } = require("@google-cloud/storage");

// Load the service account key JSON file
const keyFilename = "service-account-key.json";
const storage = new Storage({ keyFilename });

const bucketName = "air-park-api";
function uploadFile(local_path, dest_file) {
  return storage.bucket(bucketName).upload(local_path, {
    destination: dest_file,
  });
}

module.exports = { uploadFile };
