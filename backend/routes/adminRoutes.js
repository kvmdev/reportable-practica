import express from 'express'
import { createContador } from '../controllers/adminController.js'

const router = express.Router()

router.post('/create/contadores', createContador)

export default router