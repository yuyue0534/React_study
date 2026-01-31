import { create } from 'zustand'

export const useAuthStore = create(set => ({
  token: localStorage.getItem('TOKEN'),
  user: null,
  login: (token, user) => {
    localStorage.setItem('TOKEN', token)
    set({ token, user })
  },
  logout: () => {
    localStorage.clear()
    set({ token: null, user: null })
  }
}))
