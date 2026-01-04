package com.lr.construcao.management.service;

import com.lr.construcao.management.dto.request.User.UserRequestDTO;
import com.lr.construcao.management.dto.response.DeleteResponseDTO;
import com.lr.construcao.management.dto.response.User.UserResponseDTO;
import com.lr.construcao.management.dto.security.AccountCredentialsDTO;
import com.lr.construcao.management.exception.DataNotFoundException;
import com.lr.construcao.management.exception.EntityAlreadyExistExcpetion;
import com.lr.construcao.management.model.Permission;
import com.lr.construcao.management.model.User;
import com.lr.construcao.management.repository.PermissionRepository;
import com.lr.construcao.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.DelegatingPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password.Pbkdf2PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import static com.lr.construcao.management.mapper.ObjectMapper.*;

@RequiredArgsConstructor
@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PermissionRepository permissionRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email);

        if (user != null) {
            return user;
        } else {
            throw new UsernameNotFoundException("Email " + email + " not found");
        }
    }

    public AccountCredentialsDTO create(AccountCredentialsDTO dto) {
        if (userRepository.findUserByEmail(dto.getEmail()).isPresent())
            throw new EntityAlreadyExistExcpetion("User with email " + dto.getEmail() + " Already exist");

        User user = User.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .password(generatedHashPassword(dto.getPassword()))
                .active(true)
                .createAt(LocalDateTime.now())
                .updateAt(LocalDateTime.now())
                .accountNonExpired(true)
                .accountNonLocked(true)
                .credentialsNonExpired(true)
                .permissions(new ArrayList<>())
                .build();

        Permission permission = permissionRepository.findPermissionByDescription("EMPLOYEE");

        user.getPermissions().add(permission);
        return parseObject(userRepository.save(user), AccountCredentialsDTO.class);
    }

    public UserResponseDTO update(UserRequestDTO dto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new DataNotFoundException("Client wit id " + userId + " not found"));

        user.setName(dto.getName() != null ? dto.getName() : user.getName());
        user.setEmail(dto.getEmail() != null ? dto.getEmail() : user.getEmail());
        user.setPassword(dto.getPassword() != null ? dto.getPassword() : user.getPassword());
        user.setUpdateAt(LocalDateTime.now());

        return parseObject(userRepository.save(user), UserResponseDTO.class);
    }

    public DeleteResponseDTO disable(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new DataNotFoundException("Client wit id " + userId + " not found"));

        userRepository.disable(userId);
        return new DeleteResponseDTO(
                LocalDateTime.now(),
                "The user " + user.getName() + " was disable!"
        );
    }

    public Page<UserResponseDTO> findAll(int page, int numberOfUsers) {
        Pageable pageable = PageRequest.of(page, numberOfUsers);
        Page<User> users = userRepository.findAll(pageable);

        return new PageImpl<>(parsePageObjects(users, UserResponseDTO.class), pageable, users.getTotalElements());
    }

    public UserResponseDTO findById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new DataNotFoundException("Client wit id " + userId + " not found"));

        return parseObject(user, UserResponseDTO.class);
    }

    private String generatedHashPassword(String password) {
        PasswordEncoder pbkdf2Encoder = new Pbkdf2PasswordEncoder(
                "",
                8,
                185000,
                Pbkdf2PasswordEncoder.SecretKeyFactoryAlgorithm.PBKDF2WithHmacSHA256
        );

        Map<String, PasswordEncoder> encoders = new HashMap<>();
        encoders.put("pbkdf2", pbkdf2Encoder);
        DelegatingPasswordEncoder passwordEncoder = new DelegatingPasswordEncoder("pbkdf2", encoders);

        passwordEncoder.setDefaultPasswordEncoderForMatches(pbkdf2Encoder);
        return passwordEncoder.encode(password);
    }
}
