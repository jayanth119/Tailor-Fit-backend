const admin = require("firebase-admin");

let serviceAccount;

try {
  serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
} 
catch (error) 
{
  console.error("Invalid FIREBASE_CONFIG:", error);
  process.exit(1); // Exit the process if the config is invalid
}

try 
{
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Firebase Admin SDK initialized successfully.");
} 
catch (error) 
{
  console.error("Failed to initialize Firebase Admin SDK:", error);
  process.exit(1); // Exit the process if initialization fails
}

module.exports = admin;
