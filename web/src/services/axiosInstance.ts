import axios from 'axios'
import { auth } from '../firebase'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

axiosInstance.interceptors.request.use(async (config:any) => {
  const user = auth.currentUser
  if (user) {
    const token = await user.getIdToken()
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosInstance.interceptors.response.use(
  (response:any) => response,
  async (error:any) => {
    if (error.response?.status === 401) {
      await auth.signOut()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axiosInstance