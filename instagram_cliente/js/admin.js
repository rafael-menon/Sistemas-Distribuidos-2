const API_URL = localStorage.getItem('api_url');
    if (!API_URL) window.location.href = '/html/conectar.html';

    const token = localStorage.getItem('token');

    const usuarioLogado = JSON.parse(localStorage.getItem('usuario'));

    if (!usuarioLogado || usuarioLogado.usuario !== 'admin') {
        window.location.href = '/html/feed.html';
    }

    let idEditando = null;

    function mostrarMensagem(texto, tipo) {
        const msgDiv = document.getElementById('mensagem');
        msgDiv.innerText = texto; msgDiv.className = tipo;
        setTimeout(() => msgDiv.innerText = '', 4000);
    }

    async function carregarLista() {
        console.log("REQUEST OBTER LISTA (Enviado para o servidor):");
       
        try {
            const resposta = await fetch(`${API_URL}/usuarios`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            const json = await resposta.json();

            console.log(`RESPONSE OBTER LISTA (Status: ${resposta.status}):`);
            console.log(JSON.stringify(json, null, 2));
            
            if (resposta.status === 200) {
                console.log(json);
                const listaUsuarios = json.dados.usuarios;
                desenharTabela(listaUsuarios);
            } else {
                mostrarMensagem('Erro ao carregar lista.', 'erro');
            }
        } catch (error) {
            console.log(error);
            mostrarMensagem('Erro de conexão.', 'erro');
        }
    }

   function desenharTabela(dadosUsuarios) {
    const corpo = document.getElementById('corpo-tabela');
    corpo.innerHTML = ''; 

    const usuarios = dadosUsuarios ? Object.values(dadosUsuarios) : [];

    if (usuarios.length === 0) {
        corpo.innerHTML = '<tr><td colspan="5" style="text-align: center;">Nenhum usuário encontrado.</td></tr>';
        return;
    }   

    for (const u of usuarios) {
        const isMimMesmo = u.usuario === 'admin';
        
        const botoes = isMimMesmo 
            ? `<i>Administrador</i>` 
            : `<button class="btn-pequeno btn-edit" onclick="abrirEdicao('${u.id}', '${u.nome}', '${u.usuario}', '${u.email}')">Editar</button>
               <button class="btn-pequeno btn-del" onclick="deletarUsuario('${u.id}', '${u.usuario}')">Deletar</button>`;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${u.id}</td>
            <td>${u.nome}</td>
            <td>@${u.usuario}</td>
            <td>${u.email}</td>
            <td>${botoes}</td>
        `;
        corpo.appendChild(tr);
    }
}

    function abrirEdicao(id, nome, usuario, email) {
        idEditando = id;
        document.getElementById('id-alvo').innerText = id;
        document.getElementById('edit-nome').value = nome;
        document.getElementById('edit-usuario').value = usuario;
        document.getElementById('edit-email').value = email;
        
        document.getElementById('modal-edicao').style.display = 'block';
        window.scrollTo(0, document.body.scrollHeight); 
    }

    function fecharEdicao() {
        idEditando = null;
        document.getElementById('modal-edicao').style.display = 'none';
    }

    async function salvarEdicao() {
        const dadosAtualizados = {
            nome: document.getElementById('edit-nome').value,
            usuario: document.getElementById('edit-usuario').value,
            email: document.getElementById('edit-email').value
        };

        try {
            const resposta = await fetch(`${API_URL}/usuarios/${idEditando}`, {
                method: 'PATCH', 
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(dadosAtualizados)
            });

            if (resposta.status === 200) {
                mostrarMensagem('Usuário atualizado com sucesso!', 'sucesso');
                fecharEdicao();
                carregarLista(); 
            } else {
                const json = await resposta.json();
                mostrarMensagem(json.mensagem || 'Erro ao atualizar.', 'erro');
            }
        } catch (error) { mostrarMensagem('Erro de conexão.', 'erro'); }
    }

    async function deletarUsuario(id, nomeUsuario) {
        const confirmacao = confirm(`ATENÇÃO: Deseja apagar a conta de @${nomeUsuario} (ID: ${id}) para sempre?`);
        if (!confirmacao) return;

        console.log(`REQUEST DELETAR (Enviado para o Java): DELETE ${urlFinal}`);

        try {
            const resposta = await fetch(`${API_URL}/usuarios/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            console.log(`RESPONSE DELETAR (Status: ${resposta.status}):`);

            if (resposta.status === 200 || resposta.status === 204) {
                mostrarMensagem('Usuário deletado do sistema.', 'sucesso');
                fecharEdicao(); 
                carregarLista(); 
            } else {
                let json = {};
                if (resposta.status !== 204) json = await resposta.json();
                mostrarMensagem(json.mensagem || 'Erro ao deletar.', 'erro');
            }
        } catch (error) { mostrarMensagem('Erro de conexão.', 'erro'); }
    }

carregarLista();