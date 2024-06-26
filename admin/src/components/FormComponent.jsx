// components/FormComponent.js
import React, { useState } from 'react'
import axios from 'axios'
import FileUploader from './FileUploader'
import { useNavigate } from 'react-router-dom'
import TextEditor from './TextEditor'
const FormComponent = ({ formFields, submitUrl, auth, navigate, name }) => {
  const history = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    description: '',
    news: '',
    imageUrl: [],
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  const handleDescChange = (content) => {
    if (name === 'news') {
      setFormData((prev) => ({ ...prev, news: content }))
    } else {
      setFormData((prev) => ({ ...prev, description: content }))
    }
  }

  const handleFileChange = (urls) => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: [...formData.imageUrl, ...urls],
    }))
  }

  const handleSubmit = async (e) => {
    // console.log(formData)
    e.preventDefault()
    try {
      const response = await axios.post(submitUrl, formData, {
        headers: {
          token: localStorage.getItem('token'),
        },
      })
      if (response.data.success) {
        alert('Submitted successfully')
        history(navigate)
      }
    } catch (error) {
      alert(error.response.data.message)
    }
  }

  return (
    <div className='flex flex-col gap-10 px-4 pt-10'>
      <h1 className='text-3xl font-bold'>Submit Form</h1>
      <FileUploader
        onFileChange={handleFileChange}
        reset={false}
      />
      <div className='flex flex-wrap gap-4 mt-6'>
        {formData.imageUrl.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Uploaded Image ${index}`}
            className='object-cover w-32 h-32 border border-gray-300 rounded'
          />
        ))}
      </div>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col justify-center lg:w-[50%] gap-6 p-6 border border-gray-300 rounded-lg shadow-lg bg-white'
      >
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
            {elem.name !== 'news' && elem.name !== 'description' ? (
              <input
                className='p-2 border border-gray-300 rounded'
                name={elem.name}
                onChange={handleChange}
                type='text'
                value={formData[elem.name]}
                placeholder={elem.placeholder}
              />
            ) : (
              <TextEditor change={handleDescChange} />
            )}
          </div>
        ))}

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
