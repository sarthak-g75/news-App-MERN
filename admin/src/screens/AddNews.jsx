import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCheckAdmin } from '../hooks/useCheckAdmin'
import { useRecoilValue } from 'recoil'
import { adminAuth } from '../recoil/atoms/authAtom'
import FormComponent from '../components/FormComponent'

const AddNews = () => {
  const mainUrl = import.meta.env.VITE_URL

  const url = `${mainUrl}/auth`
  const submitUrl = `${mainUrl}/news/create-news`
  const auth = useRecoilValue(adminAuth)
  const navigate = useNavigate()
  const { role, loading } = useCheckAdmin(url)

  const formFields = [
    {
      label: 'Title',
      name: 'title',
      type: 'text',
      placeholder: 'Enter Title Here',
    },
    {
      label: 'Genre',
      name: 'genre',
      type: 'text',
      placeholder: 'Enter Genre Here',
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
      name={'news'}
      formFields={formFields}
      submitUrl={submitUrl}
      navigateUrl={'/my-news'}
    />
  )
}

export default AddNews
