import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCheckAdmin } from '../hooks/useCheckAdmin'
import { useRecoilValue } from 'recoil'
import { adminAuth } from '../recoil/atoms/authAtom'
import FormComponent from '../components/FormComponent'

const AddNews = () => {
  const mainUrl = import.meta.VITE_URL

  const url = `${mainUrl}/auth`
  const submitUrl = `${mainUrl}/news/createNews`
  const auth = useRecoilValue(adminAuth)
  const navigate = useNavigate()
  const { role, loading } = useCheckAdmin(url)

  const formFields = [
    { label: 'Enter The Title', name: 'title', placeholder: 'Title Here' },
    { label: 'Enter The Genre', name: 'genre', placeholder: 'Genre Here' },
    { label: 'Enter The News', name: 'news', placeholder: 'News Here' },
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
      name={'news'}
      formFields={formFields}
      submitUrl={submitUrl}
      navigateUrl={'/my-news'}
    />
  )
}

export default AddNews
