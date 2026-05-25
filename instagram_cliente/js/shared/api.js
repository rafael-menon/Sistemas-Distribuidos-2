function getUrlBase() {
    return localStorage.getItem("api_url");
}

function getToken() {
    return localStorage.getItem("token");
}

function getUsuario() {
    return JSON.parse(localStorage.getItem("usuario"));
}

function checkToken() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/html/login.html";
    }
}
