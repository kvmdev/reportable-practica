import express from 'express'
import { login, register, changePassword } from '../controllers/authController.js'

const router = express.Router()

router.post('/login', login)
router.post('/register', register)
router.post('/changePassword', changePassword)
export default router