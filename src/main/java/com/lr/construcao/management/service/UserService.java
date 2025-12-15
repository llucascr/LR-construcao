package com.lr.construcao.management.service;

import com.lr.construcao.management.dto.request.User.UserRequestDTO;
import com.lr.construcao.management.dto.response.User.UserResponseDTO;
import com.lr.construcao.management.exception.DataNotFoundException;
import com.lr.construcao.management.exception.EntityAlreadyExistExcpetion;
import com.lr.construcao.management.model.User;
import com.lr.construcao.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import static com.lr.construcao.management.mapper.ObjectMapper.*;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;

    public UserResponseDTO create(UserRequestDTO dto) {
        if (userRepository.findUserByEmail(dto.getEmail()).isPresent())
            throw new EntityAlreadyExistExcpetion("User with email " + dto.getEmail() + " Already exist");

        User user = User.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .password(dto.getPassword())
                .active(true)
                .createAt(LocalDateTime.now())
                .updateAt(LocalDateTime.now())
                .build();

        return parseObject(userRepository.save(user), UserResponseDTO.class);
    }

    public UserResponseDTO update(UserRequestDTO dto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new DataNotFoundException("Client wit email " + dto.getEmail() + " not found"));

        user.setName(dto.getName() != null ? dto.getName() : user.getName());
        user.setEmail(dto.getEmail() != null ? dto.getEmail() : user.getEmail());
        user.setPassword(dto.getPassword() != null ? dto.getPassword() : user.getPassword());
        user.setUpdateAt(LocalDateTime.now());

        return parseObject(userRepository.save(user), UserResponseDTO.class);
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

}
