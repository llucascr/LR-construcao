package com.lr.construcao.management.service;

import com.lr.construcao.management.dto.request.Client.ClientRequestDTO;
import com.lr.construcao.management.dto.response.Client.ClientResponseDTO;
import com.lr.construcao.management.exception.DataNotFoundException;
import com.lr.construcao.management.exception.EntityAlreadyExistExcpetion;
import com.lr.construcao.management.model.Client;
import com.lr.construcao.management.repository.ClientRepository;
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

    public Page<ClientResponseDTO> findAll(int page, int numberOfClients) {
        Pageable pageable = PageRequest.of(page, numberOfClients);
        Page<Client> clients = clientRepository.findAll(pageable);

        return new PageImpl<>(parsePageObjects(clients, ClientResponseDTO.class), pageable, clients.getTotalElements());
    }

    public ClientResponseDTO findById(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Client wit id " + id + " not found"));

        return parseObject(client, ClientResponseDTO.class);
    }

    public Page<ClientResponseDTO> findByName(String name, int page, int numberOfClients) {
        Pageable pageable = PageRequest.of(page, numberOfClients);
        Page<Client> client = clientRepository.SearchByName(name, pageable);

        return new PageImpl<>(parsePageObjects(client, ClientResponseDTO.class), pageable, client.getTotalElements());
    }

}
