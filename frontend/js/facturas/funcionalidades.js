//Funciona para poder hacer 
function toggleForm(type) {
    const formCompra = document.getElementById('formCompra');
    const formVenta = document.getElementById('formVenta');
    const buttons = document.querySelectorAll('.btn-toggle');
    
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
