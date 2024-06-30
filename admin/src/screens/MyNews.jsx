import React from 'react'
import MyContent from '../components/MyContent'

const MyNews = () => {
  const mainUrl = import.meta.env.VITE_URL
  return (
    <MyContent
      dataUrl={`${mainUrl}/api/auth`}
      deleteUrl={`${mainUrl}/api/news/deleteNews`}
      fetchUrl={`${mainUrl}/api/news/getUserNews`}
      name='news'
    />
  )
}

export default MyNews
