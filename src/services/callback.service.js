const axios = require("axios");

const sendCallback = async (callbackUrl, data) => {
  try {
    const response = await axios.post(callbackUrl, data, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    console.log("✅ Callback envoyé :", response.status);
  } catch (error) {
    console.error("❌ Erreur lors du callback :", error.message);
  }
};

module.exports = { sendCallback };
