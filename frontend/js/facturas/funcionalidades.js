function toggleForm(type) {
    document.getElementById('formCompra').style.display = type === 'compra' ? 'block' : 'none';
    document.getElementById('formVenta').style.display = type === 'venta' ? 'block' : 'none';
}

function agregarFactura(tipo) {
    const form = tipo === 'compra' ? document.getElementById('formCompra') : document.getElementById('formVenta');
    const datos = Array.from(form.querySelectorAll('input')).map(input => input.value);
    const nuevaFila = `<tr>${datos.map(dato => `<td>${dato}</td>`).join('')}</tr>`;
    document.getElementById('facturaTableBody').insertAdjacentHTML('beforeend', nuevaFila);
    form.reset();
    var modal = bootstrap.Modal.getInstance(document.getElementById('facturaModal'));
    modal.hide();
}

document.getElementById('searchInput').addEventListener('keyup', function() {
    const valor = this.value.toLowerCase();
    document.querySelectorAll('#facturaTableBody tr').forEach(fila => {
        fila.style.display = fila.innerText.toLowerCase().includes(valor) ? '' : 'none';
    });
});