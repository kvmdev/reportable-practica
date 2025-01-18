const button = document.getElementById("button");

button.addEventListener("click", () => {
  const ruc = document.getElementById("ruc").value;
  const password = document.getElementById("password").value;


  Swal.fire({
    title: "Verificando...",
    text: "Por favor, espere mientras procesamos su información",
    didOpen: () => {
      Swal.showLoading(); 
    },
    allowOutsideClick: false, 
  });

  const body = JSON.stringify({
    password: password,
    ruc: ruc,
  });


  fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  })
    .then((response) => response.json())
    .then((data) => {
  
      Swal.close();
  
      if (data.token) {
        localStorage.setItem('jwt', data.token);
        Swal.fire({
          text: "Bienvenido",
          title: "Inicio de sesión correcto",
          icon: "success",
        }).then(() => {
       
          window.location.href = './index.html';  
        });
      } else {
        Swal.fire({
          text: data.message || "Credenciales incorrectas",
          title: "Inicio de sesión incorrecto",
          icon: "error",
        });
      }
    })
    .catch((error) => {
  
      Swal.close();
  
      Swal.fire({
        text: "Ocurrió un error al procesar su solicitud. Intente nuevamente.",
        title: "Error de conexión",
        icon: "error",
      });
      console.error("Error:", error);
    });
  });
  
