package com.lr.construcao.management.controller.Docs;

import com.lr.construcao.management.dto.request.Email.EmailRequestDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

@Tag(name = "Email", description = "Endpoints para envio de notificações e emails")
public interface EmailControllerDoc {

    @Operation(
            summary = "Enviar email simples",
            description = "Envia um email de texto simples sem anexos.",
            tags = {"Email"},
            responses = {
                    @ApiResponse(
                            description = "Success",
                            responseCode = "200",
                            content = @Content(schema = @Schema(implementation = String.class, example = "e-Mail sent with success"))
                    ),
                    @ApiResponse(description = "Bad Request", responseCode = "400", content = @Content),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<String> sendEmailWithAttachment(@RequestBody EmailRequestDTO dto);

    @Operation(
            summary = "Enviar email com anexo",
            description = "Envia um email contendo um arquivo anexo. Os dados do email devem ser enviados como String (JSON) e o arquivo como binário.",
            tags = {"Email"},
            responses = {
                    @ApiResponse(
                            description = "Success",
                            responseCode = "200",
                            content = @Content(schema = @Schema(implementation = String.class, example = "e-Mail with attachment sent successfully"))
                    ),
                    @ApiResponse(description = "Bad Request", responseCode = "400", content = @Content),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<String> sendEmailWithAttachment(
            @Parameter(description = "JSON do EmailRequestDTO convertido em String", required = true)
            String emailRequest,
            @Parameter(description = "Arquivo para anexo", required = true)
            MultipartFile attachment
    );
}
