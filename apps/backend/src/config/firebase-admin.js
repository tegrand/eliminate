import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The user placed config.json at the root of the "eliminate" project.
const serviceAccountPath = path.join(__dirname, "../../../../config.json");

let serviceAccount;
try {
  const fileContents = fs.readFileSync(serviceAccountPath, "utf8");
  serviceAccount = JSON.parse(fileContents);
} catch (error) {
  console.error("Failed to load Firebase Admin service account key from:", serviceAccountPath);
  console.error("Make sure config.json is placed in the root directory (eliminate/).");
}

let app;
if (serviceAccount && !getApps().length) {
  app = initializeApp({
    credential: cert(serviceAccount)
  });
  console.log("Firebase Admin Initialized Successfully");
}

export const auth = getAuth(app);
