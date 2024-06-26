import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { adminAuth } from '../recoil/atoms/authAtom'
import { useRecoilState } from 'recoil'
const url = 'http://localhost:5000/api/auth'
import axios from 'axios'

const formInputs = [
  {
    name: 'email',
    label: 'Email',
    placeholder: 'example@example.com',
    type: 'email',
  },
  {
    name: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    type: 'password',
  },
]

const AdminLoginPage = () => {
  const [auth, setAuth] = useRecoilState(adminAuth)

  const history = useNavigate()
  const [formData, setformData] = useState({
    email: '',
    password: '',
  })
  const handleChange = (e) => {
    setformData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${url}/login`, {
        email: formData.email,
        password: formData.password,
      })
      const { data } = response

      // console.log(data)
      if (data.success) {
        // setAuth(!auth)
        localStorage.setItem('token', `Bearer ${data.token}`)
        setAuth((prev) => !prev)
        // setAdmin((prev) => !prev)
        history('/my-news')
      } else {
        console.log(data)
        alert('Please enter correct credentials')
      }
    } catch (error) {
      console.log(error)
      alert(error.response.data.message || error.response.data.error)
    }
  }
  useEffect(() => {
    if (auth) {
      history('/')
    }
  }, [])

  return (
    <div className='flex items-center justify-center px-4 pt-10 '>
      <div className='flex flex-col items-center justify-center gap-8 px-8 py-10 bg-white rounded-lg shadow-lg '>
        <div className='flex flex-col items-center justify-center gap-2 px-14'>
          <h2 className='text-4xl font-bold'>Admin Sign In</h2>
          <p className='text-lg font-semibold text-center text-slate-400'>
            Enter your credentials to access your <br />
            account
          </p>
        </div>

        <form
          className='flex flex-col w-full gap-8'
          onSubmit={handleSubmit}
        >
          {formInputs.map((elem) => {
            return (
              <div
                key={elem.name}
                className='flex flex-col gap-1'
              >
                <label className='text-lg font-bold'>{elem.label}</label>
                <input
                  className='px-2 py-3 rounded-md shadow-md text-md'
                  value={formData[elem.name]}
                  type={elem.type}
                  placeholder={elem.placeholder}
                  name={elem.name}
                  onChange={handleChange}
                />
              </div>
            )
          })}
          <button
            type='submit'
            className='py-3 font-bold text-white rounded-md bg-slate-950 hover:bg-slate-700'
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLoginPage
