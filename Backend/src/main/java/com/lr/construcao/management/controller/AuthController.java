package com.lr.construcao.management.controller;

import com.lr.construcao.management.controller.Docs.AuthControllerDoc;
import com.lr.construcao.management.dto.security.AccountCredentialsDTO;
import com.lr.construcao.management.dto.security.TokenDTO;
import com.lr.construcao.management.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/auth/")
public class AuthController implements AuthControllerDoc {

    private final AuthService authService;

    @PostMapping("/signin")
    @Override
    public ResponseEntity<?> signin(@RequestBody AccountCredentialsDTO credentials) {

        if (credentialIsInvalid(credentials) ) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid client request!");
        }

        ResponseEntity<TokenDTO> token = authService.signIn(credentials);

        if (token == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid client request!");
        }

        return ResponseEntity.ok().body(token);
    }

    @PutMapping("/refresh")
    @Override
    public ResponseEntity<?> refreshToken(
            @RequestParam String email,
            @RequestHeader("Authorization") String refreshToken) {

        if (parametersAreInvalid(email, refreshToken)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid client request!");
        }

        ResponseEntity<TokenDTO> token = authService.refreshToken(email, refreshToken);

        if (token == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid client request!");
        }

        return ResponseEntity.ok().body(token);

    }

    private boolean parametersAreInvalid(String email, String refreshToken) {
        return StringUtils.isBlank(email) || StringUtils.isBlank(refreshToken);
    }

    private static boolean credentialIsInvalid(AccountCredentialsDTO credentials) {
        return credentials == null || StringUtils.isBlank(credentials.getEmail())
                || StringUtils.isBlank(credentials.getPassword());
    }

}
