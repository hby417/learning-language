import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getSettings, updateSettings } from '../services/settingsService'

const SettingsPage = () => {
  const [dailyWordCount, setDailyWordCount] = useState(10)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings()
        setDailyWordCount(data.daily_word_count)
      } catch {
        setError('Ayarlar yüklenemedi.')
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setSaving(true)
    try {
      await updateSettings(dailyWordCount)
      setSuccess(true)
    } catch {
      setError('Ayarlar kaydedilemedi.')
    } finally {
      setSaving(false)
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
            Kullanıcı <span style={{ color: '#c9a96e' }}>Ayarları</span>
          </h1>
        </div>

        <div style={{ background: '#16181f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '2px', padding: '40px', width: '100%', maxWidth: '480px' }}>

          {loading ? (
            <p style={{ color: '#7a7870', fontSize: '13px' }}>Yükleniyor...</p>
          ) : (
            <form onSubmit={handleSave}>

              {success && (
                <div style={{ color: '#70c9a0', fontSize: '12px', marginBottom: '16px', letterSpacing: '0.05em' }}>
                  Ayarlar başarıyla kaydedildi.
                </div>
              )}

              {error && (
                <div style={{ color: '#c97070', fontSize: '12px', marginBottom: '16px', letterSpacing: '0.05em' }}>
                  {error}
                </div>
              )}

              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7a7870', marginBottom: '10px' }}>
                  Günlük Yeni Kelime Sayısı
                </label>
                <p style={{ fontSize: '12px', color: '#7a7870', marginBottom: '16px', lineHeight: 1.6 }}>
                  Her quiz turunda karşınıza çıkacak yeni kelime sayısını belirleyin. (1-50 arası)
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <input
                    type="range"
                    min={1}
                    max={50}
                    value={dailyWordCount}
                    onChange={(e) => setDailyWordCount(Number(e.target.value))}
                    style={{ flex: 1, accentColor: '#c9a96e' }}
                  />
                  <div style={{ background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.3)', borderRadius: '2px', padding: '8px 16px', minWidth: '48px', textAlign: 'center', fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', color: '#c9a96e' }}>
                    {dailyWordCount}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                style={{ width: '100%', padding: '14px', background: '#c9a96e', border: 'none', borderRadius: '2px', color: '#0e0f13', fontFamily: "'Jost', sans-serif", fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}
              >
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>

            </form>
          )}
        </div>
      </main>
    </div>
  )
}

export default SettingsPage