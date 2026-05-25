import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'
import useAuthStore from '../store/authStore'
import axiosInstance from '../services/axiosInstance'

const useAuth = () => {
  const { user, isLoading, setUser, setLoading } = useAuthStore()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)

      if (firebaseUser) {
        try {
          await axiosInstance.post('/auth/provision')
        } catch (err) {
          console.error('Provision hatası:', err)
        }
      }
    })

    return () => unsubscribe()
  }, [])

  return { user, isLoading }
}

export default useAuth