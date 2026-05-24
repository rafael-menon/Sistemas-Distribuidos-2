package br.com.rafael.instagram.repository;

import br.com.rafael.instagram.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UsuarioRepository extends JpaRepository<Usuario, UUID> {
    boolean existsByEmail(String email);

    boolean existsByUsuario(String usuario);

    Optional<Usuario> findByUsuario(String usuario);

    List<Usuario> findAll();
}