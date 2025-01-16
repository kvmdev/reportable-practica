import express from 'express'
import { 
    createFacturaVenta, 
    getFacturasVenta, 
    getFacturaVentaById, 
    updateFacturaVenta, 
    deleteFacturaVenta,
    getFacturaVentaByRucnumber,
    createFacturaCompra,
    getFacturasCompra,
    getFacturaCompraById,
    getFacturaCompraByRucnumber,
    updateFacturaCompra,
    deleteFacturaCompra,
    obtenerFactura
} from '../controllers/facturasController.js'

const router = express.Router()


// Rutas de facturas de venta
router.post('/facturas-ventas', createFacturaVenta)
router.get('/facturas-ventas', getFacturasVenta)
router.get('/facturas-ventas/:numRuc/:numFactura', getFacturaVentaByRucnumber)
router.get('/facturas-ventas/:id', getFacturaVentaById)
router.put('/facturas-ventas/:id', updateFacturaVenta)
router.delete('/facturas-ventas/:id', deleteFacturaVenta)

// Rutas de facturas de compra
router.post('/facturas-compras/', createFacturaCompra)
router.get('/facturas-compras', getFacturasCompra)
router.get('/facturas-compras/:id', getFacturaCompraById)
router.get('/facturas-compras/:numRuc/:numFactura', getFacturaCompraByRucnumber)
router.put('/facturas-compras/:id', updateFacturaCompra)
router.delete('/facturas-compras/:id', deleteFacturaCompra)

// Rutas de imagen factura
router.post('/obtener-factura', obtenerFactura)




export default router