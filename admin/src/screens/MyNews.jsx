import React from 'react'
import MyContent from '../components/MyContent'

const MyNews = () => {
  return (
    <MyContent
      dataUrl='http://localhost:5000/api/auth'
      deleteUrl='http://localhost:5000/api/news/deleteNews'
      fetchUrl='http://localhost:5000/api/news/getUserNews'
      name='news'
    />
  )
}

export default MyNews
