// Utility function to get JWT token
const getToken = () => localStorage.getItem('jwt');

// Base API configuration
const API_URL = 'http://localhost:3000/v0/api';
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
};

// Generic API request function with error handling
async function apiRequest(endpoint, method = 'GET', body = null) {
    try {
        const options = {
            method,
            headers,
            ...(body && { body: JSON.stringify(body) })
        };
        
        const response = await fetch(`${API_URL}/${endpoint}`, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        alert('Error en la operación: ' + error.message);
        throw error;
    }
}

// Load facturas to table
async function loadFacturas(tipo) {
    const endpoint = `facturas-${tipo}s`;
    const facturas = await apiRequest(endpoint);
    const tableBody = document.getElementById('facturaTableBody');
    tableBody.innerHTML = '';
    
    facturas.forEach(factura => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${factura.ruc}</td>
            <td>${factura.razonSocial}</td>
            <td>${new Date(factura.fecha_emision).toLocaleDateString()}</td>
            <td>${factura.valor.toLocaleString('es-PY')} ₲</td>
            <td>${factura.timbrado}</td>
            <td>${factura.numeroFactura}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editarFactura('${factura.id}', '${tipo}')">
                    Editar
                </button>
                <button class="btn btn-sm btn-danger" onclick="eliminarFactura('${factura.id}', '${tipo}')">
                    Eliminar
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Add new factura
async function agregarFactura(tipo) {
    const form = document.getElementById(`form${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
    const formData = new FormData(form);
    const factura = {
        ruc: formData.get('ruc'),
        razonSocial: formData.get('razonSocial'),
        fecha_emision: formData.get('fecha'),
        valor: Number(formData.get('monto')),
        timbrado: Number(formData.get('timbrado')),
        numeroFactura: Number(formData.get('numeroFactura')),
        condicion: 'Contado' // You might want to make this dynamic
    };

    await apiRequest(`facturas-${tipo}s`, 'POST', factura);
    await loadFacturas(tipo);
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('facturaModal'));
    modal.hide();
    form.reset();
}

// Edit factura
async function editarFactura(id, tipo) {
    const factura = await apiRequest(`facturas-${tipo}s/${id}`);
    
    // Open modal and fill form
    const modal = new bootstrap.Modal(document.getElementById('facturaModal'));
    const form = document.getElementById(`form${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
    
    form.querySelector('[placeholder*="RUC"]').value = factura.ruc;
    form.querySelector('[placeholder*="Nombre"]').value = factura.razonSocial;
    form.querySelector('[type="date"]').value = factura.fecha_emision.split('T')[0];
    form.querySelector('[placeholder*="Monto"]').value = factura.valor;
    form.querySelector('[placeholder*="timbrado"]').value = factura.timbrado;
    form.querySelector('[placeholder*="factura"]').value = factura.numeroFactura;
    
    // Change button to update
    const submitButton = form.querySelector('button[type="button"]');
    submitButton.textContent = 'Actualizar';
    submitButton.onclick = async () => {
        const formData = new FormData(form);
        const updatedFactura = {
            ruc: formData.get('ruc'),
            razonSocial: formData.get('razonSocial'),
            fecha_emision: formData.get('fecha'),
            valor: Number(formData.get('monto')),
            timbrado: Number(formData.get('timbrado')),
            numeroFactura: Number(formData.get('numeroFactura')),
            condicion: factura.condicion
        };
        
        await apiRequest(`facturas-${tipo}s/${id}`, 'PUT', updatedFactura);
        await loadFacturas(tipo);
        modal.hide();
        
        // Reset form and button
        form.reset();
        submitButton.textContent = 'Subir';
        submitButton.onclick = () => agregarFactura(tipo);
    };
    
    modal.show();
}

// Delete factura
async function eliminarFactura(id, tipo) {
    if (confirm('¿Está seguro de eliminar esta factura?')) {
        await apiRequest(`facturas-${tipo}s/${id}`, 'DELETE');
        await loadFacturas(tipo);
    }
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', async (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('#facturaTableBody tr');
        
        rows.forEach(row => {
            const ruc = row.cells[0].textContent.toLowerCase();
            const nombre = row.cells[1].textContent.toLowerCase();
            row.style.display = ruc.includes(searchTerm) || nombre.includes(searchTerm) ? '' : 'none';
        });
    });
}

// Toggle between compra/venta forms
function toggleForm(tipo) {
    const formCompra = document.getElementById('formCompra');
    const formVenta = document.getElementById('formVenta');
    const buttons = document.querySelectorAll('.btn-toggle');
    
    if (tipo === 'compra') {
        formCompra.style.display = 'block';
        formVenta.style.display = 'none';
        buttons[0].classList.add('active');
        buttons[1].classList.remove('active');
        loadFacturas('compra');
    } else {
        formCompra.style.display = 'none';
        formVenta.style.display = 'block';
        buttons[0].classList.remove('active');
        buttons[1].classList.add('active');
        loadFacturas('venta');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupSearch();
    loadFacturas('compra'); // Start with compras by default
});

// Make functions globally available
window.agregarFactura = agregarFactura;
window.editarFactura = editarFactura;
window.eliminarFactura = eliminarFactura;
window.toggleForm = toggleForm;