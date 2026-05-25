if (getToken()) {
    window.location.href = "/html/feed.html";
}

function toggleForms() {
    document.getElementById("login-section").classList.toggle("hidden");
    document.getElementById("register-section").classList.toggle("hidden");
    document.getElementById("mensagem").innerText = "";
}

document
    .getElementById("form-register")
    .addEventListener("submit", async (e) => {
        e.preventDefault();

        register();
    });

document.getElementById("form-login").addEventListener("submit", async (e) => {
    e.preventDefault();

    login();
});

function voltarParaConectar() {
    localStorage.removeItem("api_url");

    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    window.location.href = "/html/conectar.html";
}
