package com.lr.construcao.management.controller.Docs;

import com.lr.construcao.management.dto.CondominiumDTO;
import com.lr.construcao.management.dto.response.DeleteResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

@Tag(name = "Condominium", description = "Endpoints para gerenciamento de condomínios")
public interface CondominiumControllerDoc {

    @Operation(
            summary = "Atualiza um condomínio",
            description = "Atualiza as informações de um condomínio existente na base de dados.",
            tags = {"Condominium"},
            responses = {
                    @ApiResponse(
                            description = "Success",
                            responseCode = "200",
                            content = @Content(schema = @Schema(implementation = CondominiumDTO.class))
                    ),
                    @ApiResponse(description = "Bad Request", responseCode = "400", content = @Content),
                    @ApiResponse(description = "Unauthorized", responseCode = "401", content = @Content),
                    @ApiResponse(description = "Not Found", responseCode = "404", content = @Content),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<CondominiumDTO> update(
            CondominiumDTO dto,
            @Parameter(description = "ID do condomínio a ser atualizado", required = true) Long condominiumId
    );

    @Operation(
            summary = "Busca condomínio por ID",
            description = "Retorna os detalhes de um condomínio específico.",
            tags = {"Condominium"},
            responses = {
                    @ApiResponse(
                            description = "Success",
                            responseCode = "200",
                            content = @Content(schema = @Schema(implementation = CondominiumDTO.class))
                    ),
                    @ApiResponse(description = "Bad Request", responseCode = "400", content = @Content),
                    @ApiResponse(description = "Unauthorized", responseCode = "401", content = @Content),
                    @ApiResponse(description = "Not Found", responseCode = "404", content = @Content),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<CondominiumDTO> findById(
            @Parameter(description = "ID do condomínio", required = true) Long condominiumId
    );

    @Operation(
            summary = "Deleta um condomínio",
            description = "Remove o registro de um condomínio do sistema.",
            tags = {"Condominium"},
            responses = {
                    @ApiResponse(
                            description = "Success",
                            responseCode = "200",
                            content = @Content(schema = @Schema(implementation = DeleteResponseDTO.class))
                    ),
                    @ApiResponse(description = "Bad Request", responseCode = "400", content = @Content),
                    @ApiResponse(description = "Unauthorized", responseCode = "401", content = @Content),
                    @ApiResponse(description = "Not Found", responseCode = "404", content = @Content),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<DeleteResponseDTO> delete(
            @Parameter(description = "ID do condomínio a ser removido", required = true) Long condominiumId
    );
}