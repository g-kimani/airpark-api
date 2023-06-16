const { Storage } = require("@google-cloud/storage");

// Load the service account key JSON file
const keyFilename = "service-account-key.json";
const storage = new Storage({ keyFilename });
const bucketName = "air-park-api";

async function createBucket() {
  try {
    const [bucket] = await storage.createBucket(bucketName);
    console.log(`Bucket ${bucket.name} created.`);
  } catch (error) {
    console.error("Error creating bucket:", error);
  }
}

createBucket().catch((err) => console.log(err));
