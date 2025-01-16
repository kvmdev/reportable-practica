import express from 'express'
import adminRoutes from './routes/adminRoutes.js'
import facturasRoutes from './routes/facturasRoutes.js'
import authRoutes from './routes/authRoutes.js'
import { authenticateToken} from './middleware/auth.js'

const app = express()
app.use(express.json())



// Rutas
app.use('/v0/api/admin', authenticateToken,adminRoutes)
app.use('/v0/api', authenticateToken, facturasRoutes)
// Rutas públicas
app.use('/auth', authRoutes)

app.listen(3000, () => {
    console.log("server is running on port 3000")
})