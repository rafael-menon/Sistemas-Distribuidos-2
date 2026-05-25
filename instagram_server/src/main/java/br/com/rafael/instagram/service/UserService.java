package br.com.rafael.instagram.service;

import br.com.rafael.instagram.dto.UserDto;
import br.com.rafael.instagram.entity.Usuario;
import br.com.rafael.instagram.exception.RegraNegocioException;
import br.com.rafael.instagram.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public UserDto.RegisterResponse registrar(UserDto.RegisterRequest request) {
        if (repository.existsByEmail(request.email())) {
            throw new RegraNegocioException("E-mail já cadastrado");
        }

        if (repository.existsByUsuario(request.usuario())) {
            throw new RegraNegocioException("Usuário já cadastrado");
        }

        if(request.usuario().equals("admin")) {
            throw new RegraNegocioException("Usuário reservado");
        }

        Usuario novo = new Usuario();
        novo.setNome(request.nome());
        novo.setEmail(request.email());
        novo.setUsuario(request.usuario());

        novo.setSenha(passwordEncoder.encode(request.senha()));

        novo.setBiografia(request.biografia());
        novo.setFoto(request.foto());

        Usuario salvo = repository.save(novo);

        return new UserDto.RegisterResponse(
                salvo.getId().toString(),
                salvo.getNome(),
                salvo.getEmail(),
                salvo.getUsuario()
        );
    }

    public List<UserDto.UserSummary> listar() {
        List<Usuario> usuarios = repository.findAll();

        return usuarios.stream()
                .map(u -> new UserDto.UserSummary(
                        u.getId().toString(),
                        u.getNome(),
                        u.getEmail(),
                        u.getUsuario()
                ))
                .collect(Collectors.toList());
    }

    public UserDto.UpdateRequest atualizar(String id, UserDto.UpdateRequest request) {
        UUID uuid = UUID.fromString(id);

        verificarPermissao(uuid);

        Usuario usuario = repository.findById(uuid)
                .orElseThrow(() -> new RegraNegocioException("Usuário não encontrado"));

        if (request.email() != null && !usuario.getEmail().equals(request.email())) {
            if (repository.existsByEmail(request.email())) {
                throw new RegraNegocioException("E-mail já está em uso por outra conta");
            }
            usuario.setEmail(request.email());
        }

        if (request.usuario() != null && !usuario.getUsuario().equals(request.usuario())) {
            if (usuario.getUsuario().equals("admin")) {
                throw new RegraNegocioException("O administrador principal não pode alterar o próprio nome de usuário.");
            }

            if (repository.existsByUsuario(request.usuario())) {
                throw new RegraNegocioException("Nome de usuário já está em uso");
            }
            usuario.setUsuario(request.usuario());
        }

        if(request.biografia() != null && !request.biografia().equals(usuario.getBiografia())) {
            usuario.setBiografia(request.biografia());
        }

        if (request.nome() != null) {
            usuario.setNome(request.nome());
        }

        if (request.senha() != null && !request.senha().trim().isEmpty()) {
            usuario.setSenha(passwordEncoder.encode(request.senha()));
        }

        Usuario salvo = repository.save(usuario);

        return new UserDto.UpdateRequest(
                salvo.getId().toString(),
                salvo.getNome(),
                salvo.getEmail(),
                salvo.getBiografia(),
                salvo.getUsuario()
        );
    }

    public void deletar(String id) {
        UUID uuid = UUID.fromString(id);

        verificarPermissao(uuid);

        Usuario usuario = repository.findById(uuid)
                .orElseThrow(() -> new RegraNegocioException("Usuário não encontrado"));

        if (usuario.getUsuario().equals("admin")) {
            throw new RegraNegocioException("A conta do administrador principal não pode ser deletada.");
        }

        usuario.setAtivo(false);
        repository.save(usuario);
    }

    public UserDto.UserResponse buscarPorId(String id) {
        UUID uuid = UUID.fromString(id);

        Usuario usuario = repository.findById(uuid)
                .orElseThrow(() -> new RegraNegocioException("Usuário não encontrado"));

        return new UserDto.UserResponse(
                usuario.getId().toString(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getUsuario(),
                usuario.getBiografia(),
                usuario.getFoto()
        );
    }

    private void verificarPermissao(UUID uuid) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuarioLogado = (Usuario) auth.getPrincipal();

        boolean isAdmin = usuarioLogado.getUsuario().equals("admin");
        boolean isDonoDaConta = usuarioLogado.getId().equals(uuid);

        if (!isAdmin && !isDonoDaConta) {
            throw new RegraNegocioException("Você não tem permissão para alterar os dados de outro usuário.");
        }
    }
}
