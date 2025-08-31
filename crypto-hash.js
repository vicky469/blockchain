const crypto = require("crypto"); // Node.js built-in crypto module

const cryptoHash = (...inputs) => {
  return crypto
    .createHash("sha256")
    .update(inputs.sort().join(","))
    .digest("hex");
};

module.exports = cryptoHash;
