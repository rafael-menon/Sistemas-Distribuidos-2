async function register() {
    const dados = {
        nome: document.getElementById("reg-nome").value,
        email: document.getElementById("reg-email").value,
        usuario: document.getElementById("reg-usuario").value,
        senha: document.getElementById("reg-senha").value,
        biografia: document.getElementById("reg-bio").value,
        foto: "",
    };

    console.log("REQUEST CADASTRO (Enviado para o Java):");
    console.log(JSON.stringify(dados, null, 2));

    try {
        const urlFinal = `${getUrlBase()}/usuarios`;

        const resposta = await fetch(urlFinal, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados),
        });

        const json = await resposta.json();

        console.log(`RESPONSE CADASTRO (Status: ${resposta.status}):`);
        console.log(JSON.stringify(json, null, 2));

        if (resposta.status === 201) {
            mostrarMensagem(
                "Cadastro realizado com sucesso! Faça login.",
                "sucesso",
            );
            setTimeout(toggleForms, 2000);
        } else {
            mostrarMensagem(
                json.mensagem || "Erro ao realizar cadastro.",
                "erro",
            );
        }
    } catch (error) {
        console.error("ERRO NO JAVASCRIPT (Cadastro):", error);
        mostrarMensagem("Erro ao conectar com o servidor.", "erro");
    }
}

async function login() {
    const dados = {
        usuario: document.getElementById("login-usuario").value,
        senha: document.getElementById("login-senha").value,
    };

    console.log("REQUEST LOGIN (Enviado para o servidor):");
    console.log(JSON.stringify(dados, null, 2));

    try {
        const urlFinal = `${getUrlBase()}/usuarios/login`;

        const resposta = await fetch(urlFinal, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados),
        });

        const json = await resposta.json();

        console.log(`RESPONSE LOGIN (Status: ${resposta.status}):`);
        console.log(JSON.stringify(json, null, 2));

        if (resposta.status === 200) {
            localStorage.setItem("token", json.dados.token);
            localStorage.setItem("usuario", JSON.stringify(json.dados.usuario));

            window.location.href = "/html/feed.html";
        } else {
            mostrarMensagem(
                json.mensagem || "Usuário ou senha incorretos.",
                "erro",
            );
        }
    } catch (error) {
        console.error("ERRO NO JAVASCRIPT (Login):", error);
        mostrarMensagem("Erro ao conectar com o servidor.", "erro");
    }
}

async function logout() {
    console.log("REQUEST LOGOUT (Enviado para o Java)");

    try {
        const urlFinal = `${getUrlBase()}/usuarios/logout`;

        const resposta = await fetch(urlFinal, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
        });

        let json = {};
        if (resposta.status !== 204) {
            try {
                json = await resposta.json();
            } catch (e) {}
        }

        console.log(`RESPONSE LOGOUT (Status: ${resposta.status}):`);
        console.log(JSON.stringify(json, null, 2));
    } catch (error) {
        console.error("ERRO NO LOGOUT:", error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "/html/login.html";
}
