checkToken();

const usuarioBasico = getUsuario();

checkIfAdmin();

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
                'Authorization': `Bearer ${getToken()}`
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
            document.getElementById('view-foto').src = usuarioCompleto.foto || '';

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