import { PrismaClient } from '@prisma/client'
import express from 'express'

const prisma = new PrismaClient()

const app = express()

app.use(express.json())

app.post('/admin/create/contadores', async (req, res)=> {
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
        res.status(500).json({message: "Hubo un error durante la creacion"})
    }
})

app.post('/facturas-ventas', async (req, res)=> {
    try {
        const { timbrado, ruc, razonSocial, condicion, fechaEmision, valor } = req.body
        const fecha_emision = new Date(fechaEmision) // Ensure fechaEmision is a Date object
        console.log('Received data:', { timbrado, ruc, razonSocial, condicion, fecha_emision, valor }) // Log received data
        await prisma.facturas_ventas.create({
            data: {
                timbrado, ruc, razonSocial, condicion, fecha_emision, valor
            }
        })
        res.status(201).json({ message: "Factura creada"})
    } catch (error) {
        console.error('Error creating factura:', error) // Log error
        res.status(500).send({ message: "Error al crear la factura", error })
    }
})

app.post('/facturas-compras', async (req, res)=> {
    try {
        const { timbrado, ruc, razonSocial, condicion, fechaEmision, valor } = req.body
        const fecha_emision = new Date(fechaEmision) // Ensure fechaEmision is a Date object
        console.log('Received data:', { timbrado, ruc, razonSocial, condicion, fecha_emision, valor }) // Log received data
        await prisma.facturas_compras.create({
            data: {
                timbrado, ruc, razonSocial, condicion, fecha_emision, valor
            }
        })
        res.status(201).json({ message: "Factura creada"})
    } catch (error) {
        console.error('Error creating factura:', error) // Log error
        res.status(500).send({ message: "Error al crear la factura" })
    }
})

app.listen(3000, ()=> {
    console.log("server is running on port 3000")
})