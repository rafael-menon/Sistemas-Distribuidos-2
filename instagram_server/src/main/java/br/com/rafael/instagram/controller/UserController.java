package br.com.rafael.instagram.controller;

import br.com.rafael.instagram.dto.ApiResponse;
import br.com.rafael.instagram.dto.UserDto;
import br.com.rafael.instagram.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/usuarios")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UserDto.RegisterResponse>> register(@Valid @RequestBody UserDto.RegisterRequest request) {
        UserDto.RegisterResponse dados = userService.registrar(request);

        return ResponseEntity.ok(ApiResponse.sucesso("USUARIO_CRIADO", "Usuário cadastrado com sucesso!", dados));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, List<UserDto.UserSummary>>>> list() {
        List<UserDto.UserSummary> usuarios = userService.listar();

        Map<String, List<UserDto.UserSummary>> dados = Map.of("usuarios", usuarios);

        return ResponseEntity.ok(
                ApiResponse.sucesso("LISTAGEM_SUCESSO", "Usuários listados com sucesso", dados)
        );
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDto.UpdateRequest>> update(
            @PathVariable String id,
            @Valid @RequestBody UserDto.UpdateRequest request) {

        UserDto.UpdateRequest dados = userService.atualizar(id, request);

        return ResponseEntity.ok(
                ApiResponse.sucesso("USUARIO_ATUALIZADO", "Usuário atualizado com sucesso", dados)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        userService.deletar(id);

        return ResponseEntity.ok(
                ApiResponse.sucesso("OPERACAO_SUCESSO", "Usuário deletado com sucesso", null)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDto.UserResponse>> findById(@PathVariable String id) {
        UserDto.UserResponse dados = userService.buscarPorId(id);

        return ResponseEntity.ok(
                ApiResponse.sucesso("BUSCA_SUCESSO", "Usuário encontrado com sucesso", dados)
        );
    }
}
