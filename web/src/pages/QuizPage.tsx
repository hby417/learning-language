import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getQuizQueue, submitQuizResult } from '../services/quizService'

type QuizCard = {
  id: number
  eng_word: string
  tur_word: string
  image_url: string | null
  audio_url: string | null
  correct_streak: number
  mastered: boolean
}

const QuizPage = () => {
  const [queue, setQueue] = useState<QuizCard[]>([])
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [results, setResults] = useState<('correct' | 'wrong')[]>([])
  const [finished, setFinished] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const data = await getQuizQueue()
        setQueue(data)
      } catch {
        setError('Kelimeler yüklenemedi.')
      } finally {
        setLoading(false)
      }
    }
    fetchQueue()
  }, [])

  const current = queue[index]

  const playAudio = (url: string) => {
    const audio = new Audio(url)
    audio.play()
  }

  const handleAnswer = async (quality: 'correct' | 'wrong') => {
    await submitQuizResult({ word_id: current.id, quality })
    const newResults = [...results, quality]
    setResults(newResults)
    setFlipped(false)
    if (index + 1 >= queue.length) {
      setFinished(true)
    } else {
      setIndex(index + 1)
    }
  }

  const restart = () => {
    setIndex(0)
    setFlipped(false)
    setResults([])
    setFinished(false)
    setLoading(true)
    getQuizQueue().then(data => {
      setQueue(data)
      setLoading(false)
    })
  }

  const correctCount = results.filter(r => r === 'correct').length

  const streakDots = (streak: number) => {
    return Array.from({ length: 6 }, (_, i) => (
      <div
        key={i}
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: i < streak ? '#c9a96e' : 'rgba(255,255,255,0.1)',
          transition: 'background 0.3s'
        }}
      />
    ))
  }

  return (
    <div style={{ fontFamily: "'Jost', sans-serif", backgroundColor: '#0e0f13', color: '#e8e4dc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 48px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <Link to="/" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontStyle: 'italic', fontSize: '22px', letterSpacing: '0.03em', color: '#e8e4dc', textDecoration: 'none' }}>
          Söz <span style={{ color: '#c9a96e' }}>Hazinesi</span>
        </Link>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7a7870', textDecoration: 'none' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Dashboard
        </Link>
      </nav>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>

        {loading && <p style={{ color: '#7a7870', fontSize: '13px', letterSpacing: '0.1em' }}>Yükleniyor...</p>}
        {error && <p style={{ color: '#c97070', fontSize: '13px' }}>{error}</p>}

        {!loading && !error && queue.length === 0 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, transparent, #c9a96e)', margin: '0 auto 20px' }} />
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontStyle: 'italic', fontSize: '38px', marginBottom: '16px' }}>
              Tebrikler! 🎉
            </h1>
            <p style={{ color: '#7a7870', fontSize: '13px', marginBottom: '24px' }}>Tüm kelimeleri öğrendiniz.</p>
            <Link to="/words" style={{ padding: '14px 32px', background: '#c9a96e', borderRadius: '2px', color: '#0e0f13', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Yeni Kelime Ekle
            </Link>
          </div>
        )}

        {!loading && !error && queue.length > 0 && !finished && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, transparent, #c9a96e)', margin: '0 auto 20px' }} />
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontStyle: 'italic', fontSize: '38px', letterSpacing: '0.02em' }}>
                Kelime <span style={{ color: '#c9a96e' }}>Quiz</span>
              </h1>
              <p style={{ fontSize: '11px', letterSpacing: '0.12em', color: '#7a7870', marginTop: '12px' }}>
                {index + 1} / {queue.length}
              </p>
            </div>

            {/* Streak göstergesi */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <span style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7a7870' }}>İlerleme</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                {streakDots(current.correct_streak)}
              </div>
              <span style={{ fontSize: '10px', color: '#7a7870' }}>{current.correct_streak}/6</span>
            </div>

            <div
              onClick={() => setFlipped(!flipped)}
              style={{ background: '#16181f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '2px', padding: '40px', width: '100%', maxWidth: '480px', textAlign: 'center', cursor: 'pointer', marginBottom: '32px', minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', gap: '16px' }}
            >
              <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7a7870' }}>
                {flipped ? 'Türkçe' : 'İngilizce'}
              </div>

              {!flipped && current.image_url && (
                <img
                  src={current.image_url}
                  alt={current.eng_word}
                  style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '2px', border: '1px solid rgba(255,255,255,0.07)' }}
                />
              )}

              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontStyle: 'italic', fontSize: '36px', letterSpacing: '0.02em', color: '#e8e4dc' }}>
                {flipped ? current.tur_word : current.eng_word}
              </div>

              {!flipped && current.audio_url && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); playAudio(current.audio_url!) }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.3)', borderRadius: '2px', color: '#c9a96e', fontFamily: "'Jost', sans-serif", fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', padding: '8px 16px', cursor: 'pointer' }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                  Okunuşu Dinle
                </button>
              )}

              {!flipped && (
                <div style={{ position: 'absolute', bottom: '16px', fontSize: '10px', letterSpacing: '0.1em', color: '#7a7870', textTransform: 'uppercase' }}>
                  Cevabı görmek için tıkla
                </div>
              )}
            </div>

            {flipped && (
              <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '480px' }}>
                <button onClick={() => handleAnswer('wrong')} style={{ flex: 1, padding: '14px', background: 'transparent', border: '1px solid rgba(201,112,112,0.3)', borderRadius: '2px', color: '#c97070', fontFamily: "'Jost', sans-serif", fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer' }}>
                  Bilmedim
                </button>
                <button onClick={() => handleAnswer('correct')} style={{ flex: 1, padding: '14px', background: 'transparent', border: '1px solid rgba(112,201,160,0.3)', borderRadius: '2px', color: '#70c9a0', fontFamily: "'Jost', sans-serif", fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer' }}>
                  Bildim
                </button>
              </div>
            )}
          </>
        )}

        {finished && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, transparent, #c9a96e)', margin: '0 auto 20px' }} />
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontStyle: 'italic', fontSize: '48px', letterSpacing: '0.02em', marginBottom: '16px' }}>
              Tur Bitti
            </h1>
            <p style={{ fontSize: '11px', letterSpacing: '0.12em', color: '#7a7870', marginBottom: '8px', textTransform: 'uppercase' }}>Sonuç</p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', fontWeight: 300, color: '#c9a96e', marginBottom: '48px' }}>
              {correctCount} / {queue.length} doğru
            </p>
            <button onClick={restart} style={{ padding: '14px 48px', background: '#c9a96e', border: 'none', borderRadius: '2px', color: '#0e0f13', fontFamily: "'Jost', sans-serif", fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer' }}>
              Tekrar Başla
            </button>
          </div>
        )}

      </main>
    </div>
  )
}

export default QuizPage