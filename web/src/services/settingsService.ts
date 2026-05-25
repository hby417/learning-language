import axiosInstance from './axiosInstance'

export const getSettings = async () => {
  const res = await axiosInstance.get('/settings')
  return res.data.settings
}

export const updateSettings = async (daily_word_count: number) => {
  const res = await axiosInstance.put('/settings', { daily_word_count })
  return res.data
}