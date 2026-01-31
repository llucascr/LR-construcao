package com.lr.construcao.management.repository;

import com.lr.construcao.management.dto.request.Client.ClientRequestDTO;
import com.lr.construcao.management.model.Client;
import com.lr.construcao.management.model.User;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
class ClientRepositoryTest {

    @Autowired
    ClientRepository clientRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    EntityManager entityManager;

    @Test
    @DisplayName("Should get User successfully from DB")
    void findClientByEmailSuccess() {

        ClientRequestDTO dto = mockClientResquestDTO();
        this.createClient(dto);

        Optional<Client> result = this.clientRepository.findClientByEmail(dto.getEmail());

        assertThat(result.isPresent()).isTrue();

    }

    @Test
    @DisplayName("Should not get Client from DB when user not exist")
    void findClientByEmailFailure() {

        ClientRequestDTO dto = mockClientResquestDTO();

        Optional<Client> result = this.clientRepository.findClientByEmail(dto.getEmail());

        assertThat(result.isEmpty()).isTrue();

    }

    @Test
    void searchByName() {
    }

    @Test
    void getTotalClients() {
    }

    private Client createClient(ClientRequestDTO dto) {
        Client newClient = Client.builder()
                .builds(new ArrayList<>())
                .name(dto.getName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .createAt(LocalDateTime.now())
                .updateAt(LocalDateTime.now())
                .user(userRepository.save(mockUser()))
                .build();

        this.entityManager.persist(newClient);
        return newClient;
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

    private ClientRequestDTO mockClientResquestDTO() {
        return new ClientRequestDTO(
                "ClientResponseTest",
                "clientresponsetest@email.com",
                "133563862"
                );
    }

}