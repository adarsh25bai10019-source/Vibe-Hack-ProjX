const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ============================================================
// SYSTEM PROMPT — Edit this to change Claude's persona/tone
// ============================================================
const SYSTEM_PROMPT = `You are a startup mentor and investor advisor helping Indian college students turn their projects into income and funding opportunities. Be specific, encouraging, and realistic. Always respond in JSON only — no markdown, no explanation, just raw JSON.`;

// ============================================================
// USER PROMPT TEMPLATE — Edit this to change the analysis shape
// ============================================================
function buildUserPrompt({ projectName, description, techStack, targetAudience, stage, githubLink }) {
  return `Analyse this student project and return a JSON object with exactly these fields:

Project Name: ${projectName}
Description: ${description}
Tech Stack: ${techStack}
Target Audience: ${targetAudience}
Stage: ${stage}
${githubLink ? `GitHub Link: ${githubLink}` : ''}

Return this exact JSON structure:
{
  "underdog_score": <number 0-100>,
  "score_label": <string like "Hidden Gem" or "Raw Diamond" or "Underrated Powerhouse">,
  "score_reason": <string, 2 sentences why this score>,
  "monetization_paths": [
    {
      "title": <string>,
      "description": <string, 1-2 sentences>,
      "effort": <"Low" or "Medium" or "High">,
      "effort_score": <number 1-10>,
      "revenue_min": <number in INR monthly>,
      "revenue_max": <number in INR monthly>,
      "confidence": <number 0-100>
    }
  ],
  "target_niche": <string, very specific target user description>,
  "investor_type": <"Angel Investor" or "Pre-seed VC" or "Government Grant" or "Accelerator Program">,
  "investor_type_reason": <string, 1 sentence why this funding type fits>,
  "funding_opportunities": [
    {
      "name": <string, real Indian funding program or investor>,
      "type": <string>,
      "fit_score": <number 0-100>,
      "url": <string, real URL>
    }
  ],
  "pitch_capsule": {
    "problem": <string, 1 sentence>,
    "solution": <string, 1 sentence>,
    "ask": <string, 1 sentence, e.g. "We are looking for ₹5L seed to reach 1000 users in 3 months">
  },
  "first_dollar": {
    "days": <number, realistic days to first income>,
    "amount": <number in INR>,
    "action": <string, one very specific action to take today>,
    "founder_type": <string, e.g. "Builder-Seller" or "Community Creator" or "Problem Solver">,
    "indian_startup_parallel": <string, e.g. "Zepto started as a college delivery app just like yours">
  }
}

Return 3 monetization_paths and 3 funding_opportunities. Be specific to the Indian student ecosystem. Use real INR numbers.`;
}

// ============================================================
// MAIN ANALYSE FUNCTION — Called by the Express route
// ============================================================
async function analyseProject(projectData) {
  const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: buildUserPrompt(projectData),
      },
    ],
  });

  const rawText = response.content[0].text.trim();

  // Strip any accidental markdown fences if Claude wraps with ```json
  const jsonText = rawText.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/, "").trim();

  const parsed = JSON.parse(jsonText);
  return parsed;
}

module.exports = { analyseProject };
