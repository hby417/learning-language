import { useState } from 'react'
import { Link } from 'react-router-dom'
import { addWord } from '../services/wordService'

const WordsPage = () => {
  const [engWord, setEngWord] = useState('')
  const [turWord, setTurWord] = useState('')
  const [samples, setSamples] = useState<string[]>([''])
  const [image, setImage] = useState<File | null>(null)
  const [audio, setAudio] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const addSample = () => setSamples([...samples, ''])
  const removeSample = (i: number) => setSamples(samples.filter((_, idx) => idx !== i))
  const updateSample = (i: number, val: string) => {
    const updated = [...samples]
    updated[i] = val
    setSamples(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)
    try {
      await addWord({
        eng_word: engWord,
        tur_word: turWord,
        samples: samples.filter(s => s.trim() !== ''),
        image,
        audio
      })
      setSuccess(true)
      setEngWord('')
      setTurWord('')
      setSamples([''])
      setImage(null)
      setAudio(null)
    } catch (err) {
      setError('Kelime kaydedilemedi. Lütfen tekrar deneyin.')
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
            Kelime <span style={{ color: '#c9a96e' }}>Ekle</span>
          </h1>
        </div>

        <div style={{ background: '#16181f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '2px', padding: '40px', width: '100%', maxWidth: '560px' }}>

          {success && (
            <div style={{ color: '#70c9a0', fontSize: '12px', marginBottom: '16px', letterSpacing: '0.05em' }}>
              Kelime başarıyla kaydedildi.
            </div>
          )}

          {error && (
            <div style={{ color: '#c97070', fontSize: '12px', marginBottom: '16px', letterSpacing: '0.05em' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7a7870', marginBottom: '20px' }}>Kelime Çifti</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7a7870', marginBottom: '10px' }}>İngilizce</label>
                <input type="text" value={engWord} onChange={(e) => setEngWord(e.target.value)} placeholder="English word" required style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '2px', color: '#e8e4dc', fontFamily: "'Jost', sans-serif", fontSize: '15px', fontWeight: 300, padding: '12px 16px', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7a7870', marginBottom: '10px' }}>Türkçe</label>
                <input type="text" value={turWord} onChange={(e) => setTurWord(e.target.value)} placeholder="Türkçe anlamı" required style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '2px', color: '#e8e4dc', fontFamily: "'Jost', sans-serif", fontSize: '15px', fontWeight: 300, padding: '12px 16px', outline: 'none' }} />
              </div>
            </div>

            <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7a7870', marginBottom: '20px' }}>Medya</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7a7870', marginBottom: '10px' }}>Resim</label>
                <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] ?? null)} style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '2px', color: '#7a7870', fontFamily: "'Jost', sans-serif", fontSize: '12px', padding: '10px 14px', outline: 'none', cursor: 'pointer' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7a7870', marginBottom: '10px' }}>Ses</label>
                <input type="file" accept="audio/*" onChange={(e) => setAudio(e.target.files?.[0] ?? null)} style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '2px', color: '#7a7870', fontFamily: "'Jost', sans-serif", fontSize: '12px', padding: '10px 14px', outline: 'none', cursor: 'pointer' }} />
              </div>
            </div>

            <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7a7870', marginBottom: '20px' }}>Örnek Cümleler</div>
            {samples.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <textarea value={s} onChange={(e) => updateSample(i, e.target.value)} placeholder="Örnek cümle yazın..." style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '2px', color: '#e8e4dc', fontFamily: "'Jost', sans-serif", fontSize: '15px', fontWeight: 300, padding: '12px 16px', outline: 'none', minHeight: '60px', resize: 'vertical' }} />
                {samples.length > 1 && (
                  <button type="button" onClick={() => removeSample(i)} style={{ width: '36px', height: '42px', background: 'none', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '2px', color: '#7a7870', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                )}
              </div>
            ))}

            <button type="button" onClick={addSample} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'none', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '2px', color: '#7a7870', fontFamily: "'Jost', sans-serif", fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', padding: '10px 16px', cursor: 'pointer', marginBottom: '32px' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Cümle Ekle
            </button>

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: '#c9a96e', border: 'none', borderRadius: '2px', color: '#0e0f13', fontFamily: "'Jost', sans-serif", fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>

          </form>
        </div>
      </main>
    </div>
  )
}

export default WordsPage