import React from 'react'
import MyContent from '../components/MyContent'

const MyBlogs = () => {
  const mainUrl = import.meta.env.VITE_URL
  return (
    <MyContent
      dataUrl={`${mainUrl}/auth`}
      deleteUrl={`${mainUrl}/blog/delete-blog`}
      fetchUrl={`${mainUrl}/blog/get-user-blogs`}
      name='blog'
    />
  )
}

export default MyBlogs
