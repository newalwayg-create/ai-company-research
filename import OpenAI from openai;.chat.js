import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY  // Vercel環境変数に設定
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URLが必要です" });

  try {
    const prompt = `
次のURLの企業について、就活用の企業研究レポートを作ってください。
ポイント：企業概要・強み・弱み・志望動機に使えるポイント
URL: ${url}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5
    });

    const answer = completion.choices[0].message.content;
    res.status(200).json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI呼び出しエラー" });
  }
}
