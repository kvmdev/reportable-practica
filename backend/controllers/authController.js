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
                rol
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