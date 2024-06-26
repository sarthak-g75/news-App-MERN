import React, { useState } from 'react'
import { RxHamburgerMenu } from 'react-icons/rx'
import { useNavigate } from 'react-router-dom'
import { MdClose } from 'react-icons/md'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaUser } from 'react-icons/fa'
import { adminAuth } from '../recoil/atoms/authAtom'
import { useRecoilState } from 'recoil'

const AdminNavbar = () => {
  const navigate = useNavigate()
  const [admin, setAdmin] = useRecoilState(adminAuth)
  const [menu, setMenu] = useState(false)

  const handleClickMenu = () => {
    setMenu((prev) => !prev)
  }

  const handleLogout = () => {
    // console.log('Logging out...') // Log for debugging
    localStorage.removeItem('token')
    setAdmin(false)
    navigate('/login')
    // console.log('Navigate to login') // Log for debugging
  }

  const SidebarButtons = () => (
    <>
      <Link
        className='lg:hover:underline lg:text-base lg:font-medium'
        onClick={handleClickMenu}
        to={'/add-news'}
      >
        Add News
      </Link>
      <Link
        className='lg:hover:underline lg:text-base lg:font-medium'
        onClick={handleClickMenu}
        to={'/my-news'}
      >
        My News
      </Link>
      <Link
        className='lg:hover:underline lg:text-base lg:font-medium'
        onClick={handleClickMenu}
        to={'/add-blog'}
      >
        Add Blogs
      </Link>
      <Link
        className='lg:hover:underline lg:text-base lg:font-medium'
        onClick={handleClickMenu}
        to={'/my-blogs'}
      >
        My Blogs
      </Link>
      {!admin ? (
        <Link
          className='flex items-center gap-2 rounded-full lg:text-white lg:px-6 lg:py-2 lg:text-md lg:bg-primary lg:opacity-80 lg:hover:opacity-100 lg:text-base lg:font-medium'
          onClick={handleClickMenu}
          to={'/login'}
        >
          Login
          <FaUser className='hidden w-4 h-4 lg:inline' />
        </Link>
      ) : (
        <button
          onClick={handleLogout}
          className='flex items-center gap-3 rounded-full lg:px-6 lg:py-2 lg:text-md lg:bg-primary lg:opacity-80 lg:text-white lg:hover:opacity-100 lg:text-base lg:font-medium'
        >
          Logout
        </button>
      )}
    </>
  )

  return (
    <nav className='relative h-[8vh] flex justify-between items-center px-2 lg:px-10 overflow-x-hidden z-20 shadow-lg'>
      <Link
        to={'/'}
        className='text-3xl font-bold text-other'
      >
        News App
      </Link>
      <div className='relative z-30 lg:hidden'>
        {menu ? (
          <MdClose
            onClick={handleClickMenu}
            className='text-3xl cursor-pointer text-other'
          />
        ) : (
          <RxHamburgerMenu
            onClick={handleClickMenu}
            className='text-3xl cursor-pointer'
          />
        )}
      </div>
      <motion.div
        className='fixed top-0 right-0 z-10 w-[80vw] h-full font-semibold lg:hidden'
        initial={{ x: '100%' }}
        animate={{ x: menu ? '0%' : '100%' }}
        transition={{ type: 'tween', duration: 0.4 }}
      >
        <div className='flex flex-col items-start h-screen gap-4 px-4 py-10 text-xl bg-white bg-opacity-40 text-other backdrop-blur-lg'>
          <SidebarButtons />
        </div>
      </motion.div>
      <div className='flex-row items-center hidden gap-6 text-xl font-semibold lg:flex'>
        <SidebarButtons />
      </div>
    </nav>
  )
}

export default AdminNavbar
