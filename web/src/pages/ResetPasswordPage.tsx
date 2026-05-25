import { useState } from 'react'
import { confirmPasswordReset } from 'firebase/auth'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { auth } from '../firebase'

const ResetPasswordPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const oobCode = searchParams.get('oobCode') ?? ''

  const [step, setStep] = useState<1 | 2>(1)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError('Şifreler eşleşmiyor.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await confirmPasswordReset(auth, oobCode, newPassword)
      navigate('/login')
    } catch (err: any) {
      setError('Şifre sıfırlanamadı. Bağlantı geçersiz veya süresi dolmuş olabilir.')
    } finally {
      setLoading(false)
    }
  }

  const eyeOpen = (
    <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
  )
  const eyeClosed = (
    <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
  )

  const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '2px', color: '#e8e4dc', fontFamily: "'Jost', sans-serif", fontSize: '15px', fontWeight: 300, padding: '12px 44px 12px 16px', outline: 'none' }
  const labelStyle = { display: 'block', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: '#7a7870', marginBottom: '10px' }
  const eyeBtnStyle = { position: 'absolute' as const, right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#7a7870', display: 'flex', alignItems: 'center' }

  return (
    <div style={{ fontFamily: "'Jost', sans-serif", backgroundColor: '#0e0f13', color: '#e8e4dc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '48px' }}>
          <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, transparent, #c9a96e)', marginBottom: '20px' }} />
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontStyle: 'italic', fontSize: '38px', letterSpacing: '0.02em', textAlign: 'center' }}>
            Şifre <span style={{ color: '#c9a96e' }}>Sıfırlama</span>
          </h1>
          <p style={{ fontSize: '11px', letterSpacing: '0.08em', color: '#7a7870', textAlign: 'center', marginTop: '14px' }}>
            Yeni şifrenizi belirleyin.
          </p>
        </div>

        <div style={{ background: '#16181f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '2px', padding: '40px', position: 'relative' }}>

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px', gap: '8px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: step === 1 ? '#c9a96e' : 'rgba(201,169,110,0.3)', boxShadow: step === 1 ? '0 0 8px rgba(201,169,110,0.4)' : 'none' }} />
              <span style={{ fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: step === 1 ? '#c9a96e' : '#7a7870' }}>Şifre</span>
            </div>
            <div style={{ width: '48px', height: '1px', background: step === 2 ? 'rgba(201,169,110,0.3)' : 'rgba(255,255,255,0.07)', marginBottom: '16px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: step === 2 ? '#c9a96e' : 'rgba(255,255,255,0.07)' }} />
              <span style={{ fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: step === 2 ? '#c9a96e' : '#7a7870' }}>Onayla</span>
            </div>
          </div>

          {error && (
            <div style={{ color: '#c97070', fontSize: '12px', marginBottom: '16px', letterSpacing: '0.05em' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Yeni Şifre</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    style={inputStyle}
                  />
                  <button type="button" onClick={() => setShowNew(!showNew)} style={eyeBtnStyle}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      {showNew ? eyeClosed : eyeOpen}
                    </svg>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => { if (newPassword) setStep(2) }}
                  style={{ width: '100%', marginTop: '24px', padding: '14px', background: '#c9a96e', border: 'none', borderRadius: '2px', color: '#0e0f13', fontFamily: "'Jost', sans-serif", fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer' }}
                >
                  Devam Et
                </button>
              </div>
            )}

            {step === 2 && (
              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Yeni Şifre Onayla</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    style={inputStyle}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={eyeBtnStyle}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      {showConfirm ? eyeClosed : eyeOpen}
                    </svg>
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  style={{ width: '100%', marginTop: '24px', padding: '14px', background: '#c9a96e', border: 'none', borderRadius: '2px', color: '#0e0f13', fontFamily: "'Jost', sans-serif", fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer' }}
                >
                  {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
                </button>
              </div>
            )}
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '28px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
            <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#7a7870', opacity: 0.4 }} />
            <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#7a7870', opacity: 0.4 }} />
            <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#7a7870', opacity: 0.4 }} />
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
          </div>

          <Link
            to="/login"
            style={{ display: 'block', width: '100%', padding: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '2px', color: '#7a7870', fontFamily: "'Jost', sans-serif", fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', textAlign: 'center' }}
          >
            Giriş Sayfasına Dön
          </Link>

        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage