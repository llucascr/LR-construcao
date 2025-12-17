package com.lr.construcao.management.controller;

import com.lr.construcao.management.dto.CondominiumDTO;
import com.lr.construcao.management.service.CondominiumService;
import jakarta.validation.Valid;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/condominium")
public class CondominiumController {

    private final CondominiumService service;

    @PostMapping(
            value = "/create",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<CondominiumDTO> create(@Valid @RequestBody CondominiumDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
    }

    @PutMapping(
            value = "/update",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<CondominiumDTO> update(
            @Valid @RequestBody CondominiumDTO dto,
            @NonNull @RequestParam Long condominiumId
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(service.update(dto, condominiumId));
    }

}
