const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/auth')

const zod = require('zod')
const prisma = require('../prismaClient')

require('dotenv').config()
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

const selectUserData = {
  user: { select: { email: true, name: true, id: true, profilePhoto: true } },
}

// Api to create News - login required;
router.post('/create-news', authMiddleware, async (req, res) => {
  try {
    if (req.userDetail.role !== 'admin') {
      return res
        .status(403)
        .json({ success: false, message: 'Not allowed to add news' })
    }

    const { content, genre, title } = req.body
    const validate = schema.safeParse(req.body)

    if (!validate.success) {
      return res.status(403).json({
        success: false,
        message:
          'Input validation failed, genre should contain at least 3 characters and content should have atleast one element',
      })
    }

    await prisma.news.create({
      data: {
        title,
        content,
        userId: req.userDetail.id,
        genre,
      },
    })

    return res
      .status(200)
      .json({ success: true, message: 'News added successfully' })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
})

// Api to delete News - login required:
router.delete('/delete-news/:id', authMiddleware, async (req, res) => {
  try {
    if (req.userDetail.role !== 'admin') {
      return res
        .status(403)
        .json({ success: false, message: 'Not allowed to delete the news' })
    }
    const deletedNews = await prisma.news.deleteMany({
      where: { userId: req.userDetail.id, id: req.params.id },
    })
    if (deletedNews.count === 0) {
      return res.status(404).json({
        success: false,
        message: 'News not found or you are not the owner',
      })
    }
    return res
      .status(200)
      .json({ success: true, message: 'News deleted successfully' })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
})

router.patch('/update-news/:id', authMiddleware, async (req, res) => {
  try {
    const { content, genre, title } = req.body

    const currentNews = await prisma.news.findUnique({
      where: { id: req.params.id },
    })

    if (!currentNews) {
      return res.status(404).json({ success: false, message: 'News not found' })
    }

    const isAdmin = req.userDetail.role === 'admin'
    const isOwner = currentNews.userId === req.userDetail.id

    if (!isAdmin && !isOwner) {
      return res
        .status(403)
        .json({ success: false, message: 'Not allowed to update' })
    }

    const updatedNews = await prisma.news.update({
      where: { id: req.params.id },
      data: {
        title: title ?? currentNews.title, // Keep existing title if not provided
        content: content ?? currentNews.content, // Keep existing content if not provided
        genre: genre ?? currentNews.genre, // Keep existing genre if not provided
      },
    })

    return res.status(200).json({
      success: true,
      message: 'News updated successfully',
      news: updatedNews,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
})

// Api to get a news by id
router.get('/get-news/:id', async (req, res) => {
  try {
    const news = await prisma.news.findUnique({
      where: { id: req.params.id },
      include: selectUserData,
    })
    if (!news) {
      return res.status(404).json({ success: false, message: 'News not found' })
    }
    return res.status(200).json({ success: true, data: news })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
})

// Api to get all news of a user by thier id :
router.get('/get-user-news', authMiddleware, async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query

    page = parseInt(page)
    limit = parseInt(limit)

    const newsCount = await prisma.news.count({
      where: { userId: req.userDetail.id },
    })

    const news = await prisma.news.findMany({
      where: { userId: req.userDetail.id },
      include: selectUserData,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { date: 'desc' }, // Sorting by latest news
    })

    if (!news.length) {
      return res
        .status(404)
        .json({ success: false, message: 'No news found for this user' })
    }

    return res.status(200).json({
      success: true,
      data: news,
      total: newsCount,
      currentPage: page,
      totalPages: Math.ceil(newsCount / limit),
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
})
// Api To get all news;
router.get('/get-news', async (req, res) => {
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
    const newsCount = await prisma.news.count({
      where,
    })

    const news = await prisma.news.findMany({
      where,
      include: selectUserData,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { date: 'desc' }, // Sorting by newest first
    })

    if (!news.length) {
      return res.status(404).json({ success: false, message: 'No news found' })
    }

    return res.status(200).json({
      success: true,
      data: news,
      total: newsCount,
      currentPage: page,
      totalPages: Math.ceil(newsCount / limit),
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
})
module.exports = router
