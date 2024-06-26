import React, { useState, useEffect } from 'react'
import { v4 } from 'uuid'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { imageDB } from '../firebaaseConfig'

function FileUploader({ onFileChange, reset }) {
  const [files, setFiles] = useState([])
  const [previewUrls, setPreviewUrls] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (reset) {
      setFiles([])
      setPreviewUrls([])
      setSubmitting(false)
      setSubmitted(false)
    }
  }, [reset])

  const handleFileChange = (e) => {
    const filesArray = Array.from(e.target.files)
    setFiles((prevFiles) => [...prevFiles, ...filesArray])

    const urls = filesArray.map((file) => URL.createObjectURL(file))
    setPreviewUrls((prevUrls) => [...prevUrls, ...urls])
  }

  const handleDelete = (index) => {
    const newFiles = [...files]
    const newPreviewUrls = [...previewUrls]

    newFiles.splice(index, 1)
    newPreviewUrls.splice(index, 1)

    setFiles(newFiles)
    setPreviewUrls(newPreviewUrls)
  }

  const compressImage = (file, quality) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target.result
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          canvas.width = img.width
          canvas.height = img.height
          ctx.drawImage(img, 0, 0, img.width, img.height)
          canvas.toBlob(
            (blob) => {
              resolve(blob)
            },
            'image/jpeg',
            quality
          )
        }
        img.onerror = (error) => reject(error)
      }
    })
  }

  const handleClick = async () => {
    try {
      setSubmitting(true)
      const urls = []
      for (const file of files) {
        let uploadFile = file

        if (file.type.startsWith('image/')) {
          uploadFile = await compressImage(file, 0.7)
        }

        const fileRef = ref(imageDB, `files/${v4()}`)
        await uploadBytes(fileRef, uploadFile)
        const url = await getDownloadURL(fileRef)
        urls.push(url)
      }
      onFileChange(urls)
      setSubmitting(false)
      setSubmitted(true)
      setFiles([]) // Reset files after successful submission
      setPreviewUrls([]) // Reset preview URLs after successful submission
      setTimeout(() => {
        setSubmitted(false) // Allow new submissions after a short delay
      }, 1000)
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
              {files[index].type.startsWith('image/') ? (
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
                  alt={`Preview Video ${index}`}
                />
              )}
              <button
                onClick={() => handleDelete(index)}
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
