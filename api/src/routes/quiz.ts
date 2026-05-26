import { Router, Request, Response } from "express";
import pool from "../db";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.get("/queue", verifyToken, async (req: Request, res: Response) => {
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

    const userId = user.rows[0].id;

    // Henüz daha öğrenilmemiş olan kelimeleri getir, streak'e göre sırala
    const words = await pool.query(
      `SELECT w.id, w.eng_word, w.tur_word, w.image_url, w.audio_url,
              array_agg(s.sentence) as samples,
              COALESCE(wp.correct_streak, 0) as correct_streak,
              COALESCE(wp.mastered, false) as mastered
       FROM words w
       LEFT JOIN samples s ON s.word_id = w.id
       LEFT JOIN word_progress wp ON wp.word_id = w.id AND wp.user_id = $1
       WHERE w.user_id = $1 AND COALESCE(wp.mastered, false) = false
       GROUP BY w.id, wp.correct_streak, wp.mastered
       ORDER BY COALESCE(wp.correct_streak, 0) ASC, RANDOM()
       LIMIT 10`,
      [userId],
    );

    res.json({ queue: words.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

router.post("/result", verifyToken, async (req: Request, res: Response) => {
  const { uid } = (req as any).user;
  const { word_id, quality } = req.body;

  try {
    const user = await pool.query(
      "SELECT id FROM users WHERE firebase_uid = $1",
      [uid],
    );
    if (user.rows.length === 0) {
      res.status(404).json({ error: "Kullanıcı bulunamadı" });
      return;
    }

    const userId = user.rows[0].id;

    // Mevcut progress'i getir
    const existing = await pool.query(
      "SELECT * FROM word_progress WHERE user_id = $1 AND word_id = $2",
      [userId, word_id],
    );

    if (existing.rows.length === 0) {
      // İlk kez görülen kelime
      const newStreak = quality === "correct" ? 1 : 0;
      await pool.query(
        "INSERT INTO word_progress (user_id, word_id, correct_streak, mastered, last_seen) VALUES ($1, $2, $3, $4, NOW())",
        [userId, word_id, newStreak, newStreak >= 6],
      );
    } else {
      const current = existing.rows[0];
      let newStreak = quality === "correct" ? current.correct_streak + 1 : 0;
      const mastered = newStreak >= 6;

      await pool.query(
        "UPDATE word_progress SET correct_streak = $1, mastered = $2, last_seen = NOW() WHERE user_id = $3 AND word_id = $4",
        [newStreak, mastered, userId, word_id],
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// İstatistiğin endpoint'i
router.get("/stats", verifyToken, async (req: Request, res: Response) => {
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

    const userId = user.rows[0].id;

    const stats = await pool.query(
      `SELECT
        COUNT(*) as total_words,
        COUNT(CASE WHEN wp.mastered = true THEN 1 END) as mastered_words,
        COUNT(CASE WHEN wp.correct_streak >= 3 THEN 1 END) as learning_words
       FROM words w
       LEFT JOIN word_progress wp ON wp.word_id = w.id AND wp.user_id = $1
       WHERE w.user_id = $1`,
      [userId],
    );

    res.json({ stats: stats.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

export default router;
