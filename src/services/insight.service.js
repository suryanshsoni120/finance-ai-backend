const axios = require("axios");
const AI_SERVICE_URL = process.env.AI_SERVICE_URL;

exports.generateInsights = async (payload) => {
    if (!AI_SERVICE_URL) {
        return [
            "AI insights service is not available yet."
        ];
    }

    try {
        const response = await axios.post(
            `${AI_SERVICE_URL}/ai/generate-insights`,
            payload,
            {
                timeout: 5000 // prevents backend hanging forever
            }
        );

        return response.data.insights || [];
    } catch (error) {
        console.error("AI service error:", error.message);

        // Graceful degradation (VERY IMPORTANT)
        return [
            "Unable to generate AI insights at the moment."
        ];
    }
};