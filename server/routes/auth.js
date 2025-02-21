const express = require('express')
const prisma = require('../prismaClient')
const router = express.Router()

const jwt = require('jsonwebtoken')
const SEC_KEY = process.env.SEC_KEY
const bcrypt = require('bcrypt')
const zod = require('zod')
const authMiddleware = require('../middlewares/auth')
const newSchema = zod.object({
  name: zod.string().min(3),
  email: zod.string().email().min(5),
  password: zod.string().min(5),
})
const schema = zod.object({
  email: zod.string().email().min(5),
  password: zod.string().min(5),
})

//Route to create a new User
router.post('/create-user', async (req, res) => {
  let success = false
  const { name, password, email, role, pfp } = req.body
  try {
    const validate = newSchema.safeParse(req.body)
    // console.log(validate)

    if (validate.success) {
      const user = await prisma.user.findUnique({ where: { email: email } })
      if (user) {
        res
          .status(409)
          .json({ success: success, message: 'email already exists' })
      } else {
        const salt = await bcrypt.genSalt(10)
        const pass = await bcrypt.hash(password, salt)
        prisma.user
          .create({
            data: {
              name: name,
              password: pass,
              email: email,
              role: role,
              profilePhoto: pfp,
            },
          })
          .then((result) => {
            // console.log(result.id)
            success = true
            const token = jwt.sign(
              { email: email, role: result.role, name: name, id: result.id },
              SEC_KEY
            )

            res.status(200).json({ success: success, token: token })
          })
      }
    } else {
      res.status(422).json({
        success: success,
        message: 'please enter values with proper values',
      })
    }
  } catch (error) {
    res.status(500).json({ success: success, message: error.message })
  }
})

// Route To login:
router.post('/login', async (req, res) => {
  let success = false
  try {
    const { email, password } = req.body
    const validate = schema.safeParse(req.body)
    if (validate.success) {
      const user = await prisma.user.findUnique({ where: { email: email } })
      if (!user) {
        res.status(404).json({ success: success, message: 'User Not Found' })
      } else {
        const comparePass = await bcrypt.compare(password, user.password)
        if (!comparePass) {
          return res.status(400).json({
            success,
            error: 'Please try to login with correct credentials',
          })
        } else {
          const token = jwt.sign(
            { email: email, role: user.role, name: user.name, id: user.id },
            SEC_KEY
          )
          success = true
          res.status(200).json({ success: success, token: token })
        }
      }
    }
  } catch (error) {
    res.status(500).json({ success: success, message: error.message })
  }
})

// Route to update details
router.put('/update-user', authMiddleware, async (req, res) => {
  const { name, oldPassword, newPassword } = req.body
  let success = false

  try {
    // console.log(req.userDetail)
    // Find user by ID
    const user = await prisma.user.findUnique({
      where: { id: req.userDetail.id },
    })

    if (!user) {
      return res.status(404).json({ success, message: 'User not found' })
    }

    // If updating the name
    if (name) {
      const updatedUser = await prisma.user.update({
        where: { id: req.userDetail.id },
        data: { name },
      })

      // Generate new token with updated name
      const token = jwt.sign(
        {
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          id: updatedUser.id,
        },
        SEC_KEY
      )

      return res.status(200).json({
        success: true,
        token,
        message: 'Name updated successfully',
      })
    }

    // If updating the password
    if (oldPassword && newPassword) {
      const isMatch = await bcrypt.compare(oldPassword, user.password)
      if (!isMatch) {
        return res
          .status(400)
          .json({ success, message: 'Incorrect old password' })
      }

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(newPassword, salt)

      const updatedUser = await prisma.user.update({
        where: { id: req.userDetail.id },
        data: { password: hashedPassword },
      })

      // Generate new token after password update
      const token = jwt.sign(
        {
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          id: updatedUser.id,
        },
        SEC_KEY
      )

      return res.status(200).json({
        success: true,
        token,
        message: 'Password updated successfully',
      })
    }

    return res
      .status(400)
      .json({ success, message: 'No valid update fields provided' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ success, message: error.message })
  }
})

router.get('/get-user/:id', async (req, res) => {
  let success = false
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
    })
    if (!user) {
      return res
        .status(404)
        .json({ success: success, message: 'User not found' })
    }
    success = true
    return res.status(200).json({ success: success, user: user })
  } catch (error) {
    return res.status(500).json({ success: success, message: error.message })
  }
})

// Api to check user after logging in based on auth token
router.get('/check-user', authMiddleware, (req, res) => {
  return res.status(200).json({ success: true, role: req.userDetail.role })
})

module.exports = router
