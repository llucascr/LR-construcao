package com.lr.construcao.management.service;

import com.lr.construcao.management.dto.enuns.StatusBuild;
import com.lr.construcao.management.dto.request.Address.AddressRequestDTO;
import com.lr.construcao.management.dto.request.Build.BuildRequestDTO;
import com.lr.construcao.management.dto.request.Client.ClientRequestDTO;
import com.lr.construcao.management.dto.response.Address.AddressResponseDTO;
import com.lr.construcao.management.dto.response.Build.BuildResponseDTO;
import com.lr.construcao.management.exception.DataNotFoundException;
import com.lr.construcao.management.exception.EntityAlreadyExistExcpetion;
import com.lr.construcao.management.model.Address;
import com.lr.construcao.management.model.Build;
import com.lr.construcao.management.model.Client;
import com.lr.construcao.management.repository.AddressRepository;
import com.lr.construcao.management.repository.BuildRepository;
import com.lr.construcao.management.repository.CondominumRepository;
import com.lr.construcao.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import static com.lr.construcao.management.mapper.ObjectMapper.parseObject;
import static com.lr.construcao.management.mapper.ObjectMapper.parsePageObjects;

@RequiredArgsConstructor
@Service
public class BuildService {

    private final BuildRepository buildRepository;
    private final UserRepository userRepository;

    private final AddressService addressService;
    private final ClientService clientService;

    // TODO: Revisar e contruir as verificações e execeções que podem existir
    public BuildResponseDTO create(BuildRequestDTO dto, Long userId) {
        if (buildRepository.findBuildsByName(dto.getName()).isPresent()) {
            throw new EntityAlreadyExistExcpetion("Build with name " + dto.getName() + " already exist");
        }

        Build build = Build.builder()
                .name(dto.getName())
                .buildSize(dto.getBuildSize())
                .totalPaid(dto.getTotalPaid())
                .qtdTotalPayments(dto.getQtdTotalPayments())
                .paymentsValue(dto.getPaymentsValue())
                .status(StatusBuild.EM_ESPERA)
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .createAt(LocalDateTime.now())
                .updateAt(LocalDateTime.now())
                .address(addressService.createRetunrAddress(AddressRequestDTO.builder()
                                .road(dto.getRoad())
                                .numberAddress(dto.getNumberAddress())
                                .neighborhood(dto.getNeighborhood())
                                .city(dto.getCity())
                                .cep(dto.getCep())
                                .condominiumBlock(dto.getCondominiumBlock())
                                .condominiumLot(dto.getCondominiumLot())
                                .build())
                )
                .client(clientService.createReturnClient(ClientRequestDTO.builder()
                                .name(dto.getClientName())
                                .email(dto.getClientemail())
                                .phone(dto.getClientPhone()).build(), userId))
                .user(userRepository.findById(userId)
                        .orElseThrow(() -> new DataNotFoundException("User with id " + userId + "not found")))
                .build();

        return parseObject(buildRepository.save(build), BuildResponseDTO.class);
    }

    public Page<BuildResponseDTO> findAll(int page, int numberOfBuild) {
        Pageable pageable = PageRequest.of(page, numberOfBuild);
        Page<Build> builds = buildRepository.findAll(pageable);

        return new PageImpl<>(parsePageObjects(builds, BuildResponseDTO.class), pageable, builds.getTotalElements());
    }

    public Page<BuildResponseDTO> searchByName(String name, int page, int numberOfBuild) {
        Pageable pageable = PageRequest.of(page, numberOfBuild);
        Page<Build> builds = buildRepository.searchByName(name, pageable);

        return new PageImpl<>(parsePageObjects(builds, BuildResponseDTO.class), pageable, builds.getTotalElements());
    }

}
