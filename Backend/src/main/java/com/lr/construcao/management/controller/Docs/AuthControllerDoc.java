package com.lr.construcao.management.controller.Docs;

import com.lr.construcao.management.dto.security.AccountCredentialsDTO;
import com.lr.construcao.management.dto.security.TokenDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

@Tag(name = "Authentication", description = "Endpoints para autenticação e gestão de tokens")
public interface AuthControllerDoc {

    @Operation(
            summary = "Autenticar usuário",
            description = "Valida as credenciais (login/senha) e retorna um token JWT de acesso.",
            tags = {"Authentication"},
            responses = {
                    @ApiResponse(
                            description = "Success",
                            responseCode = "200",
                            content = @Content(schema = @Schema(implementation = TokenDTO.class))
                    ),
                    @ApiResponse(
                            description = "Forbidden (Invalid client request)",
                            responseCode = "403",
                            content = @Content(schema = @Schema(implementation = String.class, example = "Invalid client request!"))
                    ),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<?> signin(AccountCredentialsDTO credentials);

    @Operation(
            summary = "Atualizar Token (Refresh)",
            description = "Gera um novo token de acesso utilizando um refresh token válido.",
            tags = {"Authentication"},
            responses = {
                    @ApiResponse(
                            description = "Success",
                            responseCode = "200",
                            content = @Content(schema = @Schema(implementation = TokenDTO.class))
                    ),
                    @ApiResponse(
                            description = "Forbidden (Invalid client request)",
                            responseCode = "403",
                            content = @Content(schema = @Schema(implementation = String.class, example = "Invalid client request!"))
                    ),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<?> refreshToken(
            @Parameter(description = "Email do usuário", required = true) String email,
            @Parameter(description = "Token de atualização (Refresh Token)", required = true) String refreshToken
    );
}
