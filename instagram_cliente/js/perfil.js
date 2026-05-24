function getUrlBase() {
    const urlSalva = localStorage.getItem('api_url');
    return urlSalva;
}

const token = localStorage.getItem('token');
if (!token) window.location.href = '/html/login.html';

const usuarioBasico = JSON.parse(localStorage.getItem('usuario'));

if (usuarioBasico && usuarioBasico.usuario === 'admin') {
    const linkAdmin = document.getElementById('link-admin');
    if (linkAdmin) linkAdmin.style.display = 'inline';
}

async function carregarDadosCompletos() {
    try {
        if (!usuarioBasico || !usuarioBasico.id) {
            console.error("ID do usuário não encontrado na memória.");
            return;
        }

        const urlFinal = `${getUrlBase()}/usuarios/${usuarioBasico.id}`;

        console.log("REQUEST OBTER DADOS (Enviado para o servidor):");
        console.log(JSON.stringify(usuarioBasico.id, null, 2));

        const resposta = await fetch(urlFinal, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (resposta.status === 403) {
            console.warn("Sessão expirada ou usuário alterado. Refazendo login.");
            localStorage.clear();
            window.location.href = '/html/login.html';
            return;
        }

        const json = await resposta.json();

        console.log(`RESPONSE OBTER DADOS (Status: ${resposta.status}):`);
        console.log(JSON.stringify(json, null, 2));

        if (resposta.status === 200) {
            const usuarioCompleto = json.dados || json;

            document.getElementById('view-usuario').innerText = usuarioCompleto.usuario || 'usuario_desconhecido';
            document.getElementById('view-nome').innerText = usuarioCompleto.nome || '';
            document.getElementById('view-bio').innerText = usuarioCompleto.biografia || 'Nenhuma biografia adicionada.';
            //document.getElementById('view-foto').src = usuarioCompleto.foto || 'https://via.placeholder.com/150?text=Sem+Foto';

            const usuarioAtualizado = { ...usuarioBasico, ...usuarioCompleto };
            localStorage.setItem('usuario', JSON.stringify(usuarioAtualizado));
        } else {
            console.error("Erro na busca:", json.mensagem);
        }
    } catch (error) {
        console.error("Erro ao carregar o perfil completo:", error);
    }
}

if (usuarioBasico && usuarioBasico.id) {
    carregarDadosCompletos();
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