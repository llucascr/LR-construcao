package com.lr.construcao.management.service;

import com.lr.construcao.management.dto.request.User.UserRequestDTO;
import com.lr.construcao.management.dto.response.User.UserResponseDTO;
import com.lr.construcao.management.dto.security.AccountCredentialsDTO;
import com.lr.construcao.management.dto.security.TokenDTO;
import com.lr.construcao.management.exception.EntityAlreadyExistExcpetion;
import com.lr.construcao.management.model.User;
import com.lr.construcao.management.repository.UserRepository;
import com.lr.construcao.management.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.DelegatingPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password.Pbkdf2PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static com.lr.construcao.management.mapper.ObjectMapper.parseObject;


@RequiredArgsConstructor
@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;

    public ResponseEntity<TokenDTO> signIn(AccountCredentialsDTO credentials) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        credentials.getEmail(),
                        credentials.getPassword()
                )
        );

        User user = userRepository.findUserByEmail(credentials.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Email " + credentials.getEmail() + " not found"));

        TokenDTO tokenResponse = tokenProvider.createAccessToken(credentials.getEmail(), user.getRoles());

        return ResponseEntity.ok(tokenResponse);
    }

    public ResponseEntity<TokenDTO> refreshToken(String email, String refreshToken) {
        Optional<User> user = userRepository.findUserByEmail(email);
        TokenDTO token;

        if (user != null) {
            token = tokenProvider.refreshToken(refreshToken);
        } else {
            throw new UsernameNotFoundException("Email " + email + " not found");
        }

        return ResponseEntity.ok(token);
    }

}
