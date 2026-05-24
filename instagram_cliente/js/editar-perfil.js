function getUrlBase() {
    const urlSalva = localStorage.getItem('api_url');
    return urlSalva;
}

const token = localStorage.getItem('token');
if (!token) window.location.href = '/html/login.html';

let usuario = JSON.parse(localStorage.getItem('usuario'));

const usuarioLogado = JSON.parse(localStorage.getItem('usuario'));
if (usuarioLogado && usuarioLogado.usuario === 'admin') {
    const linkAdmin = document.getElementById('link-admin');
    if (linkAdmin) linkAdmin.style.display = 'inline';
}

document.getElementById('edit-nome').value = usuario.nome || '';
document.getElementById('edit-email').value = usuario.email || '';
document.getElementById('edit-usuario').value = usuario.usuario || '';
document.getElementById('edit-bio').value = usuario.biografia || '';
document.getElementById('edit-foto').value = usuario.foto || '';

document.getElementById('form-perfil').addEventListener('submit', async (e) => {
    e.preventDefault();

    const dadosAtualizados = {
        nome: document.getElementById('edit-nome').value,
        email: document.getElementById('edit-email').value,
        usuario: document.getElementById('edit-usuario').value,
        biografia: document.getElementById('edit-bio').value,
        foto: document.getElementById('edit-foto').value
    };

    const campoSenha = document.getElementById('edit-senha').value;
    if (campoSenha.trim() !== "") {
        dadosAtualizados.senha = campoSenha;
    }

    console.log("REQUEST ATUALIZAR (Enviado para o Java):");
    console.log(JSON.stringify(dadosAtualizados, null, 2));

    try {
        const urlFinal = `${getUrlBase()}/usuarios/${usuario.id}`;

        const resposta = await fetch(urlFinal, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(dadosAtualizados)
        });

        let json = {};
        try { json = await resposta.json(); } catch(e) {}
        
        console.log(`RESPONSE ATUALIZAR (Status: ${resposta.status}):`);
        console.log(JSON.stringify(json, null, 2));

        if (resposta.status === 200) {
            if (dadosAtualizados.usuario !== usuario.usuario) {
                mostrarMensagem('Nome de usuário alterado! Você precisa fazer login novamente.', 'sucesso');
                setTimeout(() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('usuario');
                    window.location.href = '/html/login.html';
                }, 2500);
                return;
            }

            const { senha, ...dadosSemSenha } = dadosAtualizados;
            const usuarioSeguro = { ...usuario, ...dadosSemSenha, id: usuario.id };
            localStorage.setItem('usuario', JSON.stringify(usuarioSeguro));

            mostrarMensagem('Perfil atualizado com sucesso!', 'sucesso');

            setTimeout(() => {
                window.location.href = '/html/perfil.html';
            }, 1000);
        } else {
            mostrarMensagem(json.mensagem || 'Erro ao atualizar dados.', 'erro');
        }
    } catch (error) {
        mostrarMensagem('Erro ao conectar com o servidor.', 'erro');
    }
});

async function deletarConta() {
    const confirmacao = confirm("Tem certeza que deseja deletar sua conta? Esta ação NÃO pode ser desfeita.");
    if (!confirmacao) return;

    try {
        const urlFinal = `${getUrlBase()}/usuarios/${usuario.id}`;
        
        console.log(`REQUEST DELETAR (Enviado para o Java): DELETE ${urlFinal}`);

        const resposta = await fetch(urlFinal, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        let json = {};
        if (resposta.status !== 204) {
            try { json = await resposta.json(); } catch(e) {}
        }

        console.log(`RESPONSE DELETAR (Status: ${resposta.status}):`);
        console.log(JSON.stringify(json, null, 2));

        if (resposta.status === 200 || resposta.status === 204) {
            alert("Sua conta foi deletada com sucesso.");
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');

            window.location.href = '/html/login.html';
        } else {
            mostrarMensagem(json.mensagem || 'Erro ao deletar conta.', 'erro');
        }
    } catch (error) {
        console.error("ERRO NO JAVASCRIPT:", error);
        mostrarMensagem('Erro ao conectar com o servidor.', 'erro');
    }
}

function mostrarMensagem(texto, tipo) {
    const msgDiv = document.getElementById('mensagem');
    msgDiv.innerText = texto;
    msgDiv.className = tipo;
}

async function fazerLogout() {
    const token = localStorage.getItem('token');

    if(token) {
        console.log("REQUEST LOGOUT (Enviado para o Java)");

        try {
            const urlFinal = `${getUrlBase()}/usuarios/logout`;

            const resposta = await fetch(urlFinal, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`}

            });

            let json = {};
            if (resposta.status !== 204) {
                try { json = await resposta.json(); } catch(e) {}
            }

            console.log(`RESPONSE LOGOUT (Status: ${resposta.status}):`);
            console.log(JSON.stringify(json, null, 2));

        } catch (error) {
            console.error("ERRO NO LOGOUT:", error);
        }
    } else {
        console.warn("Nenhum refresh token encontrado! Pulando o fetch pro Java...");
    }

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/html/login.html';
}