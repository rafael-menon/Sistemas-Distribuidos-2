package br.com.rafael.instagram.service;

import br.com.rafael.instagram.dto.UserDto;
import br.com.rafael.instagram.exception.CredenciaisInvalidasException;
import br.com.rafael.instagram.entity.Usuario;
import br.com.rafael.instagram.exception.RegraNegocioException;
import br.com.rafael.instagram.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public UserDto.LoginResponse realizarLogin(UserDto.LoginRequest request) {

        Usuario usuario = repository.findByUsuario(request.usuario())
                .orElseThrow(() -> new CredenciaisInvalidasException("Usuário ou senha incorretos"));

        if (!passwordEncoder.matches(request.senha(), usuario.getSenha())) {
            throw new CredenciaisInvalidasException("Usuário ou senha incorretos");
        }

        String tokenJwt = jwtService.gerarToken(usuario);
        repository.save(usuario);

        UserDto.LoginUserSummary dadosUsuario = new UserDto.LoginUserSummary(
                usuario.getId().toString(),
                usuario.getNome(),
                usuario.getUsuario(),
                usuario.getEmail()
        );

        return new UserDto.LoginResponse(tokenJwt, dadosUsuario);
    }

//    public UserDto.LoginResponse atualizarToken(String refreshTokenAntigo) {
//
//        Usuario usuario = repository.findByRefreshToken(refreshTokenAntigo)
//                .orElseThrow(() -> new RegraNegocioException("Refresh token inválido ou expirado. Faça login novamente."));
//
//        String novoTokenJwt = jwtService.gerarToken(usuario);
//
//        UserDto.LoginUserSummary dadosUsuario = new UserDto.LoginUserSummary(
//                usuario.getId().toString(),
//                usuario.getNome(),
//                usuario.getEmail()
//        );
//
//        return new UserDto.LoginResponse(novoTokenJwt, refreshTokenAntigo, dadosUsuario);
//    }

//    public void invalidarRefreshToken(String refreshToken) {
//        System.out.println("--- LOGOUT: Token recebido: [" + refreshToken + "]");
//
//        Optional<Usuario> usuarioOpt = repository.findByRefreshToken(refreshToken);
//
//        if (usuarioOpt.isPresent()) {
//            Usuario usuario = usuarioOpt.get();
//            System.out.println("--- LOGOUT: Usuário encontrado: " + usuario.getUsuario());
//
//            usuario.setRefreshToken(null);
//
//            repository.save(usuario);
//        }
//    }
}