package br.com.rafael.instagram.controller;

import br.com.rafael.instagram.dto.ApiResponse;
import br.com.rafael.instagram.dto.UserDto;
import br.com.rafael.instagram.service.AuthService;
import br.com.rafael.instagram.service.JwtService;
import br.com.rafael.instagram.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/usuarios")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserDto.LoginResponse>> login(@Valid @RequestBody UserDto.LoginRequest request) {
        UserDto.LoginResponse dados = authService.realizarLogin(request);

        return ResponseEntity.ok(
                ApiResponse.sucesso("LOGIN_SUCESSO", "Login realizado com sucesso", dados)
        );
    }

//    @PostMapping("/refresh-token")
//    public ResponseEntity<ApiResponse<UserDto.LoginResponse>> refreshToken(@Valid @RequestBody UserDto.RefreshTokenRequest request) {
//
//        UserDto.LoginResponse dados = authService.atualizarToken(request.refreshToken());
//
//        return ResponseEntity.ok(
//                ApiResponse.sucesso("TOKEN_ATUALIZADO", "Token atualizado com sucesso", dados)
//        );
//    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {

        return ResponseEntity.ok(
                ApiResponse.sucesso("OPERACAO_SUCESSO", "Logout realizado com sucesso", null)
        );
    }
}