const { Anthropic } = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const INVESTOR_PROMPT = `
You are simulating a virtual pitch room with two startup investors.
Investor 0 (Tech): Analytical, asks about tech stack, scalability, data, and architecture.
Investor 1 (Business): Pragmatic, asks about monetization, go-to-market, target audience, and revenue.

The user will speak their pitch in chunks. 
Review the entire conversation. Decide which investor should respond to the user's latest statement.
Keep the response extremely short (1-2 sentences maximum), conversational, sharp, and natural.
DO NOT use markdown, emojis, or greetings. Just jump straight into the dialogue.

You MUST respond formatted EXACTLY as this JSON object (no other text):
{
  "investorIdx": 0 or 1,
  "reply": "The response text here"
}
`;

const FEEDBACK_PROMPT = `
The user is pitching their startup idea in a single text block.
You simulate two investors:
- Tech Investor: Evaluates architecture, stack, scalability.
- Business Shark: Evaluates monetization, GTM, audience.

First, formulate a short, sharp 1-2 sentence response from the Tech Investor.
Second, formulate a short, sharp 1-2 sentence response from the Business Shark.
Third, provide scores out of 100 for both areas, and a final 2-3 sentence verdict summarizing.

You MUST respond formatted EXACTLY as this JSON object (no other text):
{
  "techScore": 85,
  "bizScore": 72,
  "techReply": "I like the stack, but how do you plan to handle state synchronization at scale?",
  "bizReply": "It's a crowded market. You need a sharper wedge to monetize early adopters.",
  "verdict": "Your idea has strong tech but struggles with a clear GTM strategy..."
}
`;

async function handlePitchChat(chatHistory) {
  // Convert chatHistory [{role: 'user', content: '...'}, {role: 'investor', content: '...', idx: 0}]
  // to Anthropic messages format [{role: 'user'|'assistant', content: '...'}]
  const messages = chatHistory.map(msg => ({
    role: msg.role === 'investor' ? 'assistant' : 'user',
    content: msg.content
  }));

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 200,
    system: INVESTOR_PROMPT,
    messages: messages,
  });

  const rawText = response.content[0].text.trim();
  try {
    return JSON.parse(rawText);
  } catch (e) {
    console.error("Failed to parse Claude chat response as JSON:", rawText);
    // fallback
    return { investorIdx: 1, reply: "Interesting point. Can you elaborate?" };
  }
}

async function handlePitchFeedback(pitchText) {
  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 300,
    system: FEEDBACK_PROMPT,
    messages: [
      { role: 'user', content: `Here is my startup pitch:\n\n${pitchText}` }
    ],
  });

  const rawText = response.content[0].text.trim();
  try {
    return JSON.parse(rawText);
  } catch (e) {
    console.error("Failed to parse Claude feedback response as JSON:", rawText);
    return { 
      techScore: 50, bizScore: 50, 
      techReply: "I couldn't evaluate this properly.", 
      bizReply: "Same here. Speak clearer.", 
      verdict: "We couldn't generate a clear score based on the transcript." 
    };
  }
}

module.exports = {
  handlePitchChat,
  handlePitchFeedback
};
