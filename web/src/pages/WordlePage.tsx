import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getWords } from '../services/wordService'

// Tahmin sonucunun tipini tanımlıyoruz.
// 'correct' = yeşil, 'present' = sarı, 'absent' = gri
type LetterState = 'correct' | 'present' | 'absent' | 'empty' | 'active'

type GuessRow = {
  letters: string[]
  states: LetterState[]
  submitted: boolean
}

const MAX_GUESSES = 6 // Maksimum tahmin hakkı

// Boş bir tahmin satırı oluşturucu — kelime uzunluğuna göre
const emptyRow = (wordLength: number): GuessRow => ({
  letters: Array(wordLength).fill(''),
  states: Array(wordLength).fill('empty'),
  submitted: false
})

// Renk eşlemesi — durum → arka plan rengi
const COLORS: Record<LetterState, string> = {
  correct: '#538d4e',   // Yeşil
  present: '#b59f3b',   // Sarı
  absent:  '#3a3a3c',   // Gri
  empty:   'transparent',
  active:  'transparent'
}

const WordlePage = () => {
  const [targetWord, setTargetWord] = useState('')
  const [wordLength, setWordLength] = useState(5)
  const [guesses, setGuesses] = useState<GuessRow[]>([])
  const [currentRow, setCurrentRow] = useState(0)
  const [currentCol, setCurrentCol] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  // Klavye harflerinin durumunu tutuyoruz — bir harf tahmin edildikten sonra
  // klavye üzerinde de renklenmesi için
  const [keyStates, setKeyStates] = useState<Record<string, LetterState>>({})

  // Sayfa açılınca kullanıcının kelimelerini çekip rastgele birini seç
  useEffect(() => {
    const fetchAndPick = async () => {
      try {
        const words = await getWords()
        if (!words || words.length === 0) {
          setError('Henüz kelime eklemediniz.')
          return
        }

        // Sadece harf içeren kelimeleri al (boşluk, tire vs. olanları geç)
        const validWords = words
          .map((w: any) => w.eng_word.toUpperCase().trim())
          .filter((w: string) => /^[A-Z]+$/.test(w))

        if (validWords.length === 0) {
          setError('Uygun kelime bulunamadı.')
          return
        }

        // Rastgele bir kelime seç
        const picked = validWords[Math.floor(Math.random() * validWords.length)]
        setTargetWord(picked)
        setWordLength(picked.length)

        // Tahmin ızgarasını başlat
        const initialGuesses = Array(MAX_GUESSES).fill(null).map(() => emptyRow(picked.length))
        setGuesses(initialGuesses)
      } catch {
        setError('Kelimeler yüklenemedi.')
      } finally {
        setLoading(false)
      }
    }
    fetchAndPick()
  }, [])

  // Bir tahmin satırını değerlendirip harf durumlarını hesapla
  // Bu Wordle'ın kalbi — her harfi kontrol ediyoruz
  const evaluateGuess = useCallback((guess: string[], target: string): LetterState[] => {
    const result: LetterState[] = Array(target.length).fill('absent')
    const targetArr = target.split('')
    const remaining: (string | null)[] = [...targetArr]

    // Önce doğru pozisyondaki harfleri işaretle (yeşil)
    guess.forEach((letter, i) => {
      if (letter === targetArr[i]) {
        result[i] = 'correct'
        remaining[i] = null // Bu harfi "kullanıldı" olarak işaretle
      }
    })

    // Sonra yanlış pozisyondaki harfleri işaretle (sarı)
    guess.forEach((letter, i) => {
      if (result[i] === 'correct') return
      const idx = remaining.indexOf(letter)
      if (idx !== -1) {
        result[i] = 'present'
        remaining[idx] = null
      }
    })

    return result
  }, [])

  // Klavye tuşuna basıldığında çağrılır
  const handleKey = useCallback((key: string) => {
    if (gameOver) return

    if (key === 'ENTER') {
      // Satır dolmamışsa enter'ı işleme alma
      if (currentCol < wordLength) return

      const currentGuess = guesses[currentRow]
      const states = evaluateGuess(currentGuess.letters, targetWord)

      // Tahmin sonuçlarını ızgaraya işle
      const newGuesses = [...guesses]
      newGuesses[currentRow] = { ...currentGuess, states, submitted: true }
      setGuesses(newGuesses)

      // Klavye renklerini güncelle
      const newKeyStates = { ...keyStates }
      currentGuess.letters.forEach((letter, i) => {
        const current = newKeyStates[letter]
        // Daha iyi bir durum varsa onu koru (correct > present > absent)
        if (current !== 'correct') {
          if (states[i] === 'correct') newKeyStates[letter] = 'correct'
          else if (states[i] === 'present' && current !== 'correct') newKeyStates[letter] = 'present'
          else if (!current) newKeyStates[letter] = 'absent'
        }
      })
      setKeyStates(newKeyStates)

      // Kazandı mı kontrol et
      if (states.every(s => s === 'correct')) {
        setWon(true)
        setGameOver(true)
        return
      }

      // Hakkı bitti mi?
      if (currentRow + 1 >= MAX_GUESSES) {
        setGameOver(true)
        return
      }

      setCurrentRow(prev => prev + 1)
      setCurrentCol(0)
      return
    }

    if (key === 'BACKSPACE') {
      if (currentCol === 0) return
      const newGuesses = [...guesses]
      newGuesses[currentRow].letters[currentCol - 1] = ''
      setGuesses(newGuesses)
      setCurrentCol(prev => prev - 1)
      return
    }

    // Harf girişi
    if (/^[A-Z]$/.test(key) && currentCol < wordLength) {
      const newGuesses = [...guesses]
      newGuesses[currentRow].letters[currentCol] = key
      setGuesses(newGuesses)
      setCurrentCol(prev => prev + 1)
    }
  }, [gameOver, currentCol, currentRow, wordLength, guesses, targetWord, evaluateGuess, keyStates])

  // Fiziksel klavye desteği
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      handleKey(e.key.toUpperCase())
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleKey])

  // Yeni oyun başlatmak için sayfayı yenile
  const restart = () => window.location.reload()

  // Ekran klavyesi satırları
  const keyboardRows = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['ENTER','Z','X','C','V','B','N','M','⌫']
  ]

  return (
    <div style={{ fontFamily: "'Jost', sans-serif", backgroundColor: '#0e0f13', color: '#e8e4dc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 48px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <Link to="/" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontStyle: 'italic', fontSize: '22px', letterSpacing: '0.03em', color: '#e8e4dc', textDecoration: 'none' }}>
          Söz <span style={{ color: '#c9a96e' }}>Hazinesi</span>
        </Link>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7a7870', textDecoration: 'none' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Dashboard
        </Link>
      </nav>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, transparent, #c9a96e)', margin: '0 auto 20px' }} />
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontStyle: 'italic', fontSize: '38px', letterSpacing: '0.02em' }}>
            Kelime <span style={{ color: '#c9a96e' }}>Bulmaca</span>
          </h1>
          <p style={{ fontSize: '11px', letterSpacing: '0.08em', color: '#7a7870', marginTop: '10px' }}>
            {wordLength} harfli kelimeyi {MAX_GUESSES} tahminde bul
          </p>
        </div>

        {loading && <p style={{ color: '#7a7870' }}>Yükleniyor...</p>}
        {error && <p style={{ color: '#c97070' }}>{error}</p>}

        {!loading && !error && (
          <>
            {/* Tahmin ızgarası */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '32px' }}>
              {guesses.map((row, ri) => (
                <div key={ri} style={{ display: 'flex', gap: '6px' }}>
                  {row.letters.map((letter, ci) => {
                    const state = row.submitted ? row.states[ci] : (ri === currentRow && ci < currentCol ? 'active' : 'empty')
                    const isActive = ri === currentRow
                    return (
                      <div
                        key={ci}
                        style={{
                          width: `${Math.min(56, Math.floor(320 / wordLength))}px`,
                          height: `${Math.min(56, Math.floor(320 / wordLength))}px`,
                          border: `2px solid ${row.submitted ? COLORS[state] : isActive && letter ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)'}`,
                          background: row.submitted ? COLORS[state] : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px',
                          fontWeight: 600,
                          color: row.submitted ? '#fff' : '#e8e4dc',
                          borderRadius: '2px',
                          transition: 'background 0.3s, border-color 0.3s'
                        }}
                      >
                        {letter}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>

            {/* Oyun sonu mesajı */}
            {gameOver && (
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                {won ? (
                  <p style={{ color: '#70c9a0', fontSize: '14px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Tebrikler! Doğru tahmin!</p>
                ) : (
                  <p style={{ color: '#c97070', fontSize: '14px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Kelime: <span style={{ color: '#c9a96e' }}>{targetWord}</span>
                  </p>
                )}
                <button onClick={restart} style={{ padding: '10px 32px', background: '#c9a96e', border: 'none', borderRadius: '2px', color: '#0e0f13', fontFamily: "'Jost', sans-serif", fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer' }}>
                  Yeni Oyun
                </button>
              </div>
            )}

            {/* Ekran klavyesi */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
              {keyboardRows.map((row, ri) => (
                <div key={ri} style={{ display: 'flex', gap: '5px' }}>
                  {row.map(key => {
                    const actualKey = key === '⌫' ? 'BACKSPACE' : key
                    const state = keyStates[key]
                    const isSpecial = key === 'ENTER' || key === '⌫'
                    return (
                      <button
                        key={key}
                        onClick={() => handleKey(actualKey)}
                        style={{
                          width: isSpecial ? '56px' : '36px',
                          height: '48px',
                          background: state ? COLORS[state] : 'rgba(255,255,255,0.1)',
                          border: 'none',
                          borderRadius: '4px',
                          color: '#e8e4dc',
                          fontFamily: "'Jost', sans-serif",
                          fontSize: isSpecial ? '9px' : '13px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          letterSpacing: isSpecial ? '0.05em' : '0',
                          transition: 'background 0.3s'
                        }}
                      >
                        {key}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default WordlePage