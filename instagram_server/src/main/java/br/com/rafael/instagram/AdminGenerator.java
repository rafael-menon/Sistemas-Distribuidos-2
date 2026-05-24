package br.com.rafael.instagram;

import br.com.rafael.instagram.entity.Usuario;
import br.com.rafael.instagram.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminGenerator implements CommandLineRunner {
    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;

    public AdminGenerator(UsuarioRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (repository.findByUsuario("admin").isEmpty()) {

            Usuario admin = new Usuario();
            admin.setNome("Admin");
            admin.setUsuario("admin");
            admin.setEmail("admin@admin.com");
            admin.setBiografia("Sou o admin do sistema!");

            admin.setSenha(passwordEncoder.encode("admin123"));

            repository.save(admin);
            System.out.println("Usuário admin criado! (Login: admin / Senha: admin123)");
        } else {
            System.out.println("Usuário admin já existe no banco. Tudo certo!");
        }
    }
}