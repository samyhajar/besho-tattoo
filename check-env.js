/* eslint-disable @typescript-eslint/no-require-imports */
require("dotenv").config({ path: ".env.local" });

console.log("🔍 Checking Google Meet Environment Variables...\n");

// Check for Service Account credentials (Domain-wide delegation)
const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
const delegatedUserEmail = process.env.GOOGLE_DELEGATED_USER_EMAIL;

// Check for OAuth credentials (Simple setup)
const oauthClientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
const oauthClientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
const oauthRefreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;

console.log("📋 Service Account Method (Domain-wide Delegation):");
console.log(
  `${serviceAccountEmail ? "✅" : "❌"} GOOGLE_SERVICE_ACCOUNT_EMAIL: ${serviceAccountEmail ? "Set" : "Missing"}`,
);
console.log(
  `${serviceAccountKey ? "✅" : "❌"} GOOGLE_SERVICE_ACCOUNT_KEY: ${serviceAccountKey ? "Set" : "Missing"}`,
);
console.log(
  `${delegatedUserEmail ? "✅" : "❌"} GOOGLE_DELEGATED_USER_EMAIL: ${delegatedUserEmail ? "Set" : "Missing"}`,
);

console.log("\n🔑 OAuth Method (Simple Setup):");
console.log(
  `${oauthClientId ? "✅" : "❌"} GOOGLE_OAUTH_CLIENT_ID: ${oauthClientId ? "Set" : "Missing"}`,
);
console.log(
  `${oauthClientSecret ? "✅" : "❌"} GOOGLE_OAUTH_CLIENT_SECRET: ${oauthClientSecret ? "Set" : "Missing"}`,
);
console.log(
  `${oauthRefreshToken ? "✅" : "❌"} GOOGLE_OAUTH_REFRESH_TOKEN: ${oauthRefreshToken ? "Set" : "Missing"}`,
);

const hasServiceAccount =
  serviceAccountEmail && serviceAccountKey && delegatedUserEmail;
const hasOAuth = oauthClientId && oauthClientSecret && oauthRefreshToken;

console.log("\n==================================================");
if (hasServiceAccount) {
  console.log("✅ Service Account configuration complete!");
  console.log("📖 Your app will use domain-wide delegation");
} else if (hasOAuth) {
  console.log("✅ OAuth configuration complete!");
  console.log("📖 Your app will use simple OAuth authentication");
} else {
  console.log("⚠️  No complete Google Meet configuration found");
  console.log(
    "📖 Check GOOGLE_MEET_SETUP.md (service account) or GOOGLE_MEET_SETUP_SIMPLE.md (OAuth) for instructions",
  );
}
console.log("==================================================");
