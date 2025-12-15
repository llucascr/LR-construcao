package com.lr.construcao.management.service;

import com.lr.construcao.management.dto.request.User.UserRequestDTO;
import com.lr.construcao.management.dto.response.User.UserResponseDTO;
import com.lr.construcao.management.exception.EntityAlreadyExistExcpetion;
import com.lr.construcao.management.model.User;
import com.lr.construcao.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
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

}
