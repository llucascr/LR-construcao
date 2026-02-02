package com.lr.construcao.management.controller.Docs;

import com.lr.construcao.management.dto.response.Build.BuildHighlightsResponseDTO;
import com.lr.construcao.management.dto.response.Drilling.DrillingRecentResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.List;

@Tag(name = "Dashboard", description = "Endpoints para indicadores e métricas da aplicação")
public interface DashboardControllerDoc {

    @Operation(
            summary = "Total de perfurações no mês",
            description = "Retorna a quantidade total de perfurações realizadas no mês atual.",
            tags = {"Dashboard"},
            responses = {
                    @ApiResponse(
                            description = "Success",
                            responseCode = "200",
                            content = @Content(schema = @Schema(implementation = Integer.class))
                    ),
                    @ApiResponse(description = "Unauthorized", responseCode = "401", content = @Content),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<Integer> getTotalDrillingMonth();

    @Operation(
            summary = "Receita mensal",
            description = "Calcula e retorna o valor monetário total arrecadado no mês.",
            tags = {"Dashboard"},
            responses = {
                    @ApiResponse(
                            description = "Success",
                            responseCode = "200",
                            content = @Content(schema = @Schema(implementation = BigDecimal.class))
                    ),
                    @ApiResponse(description = "Unauthorized", responseCode = "401", content = @Content),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<BigDecimal> getMonthlyRevenue();

    @Operation(
            summary = "Total pago em obras no mês",
            description = "Retorna o valor total pago referente a obras/construções no mês atual.",
            tags = {"Dashboard"},
            responses = {
                    @ApiResponse(
                            description = "Success",
                            responseCode = "200",
                            content = @Content(schema = @Schema(implementation = BigDecimal.class))
                    ),
                    @ApiResponse(description = "Unauthorized", responseCode = "401", content = @Content),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<BigDecimal> getTotalPaidBuildMonth();

    @Operation(
            summary = "Total de clientes",
            description = "Retorna a contagem total de clientes ativos na base de dados.",
            tags = {"Dashboard"},
            responses = {
                    @ApiResponse(
                            description = "Success",
                            responseCode = "200",
                            content = @Content(schema = @Schema(implementation = Integer.class))
                    ),
                    @ApiResponse(description = "Unauthorized", responseCode = "401", content = @Content),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<Integer> getTotalClients();

    @Operation(
            summary = "Perfurações recentes",
            description = "Lista as perfurações mais recentes registradas no sistema.",
            tags = {"Dashboard"},
            responses = {
                    @ApiResponse(
                            description = "Success",
                            responseCode = "200",
                            content = @Content(
                                    mediaType = "application/json",
                                    array = @ArraySchema(schema = @Schema(implementation = DrillingRecentResponseDTO.class))
                            )
                    ),
                    @ApiResponse(description = "Unauthorized", responseCode = "401", content = @Content),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<List<DrillingRecentResponseDTO>> findDrillingRecent();

    @Operation(
            summary = "Destaque de obra",
            description = "Retorna os dados da obra em destaque (ex: maior valor ou mais recente).",
            tags = {"Dashboard"},
            responses = {
                    @ApiResponse(
                            description = "Success",
                            responseCode = "200",
                            content = @Content(schema = @Schema(implementation = BuildHighlightsResponseDTO.class))
                    ),
                    @ApiResponse(description = "Unauthorized", responseCode = "401", content = @Content),
                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<BuildHighlightsResponseDTO> findBuilHighlight();
}
