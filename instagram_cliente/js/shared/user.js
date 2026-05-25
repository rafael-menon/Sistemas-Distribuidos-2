async function obterDadosUsuario() {
    try {
        const usuarioBasico = getUsuario();

        if (!usuarioBasico || !usuarioBasico.id) {
            console.error("ID do usuário não encontrado no localStorage.");
            return;
        }

        const urlFinal = `${getUrlBase()}/usuarios/${usuarioBasico.id}`;

        console.log("REQUEST OBTER DADOS (Enviado para o servidor):");
        console.log(JSON.stringify(usuarioBasico.id, null, 2));

        const resposta = await fetch(urlFinal, {
            method: "GET",
            headers: { Authorization: `Bearer ${getToken()}` },
        });

        const json = await resposta.json();

        console.log(`RESPONSE OBTER DADOS (Status: ${resposta.status}):`);
        console.log(JSON.stringify(json, null, 2));

        if (resposta.status === 200) {
            const usuarioCompleto = json.dados || json;

            const usuarioAtualizado = { ...usuarioBasico, ...usuarioCompleto };
            localStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));

            if (usuarioAtualizado && usuarioAtualizado.usuario === "admin") {
                const linkAdmin = document.getElementById("link-admin");
                if (linkAdmin) linkAdmin.style.display = "inline";
            }
        } else if (resposta.status === 403) {
            console.warn("Sem permissão ou token expirado.");
            localStorage.clear();
            window.location.href = "/html/login.html";
        } else {
            console.error("Erro na busca:", json.mensagem);
        }
    } catch (error) {
        console.error(
            "Erro ao conectar com o servidor para puxar perfil:",
            error,
        );
    }
}

async function atualizarUsuario() {
    let usuario = getUsuario();

    const dadosAtualizados = {
        nome: document.getElementById("edit-nome").value,
        email: document.getElementById("edit-email").value,
        usuario: document.getElementById("edit-usuario").value,
        biografia: document.getElementById("edit-bio").value,
        foto: document.getElementById("edit-foto").value,
    };

    const campoSenha = document.getElementById("edit-senha").value;
    if (campoSenha.trim() !== "") {
        dadosAtualizados.senha = campoSenha;
    }

    console.log("REQUEST ATUALIZAR (Enviado para o Java):");
    console.log(JSON.stringify(dadosAtualizados, null, 2));

    try {
        const urlFinal = `${getUrlBase()}/usuarios/${usuario.id}`;

        const resposta = await fetch(urlFinal, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(dadosAtualizados),
        });

        let json = {};
        try {
            json = await resposta.json();
        } catch (e) {}

        console.log(`RESPONSE ATUALIZAR (Status: ${resposta.status}):`);
        console.log(JSON.stringify(json, null, 2));

        if (resposta.status === 200) {
            if (dadosAtualizados.usuario !== usuario.usuario) {
                mostrarMensagem(
                    "Nome de usuário alterado! Você precisa fazer login novamente.",
                    "sucesso",
                );
                setTimeout(() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("refreshToken");
                    localStorage.removeItem("usuario");
                    window.location.href = "/html/login.html";
                }, 2500);
                return;
            }

            const { senha, ...dadosSemSenha } = dadosAtualizados;
            const usuarioSeguro = {
                ...usuario,
                ...dadosSemSenha,
                id: usuario.id,
            };
            localStorage.setItem("usuario", JSON.stringify(usuarioSeguro));

            mostrarMensagem("Perfil atualizado com sucesso!", "sucesso");

            setTimeout(() => {
                window.location.href = "/html/perfil.html";
            }, 1000);
        } else {
            mostrarMensagem(
                json.mensagem || "Erro ao atualizar dados.",
                "erro",
            );
        }
    } catch (error) {
        mostrarMensagem("Erro ao conectar com o servidor.", "erro");
    }
}

async function deletarConta() {
    const confirmacao = confirm(
        "Tem certeza que deseja deletar sua conta? Esta ação NÃO pode ser desfeita.",
    );
    if (!confirmacao) return;

    try {
        const urlFinal = `${getUrlBase()}/usuarios/${usuario.id}`;

        console.log(
            `REQUEST DELETAR (Enviado para o Java): DELETE ${urlFinal}`,
        );

        const resposta = await fetch(urlFinal, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${getToken()}` },
        });

        let json = {};
        if (resposta.status !== 204) {
            try {
                json = await resposta.json();
            } catch (e) {}
        }

        console.log(`RESPONSE DELETAR (Status: ${resposta.status}):`);
        console.log(JSON.stringify(json, null, 2));

        if (resposta.status === 200 || resposta.status === 204) {
            alert("Sua conta foi deletada com sucesso.");
            localStorage.removeItem("token");
            localStorage.removeItem("usuario");

            window.location.href = "/html/login.html";
        } else {
            mostrarMensagem(json.mensagem || "Erro ao deletar conta.", "erro");
        }
    } catch (error) {
        console.error("ERRO NO JAVASCRIPT:", error);
        mostrarMensagem("Erro ao conectar com o servidor.", "erro");
    }
}
