const tokenSalvo = localStorage.getItem('token');

if (tokenSalvo) {
    window.location.href = '/html/feed.html';
}

function getUrlBase() {
    const urlSalva = localStorage.getItem('api_url');
    return urlSalva;
}

function toggleForms() {
    document.getElementById('login-section').classList.toggle('hidden');
    document.getElementById('register-section').classList.toggle('hidden');
    document.getElementById('mensagem').innerText = '';
}

function mostrarMensagem(texto, tipo) {
    const msgDiv = document.getElementById('mensagem');
    msgDiv.innerText = texto;
    msgDiv.className = tipo;
}

document.getElementById('form-register').addEventListener('submit', async (e) => {
    e.preventDefault();

    const dados = {
        nome: document.getElementById('reg-nome').value,
        email: document.getElementById('reg-email').value,
        usuario: document.getElementById('reg-usuario').value,
        senha: document.getElementById('reg-senha').value,
        biografia: document.getElementById('reg-bio').value,
        foto: ""      
    };

    console.log("REQUEST CADASTRO (Enviado para o Java):");
    console.log(JSON.stringify(dados, null, 2));

    try {
        const urlFinal = `${getUrlBase()}/usuarios`;

        const resposta = await fetch(urlFinal, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        const json = await resposta.json();

        console.log(`RESPONSE CADASTRO (Status: ${resposta.status}):`);
        console.log(JSON.stringify(json, null, 2));

        if (resposta.status === 201) {
            mostrarMensagem('Cadastro realizado com sucesso! Faça login.', 'sucesso');
            setTimeout(toggleForms, 2000);
        } else {
            mostrarMensagem(json.mensagem || 'Erro ao realizar cadastro.', 'erro');
        }
    } catch (error) {
        console.error("ERRO NO JAVASCRIPT (Cadastro):", error);
        mostrarMensagem('Erro ao conectar com o servidor.', 'erro');
    }
});

document.getElementById('form-login').addEventListener('submit', async (e) => {
    e.preventDefault();

    const dados = {
        usuario: document.getElementById('login-usuario').value,
        senha: document.getElementById('login-senha').value
    };

    console.log("REQUEST LOGIN (Enviado para o servidor):");
    console.log(JSON.stringify(dados, null, 2));

    try {
        const urlFinal = `${getUrlBase()}/usuarios/login`;

        const resposta = await fetch(urlFinal, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        const json = await resposta.json();

        console.log(`RESPONSE LOGIN (Status: ${resposta.status}):`);
        console.log(JSON.stringify(json, null, 2));

        if (resposta.status === 200) {
            localStorage.setItem('token', json.dados.token);
            localStorage.setItem('usuario', JSON.stringify(json.dados.usuario));

            window.location.href = '/html/feed.html';
        } else {
            mostrarMensagem(json.mensagem || 'Usuário ou senha incorretos.', 'erro');
        }
    } catch (error) {
        console.error("ERRO NO JAVASCRIPT (Login):", error);
        mostrarMensagem('Erro ao conectar com o servidor.', 'erro');
    }
});

function voltarParaConectar() {
    localStorage.removeItem('api_url');
    
    localStorage.removeItem('token'); 
    localStorage.removeItem('usuario'); 

    window.location.href = '/html/conectar.html'; 
}