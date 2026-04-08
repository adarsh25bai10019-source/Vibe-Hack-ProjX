require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { analyseProject } = require("./claude");
const { handlePitchChat, handlePitchFeedback } = require("./pitchClaude");

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================================
// MIDDLEWARE
// ============================================================
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:5173"] }));
app.use(express.json());

// ============================================================
// ROUTES
// ============================================================

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Project-to-Income Engine server is running" });
});

// Main analysis endpoint
app.post("/api/analyse", async (req, res) => {
  const { projectName, description, techStack, targetAudience, stage, githubLink } = req.body;

  // Basic validation
  if (!projectName || !description || !techStack || !targetAudience || !stage) {
    return res.status(400).json({
      error: "Missing required fields",
      required: ["projectName", "description", "techStack", "targetAudience", "stage"],
    });
  }

  try {
    console.log(`[Analyse] Processing project: "${projectName}"`);
    const result = await analyseProject({ projectName, description, techStack, targetAudience, stage, githubLink });
    console.log(`[Analyse] Done — underdog score: ${result.underdog_score}`);
    res.json(result);
  } catch (error) {
    console.error("[Analyse] Error:", error.message);

    if (error.message.includes("JSON")) {
      return res.status(500).json({
        error: "Analysis parsing failed",
        message: "Claude returned an unexpected format. Please try again.",
      });
    }

    if (error.status === 401) {
      return res.status(500).json({
        error: "API key invalid",
        message: "Please check your ANTHROPIC_API_KEY in the .env file.",
      });
    }

    res.status(500).json({
      error: "Analysis failed",
      message: "Something went wrong. Please try again in a moment.",
    });
  }
});

// Pitch chat interaction
app.post("/api/pitch/chat", async (req, res) => {
  const { chatHistory } = req.body;
  if (!chatHistory || !Array.isArray(chatHistory)) {
    return res.status(400).json({ error: "Missing or invalid chatHistory payload" });
  }

  try {
    const result = await handlePitchChat(chatHistory);
    res.json(result);
  } catch (error) {
    console.error("[Pitch] Error:", error.message);
    res.status(500).json({ error: "Failed to process chat" });
  }
});

// Final pitch feedback
app.post("/api/pitch/feedback", async (req, res) => {
  const { pitchText } = req.body;
  if (!pitchText || typeof pitchText !== 'string') {
    return res.status(400).json({ error: "Missing or invalid pitchText payload" });
  }

  try {
    const result = await handlePitchFeedback(pitchText);
    res.json(result);
  } catch (error) {
    console.error("[Pitch Feedback] Error:", error.message);
    res.status(500).json({ error: "Failed to generate feedback" });
  }
});

// ============================================================
// START SERVER
// ============================================================
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`\n🚀 Project-to-Income Engine server running on http://localhost:${PORT}`);
    console.log(`📊 POST /api/analyse — ready to analyse projects\n`);
  });
}

module.exports = app;
