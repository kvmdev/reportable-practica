// function toggleForm(type) {
//     const formCompra = document.getElementById('formCompra');
//     const formVenta = document.getElementById('formVenta');
//     const buttons = document.querySelectorAll('.btn-toggle');
    
//     if (type === 'compra') {
//         formCompra.style.display = 'block';
//         formVenta.style.display = 'none';
//         buttons[0].classList.add('active');
//         buttons[1].classList.remove('active');
//     } else {
//         formCompra.style.display = 'none';
//         formVenta.style.display = 'block';
//         buttons[0].classList.remove('active');
//         buttons[1].classList.add('active');
//     }
// }

function openModal(type) {
    const modal = new bootstrap.Modal(document.getElementById('invoiceModal'));
    const modalTitle = document.getElementById('invoiceModalLabel');
    const modalBody = document.querySelector('.modal-body');

    modalTitle.textContent = type === 'compra' ? 'Cargar factura de compra' : 'Cargar factura de venta';
    
    // Create toggle buttons
    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'btn-group mb-3';
    toggleContainer.innerHTML = `
        <button type="button" class="btn btn-outline-primary active" onclick="toggleModalForm('compra')">Compra</button>
        <button type="button" class="btn btn-outline-primary" onclick="toggleModalForm('venta')">Venta</button>
    `;
    
    // Create form container
    const formContainer = document.createElement('div');
    formContainer.id = 'formContainer';
    formContainer.innerHTML = getCompraForm() + getVentaForm();
    
    // Clear modal body and append new elements
    modalBody.innerHTML = '';
    modalBody.appendChild(toggleContainer);
    modalBody.appendChild(formContainer);
    
    // Show initial form
    toggleModalForm(type);

    modal.show();
}

// Add new function to toggle between forms in the modal
function toggleModalForm(type) {
    const formCompra = document.getElementById('formCompra');
    const formVenta = document.getElementById('formVenta');
    const buttons = document.querySelectorAll('.btn-group .btn');
    
    if (type === 'compra') {
        formCompra.style.display = 'block';
        formVenta.style.display = 'none';
        buttons[0].classList.add('active');
        buttons[1].classList.remove('active');
    } else {
        formCompra.style.display = 'none';
        formVenta.style.display = 'block';
        buttons[0].classList.remove('active');
        buttons[1].classList.add('active');
    }
}

function getCompraForm() {
    return `
        <form id="formCompra" onsubmit="submitForm(event, 'compra')" style="display: none;">
        <!-- Rest of the form content remains the same -->
        </form>
    `;
}

function getVentaForm() {
    return `
        <form id="formVenta" onsubmit="submitForm(event, 'venta')" style="display: none;">
        <!-- Rest of the form content remains the same -->
        </form>
    `;
}

function submitForm(event, type){
    event.preventDefault();
    //rest of the code
}


// funcionalidades.js

let invoices = [];
let currentPage = 1;
const itemsPerPage = 10;

// Fetch invoices from the API
async function fetchInvoices() {
    try {
        const response = await fetch('/api/invoices'); // Replace with your API endpoint
        invoices = await response.json();
        renderTable();
    } catch (error) {
        console.error('Error fetching invoices:', error);
    }
}

// Render the table with current data
function renderTable() {
    const tableBody = document.getElementById('invoiceTableBody');
    const filteredInvoices = filterInvoices();
    const paginatedInvoices = paginateInvoices(filteredInvoices);

    tableBody.innerHTML = '';
    paginatedInvoices.forEach(invoice => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${invoice.numeroFactura}</td>
            <td>${invoice.razonSocial}</td>
            <td>${invoice.ruc}</td>
            <td>${invoice.timbrado}</td>
            <td>${invoice.condicion}</td>
            <td>${new Date(invoice.fecha_emision).toLocaleDateString()}</td>
            <td>₲ ${invoice.valor.toLocaleString()}</td>
        `;
        tableBody.appendChild(row);
    });

    renderPagination(filteredInvoices.length);
}

// Filter invoices based on user input
function filterInvoices() {
    const filterValue = document.getElementById('filterInput').value.toLowerCase();
    return invoices.filter(invoice => 
        invoice.ruc.toLowerCase().includes(filterValue) ||
        invoice.razonSocial.toLowerCase().includes(filterValue) ||
        invoice.numeroFactura.toString().includes(filterValue)
    );
}

// Paginate invoices
function paginateInvoices(filteredInvoices) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredInvoices.slice(startIndex, startIndex + itemsPerPage);
}

// Render pagination controls
function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginationElement = document.getElementById('pagination');
    
    let paginationHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `<button class="btn btn-sm ${i === currentPage ? 'btn-primary' : 'btn-outline-primary'}" onclick="changePage(${i})">${i}</button>`;
    }
    
    paginationElement.innerHTML = paginationHTML;
}

// Change current page
function changePage(page) {
    currentPage = page;
    renderTable();
}

// Open modal for new invoice
function openModal(type) {
    const modal = new bootstrap.Modal(document.getElementById('invoiceModal'));
    const modalTitle = document.getElementById('invoiceModalLabel');
    const modalBody = document.querySelector('.modal-body');

    modalTitle.textContent = type === 'compra' ? 'Cargar factura de compra' : 'Cargar factura de venta';
    modalBody.innerHTML = type === 'venta' ? getCompraForm() : getVentaForm();

    modal.show();
}

// Get Compra form HTML
function getCompraForm() {
    return `
        <form id="formCompra" onsubmit="submitForm(event, 'compra')">
            <div class="mb-3">
                <label for="ruc" class="form-label">RUC</label>
                <input type="text" class="form-control" id="ruc" placeholder="RUC del proveedor" required>
            </div>
            <div class="mb-3">
                <label for="nombre" class="form-label">Nombre</label>
                <input type="text" class="form-control" id="nombre" placeholder="Nombre del proveedor" required>
            </div>
            <div class="mb-3">
                <label for="fecha" class="form-label">Fecha</label>
                <input type="date" class="form-control" id="fecha" required>
            </div>
            <div class="mb-3">
                <label for="monto" class="form-label">Monto</label>
                <div class="input-group">
                    <span class="input-group-text">₲</span>
                    <input type="number" class="form-control" id="monto" placeholder="Monto de lo comprado" value="0" required>
                </div>
            </div>
            <div class="mb-3">
                <label for="timbrado" class="form-label">Timbrado</label>
                <input type="number" class="form-control" id="timbrado" placeholder="Número de timbrado" required>
            </div>
            <div class="mb-3">
                <label for="factura" class="form-label">N° Factura</label>
                <input type="number" class="form-control" id="factura" placeholder="Número de factura" required>
            </div>
            <div class="mb-3">
                <label for="customFile" class="form-label">Subir Factura</label>
                <input type="file" class="form-control" id="customFile">
            </div>
            <button type="submit" class="btn btn-primary">Subir</button>
            <button type="reset" class="btn btn-outline-secondary">Limpiar</button>
        </form>
    `;
}

// Get Venta form HTML
function getVentaForm() {
    return `
        <form id="formVenta" onsubmit="submitForm(event, 'venta')">
            <div class="mb-3">
                <label for="ruc" class="form-label">RUC</label>
                <input type="text" class="form-control" id="ruc" placeholder="RUC del cliente" required>
            </div>
            <div class="mb-3">
                <label for="nombre" class="form-label">Nombre</label>
                <input type="text" class="form-control" id="nombre" placeholder="Nombre del cliente" required>
            </div>
            <div class="mb-3">
                <label for="fecha" class="form-label">Fecha</label>
                <input type="date" class="form-control" id="fecha" required>
            </div>
            <div class="mb-3">
                <label for="monto" class="form-label">Monto</label>
                <div class="input-group">
                    <span class="input-group-text">₲</span>
                    <input type="number" class="form-control" id="monto" placeholder="Monto de la venta" value="0" required>
                </div>
            </div>
            <div class="mb-3">
                <label for="timbrado" class="form-label">Timbrado</label>
                <input type="number" class="form-control" id="timbrado" placeholder="Número de timbrado" required>
            </div>
            <div class="mb-3">
                <label for="factura" class="form-label">N° Factura</label>
                <input type="number" class="form-control" id="factura" placeholder="Número de factura" required>
            </div>
            <div class="mb-3">
                <label for="customFile" class="form-label">Subir Factura</label>
                <input type="file" class="form-control" id="customFile">
            </div>
            <button type="submit" class="btn btn-primary">Subir</button>
            <button type="reset" class="btn btn-outline-secondary">Limpiar</button>
        </form>
    `;
}

// Submit form data
async function submitForm(event, type) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    try {
        const response = await fetch(`/api/invoices/${type}`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Factura cargada exitosamente');
            bootstrap.Modal.getInstance(document.getElementById('invoiceModal')).hide();
            await fetchInvoices(); // Refresh the table
        } else {
            alert('Error al cargar la factura');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('Error al cargar la factura');
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    fetchInvoices();
    document.getElementById('filterInput').addEventListener('input', renderTable);
});