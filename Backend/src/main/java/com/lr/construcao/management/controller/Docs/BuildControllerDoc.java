package com.lr.construcao.management.controller.Docs;

import com.lr.construcao.management.dto.enuns.StatusBuild;
import com.lr.construcao.management.dto.request.Build.BuildRequestDTO;
import com.lr.construcao.management.dto.response.Build.BuildResponseDTO;
import com.lr.construcao.management.dto.response.Build.StatusBuildResponseDTO;
import com.lr.construcao.management.dto.response.Build.TotalPaidResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

import java.util.List;

@Tag(name = "Build", description = "Endpoints para gerenciamento de obras/construções da LR Construção")
public interface BuildControllerDoc {

    @Operation(
            summary = "Cria uma nova obra",
            description = "Registra uma nova obra no sistema e a vincula a um usuário responsável.",
            tags = {"Build"},
            responses = {
                    @ApiResponse(
                            description = "Success",
                            responseCode = "200",
                            content = @Content(schema = @Schema(implementation = BuildResponseDTO.class))
                    ),
                    @ApiResponse(description = "Bad Request", responseCode = "400", content = @Content),
                    @ApiResponse(description = "Unauthorized", responseCode = "401", content = @Content),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<BuildResponseDTO> create(
            BuildRequestDTO dto,
            @Parameter(description = "ID do usuário responsável pela obra", required = true) Long userId
    );

    @Operation(
            summary = "Atualiza uma obra",
            description = "Atualiza as informações cadastrais de uma obra existente.",
            tags = {"Build"},
            responses = {
                    @ApiResponse(
                            description = "Success",
                            responseCode = "200",
                            content = @Content(schema = @Schema(implementation = BuildResponseDTO.class))
                    ),
                    @ApiResponse(description = "Bad Request", responseCode = "400", content = @Content),
                    @ApiResponse(description = "Unauthorized", responseCode = "401", content = @Content),
                    @ApiResponse(description = "Not Found", responseCode = "404", content = @Content),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<BuildResponseDTO> update(
            BuildRequestDTO dto,
            @Parameter(description = "ID da obra a ser atualizada", required = true) Long buildId
    );

    @Operation(
            summary = "Altera o status da obra",
            description = "Modifica o status atual da obra (ex: Em andamento, Finalizada, etc).",
            tags = {"Build"},
            responses = {
                    @ApiResponse(
                            description = "Success",
                            responseCode = "200",
                            content = @Content(schema = @Schema(implementation = StatusBuildResponseDTO.class))
                    ),
                    @ApiResponse(description = "Bad Request", responseCode = "400", content = @Content),
                    @ApiResponse(description = "Unauthorized", responseCode = "401", content = @Content),
                    @ApiResponse(description = "Not Found", responseCode = "404", content = @Content),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<StatusBuildResponseDTO> changeStatus(
            @Parameter(description = "Novo status da obra", required = true) StatusBuild statusBuild,
            @Parameter(description = "ID da obra", required = true) Long buildId
    );

    @Operation(
            summary = "Adiciona pagamento",
            description = "Registra um valor pago referente à obra, atualizando o total pago.",
            tags = {"Build"},
            responses = {
                    @ApiResponse(
                            description = "Success",
                            responseCode = "200",
                            content = @Content(schema = @Schema(implementation = TotalPaidResponseDTO.class))
                    ),
                    @ApiResponse(description = "Bad Request", responseCode = "400", content = @Content),
                    @ApiResponse(description = "Unauthorized", responseCode = "401", content = @Content),
                    @ApiResponse(description = "Not Found", responseCode = "404", content = @Content),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<TotalPaidResponseDTO> addPayment(
            @Parameter(description = "Valor do pagamento a ser adicionado", required = true) Double payment,
            @Parameter(description = "ID da obra", required = true) Long buildId
    );

    @Operation(
            summary = "Lista todas as obras",
            description = "Retorna uma lista paginada de todas as obras cadastradas.",
            tags = {"Build"},
            responses = {
                    @ApiResponse(
                            description = "Success",
                            responseCode = "200",
                            content = @Content(
                                    mediaType = "application/json",
                                    array = @ArraySchema(schema = @Schema(implementation = BuildResponseDTO.class))
                            )
                    ),
                    @ApiResponse(description = "Bad Request", responseCode = "400", content = @Content),
                    @ApiResponse(description = "Unauthorized", responseCode = "401", content = @Content),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<List<BuildResponseDTO>> findAll(
            @Parameter(description = "Número da página") int page,
            @Parameter(description = "Quantidade de itens por página") int numberOfBuild
    );

    @Operation(
            summary = "Busca obras por nome",
            description = "Filtra e retorna obras que contenham o nome especificado.",
            tags = {"Build"},
            responses = {
                    @ApiResponse(
                            description = "Success",
                            responseCode = "200",
                            content = @Content(
                                    mediaType = "application/json",
                                    array = @ArraySchema(schema = @Schema(implementation = BuildResponseDTO.class))
                            )
                    ),
                    @ApiResponse(description = "Bad Request", responseCode = "400", content = @Content),
                    @ApiResponse(description = "Unauthorized", responseCode = "401", content = @Content),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<List<BuildResponseDTO>> searchByName(
            @Parameter(description = "Nome (ou parte do nome) da obra", required = true) String name,
            @Parameter(description = "Número da página") int page,
            @Parameter(description = "Quantidade de itens por página") int numberOfBuild
    );
}
