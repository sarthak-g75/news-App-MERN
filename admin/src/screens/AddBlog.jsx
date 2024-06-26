// screens/AddBlog.js
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCheckAdmin } from '../hooks/useCheckAdmin'
import { useRecoilValue } from 'recoil'
import { adminAuth } from '../recoil/atoms/authAtom'
import FormComponent from '../components/FormComponent'

const url = 'http://localhost:5000/api/auth'
const submitUrl = 'http://localhost:5000/api/blog/createBlog'

const AddBlog = () => {
  const auth = useRecoilValue(adminAuth)
  const navigate = useNavigate()
  const { role, loading } = useCheckAdmin(url)

  const formFields = [
    { label: 'Enter The Title', name: 'title', placeholder: 'Title Here' },
    { label: 'Enter The Genre', name: 'genre', placeholder: 'Genre Here' },
    {
      label: 'Enter The Description',
      name: 'description',
      placeholder: 'Description Here',
    },
  ]

  useEffect(() => {
    if (!auth) {
      navigate('/login')
    }
    if (!loading && role !== 'admin') {
      navigate('/login')
    }
  }, [loading, role, auth, navigate])

  return (
    <FormComponent
      formFields={formFields}
      submitUrl={submitUrl}
      auth={auth}
      navigate={'/my-blogs'}
    />
  )
}

export default AddBlog
