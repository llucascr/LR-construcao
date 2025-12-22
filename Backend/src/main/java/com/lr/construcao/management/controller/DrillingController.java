package com.lr.construcao.management.controller;

import com.lr.construcao.management.dto.request.Drilling.DrillingRequestDTO;
import com.lr.construcao.management.dto.response.Drilling.DrillingResponseDTO;
import com.lr.construcao.management.service.DrillingService;
import jakarta.validation.Valid;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/drilling")
public class DrillingController {

    private final DrillingService service;

    @PostMapping(
            value = "/create",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<DrillingResponseDTO> create(
            @Valid @RequestBody DrillingRequestDTO dto,
            @NonNull @RequestParam Long userId
            ) {
        return ResponseEntity.status(HttpStatus.OK).body(service.create(dto, userId));
    }

    @GetMapping(
            value = "/findAll",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<List<DrillingResponseDTO>> findAll(
            @RequestParam(required = false, defaultValue = "0" ) int page,
            @RequestParam(required = false, defaultValue = "10") int numberOfDrilling
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(service.findAll(page, numberOfDrilling).getContent());
    }

}
