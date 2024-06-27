import React, { useEffect, useState } from 'react'
import axios from 'axios'
import FormComponent from '../components/FormComponent'
import { useParams, useNavigate } from 'react-router-dom'

const fetchUrl = 'http://localhost:5000/api/news/getNews'
const updateUrl = 'http://localhost:5000/api/news/updateNews'

const EditNews = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [initialValues, setInitialValues] = useState({
    title: '',
    genre: '',
    news: '',
    imageUrl: [],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${fetchUrl}/${id}`, {
          headers: { token: localStorage.getItem('token') },
        })
        if (response.data.success) {
          // console.log(response.data.data)
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
        navigate('/my-news')
      }
    } catch (error) {
      alert(error.response.data.message)
    }
  }

  const formFields = [
    { label: 'Enter The Title', name: 'title', placeholder: 'Title Here' },
    { label: 'Enter The Genre', name: 'genre', placeholder: 'Genre Here' },
    { label: 'Enter The News', name: 'news', placeholder: 'News Here' },
  ]

  return (
    <FormComponent
      name={'news'}
      formFields={formFields}
      initialValues={initialValues}
      submitHandler={handleUpdate}
      navigateUrl={'/my-news'}
      isUpdateMode
    />
  )
}

export default EditNews
