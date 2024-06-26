import { atom } from 'recoil'
export const adminAuth = atom({
  key: 'admin',
  default: !!localStorage.getItem('token'),
})
