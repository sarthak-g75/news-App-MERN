import React from 'react'
import MyContent from '../components/MyContent'

const MyBlogs = () => {
  return (
    <MyContent
      dataUrl='http://localhost:5000/api/auth'
      deleteUrl='http://localhost:5000/api/blog/deleteBlog'
      fetchUrl='http://localhost:5000/api/blog/getUserBlogs'
      name='blog'
    />
  )
}

export default MyBlogs
