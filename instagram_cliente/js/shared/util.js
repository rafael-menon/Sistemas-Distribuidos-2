function mostrarMensagem(texto, tipo) {
    const msgDiv = document.getElementById("mensagem");
    msgDiv.innerText = texto;
    msgDiv.className = tipo;
}

function checkIfAdmin() {
    usuario = getUsuario();

    if (usuario && usuario.usuario === "admin") {
        const linkAdmin = document.getElementById("link-admin");
        if (linkAdmin) linkAdmin.style.display = "inline";
    }
}
