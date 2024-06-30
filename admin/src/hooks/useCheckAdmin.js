import axios from 'axios'
// import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { adminAuth } from '../recoil/atoms/authAtom'

export const useCheckAdmin = (url) => {
  const auth = useRecoilValue(adminAuth)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const checkRole = async () => {
    try {
      const response = await axios.get(`${url}/checkUser`, {
        headers: { token: localStorage.getItem('token') },
      })
      const { data } = response
      // console.log(data)
      if (data.success) {
        setLoading(false)
        setRole(data.role)
      } else {
        setLoading(false)
      }
    } catch (error) {
      // console.log(error)
      // alert(error.response.data.message)
    }
  }
  useEffect(() => {
    if (auth) checkRole()
  }, [])
  return { loading, role }
}
