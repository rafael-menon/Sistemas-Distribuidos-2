package br.com.rafael.instagram.exception;

import br.com.rafael.instagram.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> tratarErroDeValidacao(MethodArgumentNotValidException ex) {

        String mensagensDeErro = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(erro -> erro.getDefaultMessage())
                .collect(Collectors.joining("; "));

        ApiResponse<Object> resposta = new ApiResponse<>(
                "erro",
                "DADOS_INCOMPLETOS",
                "Dados inválidos: " + mensagensDeErro,
                new HashMap<>()
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resposta);
    }

    @ExceptionHandler(RegraNegocioException.class)
    public ResponseEntity<ApiResponse<Object>> tratarRegraDeNegocio(RegraNegocioException ex) {

        ApiResponse<Object> resposta = new ApiResponse<>(
                "erro",
                "CONFLITO_DADOS",
                ex.getMessage(),
                new HashMap<>()
        );

        return ResponseEntity.status(HttpStatus.CONFLICT).body(resposta);
    }

    @ExceptionHandler(CredenciaisInvalidasException.class)
    public ResponseEntity<ApiResponse<Object>> tratarCredenciaisInvalidas(CredenciaisInvalidasException ex) {
        ApiResponse<Object> resposta = new ApiResponse<>(
                "erro",
                "CREDENCIAIS_INVALIDAS",
                ex.getMessage(),
                new java.util.HashMap<>()
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(resposta);
    }
}