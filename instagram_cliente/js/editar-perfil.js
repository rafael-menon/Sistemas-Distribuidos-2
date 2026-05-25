checkToken();

let usuario = getUsuario();

checkIfAdmin();

document.getElementById("edit-nome").value = usuario.nome || "";
document.getElementById("edit-email").value = usuario.email || "";
document.getElementById("edit-usuario").value = usuario.usuario || "";
document.getElementById("edit-bio").value = usuario.biografia || "";
document.getElementById("edit-foto").value = usuario.foto || "";

document.getElementById("form-perfil").addEventListener("submit", async (e) => {
    e.preventDefault();

    atualizarUsuario();
});
