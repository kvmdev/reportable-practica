import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const createContador = async (req, res) => {
    try {
        const { razonSocial, ruc } = req.body
        const contador = await prisma.users.create({
            data: {
                razonSocial,
                password: '123456',
                ruc,
                rol: 'CONTADOR'
            }
        })
        res.status(201).json({message: "El contador ha sido creado satisfactoriamente"})
    } catch (error) {
        res.status(500).json({message: `Hubo un error durante la creacion ${error.message}`})
    }
}
