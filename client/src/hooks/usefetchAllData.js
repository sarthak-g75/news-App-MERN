import { useState, useEffect } from 'react'
import axios from 'axios'

export const useFetchAll = (url, searchQuery = '') => {
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const mainUrl = import.meta.env.VITE_URL
  const fetchApi = async (pageNumber, query) => {
    try {
      const res = await axios.get(`${url}page=${pageNumber}&query=${query}`)
      if (res.data.success) {
        const dataWithUser = []
        for (const item of res.data.data) {
          const userDataPromise = axios.get(
            `${mainUrl}/auth/get-user/${item.user}`
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
        setData((prev) =>
          pageNumber === 1 ? resolvedData : [...prev, ...resolvedData]
        )
        setLoading(false)
        if (res.data.data.length < 5) setHasMore(false)
      }
    } catch (error) {
      setHasMore(false)
      console.error('Error fetching data:', error.response.data)
    }
  }

  useEffect(() => {
    fetchApi(page, searchQuery)
  }, [page, searchQuery])

  useEffect(() => {
    const handleScroll = () => {
      if (
        !loading &&
        hasMore &&
        window.innerHeight + document.documentElement.scrollTop + 1 >=
          document.documentElement.scrollHeight
      ) {
        setLoading(true)
        setPage((prev) => prev + 1)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loading, hasMore])

  return {
    loading,
    data,
    setPage,
    setSearchQuery: (query) => {
      setPage(1)
      setData([])
      fetchApi(1, query)
    },
  }
}
