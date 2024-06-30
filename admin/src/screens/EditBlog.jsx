import React, { useEffect, useState } from 'react'
import axios from 'axios'
import FormComponent from '../components/FormComponent'
import { useParams, useNavigate } from 'react-router-dom'
const mainUrl = import.meta.VITE_URL

const fetchUrl = `${mainUrl}/blog/getBlog` // Adjust API endpoint as per your backend
const updateUrl = `${mainUrl}/blog/updateBlog` // Adjust API endpoint as per your backend

const EditBlog = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [initialValues, setInitialValues] = useState({
    title: '',
    genre: '',
    description: '',
    imageUrl: [],
    // Add more fields as per your blog schema
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${fetchUrl}/${id}`, {
          headers: { token: localStorage.getItem('token') },
        })
        if (response.data.success) {
          setInitialValues(response.data.data)
        } else {
          alert(response.data.message)
          navigate('/login')
        }
      } catch (error) {
        console.log(error.response.data.message)
      }
    }
    fetchData()
  }, [fetchUrl, id, navigate])

  const handleUpdate = async (updatedData) => {
    try {
      const response = await axios.put(`${updateUrl}/${id}`, updatedData, {
        headers: { token: localStorage.getItem('token') },
      })
      if (response.data.success) {
        alert('Updated successfully')
        navigate('/my-blogs') // Adjust navigation URL as per your application
      }
    } catch (error) {
      alert(error.response.data.message)
    }
  }

  const formFields = [
    { label: 'Enter The Title', name: 'title', placeholder: 'Title Here' },
    { label: 'Enter The Genre', name: 'genre', placeholder: 'Genre Here' },
    {
      label: 'Enter The Description',
      name: 'description',
      placeholder: 'Description Here',
    },

    // Add more fields as per your blog schema
  ]

  return (
    <FormComponent
      name={'blog'}
      formFields={formFields}
      initialValues={initialValues}
      submitHandler={handleUpdate}
      navigateUrl={'/my-blogs'} // Adjust navigation URL as per your application
      isUpdateMode
    />
  )
}

export default EditBlog
