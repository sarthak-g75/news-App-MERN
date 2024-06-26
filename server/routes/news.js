const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/auth')
const News = require('../models/News')
const zod = require('zod')

require('dotenv').config()

const schema = zod.object({
  title: zod.string().min(5),
  news: zod.string().min(10),
})

// Api to create News - login required;
router.post('/createNews', authMiddleware, async (req, res) => {
  try {
    if (req.userDetail.role !== 'admin') {
      return res
        .status(403)
        .json({ success: false, message: 'Not allowed to add news' })
    }

    const { title, news, imageUrl, genre } = req.body
    const validate = schema.safeParse({ title, news })

    if (!validate.success) {
      return res.status(403).json({
        success: false,
        message:
          'Input validation failed, title should contain at least 5 characters and description should contain at least 10 characters',
      })
    }

    await News.create({
      title,
      news,
      user: req.userDetail.id,
      imageUrl,
      genre,
    })

    return res
      .status(200)
      .json({ success: true, message: 'News added successfully' })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
})

// Api to delete News - login required:
router.delete('/deleteNews/:id', authMiddleware, async (req, res) => {
  try {
    if (req.userDetail.role !== 'admin') {
      return res
        .status(403)
        .json({ success: false, message: 'Not allowed to delete the news' })
    }

    const news = await News.findById(req.params.id)
    if (!news) {
      return res.status(404).json({ success: false, message: 'News not found' })
    }

    if (news.user.toString() !== req.userDetail.id) {
      return res
        .status(404)
        .json({ success: false, message: 'You are not the owner of this news' })
    }

    await News.findByIdAndDelete(req.params.id)

    return res
      .status(200)
      .json({ success: true, message: 'News deleted successfully' })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
})

router.put('/updateNews/:id', authMiddleware, async (req, res) => {
  try {
    const { title, news, imageUrl } = req.body
    const currentNews = await News.findById(req.params.id)

    if (!currentNews) {
      return res.status(404).json({ success: false, message: 'News not found' })
    }

    const isAdmin = req.userDetail.role === 'admin'
    const isOwner = currentNews.user.toString() === req.userDetail.id

    if (!(isAdmin && isOwner)) {
      return res
        .status(403)
        .json({ success: false, message: 'Not allowed to update' })
    }

    const newTitle = title || currentNews.title
    const newNews = news || currentNews.news

    const validate = schema.safeParse({ title: newTitle, data: newNews })

    if (!validate.success) {
      return res.status(403).json({
        success: false,
        message:
          'Input validation failed, title should contain at least 5 characters and description should contain at least 10 characters',
      })
    }

    await News.findByIdAndUpdate(req.params.id, {
      title: newTitle,
      news: newNews,
      imageUrl: imageUrl || currentNews.imageUrl,
    })

    return res
      .status(200)
      .json({ success: true, message: 'News updated successfully' })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
})

// Api to get a news by id
router.get('/getNews/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id)
    if (!news) {
      return res.status(404).json({ success: false, message: 'News not found' })
    }
    return res.status(200).json({ success: true, data: news })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
})

// Api to get all news of a user by thier id :
router.get('/getUserNews', authMiddleware, async (req, res) => {
  let success = false
  try {
    const { page, limit } = req.query

    const newsCount = await News.countDocuments({ user: req.userDetail.id })
    const news = await News.find({ user: req.userDetail.id })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))

    if (news.length > 0) {
      success = true
      return res.status(200).json({
        success: success,
        data: news,
        total: newsCount,
        currentPage: parseInt(page),
        totalPages: Math.ceil(newsCount / limit),
      })
    } else {
      return res
        .status(404)
        .json({ success: success, message: 'news not found for this user' })
    }
  } catch (error) {
    return res.status(500).json({ success: success, message: error.message })
  }
})

// Api To get all news;
router.get('/getNews', async (req, res) => {
  let success = false
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10 // Default limit to 10 if not specified
    const genre = req.query.genre
    const searchQuery = req.query.query || '' // Get the search query

    // Calculate the index to start retrieving results from
    const startIndex = (page - 1) * limit

    // Construct the search criteria
    let searchCriteria = {}
    if (genre) {
      searchCriteria.genre = genre
    }
    if (searchQuery) {
      searchCriteria.title = { $regex: searchQuery, $options: 'i' } // case-insensitive search by title
    }

    // Find news with the specified criteria, skip, and limit
    const newsCount = await News.countDocuments(searchCriteria)
    const news = await News.find(searchCriteria).skip(startIndex).limit(limit)

    if (news.length > 0) {
      success = true
      return res.status(200).json({
        success: success,
        data: news,
        total: newsCount,
        currentPage: page,
        totalPages: Math.ceil(newsCount / limit),
      })
    } else {
      return res
        .status(404)
        .json({ success: success, message: 'News not found' })
    }
  } catch (error) {
    return res.status(500).json({ success: success, message: error.message })
  }
})

module.exports = router
