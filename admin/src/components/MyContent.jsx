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
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: 'ap-south-1',
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_KEY,
  },
})

const deleteImage = async (fileUrl) => {
  console.log(fileUrl)
  const fileKey = fileUrl.split('/').pop()
  // console.log(fileKey.slice(-2).join('/'))
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
      Key: `uploads/${fileKey}`,
    })
  )
  alert('Image deleted successfully')
}
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

  const handleDelete = async (itemId, content) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        content.map((item) => {
          if (item.type === 'image') {
            item.content.map((url) => {
              console.log(url)
              deleteImage(url)
            })
          }
        })
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
