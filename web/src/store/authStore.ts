import { create } from 'zustand'
import type { User as FirebaseUser } from 'firebase/auth'

interface AuthState {
  user: FirebaseUser | null
  isLoading: boolean
  setUser: (user: FirebaseUser | null) => void
  setLoading: (loading: boolean) => void
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ isLoading: loading }),
}))

export default useAuthStore