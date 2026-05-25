import axiosInstance from './axiosInstance'

export const getWords = async () => {
  const res = await axiosInstance.get('/words')
  return res.data.words
}

export const addWord = async (data: {
  eng_word: string
  tur_word: string
  samples: string[]
  image?: File | null
  audio?: File | null
}) => {
  const formData = new FormData()
  formData.append('eng_word', data.eng_word)
  formData.append('tur_word', data.tur_word)

  data.samples.forEach(s => {
    if (s.trim()) formData.append('samples', s)
  })

  if (data.image) formData.append('image', data.image)
  if (data.audio) formData.append('audio', data.audio)

  const res = await axiosInstance.post('/words', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return res.data.word
}

export const deleteWord = async (id: number) => {
  const res = await axiosInstance.delete(`/words/${id}`)
  return res.data
}