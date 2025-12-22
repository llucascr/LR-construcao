package com.lr.construcao.management.controller;

import com.lr.construcao.management.dto.request.Address.AddressRequestDTO;
import com.lr.construcao.management.dto.response.Address.AddressResponseDTO;
import com.lr.construcao.management.dto.response.DeleteResponseDTO;
import com.lr.construcao.management.service.AddressService;
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
@RequestMapping("/api/v1/address")
public class AddressController {

    private final AddressService service;

    @PostMapping(
            value = "/create",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<AddressResponseDTO> create(@Valid @RequestBody AddressRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
    }

    @PutMapping(
            value = "/update",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<AddressResponseDTO> update(
            @Valid @RequestBody AddressRequestDTO dto,
            @RequestParam Long addressId)
    {
        return ResponseEntity.status(HttpStatus.OK).body(service.update(dto, addressId));
    }

    @DeleteMapping(
            value = "/delete",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<DeleteResponseDTO> delete(@NonNull @RequestParam Long addressId) {
        return ResponseEntity.status(HttpStatus.OK).body(service.delete(addressId));
    }

    @GetMapping(
            value = "/findAll",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<List<AddressResponseDTO>> findAll(
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int numberOfAddress
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(service.findAll(page, numberOfAddress).getContent());
    }

    @GetMapping(
            value = "/findById",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<AddressResponseDTO> findById(@NonNull @RequestParam Long addressId) {
        return ResponseEntity.status(HttpStatus.OK).body(service.findById(addressId));
    }

}
