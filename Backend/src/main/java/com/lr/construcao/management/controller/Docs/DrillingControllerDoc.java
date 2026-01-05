package com.lr.construcao.management.controller.Docs;

import com.lr.construcao.management.dto.enuns.PaymentsStatus;
import com.lr.construcao.management.dto.request.Drilling.DrillingRequestDTO;
import com.lr.construcao.management.dto.response.Drilling.DrillingResponseDTO;
import com.lr.construcao.management.dto.response.Drilling.PaymentsStatusResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

import java.util.List;

@Tag(name = "Drilling", description = "Endpoints para gerenciamento de perfurações da LR Construção")
public interface DrillingControllerDoc {

    @Operation(
            summary = "Cria uma nova perfuração",
            description = "Registra uma nova perfuração associada a um usuário (cliente ou responsável).",
            tags = {"Drilling"},
            responses = {
                    @ApiResponse(
                            description = "Success",
                            responseCode = "200",
                            content = @Content(schema = @Schema(implementation = DrillingResponseDTO.class))
                    ),
                    @ApiResponse(description = "Bad Request", responseCode = "400", content = @Content),
                    @ApiResponse(description = "Unauthorized", responseCode = "401", content = @Content),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<DrillingResponseDTO> create(
            DrillingRequestDTO dto,
            @Parameter(description = "ID do usuário vinculado à perfuração", required = true) Long userId
    );

    @Operation(
            summary = "Atualiza uma perfuração",
            description = "Atualiza os dados técnicos ou informativos de uma perfuração existente.",
            tags = {"Drilling"},
            responses = {
                    @ApiResponse(
                            description = "Success",
                            responseCode = "200",
                            content = @Content(schema = @Schema(implementation = DrillingResponseDTO.class))
                    ),
                    @ApiResponse(description = "Bad Request", responseCode = "400", content = @Content),
                    @ApiResponse(description = "Unauthorized", responseCode = "401", content = @Content),
                    @ApiResponse(description = "Not Found", responseCode = "404", content = @Content),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<DrillingResponseDTO> update(
            DrillingRequestDTO dto,
            @Parameter(description = "ID da perfuração a ser atualizada", required = true) Long drillingId
    );

    @Operation(
            summary = "Altera o status de pagamento",
            description = "Modifica o status financeiro ou operacional da perfuração.",
            tags = {"Drilling"},
            responses = {
                    @ApiResponse(
                            description = "Success",
                            responseCode = "200",
                            content = @Content(schema = @Schema(implementation = PaymentsStatusResponseDTO.class))
                    ),
                    @ApiResponse(description = "Bad Request", responseCode = "400", content = @Content),
                    @ApiResponse(description = "Unauthorized", responseCode = "401", content = @Content),
                    @ApiResponse(description = "Not Found", responseCode = "404", content = @Content),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<PaymentsStatusResponseDTO> changeStatus(
            @Parameter(description = "Novo status a ser aplicado", required = true) PaymentsStatus status,
            @Parameter(description = "ID da perfuração", required = true) Long drillingId
    );

    @Operation(
            summary = "Lista todas as perfurações",
            description = "Retorna uma lista paginada de todas as perfurações cadastradas.",
            tags = {"Drilling"},
            responses = {
                    @ApiResponse(
                            description = "Success",
                            responseCode = "200",
                            content = @Content(
                                    mediaType = "application/json",
                                    array = @ArraySchema(schema = @Schema(implementation = DrillingResponseDTO.class))
                            )
                    ),
                    @ApiResponse(description = "Bad Request", responseCode = "400", content = @Content),
                    @ApiResponse(description = "Unauthorized", responseCode = "401", content = @Content),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<List<DrillingResponseDTO>> findAll(
            @Parameter(description = "Número da página") int page,
            @Parameter(description = "Quantidade de itens por página") int numberOfDrilling
    );

    @Operation(
            summary = "Lista perfurações por cliente",
            description = "Filtra e retorna as perfurações associadas a um cliente específico.",
            tags = {"Drilling"},
            responses = {
                    @ApiResponse(
                            description = "Success",
                            responseCode = "200",
                            content = @Content(
                                    mediaType = "application/json",
                                    array = @ArraySchema(schema = @Schema(implementation = DrillingResponseDTO.class))
                            )
                    ),
                    @ApiResponse(description = "Bad Request", responseCode = "400", content = @Content),
                    @ApiResponse(description = "Unauthorized", responseCode = "401", content = @Content),
                    @ApiResponse(description = "Not Found", responseCode = "404", content = @Content),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<List<DrillingResponseDTO>> findPerforationsByClient(
            @Parameter(description = "Número da página") int page,
            @Parameter(description = "Quantidade de itens por página") int numberOfDrilling,
            @Parameter(description = "ID do cliente", required = true) Long clientId
    );

}
