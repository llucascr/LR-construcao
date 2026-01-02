package com.lr.construcao.management.service;

import com.lr.construcao.management.dto.request.Client.ClientRequestDTO;
import com.lr.construcao.management.dto.response.Client.ClientResponseDTO;
import com.lr.construcao.management.dto.response.DeleteResponseDTO;
import com.lr.construcao.management.exception.DataNotFoundException;
import com.lr.construcao.management.exception.EntityAlreadyExistExcpetion;
import com.lr.construcao.management.exception.UserDisableException;
import com.lr.construcao.management.model.Client;
import com.lr.construcao.management.model.User;
import com.lr.construcao.management.repository.ClientRepository;
import com.lr.construcao.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.Optional;

import static com.lr.construcao.management.mapper.ObjectMapper.*;

@RequiredArgsConstructor
@Service
public class ClientService {

    private final ClientRepository clientRepository;
    private final UserRepository userRepository;

    public ClientResponseDTO create(ClientRequestDTO dto, String userEmail) {
        if (clientRepository.findClientByEmail(dto.getEmail()).isPresent()) {
            throw new EntityAlreadyExistExcpetion("Client with email " + dto.getEmail() + " Already exist");
        }

        User user = userRepository.findOpUserByEmail(userEmail)
                .orElseThrow(() -> new DataNotFoundException("Client with email " + userEmail + " not found"));

        if (user.getActive() == false) {
            throw new UserDisableException("The user with email " + userEmail + " is desactivated and cannot register clients");
        }

        Client client = Client.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .createAt(LocalDateTime.now())
                .updateAt(LocalDateTime.now())
                .user(user)
                .build();

        return parseObject(clientRepository.save(client), ClientResponseDTO.class);
    }

    public Client createReturnClient(ClientRequestDTO dto, Long userId) {

        Optional<Client> existingClient = clientRepository.findClientByEmail(dto.getEmail());

        if (existingClient.isPresent()) {
            return existingClient.get();
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new DataNotFoundException("User with id " + userId + " not found"));

        if (!user.getActive()) {
            throw new UserDisableException("The user with id " + userId + " is desactivated and cannot register clients");
        }

        return Client.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .createAt(LocalDateTime.now())
                .updateAt(LocalDateTime.now())
                .user(user)
                .build();
    }

    public ClientResponseDTO update(ClientRequestDTO dto, Long clientId) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new DataNotFoundException("Client with id " + clientId + " not found"));

        client.setName(dto.getName() != null ? dto.getName() : client.getName());
        client.setEmail(dto.getEmail() != null ? dto.getEmail() : client.getEmail());
        client.setPhone(dto.getPhone() != null ? dto.getPhone() : client.getPhone());
        client.setCreateAt(client.getCreateAt());
        client.setUpdateAt(LocalDateTime.now());

        return parseObject(clientRepository.save(client), ClientResponseDTO.class);
    }

    public DeleteResponseDTO delete(Long clientId) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new DataNotFoundException("Client with id " + clientId + " not found"));

        clientRepository.delete(client);
        return new DeleteResponseDTO(
                LocalDateTime.now(),
                "The user " + client.getName() + " was deleted!"
        );
    }

    public Page<ClientResponseDTO> findAll(int page, int numberOfClients) {
        Pageable pageable = PageRequest.of(page, numberOfClients);
        Page<Client> clients = clientRepository.findAll(pageable);

        return new PageImpl<>(parsePageObjects(clients, ClientResponseDTO.class), pageable, clients.getTotalElements());
    }

    public ClientResponseDTO findById(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Client with id " + id + " not found"));

        return parseObject(client, ClientResponseDTO.class);
    }

    public Page<ClientResponseDTO> findByName(String name, int page, int numberOfClients) {
        Pageable pageable = PageRequest.of(page, numberOfClients);
        Page<Client> client = clientRepository.SearchByName(name, pageable);

        return new PageImpl<>(parsePageObjects(client, ClientResponseDTO.class), pageable, client.getTotalElements());
    }

}
