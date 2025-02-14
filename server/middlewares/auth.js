const SEC_KEY = process.env.SEC_KEY
const jwt = require('jsonwebtoken')

const prisma = require('../prismaClient')
const fetchUser = async (req, res, next) => {
  const token = req.header('token')

  try {
    if (!token) {
      res.status(401).send('Please authenticate with the valid authentication')
    } else {
      const authToken = token.split(' ')[1]
      // console.log(authToken)
      const data = jwt.verify(authToken, SEC_KEY)
      // console.log(data)
      const user = await prisma.user.findUnique({ where: { id: data.id } })
      if (user) {
        req.userDetail = data
        //   console.log(req.userDetail)
        next()
      } else {
        return res.status(404).send('User Not Found')
      }
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = fetchUser
