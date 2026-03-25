// api/moderate.js  ← place this file in an "api" folder at your project ROOT (not inside src/)
// ─── Vercel Serverless Function for AI Toxicity Moderation ───
//
// SETUP after deploying to Vercel:
// 1. Go to vercel.com → your project → Settings → Environment Variables
// 2. Add:  ANTHROPIC_API_KEY  =  sk-ant-... (get from console.anthropic.com)
// 3. Redeploy — toxicity filtering now works!
//
// For LOCAL testing, create .env.local in your project root:
//   ANTHROPIC_API_KEY=your_key_here
// Then run:  npx vercel dev  (instead of npm run dev)

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")   return res.status(405).json({ error: "Method not allowed" });

  const { message } = req.body || {};
  if (!message) return res.status(400).json({ toxic: false });

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type":      "application/json",
        "x-api-key":         process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model:      "claude-sonnet-4-20250514",
        max_tokens: 60,
        messages: [{
          role: "user",
          content: `You moderate an anonymous platform for sharing genuine feelings and thoughts. Users may be college students, teammates, or friends sharing emotions, incidents, and honest thoughts.

TOXIC   = clearly abusive, hateful, personal attacks, slurs, or threats intended to demean.
CLEAN   = honest feelings, raw emotions, harsh criticism, venting — but not targeted hatred.

Be BALANCED. Raw honest emotion is CLEAN. Only flag obvious abuse.

Message: """${message}"""

Reply with ONE word only: TOXIC or CLEAN`,
        }],
      }),
    });
    const data   = await response.json();
    const result = data?.content?.[0]?.text?.trim().toUpperCase();
    return res.json({ toxic: result === "TOXIC" });
  } catch (err) {
    console.error("Moderation error:", err);
    return res.json({ toxic: false });
  }
}