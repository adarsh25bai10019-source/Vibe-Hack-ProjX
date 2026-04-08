# ProjX — From Student Project to Funded Startup

> "You're not a student with a project. You're a founder with a product."

Built at **VIT Bhopal Vibe Coding Hackathon 2026** using Antigravity IDE + Claude AI.

---

## What is ProjX?

ProjX is an AI-powered launchpad that transforms any student project into a complete monetization roadmap, investor match, and funded startup plan — in under 60 seconds.

India has 10 crore students. Most of them have built something. None of them know what to do next. ProjX changes that.

---

## Features

### 1. Underdog Score
Every project gets rated 0–100 with a label like "Hidden Gem" or "Underrated Powerhouse." No project gets left behind — even the small ones get validated.

### 2. Monetization Paths
3 specific income routes tailored to the exact project. Each path includes an INR revenue range, effort level, and confidence percentage. No generic advice — real numbers.

### 3. Effort vs Income Matrix
All 3 monetization paths plotted on a visual scatter chart. The low-effort, high-income "sweet spot" is highlighted. Instant clarity on where to start.

### 4. Investor Match + 30-Second Pitch Capsule
Matches the project to the right funding type — Angel, Pre-seed VC, Government Grant, or Accelerator. Surfaces real Indian programs like Surge, Antler India, NASSCOM 10000 Startups, and Atal Innovation Mission. Generates a 3-line elevator pitch: Problem. Solution. Ask. Ready to copy and send.

### 5. Virtual Investor Pitch Room
A 3D room built in Three.js with two seated AI investor avatars. The student speaks their pitch out loud using the microphone. Investors respond in real time, push back with hard questions, and score the pitch on Clarity, Market, and Traction across 5 rounds. Session ends with a personalised feedback verdict.

### 6. First Dollar Screen
The emotional climax of the app. Shows: "Your first ₹1,000 is 7 days away. Here's your one move for today." Includes founder archetype, a real Indian startup parallel, and a shareable LinkedIn card.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Tailwind CSS |
| 3D Scene | Three.js |
| Charts | Chart.js |
| Backend | Node.js, Express |
| AI Brain | Anthropic Claude API (claude-sonnet-4-6) |
| Voice Input | Web Speech API |
| IDE | Antigravity (Google) |

---

## Project Structure

Vibe-Hack-ProjX/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Logo.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── InputForm.jsx
│   │   │   ├── UnderdogScore.jsx
│   │   │   ├── MonetizationCards.jsx
│   │   │   ├── EffortIncomeMatrix.jsx
│   │   │   ├── InvestorMatch.jsx
│   │   │   ├── PitchCapsule.jsx
│   │   │   ├── PitchRoom.jsx
│   │   │   └── FirstDollarScreen.jsx
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
├── server/
│   ├── index.js
│   ├── claude.js
│   └── package.json
├── .gitignore
└── README.md




---

## Setup and Installation

### Prerequisites
- Node.js v18 or above
- An Anthropic API key from console.anthropic.com

### 1. Clone the repository
```bash
git clone https://github.com/adarsh25bai10019-source/Vibe-Hack-ProjX.git
cd Vibe-Hack-ProjX
```

### 2. Install dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Set up environment variables
Create a `.env` file inside the `/server` folder:

ANTHROPIC_API_KEY=your_claude_api_key_here
PORT=3001




### 4. Run the app
```bash
# In /server
npm start

# In /client (new terminal)
npm run dev
```

### 5. Open in browser

http://localhost:5173

## How It Works

Student pastes project
↓
Claude analyses via API
↓
Underdog Score + 3 Monetization Paths
↓
Effort vs Income Matrix (visual)
↓
Investor Match + Pitch Capsule
↓
Virtual Pitch Room (speak to AI investors)
↓
First Dollar Screen

---

## The One-Line Pitch

> "We don't just tell students what their project is worth. We tell them who will pay for it, who will fund it, and exactly what to say to both — in 60 seconds."

---

## Team

Built in 8 hours at **VIT Bhopal Vibe Coding Hackathon 2026.**

---

## License

MIT — free to use, build on, and share.
