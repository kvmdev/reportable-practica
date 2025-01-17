import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || 'tu-secreto-seguro'

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ message: "Token no proporcionado" })
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(403).json({ message: "Token inválido" })
    }
}

export const checkRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.rol)) {
            return res.status(403).json({ 
                message: "No tienes permiso para realizar esta acción" 
            })
        }
        next()
    }
}
