import axiosInstance from './axiosInstance'

export const getQuizQueue = async () => {
  const res = await axiosInstance.get('/quiz/queue')
  return res.data.queue
}

export const submitQuizResult = async (data: {
  word_id: number
  quality: 'correct' | 'wrong'
}) => {
  const res = await axiosInstance.post('/quiz/result', data)
  return res.data
}