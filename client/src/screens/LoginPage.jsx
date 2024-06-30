import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
// import { useRecoilState } from 'recoil'
import axios from 'axios'
import { useRecoilState } from 'recoil'
import { authAtom } from '../recoil/atoms/authAtom'

// import { authState } from '../state/atoms/AuthState'
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

const LoginPage = () => {
  const mainUrl = import.meta.env.VITE_URL
  const url = `${mainUrl}/auth`
  console.log('hello')
  const [auth, setAuth] = useRecoilState(authAtom)
  // console.log(auth)
  const history = useNavigate()
  useEffect(() => {
    if (auth) {
      history('/')
    }
  }, [])

  const [formData, setformData] = useState({
    email: '',
    password: '',
  })
  const handleChange = (e) => {
    // console.log(e.target.value)
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
        history('/')
      } else {
        alert('Please enter correct credentials')
      }
    } catch (error) {
      // console.log()
      alert(error.response.data.message)
    }
  }
  return (
    <div className='flex items-center justify-center px-4 pt-10 '>
      <div className='flex flex-col items-center justify-center gap-8 px-8 py-10 bg-white rounded-lg shadow-lg '>
        <div className='flex flex-col items-center justify-center gap-2 px-14'>
          <h2 className='text-4xl font-bold'>Sign In</h2>
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

        <h3 className='text-lg font-semibold'>
          Don't have an account?{' '}
          <Link
            className='font-bold underline'
            to={'/signup'}
          >
            Sign Up
          </Link>
        </h3>
      </div>
    </div>
  )
}

export default LoginPage
