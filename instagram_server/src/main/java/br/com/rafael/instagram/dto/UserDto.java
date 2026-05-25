package br.com.rafael.instagram.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;

import java.util.List;

public class UserDto {
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record LoginRequest(
            @NotBlank(message = "O campo usuário é obrigatório")
            String usuario,

            @NotBlank(message = "O campo senha é obrigatório")
            String senha
    ) {}

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record LoginUserSummary(
            String id,
            String nome,
            String email
    ) {}

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record LoginResponse(
            String token,
            LoginUserSummary usuario
    ) {}

    public record LogoutRequest() {}

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record RegisterRequest(
            @NotBlank(message = "O campo nome é obrigatório")
            @Size(min = 3, max = 60, message = "O nome deve ter entre 3 e 60 caracteres")
            @Pattern(regexp = "^[A-Za-zÀ-ÿ\\s]+$", message = "O nome deve conter apenas letras e espaços")
            String nome,

            @NotBlank(message = "O campo e-mail é obrigatório")
            @Email(message = "O formato do e-mail é inválido")
            @Size(min = 10, max = 35, message = "O e-mail deve ter entre 10 e 35 caracteres")
            String email,

            @NotBlank(message = "O campo usuário é obrigatório")
            @Size(min = 3, max = 30, message = "O usuário deve ter entre 3 e 30 caracteres")
            @Pattern(regexp = "^[a-z0-9_]+$", message = "O usuário deve conter apenas letras minúsculas, números e underline")
            String usuario,

            @NotBlank(message = "O campo senha é obrigatório")
            @Size(min = 8, max = 24, message = "A senha deve ter entre 8 e 24 caracteres")
            @Pattern(regexp = "^[A-Za-z0-9]+$", message = "A senha deve conter apenas letras e números")
            String senha,

            @Size(max = 150, message = "A biografia deve ter no máximo 150 caracteres")
            String biografia,

            String foto
    ) {}

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record RegisterResponse(
            String id,
            String nome,
            String email,
            String usuario
    ) {}

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record UserSummary(
            String id,
            String nome,
            String email,
            String usuario
    ) {}

//    @JsonInclude(JsonInclude.Include.NON_NULL)
//    public record PaginatedUserResponse(
//            long total,
//            int pagina,
//            int limite,
//            List<UserSummary> usuarios
//    ) {}

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record UpdateRequest(
            @NotBlank(message = "O campo nome é obrigatório")
            @Size(min = 3, max = 60, message = "O nome deve ter entre 3 e 60 caracteres")
            @Pattern(regexp = "^[A-Za-zÀ-ÿ\\s]+$", message = "O nome deve conter apenas letras e espaços")
            String nome,

            @NotBlank(message = "O campo e-mail é obrigatório")
            @Email(message = "O formato do e-mail é inválido")
            @Size(min = 10, max = 35, message = "O e-mail deve ter entre 10 e 35 caracteres")
            String email,

            @NotBlank(message = "O campo usuário é obrigatório")
            @Size(min = 3, max = 30, message = "O usuário deve ter entre 3 e 30 caracteres")
            @Pattern(regexp = "^[a-z0-9_]+$", message = "O usuário deve conter apenas letras minúsculas, números e underline")
            String usuario,

            @Size(max = 130, message = "A biografia deve ter no máximo 150 caracteres")
            String biografia,

            @Size(min = 8, max = 24, message = "A nova senha deve ter entre 8 e 24 caracteres")
            String senha
    ) {}

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record UserResponse(
            String id,

            String nome,

            String email,

            String usuario,

            String biografia,

            @JsonProperty("foto_url")
            String fotoUrl
    ) {}

//    @JsonInclude(JsonInclude.Include.NON_NULL)
//    public record RefreshTokenRequest(
//            @NotBlank(message = "O token de atualização é obrigatório")
//            @JsonProperty("refresh_token")
//            String refreshToken
//    ) {}

}