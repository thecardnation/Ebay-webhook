const express = require('express');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 3000;

// Replace these with your real values:
const VERIFICATION_TOKEN = "SecureToken_ebayWebhook_12345678901234567890";
const ENDPOINT_URL = "https://ebay-webhook.onrender.com/webhook";

app.get('/webhook', (req, res) => {
  const challengeCode = req.query.challenge_code;

  if (!challengeCode) {
    return res.status(400).json({ error: "Missing challenge_code" });
  }

  // Build the SHA-256 hash from: challengeCode + verificationToken + endpoint
  const hash = crypto.createHash('sha256');
  hash.update(challengeCode);
  hash.update(VERIFICATION_TOKEN);
  hash.update(ENDPOINT_URL);
  const challengeResponse = hash.digest('hex');

  // Send the response back in JSON format
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({ challengeResponse });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
