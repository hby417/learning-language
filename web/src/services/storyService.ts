import axiosInstance from './axiosInstance'

// Hikaye oluşturma servisi.
// Backend'e kelime listesi gönderir, Gemini hikayeyi yazar,
// Pollinations görsel üretir ve her ikisi kaydedilir.
export const generateStory = async (words: string[]) => {
  const res = await axiosInstance.post('/story/generate', { words })
  return res.data // { story, image_url, id } döner
}

// Kullanıcının geçmiş hikayelerini getirir.
// En yeniden en eskiye sıralı olarak döner.
export const getStoryHistory = async () => {
  const res = await axiosInstance.get('/story/history')
  return res.data.stories
}