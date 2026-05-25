import { useNavigate, Link } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import useAuthStore from '../store/authStore'

const DashboardPage = () => {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)

  const handleLogout = async () => {
    await signOut(auth)
    navigate('/login')
  }

  return (
    <div style={{ fontFamily: "'Jost', sans-serif", backgroundColor: '#0e0f13', color: '#e8e4dc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 48px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontStyle: 'italic', fontSize: '22px', letterSpacing: '0.03em' }}>
          Söz <span style={{ color: '#c9a96e' }}>Hazinesi</span>
        </div>
        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7a7870', background: 'none', border: 'none', cursor: 'pointer' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Çıkış Yap
        </button>
      </nav>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, transparent, #c9a96e)', margin: '0 auto 20px' }} />
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontStyle: 'italic', fontSize: '48px', letterSpacing: '0.02em', lineHeight: 1.1 }}>
            Hoş Geldiniz, <span style={{ color: '#c9a96e' }}>{user?.displayName || user?.email}</span>
          </h1>
          <p style={{ fontSize: '11px', letterSpacing: '0.12em', color: '#7a7870', marginTop: '16px', textTransform: 'uppercase' }}>
            Ne yapmak istersiniz?
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', width: '100%', maxWidth: '760px' }}>

          <Link to="/words" style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: '#16181f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '2px', padding: '32px', textDecoration: 'none', color: '#e8e4dc' }}>
            <div style={{ width: '36px', height: '36px', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a96e' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#7a7870' }}>Kelime</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '22px', letterSpacing: '0.01em' }}>Kelime Ekle</div>
            </div>
            <div style={{ marginTop: 'auto', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7a7870', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Başla
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </div>
          </Link>

          <Link to="/quiz" style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: '#16181f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '2px', padding: '32px', textDecoration: 'none', color: '#e8e4dc' }}>
            <div style={{ width: '36px', height: '36px', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a96e' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#7a7870' }}>Tekrar</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '22px', letterSpacing: '0.01em' }}>Quiz</div>
            </div>
            <div style={{ marginTop: 'auto', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7a7870', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Başla
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </div>
          </Link>

          <Link to="/story" style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: '#16181f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '2px', padding: '32px', textDecoration: 'none', color: '#e8e4dc' }}>
            <div style={{ width: '36px', height: '36px', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a96e' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#7a7870' }}>Yapay Zeka</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '22px', letterSpacing: '0.01em' }}>Hikaye</div>
            </div>
            <div style={{ marginTop: 'auto', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7a7870', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Başla
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </div>
          </Link><Link to="/settings" style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: '#16181f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '2px', padding: '32px', textDecoration: 'none', color: '#e8e4dc' }}>
  <div style={{ width: '36px', height: '36px', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a96e' }}>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  </div>
  <div>
    <div style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#7a7870' }}>Kullanıcı</div>
    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '22px', letterSpacing: '0.01em' }}>Ayarlar</div>
  </div>
  <div style={{ marginTop: 'auto', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7a7870', display: 'flex', alignItems: 'center', gap: '8px' }}>
    Düzenle
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  </div>
</Link>
<Link to="/report" style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: '#16181f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '2px', padding: '32px', textDecoration: 'none', color: '#e8e4dc' }}>
  <div style={{ width: '36px', height: '36px', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a96e' }}>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  </div>
  <div>
    <div style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#7a7870' }}>Analiz</div>
    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '22px', letterSpacing: '0.01em' }}>Rapor</div>
  </div>
  <div style={{ marginTop: 'auto', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7a7870', display: 'flex', alignItems: 'center', gap: '8px' }}>
    Görüntüle
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  </div>
</Link>
<Link to="/wordle" style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: '#16181f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '2px', padding: '32px', textDecoration: 'none', color: '#e8e4dc' }}>
  <div style={{ width: '36px', height: '36px', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a96e' }}>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  </div>
  <div>
    <div style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#7a7870' }}>Oyun</div>
    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '22px', letterSpacing: '0.01em' }}>Wordle</div>
  </div>
  <div style={{ marginTop: 'auto', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7a7870', display: 'flex', alignItems: 'center', gap: '8px' }}>
    Oyna
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  </div>
</Link>

        </div>
      </main>
    </div>
  )
}

export default DashboardPage