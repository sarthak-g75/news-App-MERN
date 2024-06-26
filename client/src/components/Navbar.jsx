import { useState } from 'react'
import { RxHamburgerMenu } from 'react-icons/rx'
import { Navigate, useNavigate } from 'react-router-dom'
import { MdClose } from 'react-icons/md'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaUser } from 'react-icons/fa'
import { authAtom } from '../recoil/atoms/authAtom'
import { useRecoilState } from 'recoil'
//  token functionality is left

const Navbar = () => {
  const history = useNavigate()
  const [auth, setAuth] = useRecoilState(authAtom)
  // console.log(auth)
  const [menu, setMenu] = useState(false)
  // Function to handle click if clicked on menu or menu Item
  const hanadleClickMenu = () => {
    setMenu((prev) => !prev)
  }
  const handleLogout = () => {
    localStorage.removeItem('token')
    setAuth(false)
    history('/')
  }
  // Siderbar made into one function
  const SidebarButtons = () => (
    <>
      <Link
        className='lg:hover:underline lg:text-base lg:font-medium'
        onClick={hanadleClickMenu}
        to={'/'}
      >
        News
      </Link>
      <Link
        className='lg:hover:underline lg:text-base lg:font-medium'
        onClick={hanadleClickMenu}
        to={'/blogs'}
      >
        Blogs
      </Link>
      {/* <div className='flex gap-6'> */}
      {!localStorage.getItem('token') ? (
        <>
          <Link
            className='flex items-center gap-2 rounded-full lg:px-6 lg:py-2 lg:text-md lg:bg-gray-100 lg:opacity-80 lg:hover:opacity-100 lg:text-base lg:font-medium'
            onClick={hanadleClickMenu}
            to={'/login'}
          >
            Login
            <FaUser className='hidden w-4 h-4 lg:inline' />
          </Link>
          <Link
            className='flex items-center gap-3 rounded-full lg:px-6 lg:py-2 lg:text-md lg:bg-primary lg:opacity-80 lg:text-white lg:hover:opacity-100 lg:text-base lg:font-medium '
            onClick={hanadleClickMenu}
            to={'/signup'}
          >
            Sign Up
          </Link>
        </>
      ) : (
        <Link
          onClick={handleLogout}
          className='flex items-center gap-3 rounded-full lg:px-6 lg:py-2 lg:text-md lg:bg-primary lg:opacity-80 lg:text-white lg:hover:opacity-100 lg:text-base lg:font-medium '
        >
          Logout
        </Link>
      )}
      {/* </div> */}
    </>
  )

  return (
    <nav className='relative h-[8vh]  flex justify-between items-center px-2   lg:px-10 overflow-x-hidden z-20 shadow-lg'>
      <Link
        to={'/'}
        className='text-3xl font-bold text-other'
      >
        News App
      </Link>
      {/* Hamburger */}
      <div className='relative z-30 lg:hidden '>
        {menu ? (
          <MdClose
            onClick={hanadleClickMenu}
            className='text-3xl cursor-pointer text-other'
          />
        ) : (
          <RxHamburgerMenu
            onClick={hanadleClickMenu}
            className='text-3xl cursor-pointer'
          />
        )}
      </div>

      {/* Sidebar */}
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
      {/* sidebar converted to buttons in desktop  */}
      <div className='flex-row items-center hidden gap-6 text-xl font-semibold lg:flex'>
        <SidebarButtons />
      </div>
    </nav>
  )
}

export default Navbar
