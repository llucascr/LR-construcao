package com.lr.construcao.management.controller;

import com.lr.construcao.management.dto.request.Build.BuildRequestDTO;
import com.lr.construcao.management.dto.response.Build.BuildResponseDTO;
import com.lr.construcao.management.service.BuildService;
import jakarta.validation.Valid;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

}
