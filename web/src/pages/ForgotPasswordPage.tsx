import { useState } from 'react'
import { sendPasswordResetEmail } from 'firebase/auth'
import { Link } from 'react-router-dom'
import { auth } from '../firebase'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await sendPasswordResetEmail(auth, email)
      setSuccess(true)
    } catch (err: any) {
      setError('E-posta gönderilemedi. Adresi kontrol edin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ fontFamily: "'Jost', sans-serif", backgroundColor: '#0e0f13', color: '#e8e4dc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '48px' }}>
          <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, transparent, #c9a96e)', marginBottom: '20px' }} />
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontStyle: 'italic', fontSize: '38px', letterSpacing: '0.02em', textAlign: 'center' }}>
            Şifremi <span style={{ color: '#c9a96e' }}>Unuttum</span>
          </h1>
          <p style={{ fontSize: '11px', letterSpacing: '0.08em', color: '#7a7870', textAlign: 'center', marginTop: '14px', lineHeight: 1.7 }}>
            E-posta adresinizi girin,<br />sıfırlama bağlantısı gönderelim.
          </p>
        </div>

        <div style={{ background: '#16181f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '2px', padding: '40px', position: 'relative' }}>

          {error && (
            <div style={{ color: '#c97070', fontSize: '12px', marginBottom: '16px', letterSpacing: '0.05em' }}>
              {error}
            </div>
          )}

          {success ? (
            <div style={{ color: '#70c9a0', fontSize: '13px', letterSpacing: '0.05em', lineHeight: 1.7, marginBottom: '24px' }}>
              Sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin.
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7a7870', marginBottom: '10px' }}>
                  E-posta
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@eposta.com"
                  required
                  style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '2px', color: '#e8e4dc', fontFamily: "'Jost', sans-serif", fontSize: '15px', fontWeight: 300, padding: '12px 16px', outline: 'none' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ width: '100%', padding: '14px', background: '#c9a96e', border: 'none', borderRadius: '2px', color: '#0e0f13', fontFamily: "'Jost', sans-serif", fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer' }}
              >
                {loading ? 'Gönderiliyor...' : 'Şifre Yenileme Bağlantısı Gönder'}
              </button>
            </form>
          )}

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

export default ForgotPasswordPage