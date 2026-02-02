package com.lr.construcao.management.controller;

import com.lr.construcao.management.controller.Docs.UserControllerDoc;
import com.lr.construcao.management.dto.request.User.UserRequestDTO;
import com.lr.construcao.management.dto.response.DeleteResponseDTO;
import com.lr.construcao.management.dto.response.User.UserResponseDTO;
import com.lr.construcao.management.dto.security.AccountCredentialsDTO;
import com.lr.construcao.management.service.AuthService;
import com.lr.construcao.management.service.UserService;
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
@RequestMapping("/api/v1/user")
public class UserController implements UserControllerDoc {

    private final UserService service;

    @PostMapping("/create")
    @Override
    public ResponseEntity<AccountCredentialsDTO> create(@RequestBody AccountCredentialsDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
    }

    @PutMapping(
            value = "/update",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @Override
    public ResponseEntity<UserResponseDTO> update(
            @Valid @RequestBody UserRequestDTO dto,
            @NonNull @RequestParam Long userId)
    {
        return ResponseEntity.status(HttpStatus.OK).body(service.update(dto, userId));
    }


    @DeleteMapping(
            value = "/disable",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @Override
    public ResponseEntity<DeleteResponseDTO> disable(@NonNull @RequestParam Long userId) {
        return ResponseEntity.status(HttpStatus.OK).body(service.disable(userId));
    }

    @GetMapping(
            value = "/findAll",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @Override
    public ResponseEntity<List<UserResponseDTO>> findAll(
            @RequestParam(defaultValue = "0", required = false) int page,
            @RequestParam(defaultValue = "10", required = false) int numberOfUsers
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(service.findAll(page, numberOfUsers).getContent());
    }

    @GetMapping(
            value = "/findById",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @Override
    public ResponseEntity<UserResponseDTO> findById(@NonNull @RequestParam Long userId) {
        return ResponseEntity.status(HttpStatus.OK).body(service.findById(userId));
    }

}
