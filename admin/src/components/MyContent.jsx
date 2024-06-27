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

const MyContent = ({ dataUrl, deleteUrl, fetchUrl, name }) => {
  const auth = useRecoilValue(adminAuth)
  const navigate = useNavigate()
  const { role, loading: adminLoading } = useCheckAdmin(dataUrl)
  const [page, setPageState] = useState(1)
  const [trigger, setTrigger] = useState(false)

  const { loading, data, hasMore, setPage } = useGetUserData(
    fetchUrl,
    5,
    trigger
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
    navigate(`/edit-${name}/${itemId}`)
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

          const imageRef = ref(imageDB, filePath)

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
        const response = await axios.delete(`${deleteUrl}/${itemId}`, {
          headers: { token: localStorage.getItem('token') },
        })
        if (response.data.success) {
          setTrigger((prev) => !prev)
        } else {
          alert(response.data.message)
        }
      } catch (error) {
        console.log(error.response.data.message)
      }
    }
  }
  // console.log(data)

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

export default MyContent
