import './App.css'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'
import NewsPage from './screens/HomePage'
import BlogPage from './screens/BlogPage'
import LoginPage from './screens/LoginPage'
import SignUpPage from './screens/SignUpPage'
import AdminLoginPage from '../../admin/src/screens/AdminLoginPage'
import Blog from './screens/Blog'
import News from './screens/News'
import { useRecoilState } from 'recoil'
// import { useCheckAdmin } from './hooks/useCheckAdmin'
import AddNews from '../../admin/src/screens/AddNews'
import AddBlog from '../../admin/src/screens/AddBlog'
import AdminDashboard from '../../admin/src/screens/AdminDashboard'
// import { adminAtom } from './recoil/atoms/authAtom'
// import AdminNavbar from './components/AdminNavbar'
// import MyBlogs from './screens/MyBlogs'
// import MyNews from './screens/MyNews'
import { useEffect } from 'react'
const url = 'http://localhost:5000/api/auth'

function App() {
  // console.log(admin)
  // role === 'admin' ? setAdmin(true) : setAdmin(false)
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path='/'
          element={<NewsPage />}
        />
        <Route
          path='/blogs'
          element={<BlogPage />}
        />
        <Route
          path='/login'
          element={<LoginPage />}
        />

        <Route
          path='/signup'
          element={<SignUpPage />}
        />
        <Route
          path='/news/:id'
          element={<News />}
        />

        <Route
          path='/blog/:id'
          element={<Blog />}
        />
      </Routes>
    </>
  )
}

export default App
