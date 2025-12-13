package com.lr.construcao.management.controller;

import com.lr.construcao.management.dto.request.Client.ClientRequestDTO;
import com.lr.construcao.management.dto.response.Client.ClientResponseDTO;
import com.lr.construcao.management.service.ClientService;
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
@RequestMapping("/api/v1/client")
public class ClientController {

    private final ClientService service;

    @PostMapping(
            value = "/create",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ClientResponseDTO> create(@RequestBody @Valid ClientRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
    }

    @GetMapping(
            value = "/findAll",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<List<ClientResponseDTO>> findAll(
            @RequestParam(defaultValue = "0", required = false) int page,
            @RequestParam(defaultValue = "10", required = false) int numberOfClients) {
        return ResponseEntity.status(HttpStatus.OK).body(service.findAll(page, numberOfClients).getContent());
    }

    @GetMapping(
            value = "/findById",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ClientResponseDTO> findById(@NonNull @RequestParam Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(service.findById(id));
    }

    @GetMapping(
            value = "/findByName",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<List<ClientResponseDTO>> findByName(
            @NonNull @RequestParam String name,
            @RequestParam(defaultValue = "0", required = false) int page,
            @RequestParam(defaultValue = "10", required = false) int numberOfClients
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(service.findByName(name, page, numberOfClients).getContent());
    }

    @PutMapping(
            value = "/update",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ClientResponseDTO> update(@RequestBody @Valid ClientRequestDTO dto,
                                                    @NonNull @RequestParam Long clientId) {
        return ResponseEntity.status(HttpStatus.OK).body(service.update(dto, clientId));
    }

}
