package com.lr.construcao.management.service;

import com.lr.construcao.management.dto.response.Client.ClientResponseDTO;
import com.lr.construcao.management.model.Client;
import com.lr.construcao.management.repository.ClientRepository;
import com.lr.construcao.management.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.shortThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ClientServiceTest {

    @InjectMocks
    private ClientService clientService;

    @Mock
    private ClientRepository clientRepository;

    @Mock
    private UserRepository userRepository;

    @Test
    public void deveRetornarUmaListaDe100Clients() {

        // Arrange
        List<Client> clientMock = mockListClient();
        Page<Client> pageClient = new PageImpl<>(clientMock);

        when(clientRepository.findAll(any(Pageable.class))).thenReturn(pageClient);

        // Act
        Page<ClientResponseDTO> result = clientService.findAll(0, 10);

        // Assert
        assertNotNull(result);
        assertEquals(100, result.getTotalElements());

    }

    public void deveRetornarUmClient() {

    }

    private Client mockClient() {
        return Client.builder()
                .id(1L)
                .name("Client Test")
                .email("clienttest@email.com")
                .phone("1335638626")
                .createAt(LocalDateTime.now())
                .updateAt(LocalDateTime.now())
                .build();
    }

    private List<Client> mockListClient() {
        List<Client> clientList = new ArrayList<>();

        for (int i = 1; i <= 100; i++) {
            clientList.add(Client.builder()
                    .id((long) i)
                    .name("Client Test" + i)
                    .email("clienttest" + i +"@email.com")
                    .phone("133563862" + i)
                    .createAt(LocalDateTime.now())
                    .updateAt(LocalDateTime.now())
                    .build()
            );
        }

        return clientList;
    }

}