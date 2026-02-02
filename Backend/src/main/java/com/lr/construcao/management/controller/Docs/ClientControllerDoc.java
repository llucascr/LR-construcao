package com.lr.construcao.management.controller.Docs;

import com.lr.construcao.management.dto.request.Client.ClientRequestDTO;
import com.lr.construcao.management.dto.response.Client.ClientResponseDTO;
import com.lr.construcao.management.dto.response.DeleteResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

import java.util.List;

@Tag(name = "Client", description = "Endpoints para gerenciamento de clientes da LR Construção")
public interface ClientControllerDoc {

    @Operation(
            summary = "Cria um novo cliente",
            description = "Registra um novo cliente no sistema e o vincula a um email de usuário existente.",
            tags = {"Client"},
            responses = {
                    @ApiResponse(
                            description = "Created",
                            responseCode = "201",
                            content = @Content(schema = @Schema(implementation = ClientResponseDTO.class))
                    ),
                    @ApiResponse(description = "Bad Request", responseCode = "400", content = @Content),
                    @ApiResponse(description = "Unauthorized", responseCode = "401", content = @Content),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<ClientResponseDTO> create(
            ClientRequestDTO dto,
            @Parameter(description = "Email do usuário responsável pelo cliente", required = true) String userEmail
    );

    @Operation(
            summary = "Lista todos os clientes",
            description = "Retorna uma lista paginada de todos os clientes cadastrados.",
            tags = {"Client"},
            responses = {
                    @ApiResponse(
                            description = "Success",
                            responseCode = "200",
                            content = @Content(
                                    mediaType = "application/json",
                                    array = @ArraySchema(schema = @Schema(implementation = ClientResponseDTO.class))
                            )
                    ),
                    @ApiResponse(description = "Bad Request", responseCode = "400", content = @Content),
                    @ApiResponse(description = "Unauthorized", responseCode = "401", content = @Content),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<List<ClientResponseDTO>> findAll(
            @Parameter(description = "Número da página") int page,
            @Parameter(description = "Quantidade de itens por página") int numberOfClients
    );

    @Operation(
            summary = "Busca cliente por ID",
            description = "Retorna os detalhes de um cliente específico pelo seu identificador.",
            tags = {"Client"},
            responses = {
                    @ApiResponse(
                            description = "Success",
                            responseCode = "200",
                            content = @Content(schema = @Schema(implementation = ClientResponseDTO.class))
                    ),
                    @ApiResponse(description = "Bad Request", responseCode = "400", content = @Content),
                    @ApiResponse(description = "Unauthorized", responseCode = "401", content = @Content),
                    @ApiResponse(description = "Not Found", responseCode = "404", content = @Content),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<ClientResponseDTO> findById(
            @Parameter(description = "ID do cliente", required = true) Long id
    );

    @Operation(
            summary = "Busca clientes por nome",
            description = "Retorna uma lista paginada de clientes filtrada pelo nome.",
            tags = {"Client"},
            responses = {
                    @ApiResponse(
                            description = "Success",
                            responseCode = "200",
                            content = @Content(
                                    mediaType = "application/json",
                                    array = @ArraySchema(schema = @Schema(implementation = ClientResponseDTO.class))
                            )
                    ),
                    @ApiResponse(description = "Bad Request", responseCode = "400", content = @Content),
                    @ApiResponse(description = "Unauthorized", responseCode = "401", content = @Content),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<List<ClientResponseDTO>> findByName(
            @Parameter(description = "Nome (ou parte do nome) do cliente", required = true) String name,
            @Parameter(description = "Número da página") int page,
            @Parameter(description = "Quantidade de itens por página") int numberOfClients
    );

    @Operation(
            summary = "Atualiza um cliente",
            description = "Atualiza os dados cadastrais de um cliente existente.",
            tags = {"Client"},
            responses = {
                    @ApiResponse(
                            description = "Success",
                            responseCode = "200",
                            content = @Content(schema = @Schema(implementation = ClientResponseDTO.class))
                    ),
                    @ApiResponse(description = "Bad Request", responseCode = "400", content = @Content),
                    @ApiResponse(description = "Unauthorized", responseCode = "401", content = @Content),
                    @ApiResponse(description = "Not Found", responseCode = "404", content = @Content),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<ClientResponseDTO> update(
            ClientRequestDTO dto,
            @Parameter(description = "ID do cliente a ser atualizado", required = true) Long clientId
    );

    @Operation(
            summary = "Deleta um cliente",
            description = "Remove o registro de um cliente da base de dados.",
            tags = {"Client"},
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
            @Parameter(description = "ID do cliente a ser removido", required = true) Long clientId
    );
}
