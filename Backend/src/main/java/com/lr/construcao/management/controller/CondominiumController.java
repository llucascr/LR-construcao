package com.lr.construcao.management.controller;

import com.lr.construcao.management.controller.Docs.CondominiumControllerDoc;
import com.lr.construcao.management.dto.CondominiumDTO;
import com.lr.construcao.management.dto.response.DeleteResponseDTO;
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
public class CondominiumController implements CondominiumControllerDoc {

    private final CondominiumService service;

    @PutMapping(
            value = "/update",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @Override
    public ResponseEntity<CondominiumDTO> update(
            @Valid @RequestBody CondominiumDTO dto,
            @NonNull @RequestParam Long condominiumId
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(service.update(dto, condominiumId));
    }

    @GetMapping(
            value = "/findById",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @Override
    public ResponseEntity<CondominiumDTO> findById(@NonNull @RequestParam Long condominiumId) {
        return ResponseEntity.status(HttpStatus.OK).body(service.findById(condominiumId));
    }

    @DeleteMapping(
            value = "/delete",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @Override
    public ResponseEntity<DeleteResponseDTO> delete(@NonNull @RequestParam Long condominiumId) {
        return ResponseEntity.status(HttpStatus.OK).body(service.delete(condominiumId));
    }

}
