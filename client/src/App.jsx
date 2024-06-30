import './App.css'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'
import NewsPage from './screens/HomePage'
import BlogPage from './screens/BlogPage'
import LoginPage from './screens/LoginPage'
import SignUpPage from './screens/SignUpPage'

import Blog from './screens/Blog'
import News from './screens/News'

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
