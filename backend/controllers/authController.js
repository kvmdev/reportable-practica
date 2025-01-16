import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'tu-secreto-seguro'

export const login = async (req, res) => {
    try {
        const { ruc, password } = req.body

        // Verificar si el usuario existe
        const user = await prisma.users.findFirst({
            where: { ruc }
        })

        if (!user) {
            return res.status(401).json({ message: "Credenciales inválidas" })
        }

        // Verificar la contraseña
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            return res.status(401).json({ message: "Credenciales inválidas" })
        }

        // Generar token
        const token = jwt.sign(
            { 
                userId: user.id,
                ruc: user.ruc,
                rol: user.rol 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        )

        res.json({
            token,
            user: {
                id: user.id,
                razonSocial: user.razonSocial,
                ruc: user.ruc,
                rol: user.rol
            }
        })

    } catch (error) {
        console.error('Error en login:', error)
        res.status(500).json({ message: "Error en el servidor" })
    }
}

export const register = async (req, res) => {
    try {
        const { razonSocial, password, ruc, rol } = req.body
        let userRole = rol
        
        // Obtener el token del header de autorización
        const authHeader = req.headers.authorization
        let requestingUserRole = null

        if (authHeader) {
            const token = authHeader.split(' ')[1] // Separar 'Bearer' del token
            try {
                // Decodificar el token
                const decoded = jwt.verify(token, JWT_SECRET)
                requestingUserRole = decoded.rol
                
                // Validar permisos según el rol del usuario que hace la petición
                if (requestingUserRole === 'ADMIN') {
                    if (rol !== 'CONTADOR') {
                        return res.status(403).json({ 
                            message: "Los administradores solo pueden crear usuarios contadores" 
                        })
                    }
                } else if (requestingUserRole === 'CONTADOR') {
                    if (rol !== 'CLIENTE') {
                        return res.status(403).json({ 
                            message: "Los contadores solo pueden crear usuarios clientes" 
                        })
                    }
                } else if (requestingUserRole === 'CLIENTE') {
                    return res.status(403).json({ 
                        message: "Los clientes no tienen permiso para crear usuarios" 
                    })
                }
            } catch (error) {
                return res.status(401).json({ message: "Token inválido" })
            }
        }

        // Verificar si el usuario ya existe
        const existingUser = await prisma.users.findFirst({
            where: { ruc }
        })

        if (existingUser) {
            return res.status(400).json({ message: "El usuario ya existe" })
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10)

        // Crear usuario
        const user = await prisma.users.create({
            data: {
                razonSocial,
                password: hashedPassword,
                ruc,
                rol: userRole
            }
        })

        // Generar token
        const token = jwt.sign(
            {
                userId: user.id,
                ruc: user.ruc,
                rol: user.rol
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        )

        res.status(201).json({
            message: "Usuario creado exitosamente",
            token,
            user: {
                id: user.id,
                razonSocial: user.razonSocial,
                ruc: user.ruc,
                rol: user.rol
           }
        })

    } catch (error) {
        console.error('Error en registro:', error)
        res.status(500).json({ message: "Error en el servidor" })
    }
}

export const changePassword = async (req, res) => {
    try {
        const { ruc, currentPassword, newPassword } = req.body

        // Verificar si el usuario existe
        const user = await prisma.users.findFirst({
            where: { ruc }
        })

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" })
        }

        // Verificar la contraseña actual
        const isValidPassword = await bcrypt.compare(currentPassword, user.password)
        if (!isValidPassword) {
            return res.status(401).json({ message: "Contraseña actual incorrecta" })
        }

        // Encriptar nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        // Actualizar la contraseña
        await prisma.users.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        })

        res.json({
            message: "Contraseña actualizada exitosamente"
        })

    } catch (error) {
        console.error('Error al cambiar contraseña:', error)
        res.status(500).json({ message: "Error en el servidor" })
    }
}