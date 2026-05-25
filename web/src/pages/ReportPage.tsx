import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getReport } from '../services/reportService'

// Rapor verisinin tipini tanımlıyoruz.
// Backend'den dönen JSON yapısıyla birebir eşleşmeli.
type WordDetail = {
  eng_word: string
  tur_word: string
  correct_streak: number
  mastered: boolean
  last_seen: string | null
}

type Report = {
  total_words: number
  mastered_words: number
  learning_words: number
  not_started: number
  mastered_percent: number
  learning_percent: number
  not_started_percent: number
  words: WordDetail[]
}

const ReportPage = () => {
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Sayfa açılınca raporu backend'den çek
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await getReport()
        setReport(data)
      } catch {
        setError('Rapor yüklenemedi.')
      } finally {
        setLoading(false)
      }
    }
    fetchReport()
  }, [])

  // Tarayıcının yazdır diyaloğunu açar.
  // @media print CSS kuralları sayesinde nav ve buton gizlenir,
  // sadece rapor içeriği kağıda basılır.
  const handlePrint = () => {
    window.print()
  }

  // Streak değerine göre durum etiketi döndürür
  const getStatus = (word: WordDetail) => {
    if (word.mastered) return { label: 'Öğrenildi', color: '#70c9a0' }
    if (word.correct_streak >= 3) return { label: 'Öğreniliyor', color: '#c9a96e' }
    return { label: 'Başlanmadı', color: '#7a7870' }
  }

  return (
    <>
      {/* Yazdırma için özel stiller — ekranda görünmez, sadece print'te aktif olur */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .print-card { background: white !important; border: 1px solid #ddd !important; }
          .print-text { color: black !important; }
          .print-muted { color: #666 !important; }
        }
      `}</style>

      <div style={{ fontFamily: "'Jost', sans-serif", backgroundColor: '#0e0f13', color: '#e8e4dc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* Navbar — yazdırmada gizlenir */}
        <nav className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 48px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
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
            <h1 className="print-text" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontStyle: 'italic', fontSize: '38px', letterSpacing: '0.02em' }}>
              Analiz <span style={{ color: '#c9a96e' }}>Raporu</span>
            </h1>
          </div>

          {loading && <p style={{ color: '#7a7870', fontSize: '13px' }}>Yükleniyor...</p>}
          {error && <p style={{ color: '#c97070', fontSize: '13px' }}>{error}</p>}

          {report && (
            <div style={{ width: '100%', maxWidth: '680px' }}>

              {/* Özet kartlar */}
              <div className="print-card" style={{ background: '#16181f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '2px', padding: '32px', marginBottom: '24px' }}>
                <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7a7870', marginBottom: '24px' }}>Genel Özet</div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
                  {/* Öğrenilmiş */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '48px', fontWeight: 300, color: '#70c9a0', lineHeight: 1 }}>
                      {report.mastered_percent}%
                    </div>
                    <div style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#70c9a0', marginTop: '8px' }}>Öğrenildi</div>
                    <div style={{ fontSize: '12px', color: '#7a7870', marginTop: '4px' }}>{report.mastered_words} kelime</div>
                  </div>

                  {/* Öğreniliyor */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '48px', fontWeight: 300, color: '#c9a96e', lineHeight: 1 }}>
                      {report.learning_percent}%
                    </div>
                    <div style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c9a96e', marginTop: '8px' }}>Öğreniliyor</div>
                    <div style={{ fontSize: '12px', color: '#7a7870', marginTop: '4px' }}>{report.learning_words} kelime</div>
                  </div>

                  {/* Başlanmadı */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '48px', fontWeight: 300, color: '#7a7870', lineHeight: 1 }}>
                      {report.not_started_percent}%
                    </div>
                    <div style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7a7870', marginTop: '8px' }}>Başlanmadı</div>
                    <div style={{ fontSize: '12px', color: '#7a7870', marginTop: '4px' }}>{report.not_started} kelime</div>
                  </div>
                </div>

                {/* Yüzdesel progress bar */}
                <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', height: '100%' }}>
                    <div style={{ width: `${report.mastered_percent}%`, background: '#70c9a0', transition: 'width 0.5s' }} />
                    <div style={{ width: `${report.learning_percent}%`, background: '#c9a96e', transition: 'width 0.5s' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '10px', color: '#7a7870' }}>
                  <span>Toplam {report.total_words} kelime</span>
                </div>
              </div>

              {/* Kelime detay tablosu */}
              <div className="print-card" style={{ background: '#16181f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '2px', padding: '32px', marginBottom: '32px' }}>
                <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7a7870', marginBottom: '20px' }}>Kelime Detayları</div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                      <th style={{ textAlign: 'left', padding: '8px 0', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7a7870', fontWeight: 400 }}>İngilizce</th>
                      <th style={{ textAlign: 'left', padding: '8px 0', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7a7870', fontWeight: 400 }}>Türkçe</th>
                      <th style={{ textAlign: 'center', padding: '8px 0', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7a7870', fontWeight: 400 }}>Streak</th>
                      <th style={{ textAlign: 'right', padding: '8px 0', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7a7870', fontWeight: 400 }}>Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.words.map((word, i) => {
                      const status = getStatus(word)
                      return (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding: '10px 0', color: '#e8e4dc' }}>{word.eng_word}</td>
                          <td style={{ padding: '10px 0', color: '#7a7870' }}>{word.tur_word}</td>
                          <td style={{ padding: '10px 0', textAlign: 'center', color: '#c9a96e' }}>{word.correct_streak}/6</td>
                          <td style={{ padding: '10px 0', textAlign: 'right' }}>
                            <span style={{ fontSize: '11px', color: status.color, letterSpacing: '0.05em' }}>
                              {status.label}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Yazdır butonu — sadece ekranda görünür */}
              <button
                className="no-print"
                onClick={handlePrint}
                style={{ width: '100%', padding: '14px', background: '#c9a96e', border: 'none', borderRadius: '2px', color: '#0e0f13', fontFamily: "'Jost', sans-serif", fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="6 9 6 2 18 2 18 9"/>
                  <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
                  <rect x="6" y="14" width="12" height="8"/>
                </svg>
                Raporu Yazdır
              </button>

            </div>
          )}
        </main>
      </div>
    </>
  )
}

export default ReportPage