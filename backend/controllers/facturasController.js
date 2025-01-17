import { PrismaClient } from '@prisma/client'
import { GoogleGenerativeAI } from '@google/generative-ai';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient()

export const createFacturaVenta = async (req, res) => {
    try {
        // Verificar rol del usuario
        

        const { numeroFactura, timbrado, ruc, razonSocial, condicion, fechaEmision, valor } = req.body
        
        

        const fecha_emision = new Date(fechaEmision)

        // Crear la factura asociada al usuario
        const factura = await prisma.facturas_ventas.create({
            data: {
                numeroFactura,
                timbrado,
                ruc,
                razonSocial,
                condicion,
                fecha_emision,
                valor,
                userId: req.user.userId
            }
        })

        res.status(201).json({ 
            message: "Factura creada",
            factura
        })

    } catch (error) {
        console.error('Error creating factura:', error)
        res.status(500).json({ 
            message: "Error al crear la factura", 
            error: error.message 
        })
    }
}

// Obtener todas las facturas del usuario
export const getFacturasVenta = async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.body;
        // Si es ADMIN, puede ver todas las facturas
        const where = req.user.rol === 'ADMIN' ? {} : { userId: req.user.userId }
        
        if (fechaInicio || fechaFin) {
            where.fecha_emision = {};
            
            if (fechaInicio) {
                where.fecha_emision.gte = new Date(fechaInicio);
            }
            
            if (fechaFin) {
                where.fecha_emision.lte = new Date(fechaFin);
            }
        }
        const facturas = await prisma.facturas_ventas.findMany({
            where,
            orderBy: {
                createdAt: 'desc'
            }
        })
        res.json(facturas)
    } catch (error) {
        console.error('Error fetching facturas:', error)
        res.status(500).json({ message: "Error al obtener las facturas", error })
    }
}

// Obtener una factura específica
export const getFacturaVentaById = async (req, res) => {
    try {
        const { id } = req.params
        
        const factura = await prisma.facturas_ventas.findFirst({
            where: {
                id,
                ...(req.user.rol !== 'ADMIN' && { userId: req.user.userId })
            }
        })
        
        if (!factura) {
            return res.status(404).json({ message: "Factura no encontrada" })
        }
        
        res.json(factura)
    } catch (error) {
        console.error('Error fetching factura:', error)
        res.status(500).json({ message: "Error al obtener la factura", error })
    }
}

// Obtener una factura específica con Ruc y numfactura
export const getFacturaVentaByRucnumber = async (req, res) => {
    try {
        const { numFactura, numRuc } = req.params
        let numeroFactura = parseInt(numFactura)
        let ruc = numRuc
        
        const factura = await prisma.facturas_ventas.findMany({
            where: {
                numeroFactura,
                ruc,
                ...(req.user.rol !== 'ADMIN' && { userId: req.user.userId })
            }
        })
        
        if (!factura || factura.length === 0) {    
            return res.status(404).json({ message: "Factura no encontrada" })
        }
        
        res.json(factura)
    } catch (error) {
        console.error('Error al obtener factura', error)
        res.status(500).json({ message: "Error al obtener factura" })
    }
}

// Actualizar factura
export const updateFacturaVenta = async (req, res) => {
    try {
        const { id } = req.params
        const { numeroFactura, timbrado, ruc, razonSocial, condicion, valor } = req.body
        
        // Verificar que la factura existe y pertenece al usuario
        const facturaExiste = await prisma.facturas_ventas.findFirst({
            where: {
                id,
                ...(req.user.rol !== 'ADMIN' && { userId: req.user.userId })
            }
        })
        
        if (!facturaExiste) {
            return res.status(404).json({ message: "Factura no encontrada o no tienes permiso para modificarla" })
        }
        
        const facturaActualizada = await prisma.facturas_ventas.update({
            where: { id },
            data: {
                numeroFactura,
                timbrado,
                ruc,
                razonSocial,
                condicion,
                valor
            }
        })
        
        res.json({ message: "Factura actualizada", factura: facturaActualizada })
    } catch (error) {
        console.error('Error updating factura:', error)
        res.status(500).json({ message: "Error al actualizar la factura", error })
    }
}

// Eliminar factura
export const deleteFacturaVenta = async (req, res) => {
    try {
        const { id } = req.params
        
        // Verificar que la factura existe y pertenece al usuario
        const facturaExiste = await prisma.facturas_ventas.findFirst({
            where: {
                id,
                ...(req.user.rol !== 'ADMIN' && { userId: req.user.userId })
            }
        })
        
        if (!facturaExiste) {
            return res.status(404).json({ message: "Factura no encontrada o no tienes permiso para eliminarla" })
        }
        
        await prisma.facturas_ventas.delete({
            where: { id }
        })
        
        res.json({ message: "Factura eliminada correctamente" })
    } catch (error) {
        console.error('Error deleting factura:', error)
        res.status(500).json({ message: "Error al eliminar la factura", error })
    }
}



export const createFacturaCompra = async (req, res) => {
    try {
        const { numeroFactura, timbrado, ruc, razonSocial, condicion, fechaEmision, valor } = req.body

        const fecha_emision = new Date(fechaEmision)

        // Crear la factura asociada al usuario
        const factura = await prisma.facturas_compras.create({
            data: {
                numeroFactura,
                timbrado,
                ruc,
                razonSocial,
                condicion,
                fecha_emision,
                valor,
                userId: req.user.userId
            }
        })

        res.status(201).json({ 
            message: "Factura creada",
            factura
        })

    } catch (error) {
        console.error('Error creating factura:', error)
        res.status(500).json({ 
            message: "Error al crear la factura", 
            error: error.message 
        })
    }
}

export const getFacturasCompra = async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.body;
        // Si es ADMIN, puede ver todas las facturas
        const where = req.user.rol === 'ADMIN' ? {} : { userId: req.user.userId }
        if (fechaInicio || fechaFin) {
            where.fecha_emision = {};
            
            if (fechaInicio) {
                where.fecha_emision.gte = new Date(fechaInicio);
            }
            
            if (fechaFin) {
                where.fecha_emision.lte = new Date(fechaFin);
            }
        }
        const facturas = await prisma.facturas_compras.findMany({
            where,
            orderBy: {
                createdAt: 'desc'
            }
        })
        res.json(facturas)
    } catch (error) {
        console.error('Error fetching facturas:', error)
        res.status(500).json({ message: "Error al obtener las facturas", error })
    }
}

export const getFacturaCompraById = async (req, res) => {
    try {
        const { id } = req.params
        
        const factura = await prisma.facturas_compras.findFirst({
            where: {
                id,
                ...(req.user.rol !== 'ADMIN' && { userId: req.user.userId })
            }
        })
        
        if (!factura) {
            return res.status(404).json({ message: "Factura no encontrada" })
        }
        
        res.json(factura)
    } catch (error) {
        console.error('Error fetching factura:', error)
        res.status(500).json({ message: "Error al obtener la factura", error })
    }
}

export const getFacturaCompraByRucnumber = async (req, res) => {
    try {
        const { numFactura, numRuc } = req.params
        let numeroFactura = parseInt(numFactura)
        let ruc = numRuc
        
        const factura = await prisma.facturas_compras.findMany({
            where: {
                numeroFactura,
                ruc,
                ...(req.user.rol !== 'ADMIN' && { userId: req.user.userId })
            }
        })
        
        if (!factura || factura.length === 0) {    
            return res.status(404).json({ message: "Factura no encontrada" })
        }
        
        res.json(factura)
    } catch (error) {
        console.error('Error al obtener factura', error)
        res.status(500).json({ message: "Error al obtener factura" })
    }
}

export const updateFacturaCompra = async (req, res) => {
    try {
        const { id } = req.params
        const { numeroFactura, timbrado, ruc, razonSocial, condicion, valor } = req.body
        
        // Verificar que la factura existe y pertenece al usuario
        const facturaExiste = await prisma.facturas_compras.findFirst({
            where: {
                id,
                ...(req.user.rol !== 'ADMIN' && { userId: req.user.userId })
            }
        })
        
        if (!facturaExiste) {
            return res.status(404).json({ message: "Factura no encontrada o no tienes permiso para modificarla" })
        }
        
        const facturaActualizada = await prisma.facturas_compras.update({
            where: { id },
            data: {
                numeroFactura,
                timbrado,
                ruc,
                razonSocial,
                condicion,
                valor
            }
        })
        
        res.json({ message: "Factura actualizada", factura: facturaActualizada })
    } catch (error) {
        console.error('Error updating factura:', error)
        res.status(500).json({ message: "Error al actualizar la factura", error })
    }
}

export const deleteFacturaCompra = async (req, res) => {
    try {
        const { id } = req.params
        
        // Verificar que la factura existe y pertenece al usuario
        const facturaExiste = await prisma.facturas_compras.findFirst({
            where: {
                id,
                ...(req.user.rol !== 'ADMIN' && { userId: req.user.userId })
            }
        })
        
        if (!facturaExiste) {
            return res.status(404).json({ message: "Factura no encontrada o no tienes permiso para eliminarla" })
        }
        
        await prisma.facturas_compras.delete({
            where: { id }
        })
        
        res.json({ message: "Factura eliminada correctamente" })
    } catch (error) {
        console.error('Error deleting factura:', error)
        res.status(500).json({ message: "Error al eliminar la factura", error })
    }
}



// Configure multer for image upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

import dotenv from 'dotenv'; // Usamos la sintaxis de import para dotenv
dotenv.config(); // Cargamos las variables de entorno

// Ahora puedes acceder a la clave de API como una variable de entorno
const googleAPIKey = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(googleAPIKey);

// Helper function to convert image buffer to base64
function bufferToBase64(buffer) {
    return buffer.toString('base64');
}

// Helper function to extract date from string and format it
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toISOString();
}

function cleanJsonString(str) {
    // Remove markdown code block indicators and 'json' word
    return str.replace(/```json\n?/g, '')
              .replace(/```/g, '')
              .trim();
}


export const obtenerFactura = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se proporcionó ninguna imagen' });
        }

        // Convert image to base64
        const imageBase64 = bufferToBase64(req.file.buffer);

        // Initialize Gemini 1.5 Flash model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Prepare the image for analysis
        const prompt = `Analiza esta factura y extrae la siguiente información en formato JSON:
            - numeroFactura (número)
            - razonSocial (texto)
            - ruc (texto)
            - timbrado (número)
            - condicion (texto: "Contado" o "Crédito")
            - fecha_emision (fecha en formato YYYY-MM-DD)
            - valor (número)
            
            Responde solamente con el JSON, sin ningún otro texto.`;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    mimeType: req.file.mimetype,
                    data: imageBase64
                }
            }
        ]);

        const response = await result.response;
        const cleanedResponse = cleanJsonString(response.text());
        
        let extractedData;
        try {
            extractedData = JSON.parse(cleanedResponse);
        } catch (parseError) {
            console.error('Error parsing cleaned JSON response:', cleanedResponse);
            throw new Error('La respuesta del modelo no es un JSON válido');
        }

        // Prepare final response
        const invoiceData = {
            id: uuidv4(),
            numeroFactura: extractedData.numeroFactura,
            razonSocial: extractedData.razonSocial,
            ruc: extractedData.ruc,
            timbrado: extractedData.timbrado,
            condicion: extractedData.condicion,
            fecha_emision: formatDate(extractedData.fecha_emision),
            valor: extractedData.valor,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            userId: req.body.userId || "default-user-id"
        };

        res.json(invoiceData);

    } catch (error) {
        console.error('Error al procesar la factura:', error);
        res.status(500).json({ 
            error: 'Error al procesar la factura',
            details: error.message 
        });
    }
}
