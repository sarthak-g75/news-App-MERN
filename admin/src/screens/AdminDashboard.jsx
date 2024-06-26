import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCheckAdmin } from '../hooks/useCheckAdmin'
import { Route, Routes } from 'react-router-dom'
import AddNews from './AddNews'
import { useRecoilState } from 'recoil'
import { adminAuth } from '../recoil/atoms/authAtom'
const url = 'http://localhost:5000/api/auth'
const AdminDashboard = () => {
  const { role, loading } = useCheckAdmin(url)
  // console.log(role)
  const [admin, setAdmin] = useRecoilState(adminAuth)
  const history = useNavigate()
  if (!loading && role !== 'admin') {
    history('/')
    setAdmin((prev) => !prev)
    alert('Only allowed for admins')
  } else {
    setAdmin(true)
  }

  return <></>
}

export default AdminDashboard
