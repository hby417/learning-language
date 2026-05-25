import { Router, Request, Response } from "express";
import { verifyToken } from "../middleware/verifyToken";
import pool from "../db";

const router = Router();

// POST /api/story/generate
// Kullanıcının gönderdiği kelimeleri Gemini'ye hikaye yazdırır,
// Pollinations.ai ile görsel üretir ve her ikisini veritabanına kaydeder.
router.post("/generate", verifyToken, async (req: Request, res: Response) => {
  const { words } = req.body;
  const { uid } = (req as any).user;

  if (!words || words.length === 0) {
    res.status(400).json({ error: "Kelime listesi boş olamaz" });
    return;
  }

  try {
    // Kullanıcıyı veritabanında bulma
    const user = await pool.query(
      "SELECT id FROM users WHERE firebase_uid = $1",
      [uid],
    );
    if (user.rows.length === 0) {
      res.status(404).json({ error: "Kullanıcı bulunamadı" });
      return;
    }
    const userId = user.rows[0].id;

    // Gemini API'ye hikaye üretirme modülü //
    // Kelimelerin hikayede kalın yazılmasını ve Word Chain (Kelime Zinciri) mantığına
    // uygun şekilde birbirine bağlanmasını istiyoruz.
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Write a short English story (at least 150 words) using these words in a word chain style where each word connects to the next. Bold each of these words when used: ${words.join(", ")}. The story should feel natural and engaging.`,
                },
              ],
            },
          ],
        }),
      },
    );

    const geminiData = await geminiResponse.json();
    console.log("Gemini response:", JSON.stringify(geminiData, null, 2));
    const storyText =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    if (!storyText) {
      res.status(500).json({ error: "Hikaye oluşturulamadı" });
      return;
    }

    // Pollinations.ai ile görsel üretiyoruz.
    // Bu servis tamamen ücretsiz ve API key gerektirmiyor.
    // Prompt olarak kelimeleri ve hikaye temasını kullanıyoruz.
    // URL encode ederek boşluk ve özel karakterleri güvenli hale getiriyoruz.
    const imagePrompt = encodeURIComponent(
      `A beautiful illustration for a story about: ${words.join(", ")}. Artistic, colorful, storybook style.`,
    );
    const imageUrl = `https://image.pollinations.ai/prompt/${imagePrompt}?width=512&height=512&nologo=true`;

    // Hikayeyi ve görsel URL'ini veritabanına kaydediyoruz.
    // words alanını PostgreSQL dizisi olarak saklıyoruz.
    const saved = await pool.query(
      "INSERT INTO stories (user_id, words, story_text, image_url) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, words, storyText, imageUrl],
    );

    res.json({
      story: storyText,
      image_url: imageUrl,
      id: saved.rows[0].id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// GET /api/story/history
// Kullanıcının geçmişte oluşturduğu tüm hikayeleri listeler.
// En yeniden en eskiye sıralanır.
router.get("/history", verifyToken, async (req: Request, res: Response) => {
  const { uid } = (req as any).user;

  try {
    const user = await pool.query(
      "SELECT id FROM users WHERE firebase_uid = $1",
      [uid],
    );
    if (user.rows.length === 0) {
      res.status(404).json({ error: "Kullanıcı bulunamadı" });
      return;
    }

    const stories = await pool.query(
      "SELECT * FROM stories WHERE user_id = $1 ORDER BY created_at DESC",
      [user.rows[0].id],
    );

    res.json({ stories: stories.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

export default router;
