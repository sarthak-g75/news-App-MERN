import React from 'react'
import MyContent from '../components/MyContent'

const MyNews = () => {
  const mainUrl = import.meta.env.VITE_URL
  return (
    <MyContent
      dataUrl={`${mainUrl}/auth`}
      deleteUrl={`${mainUrl}/news/delete-news`}
      fetchUrl={`${mainUrl}/news/get-user-news`}
      name='news'
    />
  )
}

export default MyNews
