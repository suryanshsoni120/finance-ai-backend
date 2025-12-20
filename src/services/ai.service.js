const axios = require("axios");
const AI_SERVICE_URL = process.env.AI_SERVICE_URL;

exports.predictCategory = async (description) => {
  if (!AI_SERVICE_URL) {
    return [
      "AI service is not available yet."
    ];
  }

  try {
    const response = await axios.post(
      `${AI_SERVICE_URL}/predict-category`,
      description,
      {
        timeout: 5000 // prevents backend hanging forever
      }
    );

    return response.data || [];
  } catch (error) {
    console.error("AI service error:", error.message);

    // Graceful degradation (VERY IMPORTANT)
    return [
      "Unable to generate AI prediction at the moment."
    ];
  }
};