import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { generateStory, getStoryHistory } from '../services/storyService'

// Geçmiş hikaye verisinin tipini tanımlıyoruz.
// Veritabanından dönen JSON yapısıyla birebir eşleşmeli.
type StoryHistory = {
  id: number
  words: string[]
  story_text: string
  image_url: string
  created_at: string
}

// Word Chain kuralını kontrol eden fonksiyon.
// Her kelimenin bir öncekinin son harfiyle başlaması gerekiyor.
// Örnek: Brain -> Night -> Tiger -> Robin -> Noble
// B-r-a-i-N -> N-i-g-h-T -> T-i-g-e-R -> R-o-b-i-N -> N-o-b-l-e
const isValidWordChain = (words: string[]): boolean => {
  if (words.length < 2) return true // Tek kelime zincir kuralına tabi değil
  for (let i = 1; i < words.length; i++) {
    const prevWord = words[i - 1].toLowerCase()
    const currWord = words[i].toLowerCase()
    // Önceki kelimenin son harfi, sonraki kelimenin ilk harfiyle eşleşmeli
    if (prevWord[prevWord.length - 1] !== currWord[0]) {
      return false
    }
  }
  return true
}

const StoryPage = () => {
  const [prompt, setPrompt] = useState('')
  const [story, setStory] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [chainError, setChainError] = useState('')
  const [history, setHistory] = useState<StoryHistory[]>([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [selectedStory, setSelectedStory] = useState<StoryHistory | null>(null)

  // Sayfa açılınca geçmiş hikayeleri çek
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getStoryHistory()
        setHistory(data)
      } catch {
        // Geçmiş yüklenemezse sessizce geç, kritik değil
      } finally {
        setHistoryLoading(false)
      }
    }
    fetchHistory()
  }, [])

  // Kullanıcı kelime girince Word Chain kuralını anlık kontrol et
  const handlePromptChange = (val: string) => {
    setPrompt(val)
    setChainError('')

    const words = val.split(',').map(w => w.trim()).filter(w => w !== '')
    if (words.length >= 2 && !isValidWordChain(words)) {
      // Hangi kelimelerin zinciri bozduğunu kullanıcıya göster
      for (let i = 1; i < words.length; i++) {
        const prev = words[i - 1]
        const curr = words[i]
        if (prev[prev.length - 1]?.toLowerCase() !== curr[0]?.toLowerCase()) {
          setChainError(`"${prev}" kelimesi "${curr[0].toUpperCase()}" harfiyle bitmeli veya "${curr}" kelimesi "${prev[prev.length - 1].toUpperCase()}" harfiyle başlamalı.`)
          break
        }
      }
    }
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setStory('')
    setImageUrl('')

    const words = prompt.split(',').map(w => w.trim()).filter(w => w !== '')

    // Word Chain kuralını son kez kontrol et
    if (!isValidWordChain(words)) {
      setError('Kelimeler Word Chain kuralına uymuyor. Her kelime bir öncekinin son harfiyle başlamalı.')
      return
    }

    setLoading(true)
    try {
      const result = await generateStory(words)
      setStory(result.story)
      setImageUrl(result.image_url)

      // Yeni hikayeyi geçmiş listesinin başına ekle
      const newEntry: StoryHistory = {
        id: result.id,
        words,
        story_text: result.story,
        image_url: result.image_url,
        created_at: new Date().toISOString()
      }
      setHistory(prev => [newEntry, ...prev])
    } catch {
      setError('Hikaye oluşturulamadı. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
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

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, transparent, #c9a96e)', margin: '0 auto 20px' }} />
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontStyle: 'italic', fontSize: '38px', letterSpacing: '0.02em' }}>
            Word <span style={{ color: '#c9a96e' }}>Chain</span>
          </h1>
          <p style={{ fontSize: '11px', letterSpacing: '0.08em', color: '#7a7870', marginTop: '14px', lineHeight: 1.7 }}>
            Her kelime bir öncekinin son harfiyle başlamalı.<br />
            <span style={{ color: '#c9a96e' }}>Brain → Night → Tiger → Robin → Noble</span>
          </p>
        </div>

        <div style={{ width: '100%', maxWidth: '680px' }}>

          {/* Hikaye oluşturma formu */}
          <form onSubmit={handleGenerate}>
            <div style={{ background: '#16181f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '2px', padding: '40px', marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7a7870', marginBottom: '10px' }}>
                Kelimeler (virgülle ayır)
              </label>
              <textarea
                value={prompt}
                onChange={(e) => handlePromptChange(e.target.value)}
                placeholder="Brain, Night, Tiger, Robin, Noble..."
                required
                rows={3}
                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: `1px solid ${chainError ? 'rgba(201,112,112,0.4)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '2px', color: '#e8e4dc', fontFamily: "'Jost', sans-serif", fontSize: '15px', fontWeight: 300, padding: '12px 16px', outline: 'none', resize: 'vertical' }}
              />

              {/* Word Chain hata mesajı — anlık kontrol */}
              {chainError && (
                <p style={{ color: '#c97070', fontSize: '11px', marginTop: '8px', letterSpacing: '0.03em' }}>
                  ⚠ {chainError}
                </p>
              )}
            </div>

            {error && (
              <div style={{ color: '#c97070', fontSize: '12px', marginBottom: '16px', letterSpacing: '0.05em' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !!chainError}
              style={{ width: '100%', padding: '14px', background: chainError ? 'rgba(201,169,110,0.3)' : '#c9a96e', border: 'none', borderRadius: '2px', color: '#0e0f13', fontFamily: "'Jost', sans-serif", fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', cursor: loading || chainError ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Oluşturuluyor...' : 'Hikaye Oluştur'}
            </button>
          </form>

          {/* Üretilen hikaye ve görsel */}
          {(story || loading) && (
            <div style={{ background: '#16181f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '2px', padding: '40px', marginTop: '24px' }}>
              <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7a7870', marginBottom: '20px' }}>
                Hikaye
              </div>

              {/* Pollinations'tan gelen görsel */}
              {imageUrl && (
                <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                  <img
                    src={imageUrl}
                    alt="Hikaye görseli"
                    style={{ width: '100%', maxWidth: '400px', borderRadius: '2px', border: '1px solid rgba(255,255,255,0.07)' }}
                    onError={(e) => {
                      // Görsel yüklenemezse gizle
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                  <p style={{ fontSize: '10px', color: '#7a7870', marginTop: '8px', letterSpacing: '0.08em' }}>
                    LLM ile oluşturulan görsel
                  </p>
                </div>
              )}

              {loading && !story && (
                <p style={{ color: '#7a7870', fontSize: '13px' }}>Hikaye yazılıyor...</p>
              )}

              {story && (
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '18px', lineHeight: 1.8, color: '#e8e4dc', whiteSpace: 'pre-wrap' }}>
                  {story}
                </p>
              )}
            </div>
          )}

          {/* Geçmiş hikayeler bölümü */}
          {!historyLoading && history.length > 0 && (
            <div style={{ marginTop: '48px' }}>
              <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7a7870', marginBottom: '16px' }}>
                Geçmiş Hikayeler
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {history.map((h) => (
                  <div
                    key={h.id}
                    onClick={() => setSelectedStory(selectedStory?.id === h.id ? null : h)}
                    style={{ background: '#16181f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '2px', padding: '20px 24px', cursor: 'pointer' }}
                  >
                    {/* Hikaye özeti — kelimeler ve tarih */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: selectedStory?.id === h.id ? '16px' : '0' }}>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {h.words.map((w, i) => (
                          <span key={i} style={{ fontSize: '11px', color: '#c9a96e', letterSpacing: '0.05em' }}>
                            {w}{i < h.words.length - 1 ? ' →' : ''}
                          </span>
                        ))}
                      </div>
                      <span style={{ fontSize: '10px', color: '#7a7870', flexShrink: 0, marginLeft: '16px' }}>
                        {new Date(h.created_at).toLocaleDateString('tr-TR')}
                      </span>
                    </div>

                    {/* Genişletilmiş görünüm — tıklayınca açılır */}
                    {selectedStory?.id === h.id && (
                      <div>
                        {h.image_url && (
                          <img
                            src={h.image_url}
                            alt="Hikaye görseli"
                            style={{ width: '100%', maxWidth: '300px', borderRadius: '2px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.07)' }}
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                          />
                        )}
                        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '16px', lineHeight: 1.8, color: '#e8e4dc', whiteSpace: 'pre-wrap' }}>
                          {h.story_text}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}

export default StoryPage