package com.lr.construcao.management.controller;

import com.lr.construcao.management.dto.enuns.StatusBuild;
import com.lr.construcao.management.dto.request.Build.BuildRequestDTO;
import com.lr.construcao.management.dto.response.Build.BuildResponseDTO;
import com.lr.construcao.management.dto.response.Build.StatusBuildResponseDTO;
import com.lr.construcao.management.dto.response.Build.TotalPaidResponseDTO;
import com.lr.construcao.management.service.BuildService;
import jakarta.validation.Valid;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/build")
public class BuildController {

    private final BuildService service;

    @PostMapping(
            value = "/create",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<BuildResponseDTO> create(
            @Valid @RequestBody BuildRequestDTO dto,
            @NonNull @RequestParam Long userId
            ) {
        return ResponseEntity.status(HttpStatus.OK).body(service.create(dto, userId));
    }

    @PutMapping(
            value = "/update",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<BuildResponseDTO> update(
            @Valid @RequestBody BuildRequestDTO dto,
            @NonNull @RequestParam Long buildId) {
        return ResponseEntity.status(HttpStatus.OK).body(service.update(dto, buildId));
    }

    @PutMapping(
            value = "/changeStatus",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<StatusBuildResponseDTO> changeStatus(
            @RequestParam StatusBuild statusBuild, @NonNull @RequestParam Long buildId) {
        return ResponseEntity.status(HttpStatus.OK).body(service.changeStatus(statusBuild, buildId));
    }

    @PostMapping(
            value = "/addpayment",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<TotalPaidResponseDTO> addPayment (
            @RequestParam Double payment, @NonNull @RequestParam Long buildId) {
        return ResponseEntity.status(HttpStatus.OK).body(service.addPayment(payment, buildId));
    }

    @GetMapping(
            value = "/findAll",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<List<BuildResponseDTO>> findAll(
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int numberOfBuild
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(service.findAll(page, numberOfBuild).getContent());
    }

    @GetMapping(
            value = "/searchByName",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<List<BuildResponseDTO>> searchByName(
            @RequestParam String name,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int numberOfBuild
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(service.searchByName(name, page, numberOfBuild).getContent());
    }

}
