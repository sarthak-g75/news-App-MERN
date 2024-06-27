// import './App.css'
import AdminNavbar from './components/AdminNavbar'
import AddNews from './screens/AddNews'
import AddBlog from './screens/AddBlog'
import MyNews from './screens/MyNews'
import MyBlogs from './screens/MyBlogs'
import AdminLoginPage from './screens/AdminLoginPage'
import { Routes, Route } from 'react-router-dom'
import EditNews from './screens/EditNews'
import EditBlog from './screens/EditBlog'
function App() {
  return (
    <>
      <AdminNavbar />
      <Routes>
        <Route
          path={'/login'}
          element={<AdminLoginPage />}
        />
        <Route
          path='/add-news'
          element={<AddNews />}
        />
        <Route
          path='/add-blog'
          element={<AddBlog />}
        />
        <Route
          path='/my-blogs'
          element={<MyBlogs />}
        />
        <Route
          path='/my-news'
          element={<MyNews />}
        />
        <Route
          path='/edit-news/:id'
          element={<EditNews />}
        />
        <Route
          path='/edit-blog/:id'
          element={<EditBlog />}
        />
      </Routes>
    </>
  )
}

export default App
