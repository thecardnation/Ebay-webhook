const express = require('express');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 3000;

// Replace these with your real values:
const VERIFICATION_TOKEN = "TheCardNation_Ebay_Tracker_Token_2025_ABC987";
const ENDPOINT_URL = "https://ebay-webhook-omyt.onrender.com/webhook";

// 🔹 eBay Deletion Notification Challenge Route
app.get('/webhook', (req, res) => {
  const challengeCode = req.query.challenge_code;

  if (!challengeCode) {
    return res.status(400).json({ error: "Missing challenge_code" });
  }

  // Build the SHA-256 hash: challengeCode + token + endpoint
  const hash = crypto.createHash('sha256');
  hash.update(challengeCode);
  hash.update(VERIFICATION_TOKEN);
  hash.update(ENDPOINT_URL);
  const challengeResponse = hash.digest('hex');

  // Return the response to eBay
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({ challengeResponse });
});

// 🔹 OAuth2 Callback Route for displaying authorization code
app.get('/oauth-callback', (req, res) => {
  const code = req.query.code;
  const state = req.query.state;

  if (!code) {
    return res.status(400).send("Missing authorization code.");
  }

  res.send(`
    <h2>✅ Authorization Successful</h2>
    <p>Here is your code:</p>
    <pre><code>${code}</code></pre>
    <p>Use this to exchange for your access token.</p>
  `);
});

// ✅ Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
