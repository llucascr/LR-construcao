package com.lr.construcao.management.service;

import com.lr.construcao.management.dto.request.Client.ClientRequestDTO;
import com.lr.construcao.management.dto.response.Client.ClientResponseDTO;
import com.lr.construcao.management.exception.EntityAlreadyExistExcpetion;
import com.lr.construcao.management.model.Client;
import com.lr.construcao.management.model.User;
import com.lr.construcao.management.repository.ClientRepository;
import com.lr.construcao.management.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClientServiceTest {

    @InjectMocks
    private ClientService clientService;

    @Mock
    private ClientRepository clientRepository;

    @Mock
    private UserRepository userRepository;

    @Test
    @DisplayName("Client Test create")
    void deveCriarUmClient() {

        //Arrange
        String clientEmailEspererado = "clienttest@email.com";
        String userEmailEsperado = "usertest@email.com";

        Client client = mockClient();
        client.setEmail(clientEmailEspererado);

        User userLogado = mockUser();
        userLogado.setEmail(userEmailEsperado);

        ClientRequestDTO dto = mockClientRequestDTO();
        dto.setEmail(clientEmailEspererado);

        when(clientRepository.findClientByEmail(clientEmailEspererado)).thenReturn(Optional.empty());

        when(userRepository.findOpUserByEmail(userEmailEsperado)).thenReturn(Optional.of(userLogado));

        when(clientRepository.save(any(Client.class))).thenReturn(client);

        //Act
        clientService.create(dto, userEmailEsperado);


        //Assert
        verify(clientRepository, times(1)).findClientByEmail(clientEmailEspererado);

        verify(userRepository, times(1)).findOpUserByEmail(userEmailEsperado);

        verify(clientRepository, times(1)).save(any(Client.class));

    }

    @Test
    @DisplayName("")
    void deveRetonarErroAoCriarClient() {

    }


    @Test
    @DisplayName("Client Test findAll")
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

    @Test
    @DisplayName("Client Test findById")
    public void deveRetornarUmClientPorId() {

        //Arrange
        Client client = mockClient();

        when(clientRepository.findById(any(Long.class))).thenReturn(Optional.ofNullable(client));

        //Act
        ClientResponseDTO result = clientService.findById(1L);

        //Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());

    }

    @Test
    @DisplayName("Client Test searchByName")
    public void deveRetonarUmClientPorName() {

        //Arange
        String nomePesquisado = "Client Test1";
        List<Client> clients = mockListClient();
        Page<Client> pageClient = new PageImpl<>(clients);

        when(clientRepository.SearchByName(any(String.class), any(Pageable.class))).thenReturn(pageClient);

        //Act
        Page<ClientResponseDTO> result = clientService.searchByName(nomePesquisado, 0, 10);

        //Assert
        assertNotNull(result);
        assertEquals(100, result.getTotalElements());
        assertEquals(nomePesquisado, clients.getFirst().getName());

        verify(clientRepository, times(1)).SearchByName(anyString(), any(Pageable.class));

    }

    private ClientRequestDTO mockClientRequestDTO() {
        return ClientRequestDTO.builder()
                .name("ClientRequestDTO Test")
                .email("clientrequestdtotest@email.com")
                .phone("1335638626")
                .build();
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

    private Optional<Client> mockOptionalClient() {
        return Optional.ofNullable(Client.builder()
                .id(1L)
                .name("Client Test")
                .email("clienttest@email.com")
                .phone("1335638626")
                .createAt(LocalDateTime.now())
                .updateAt(LocalDateTime.now())
                .build());
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

    private User mockUser() {
        return User.builder()
                .builds(new ArrayList<>())
                .name("User Test")
                .email("usertest@email.com")
                .password("1111")
                .active(true)
                .createAt(LocalDateTime.now())
                .updateAt(LocalDateTime.now())
                .accountNonExpired(true)
                .accountNonLocked(true)
                .credentialsNonExpired(true)
                .permissions(new ArrayList<>())
                .build();
    }
}