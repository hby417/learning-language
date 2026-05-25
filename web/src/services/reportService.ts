import axiosInstance from './axiosInstance'

// Analiz raporunu backend'den çeken servis fonksiyonu.
// axiosInstance kullandığımız için Firebase token'ı otomatik ekleniyor —
// kullanıcı kimliği doğrulanmadan rapor alınamaz.
export const getReport = async () => {
  const res = await axiosInstance.get('/report')
  return res.data.report
}