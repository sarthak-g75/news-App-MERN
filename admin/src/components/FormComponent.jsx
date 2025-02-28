import React, { useState, useEffect } from 'react'
import axios from 'axios'
import FileUploader from './FileUploader'
import TextEditor from './TextEditor'
import { useNavigate } from 'react-router-dom'
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
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
      Key: `uploads/${fileKey}`,
    })
  )
}
const contentType = ['subheading', 'description', 'image', 'url']
const FormComponent = ({
  formFields,
  submitUrl,
  navigateUrl,
  name,
  initialValues = {
    title: '',
    genre: '',
    content: [],
  },
  isUpdateMode = false,
  submitHandler,
}) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: initialValues.title || '',
    genre: initialValues.genre || '',
  })
  const [contentItems, setContentItems] = useState(initialValues.content || [])
  // console.log(initialValues.content)

  // Use useEffect to initialize form data only once when initialValues change

  if (isUpdateMode) {
    useEffect(() => {
      setFormData(initialValues)
      setContentItems(initialValues.content || [])
    }, [initialValues])
  }
  const handleChange = (e) => {
    const { name, value } = e.target
    // console.log(e.target)
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleContentDelete = (index, type) => {
    if (type === 'image') {
      try {
        contentItems[index].content.map((item, index) => {
          deleteImage(item)
        })
        alert('Image deleted successfully')
      } catch (error) {
        alert(error.message)
      }
    }
    setContentItems((prev) => prev.filter((_, i) => i !== index))
  }

  const handleContentAdd = (type) => {
    setContentItems([...contentItems, { type, content: [] }])
  }

  const handleContentChange = (index, newValue) => {
    setContentItems((prev) => {
      const updatedItems = [...prev]
      updatedItems[index].content = [newValue] // Ensure content is an array
      return updatedItems
    })
  }

  const handleFileChange = (index, urls) => {
    setContentItems((prev) => {
      const updatedItems = [...prev]
      updatedItems[index].content = urls // FileUploader returns an array
      return updatedItems
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = { ...formData, content: contentItems }
      if (submitHandler) {
        await submitHandler(payload)
      } else {
        const response = await axios.post(submitUrl, payload, {
          headers: {
            token: localStorage.getItem('token'),
          },
        })
        if (response.data.success) {
          alert('Submitted successfully')
          navigate(navigateUrl)
        }
      }
    } catch (error) {
      alert(error.response.data.message)
    }
  }

  return (
    <div className='flex flex-col gap-10 px-4 pt-10'>
      <h1 className='text-3xl font-bold'>Submit Form</h1>

      <form
        onSubmit={handleSubmit}
        className='flex flex-col lg:w-[50%] gap-6 p-6 border border-gray-300 rounded-lg shadow-lg bg-white'
      >
        {/* Title & Genre Dropdown */}
        {formFields.map((elem) => (
          <div
            key={elem.name}
            className='flex flex-col gap-2'
          >
            <label
              htmlFor={elem.name}
              className='font-semibold'
            >
              {elem.label}
            </label>
            {elem.type === 'select' ? (
              <select
                name={elem.name}
                className='p-2 border border-gray-300 rounded'
                onChange={handleChange}
                value={formData[elem.name]}
              >
                {elem.options.map((option) => (
                  <option
                    key={option}
                    value={option}
                  >
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className='p-2 border border-gray-300 rounded'
                name={elem.name}
                type='text'
                onChange={handleChange}
                value={formData[elem.name]}
                placeholder={elem.placeholder}
              />
            )}
          </div>
        ))}

        {/* Render Dynamic Content Items */}
        <div className='flex flex-col gap-4 mt-4'>
          {contentItems.map((item, index) => (
            <div
              key={index}
              className='relative p-4 bg-gray-100 border rounded-lg'
            >
              <button
                type='delete'
                onClick={() => handleContentDelete(index, item.type)}
                className='absolute p-2 px-4 text-white bg-red-600 rounded-full cursor-pointer -right-4 -top-4 hover:bg-red-700'
              >
                Delete
              </button>
              <p className='font-semibold capitalize'>{item.type}</p>
              {item.type === 'description' ? (
                <TextEditor
                  change={(value) => handleContentChange(index, value)}
                  content={item.content[0] || ''}
                />
              ) : item.type === 'image' ? (
                <FileUploader
                  preview={item}
                  onFileChange={(urls) => handleFileChange(index, urls)}
                />
              ) : (
                <input
                  type='text'
                  className='w-full p-2 border border-gray-300 rounded'
                  onChange={(e) => handleContentChange(index, e.target.value)}
                  value={item.content[0] || ''}
                />
              )}
            </div>
          ))}
        </div>

        {/* Add Content Dropdown */}
        <div className='flex flex-col gap-2'>
          <label className='font-semibold'>Content</label>
          <select
            className='p-2 border border-gray-300 rounded'
            onChange={(e) => {
              if (e.target.value) handleContentAdd(e.target.value)
              e.target.value = '' // Reset selection after adding
            }}
          >
            <option value=''>+ Add Content</option>
            {contentType.map((elem, index) => (
              <option
                key={index}
                value={elem}
              >
                {elem}
              </option>
            ))}
            {/* <option value='subheading'>Subheading</option>
            <option value='description'>Description</option>
            <option value='image'>Image</option>
            <option value='url'>URL</option> */}
          </select>
        </div>
        <button
          type='submit'
          className='px-4 py-2 font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600'
        >
          Submit
        </button>
      </form>
    </div>
  )
}

export default FormComponent
