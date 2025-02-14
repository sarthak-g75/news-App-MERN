const express = require('express')
const router = express.Router()
const prisma = require('../prismaClient')
const authMiddleware = require('../middlewares/auth')
const zod = require('zod')

const schema = zod.object({
  title: zod.string().min(5),
  content: zod
    .array(
      zod.object({
        type: zod.string().min(3),
        content: zod.array(zod.string().min(1)),
      })
    )
    .min(1),
  genre: zod.string().min(3),
})

//  API to get all blogs
router.get('/get-all-blogs', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const genre = req.query.genre || ''
    const searchQuery = req.query.query || null

    const where = {
      ...(genre && { genre }),
      ...(searchQuery && {
        title: { contains: searchQuery, mode: 'insensitive' },
      }),
    }
    const blogsCount = await prisma.blog.count({ where })
    const blogs = await prisma.blog.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { date: 'desc' }, // Sorting by newest first
      include: { user: true }, // Optional: Fetch user details with the blog
    })
    if (!blogs.length) {
      return res.status(404).json({ success: false, message: 'No blogs found' })
    }

    return res.status(200).json({
      success: true,
      data: blogs,
      total: blogsCount,
      currentPage: page,
      totalPages: Math.ceil(blogsCount / limit),
    })
    // next()
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

// API to create a blog
router.post('/create-blog', authMiddleware, async (req, res) => {
  let success = false
  if (req.userDetail.role === 'admin') {
    const validate = schema.safeParse(req.body)
    if (validate.success) {
      try {
        const { title, genre, content } = req.body
        // const {i}
        await prisma.blog.create({
          data: {
            userId: req.userDetail.id,
            title: title,
            genre: genre,
            content,
          },
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
router.get('/get-blog/:id', async (req, res) => {
  try {
    const blog = await prisma.blog.findUnique({ where: { id: req.params.id } })
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' })
    }
    return res.status(200).json({ success: true, data: blog })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
})

// API to like a paricular blog;
// router.put('/like/:id', authMiddleware, async (req, res) => {
//   const { id } = req.userDetail
//   const blogId = req.params.id

//   try {
//     let blog = await Blog.findById(blogId)
//     if (!blog) {
//       return res.status(404).json({ success: false, message: 'Blog not found' })
//     }
//     const alreadyLiked = blog.likes.includes(id)
//     if (alreadyLiked) {
//       return res
//         .status(400)
//         .json({ success: false, message: 'You already liked this blog' })
//     }
//     blog.likes.push(id)
//     await blog.save()
//     return res
//       .status(200)
//       .json({ success: true, message: 'Liked Successfully' })
//   } catch (error) {
//     return res.status(500).json({ success: success, message: error.message })
//   }
// })

// API to get blogs of any user ;
router.get('/get-user-blogs', authMiddleware, async (req, res) => {
  let success = false
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    const count = await prisma.blog.count({
      where: { userId: req.userDetail.id },
    })

    const blogs = await prisma.blog.findMany({
      where: { userId: req.userDetail.id },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { date: 'desc' }, // Sorting by newest first
      include: { user: true }, // Optional: Fetch user details with the blog
    })

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
router.patch('/update-blog/:id', authMiddleware, async (req, res) => {
  const { id } = req.userDetail
  const { title, content, genre } = req.body
  try {
    const blog = await prisma.blog.findUnique({ where: { id: req.params.id } })
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' })
    }
    const isAdmin = req.userDetail.role === 'admin'
    const isOwner = blog.userId === req.userDetail.id
    if (!isAdmin && !isOwner) {
      return res
        .status(403)
        .json({ success: false, message: 'Not allowed to update' })
    }

    const updatedBlog = await prisma.blog.update({
      where: { id: req.params.id },
      data: {
        title: title ?? blog.title, // Keep existing title if not provided
        content: content ?? blog.content, // Keep existing content if not provided
        genre: genre ?? blog.genre, // Keep existing genre if not provided
      },
    })
    return res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      blog: updatedBlog,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
})

// Api to delete the blog :
router.delete('/delete-blog/:id', authMiddleware, async (req, res) => {
  let success = false
  const { role } = req.userDetail
  try {
    console.log(req.userDetail)
    if (role !== 'admin') {
      return res
        .status(403)
        .json({ success: false, message: 'Not allowed to delete the Blog' })
    }
    const deletedBlog = await prisma.blog.deleteMany({
      where: { id: req.params.id, userId: req.userDetail.id },
    })
    if (deletedBlog.count === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found or you are not the owner',
      })
    }
    return res.status(200).json({
      success: true,
      message: 'Blog deleted successfully',
    })
  } catch (error) {
    return res.status(500).json({ success: success, message: error.message })
  }
})
module.exports = router
