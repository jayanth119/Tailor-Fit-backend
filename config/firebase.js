const admin = require("firebase-admin");
const https = require("https");

/*const agent = new https.Agent({
    rejectUnauthorized: false,  
});*/


let serviceAccount;

try {
  serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
} 
catch (error) 
{
  console.error("Invalid FIREBASE_CONFIG:", error);
  process.exit(1); 
}

try 
{
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  //process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  console.log("Firebase Admin SDK initialized successfully.");
} 

catch (error) 
{
  console.error("Failed to initialize Firebase Admin SDK:", error);
  process.exit(1);
}

module.exports = admin;
