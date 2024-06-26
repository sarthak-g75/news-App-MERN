import { atom, selector } from 'recoil'
import axios from 'axios'
const url = 'http://localhost:5000/api/auth'

export const authAtom = atom({
  key: 'auth',
  default: !!localStorage.getItem('token'),
})
