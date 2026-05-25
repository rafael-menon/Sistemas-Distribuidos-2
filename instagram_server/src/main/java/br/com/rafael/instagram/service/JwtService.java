package br.com.rafael.instagram.service;

import br.com.rafael.instagram.entity.Usuario;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class JwtService {
    private static final String SECRET_KEY = "ninguem_vai_adivinhar";

    public String gerarToken(Usuario usuario) {
        Algorithm algoritmo = Algorithm.HMAC256(SECRET_KEY);
        return JWT.create()
                .withIssuer("rafael-api")
                .withSubject(usuario.getUsuario())
                .withIssuedAt(Instant.now())
                .withExpiresAt(gerarDataExpiracao())
                .sign(algoritmo);
    }

    public String validarToken(String token) {
        try {
            Algorithm algoritmo = Algorithm.HMAC256(SECRET_KEY);

            return JWT.require(algoritmo)
                    .withIssuer("rafael-api")
                    .build()
                    .verify(token)
                    .getSubject();

        } catch (JWTVerificationException exception) {
            return null;
        }
    }

    private Instant gerarDataExpiracao() {
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }
}