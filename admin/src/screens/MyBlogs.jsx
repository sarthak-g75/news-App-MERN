import React from 'react'
import MyContent from '../components/MyContent'

const MyBlogs = () => {
  const mainUrl = import.meta.VITE_URL
  return (
    <MyContent
      dataUrl={`${mainUrl}/auth`}
      deleteUrl={`${mainUrl}/blog/deleteBlog`}
      fetchUrl={`${mainUrl}/blog/getUserBlogs`}
      name='blog'
    />
  )
}

export default MyBlogs
