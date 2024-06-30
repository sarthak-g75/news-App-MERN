import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export const useGetUserData = (url, limit, trigger) => {
  const mainUrl = import.meta.env.VITE_URL
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [isFetching, setIsFetching] = useState(false)

  const fetchApi = async (pageNumber) => {
    setIsFetching(true)
    try {
      const res = await axios.get(`${url}?limit=${limit}&page=${pageNumber}`, {
        headers: { token: localStorage.getItem('token') },
      })

      if (res.data.success) {
        const dataWithUser = []
        for (const item of res.data.data) {
          const userDataPromise = axios.get(
            `${mainUrl}/auth/getUser/${item.user}`
          )
          dataWithUser.push({ data: item, userPromise: userDataPromise })
        }
        const resolvedData = await Promise.all(
          dataWithUser.map(async (item) => {
            try {
              const userDataResponse = await item.userPromise
              return { data: item.data, user: userDataResponse.data.user }
            } catch (error) {
              console.error(
                'Error fetching user data:',
                error.response.data.message
              )
              return { data: item.data, user: null }
            }
          })
        )
        setData(resolvedData)
        setLoading(false)
        setIsFetching(false)
        if (res.data.currentPage < res.data.totalPages) setHasMore(true)
        else setHasMore(false)
      }
    } catch (error) {
      setHasMore(false)
      console.error('Error fetching data:', error.response.data)
      alert(error.response.data.message)
      navigate('/add-news')
      setData(error.response.data.message)
      setIsFetching(false)
    }
  }

  useEffect(() => {
    fetchApi(page)
  }, [page, trigger]) // Add trigger to dependency array

  return { loading, data, hasMore, setPage }
}
