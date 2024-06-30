import axios from 'axios'
import { useEffect } from 'react'
import { useState } from 'react'
export const useFetchSingle = (url) => {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)
  const mainUrl = import.meta.env.VITE_URL
  const fetchApi = async () => {
    try {
      const res = await axios.get(`${url}`)
      if (res.data.success) {
        // console.log(res.data.data)
        const userData = await axios.get(
          `${mainUrl}/auth/getUser/${res.data.data.user}`
        )
        setData({ data: res.data.data, user: userData.data.user })
        setLoading(false)
      }
    } catch (error) {
      console.error('Error fetching user data:', error.response.data.message)
    }
  }
  useEffect(() => {
    fetchApi()
  }, [])
  // console.log(data)
  return { loading, data }
}
