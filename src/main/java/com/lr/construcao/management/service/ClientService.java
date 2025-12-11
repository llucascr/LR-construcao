package com.lr.construcao.management.service;

import com.lr.construcao.management.dto.request.Client.ClientRequestDTO;
import com.lr.construcao.management.dto.response.Client.ClientResponseDTO;
import com.lr.construcao.management.exception.EntityAlreadyExistExcpetion;
import com.lr.construcao.management.model.Client;
import com.lr.construcao.management.repository.ClientRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import static com.lr.construcao.management.mapper.ObjectMapper.parseObject;
import static com.lr.construcao.management.mapper.ObjectMapper.parseListObjects;

@RequiredArgsConstructor
@Service
public class ClientService {

    private final ClientRepository clientRepository;

    public ClientResponseDTO create(ClientRequestDTO dto) {
        if (clientRepository.findClientByEmail(dto.getEmail()).isPresent()) {
            throw new EntityAlreadyExistExcpetion("Client with email " + dto.getEmail() + " Already exist");
        }

        Client client = Client.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .createAt(LocalDateTime.now())
                .updateAt(LocalDateTime.now())
                .build();

        return parseObject(clientRepository.save(client), ClientResponseDTO.class);
    }

}
