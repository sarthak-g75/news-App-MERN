import React, { useState, useEffect } from 'react'
import { useGetUserData } from '../hooks/useGetUserData'
import { useNavigate } from 'react-router-dom'
import { useCheckAdmin } from '../hooks/useCheckAdmin'
import { useRecoilValue } from 'recoil'
import { imageDB } from '../firebaaseConfig'
import { ref, deleteObject } from 'firebase/storage'
import { adminAuth } from '../recoil/atoms/authAtom'
import axios from 'axios'
import DataTable from '../components/DataTable'

const url2 = 'http://localhost:5000/api/auth'
const url = 'http://localhost:5000/api/blog/'

const MyBlogs = () => {
  const auth = useRecoilValue(adminAuth)
  const navigate = useNavigate()
  const { role, loading: adminLoading } = useCheckAdmin(url2)
  const [page, setPageState] = useState(1)
  const [trigger, setTrigger] = useState(false) // Add a trigger state for refetching

  const { loading, data, hasMore, setPage } = useGetUserData(
    `${url}getUserBlogs`,
    5,
    trigger // Pass trigger to useGetUserData to refetch data
  )

  const handleNextPage = () => {
    setPage(page + 1)
    setPageState(page + 1)
  }

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1)
      setPageState(page - 1)
    }
  }

  useEffect(() => {
    if (!auth) {
      navigate('/login')
    }
    if (!loading && role !== 'admin') {
      navigate('/login')
    }
  }, [adminLoading, role, auth, navigate])

  const handleEdit = (itemId) => {
    console.log('Edit item with ID:', itemId)
  }

  const deleteImages = async (imageUrl) => {
    if (imageUrl.length === 0) {
      console.warn('No images found')
    } else {
      for (const url of imageUrl) {
        try {
          const pathStartIndex = url.indexOf('/o/') + 3
          const pathEndIndex = url.indexOf('?alt=media')
          const encodedPath = url.substring(pathStartIndex, pathEndIndex)
          const filePath = decodeURIComponent(encodedPath)

          // Create a reference to the file to delete
          const imageRef = ref(imageDB, filePath)

          // Delete the file
          await deleteObject(imageRef)
          console.log(`Deleted: ${filePath}`)
        } catch (error) {
          console.error(`Error deleting file at ${url}:`, error)
        }
      }
    }
  }

  const handleDelete = async (itemId, imageUrl) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteImages(imageUrl)
        const response = await axios.delete(`${url}deleteBlog/${itemId}`, {
          headers: { token: localStorage.getItem('token') },
        })
        if (response.data.success) {
          // Trigger a refetch of the news data
          setTrigger((prev) => !prev)
        } else {
          alert(response.data.message)
        }
      } catch (error) {
        console.log(error.response.data.message)
      }
    }
  }

  return (
    <DataTable
      data={data}
      loading={loading}
      page={page}
      handleNextPage={handleNextPage}
      handlePreviousPage={handlePreviousPage}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      hasMore={hasMore}
    />
  )
}

export default MyBlogs
