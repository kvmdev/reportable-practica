import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()

export const createContador = async (req, res) => {
    try {
        const { razonSocial, ruc } = req.body
        
        // Verificar si el usuario existe
        const existingUser = await prisma.users.findFirst({
            where: { ruc }
        })
        
        if (existingUser) {
            return res.status(400).json({ message: "El usuario ya existe" })
        }
        
        // Verificar rol de administrador
        if(req.user.rol !== "ADMIN") {
            return res.status(403).json({ message: "No eres administrador" })
        }
        
        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash('123456', 10)
        
        // Crear contador
        const contador = await prisma.users.create({
            data: {
                razonSocial,
                password: hashedPassword,
                ruc,
                rol: 'CONTADOR'
            }
        })

        // Devolver respuesta exitosa
        return res.status(201).json({
            message: "El contador ha sido creado satisfactoriamente",
            contador: contador
        })

    } catch (error) {
        return res.status(500).json({
            message: `Hubo un error durante la creación: ${error.message}`
        })
    }
}
