import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
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
function FileUploader({ onFileChange, reset, preview }) {
  const [files, setFiles] = useState([])
  const [previewUrls, setPreviewUrls] = useState(preview.content || [])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  useEffect(() => {
    if (preview.content) {
      setPreviewUrls(preview.content)
    }
  }, [preview])

  // useEffect(() => {
  //   if (reset) {
  //     setFiles([])
  //     setPreviewUrls([])
  //     setSubmitting(false)
  //     setSubmitted(false)
  //   }
  // }, [reset])

  const handleFileChange = (e) => {
    const filesArray = Array.from(e.target.files)
    setFiles((prevFiles) => [...prevFiles, ...filesArray])

    const urls = filesArray.map((file) => URL.createObjectURL(file))
    setPreviewUrls((prevUrls) => [...prevUrls, ...urls])
  }

  const handleDelete = (index, url) => {
    if (files.length > 1) {
      const newFiles = [...files]
      const newPreviewUrls = [...previewUrls]

      newFiles.splice(index, 1)
      newPreviewUrls.splice(index, 1)

      setFiles(newFiles)
      setPreviewUrls(newPreviewUrls)
      deleteImage(url)
    } else {
      const newPreviewUrls = [...previewUrls]
      newPreviewUrls.splice(index, 1)
      setPreviewUrls(newPreviewUrls)

      // console.log(newPreviewUrls)
      onFileChange(newPreviewUrls)
      deleteImage(url)
    }
  }

  const getFileBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsArrayBuffer(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }

  const handleClick = async () => {
    try {
      setSubmitting(true)
      const urls = []

      for (const file of files) {
        const buffer = await getFileBuffer(file)
        const fileKey = `uploads/${uuidv4()}-${file.name}`

        const uploadParams = {
          Bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
          Key: fileKey,
          Body: buffer,
          ContentType: file.type,
        }

        await s3Client.send(new PutObjectCommand(uploadParams))

        const fileUrl = `${import.meta.env.VITE_S3_URL}/${fileKey}`
        urls.push(fileUrl)
      }

      onFileChange(urls)
      setSubmitting(false)
      setSubmitted(true)
      setFiles([])
      setPreviewUrls(urls)
      console.log(urls)
      setSubmitted(false)
    } catch (error) {
      console.error('Error uploading file:', error)
    }
  }

  return (
    <div className='flex flex-col w-full gap-4'>
      <div>
        <input
          type='file'
          accept='image/*,video/*'
          onChange={handleFileChange}
          multiple
        />
        <button
          type='button'
          className={`px-2 py-1 font-semibold bg-gray-200 rounded-lg ${
            submitted ? 'cursor-not-allowed' : ''
          }`}
          onClick={!submitted ? handleClick : null}
        >
          {submitted ? 'Submitted' : 'Submit Files'}
        </button>
      </div>

      {submitting ? (
        <h1>Submitting...</h1>
      ) : submitted ? (
        <h2>Submitted</h2>
      ) : (
        <div className='flex w-full gap-2 overflow-x-scroll'>
          {previewUrls.map((url, index) => (
            <div
              key={index}
              className='relative flex-shrink-0 w-96 h-96'
            >
              {(files[index] && files[index].type.startsWith('image/')) ||
              url.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                <img
                  src={url}
                  className='object-cover w-full h-full'
                  alt={`Preview Image ${index}`}
                />
              ) : (
                <video
                  src={url}
                  className='object-cover w-full h-full'
                  controls
                />
              )}
              <button
                onClick={() => handleDelete(index, url)}
                className='absolute px-2 py-1 text-white bg-red-500 rounded-full top-2 left-2'
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FileUploader
