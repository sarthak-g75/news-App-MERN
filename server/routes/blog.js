const express = require('express')
const router = express.Router()
const Blog = require('../models/Blog')
const authMiddleware = require('../middlewares/auth')
const zod = require('zod')

const schema = zod.object({
  title: zod.string().min(5),
  description: zod.string().min(10),
})

//  API to get all blogs
router.get('/getAllBlogs', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const genre = req.query.genre
    const startIndex = (page - 1) * limit
    let blogs
    if (genre) {
      blogs = await Blog.find({ genre: genre }).skip(startIndex).limit(limit)
    } else {
      blogs = await Blog.find({}).skip(startIndex).limit(limit)
    }
    if (blogs.length < 1) {
      return res.status(404).json({ success: false, message: 'No blogs found' })
    }
    return res.status(200).json({ success: true, data: blogs })
    // next()
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

// API to create a blog
router.post('/createBlog', authMiddleware, async (req, res) => {
  let success = false
  if (req.userDetail.role === 'admin') {
    const validate = schema.safeParse(req.body)
    if (validate.success) {
      try {
        const { title, description, genre, imageUrl } = req.body
        // const {i}
        await Blog.create({
          user: req.userDetail.id,
          title: title,
          description: description,
          genre: genre,
          imageUrl,
        })
        success = true
        return res
          .status(200)
          .json({ success: success, message: 'blog added successfully' })
      } catch (error) {
        return res
          .status(500)
          .json({ success: success, message: error.message })
      }
    } else {
      res.json({
        success: success,
        message:
          'Title should contain atleast 5 characters and description should contain atleast 10 characters',
      })
    }
  } else {
    res.status(405).json({
      success: success,
      message: 'Only Admins are allowed to post blogs',
    })
  }
  // console.log(req.userDetail)
})

// API to get a particular Blog with blog id:
router.get('/getBlog/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' })
    }
    return res.status(200).json({ success: true, data: blog })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
})

// API to like a paricular blog;
router.put('/like/:id', authMiddleware, async (req, res) => {
  const { id } = req.userDetail
  const blogId = req.params.id

  try {
    let blog = await Blog.findById(blogId)
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' })
    }
    const alreadyLiked = blog.likes.includes(id)
    if (alreadyLiked) {
      return res
        .status(400)
        .json({ success: false, message: 'You already liked this blog' })
    }
    blog.likes.push(id)
    await blog.save()
    return res
      .status(200)
      .json({ success: true, message: 'Liked Successfully' })
  } catch (error) {
    return res.status(500).json({ success: success, message: error.message })
  }
})

// API to get blogs of any user ;
router.get('/getUserBlogs', authMiddleware, async (req, res) => {
  let success = false
  try {
    const { page, limit } = req.query

    const blogs = await Blog.find({ user: req.userDetail.id })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const count = await Blog.countDocuments({ user: req.userDetail.id })

    if (blogs.length > 0) {
      success = true
      return res.status(200).json({
        success: success,
        data: blogs,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
      })
    } else {
      return res
        .status(404)
        .json({ success: success, message: 'No blogs found for this user' })
    }
  } catch (error) {
    return res.status(500).json({ success: success, message: error.message })
  }
})

// Api to update the blog
router.put('/updateBlog/:id', authMiddleware, async (req, res) => {
  const { id } = req.userDetail
  const { title, description } = req.body
  try {
    const validate = schema.safeParse(req.body)
    if (!validate.success) {
      return res.status(405).json({
        success: false,
        message:
          'Please enter a title and description with a minimum of 5 characters each.',
      })
    }

    const blog = await Blog.findById(req.params.id)
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' })
    }

    if (blog.user.toString() !== id) {
      return res
        .status(403)
        .json({ success: false, message: 'Not allowed to update' })
    }

    if (blog.title === title && blog.description === description) {
      return res.json({
        success: false,
        message: 'Please enter a new description and title to update',
      })
    }

    await Blog.findByIdAndUpdate(req.params.id, { title, description })
    return res
      .status(200)
      .json({ success: true, message: 'Blog updated successfully' })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
})

// Api to delete the blog :
router.delete('/deleteBlog/:id', authMiddleware, async (req, res) => {
  let success = false
  const { id, role } = req.userDetail
  try {
    if (role !== 'admin') {
      return res
        .status(403)
        .json({ success: false, message: 'Not allowed to delete the Blog' })
    }
    const blog = await Blog.findById(req.params.id)
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' })
    }
    if (blog.user.toString() !== id) {
      return res
        .status(404)
        .json({ success: false, message: 'You are not the owner of this blog' })
    }
    await Blog.findByIdAndDelete(req.params.id)

    return res
      .status(200)
      .json({ success: true, message: 'Blog deleted successfully' })
  } catch (error) {
    return res.status(500).json({ success: success, message: error.message })
  }
})
module.exports = router
