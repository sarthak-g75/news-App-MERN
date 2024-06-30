import React, { useState, useEffect } from 'react'
// import { useRecoilState } from 'recoil'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useRecoilState } from 'recoil'
import { authAtom } from '../recoil/atoms/authAtom'
// import { authState } from '../state/atoms/AuthState'
const mainUrl = import.meta.env.VITE_URL
const url = `${mainUrl}/auth`

const formInputs = [
  { name: 'name', label: 'Full Name', placeholder: 'John Doe', type: 'text' },

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

const SignUpPage = () => {
  const [auth, setAuth] = useRecoilState(authAtom)
  const history = useNavigate()
  useEffect(() => {
    if (auth) {
      history('/')
    }
  }, [])
  // const [auth, setAuth] = useRecoilState(authState)

  const [formData, setformData] = useState({
    name: '',
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
      const response = await axios.post(`${url}/create-user`, formData)
      const { data } = response
      if (data.success) {
        localStorage.setItem('token', `Bearer ${data.token}`)
        setAuth((prev) => !prev)
        history('/')
      }
    } catch (error) {
      alert(error.response.data.message)
    }
  }
  return (
    <div className='flex items-center justify-center px-4 pt-10'>
      <div className='flex flex-col items-center justify-center gap-8 px-8 py-10 bg-white rounded-lg shadow-lg '>
        <div className='flex flex-col items-center justify-center gap-2 px-4 lg:px-14 '>
          <h2 className='text-4xl font-bold'>Sign Up</h2>
          <p className='text-base font-semibold text-center text-slate-400 '>
            Enter your information to create an <br />
            account
          </p>
        </div>

        <form
          className='flex flex-col w-full gap-8'
          action='submit'
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
            Sign Up
          </button>
        </form>

        <h3 className='text-lg font-semibold'>
          Already have an account?
          <Link
            className='font-bold underline'
            to={'/signin'}
          >
            Login
          </Link>
        </h3>
      </div>
    </div>
  )
}

export default SignUpPage
