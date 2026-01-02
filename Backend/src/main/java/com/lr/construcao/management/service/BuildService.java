package com.lr.construcao.management.service;

import com.lr.construcao.management.dto.enuns.StatusBuild;
import com.lr.construcao.management.dto.request.Address.AddressRequestDTO;
import com.lr.construcao.management.dto.request.Build.BuildRequestDTO;
import com.lr.construcao.management.dto.request.Client.ClientRequestDTO;
import com.lr.construcao.management.dto.response.Address.AddressResponseDTO;
import com.lr.construcao.management.dto.response.Build.BuildResponseDTO;
import com.lr.construcao.management.dto.response.Build.StatusBuildResponseDTO;
import com.lr.construcao.management.dto.response.Build.TotalPaidResponseDTO;
import com.lr.construcao.management.exception.DataNotFoundException;
import com.lr.construcao.management.exception.EntityAlreadyExistExcpetion;
import com.lr.construcao.management.model.Address;
import com.lr.construcao.management.model.Build;
import com.lr.construcao.management.model.Client;
import com.lr.construcao.management.model.Condominium;
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

import java.math.BigDecimal;
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

    public BuildResponseDTO create(BuildRequestDTO dto, Long userId) {
        if (buildRepository.findBuildsByName(dto.getName()).isPresent()) {
            throw new EntityAlreadyExistExcpetion("Build with name " + dto.getName() + " already exist");
        }

        Build build = Build.builder()
                .name(dto.getName())
                .buildSize(dto.getBuildSize())
                .totalPaid(BigDecimal.valueOf(0))
                .buildCost(dto.getBuildCost())
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

    public BuildResponseDTO update(BuildRequestDTO dto, Long buildId) {
        Build build = buildRepository.findById(buildId)
                .orElseThrow(() -> new DataNotFoundException("Build with id " + buildId + " not found"));

        build.setName(dto.getName() != null ? dto.getName() : build.getName());
        build.setBuildSize(dto.getBuildSize() != null ? dto.getBuildSize() : build.getBuildSize());
        build.setTotalPaid(dto.getTotalPaid() != null ? dto.getTotalPaid() : build.getTotalPaid());
        build.setBuildCost(dto.getBuildCost() != null ? dto.getBuildCost() : build.getBuildCost());
        build.setStartDate(dto.getStartDate() != null ? dto.getStartDate() : build.getStartDate());
        build.setEndDate(dto.getEndDate() != null ? dto.getEndDate() : build.getEndDate());

        build.setUpdateAt(LocalDateTime.now());

        if (build.getAddress() != null) {
            Address address = build.getAddress();
            address.setRoad(dto.getRoad() != null ? dto.getRoad() : address.getRoad());
            address.setNumberAddress(dto.getNumberAddress() != null ? dto.getNumberAddress() : address.getNumberAddress());
            address.setNeighborhood(dto.getNeighborhood() != null ? dto.getNeighborhood() : address.getNeighborhood());
            address.setCity(dto.getCity() != null ? dto.getCity() : address.getCity());
            address.setCep(dto.getCep() != null ? dto.getCep() : address.getCep());

            if (dto.getCondominiumBlock() != null || dto.getCondominiumLot() != null) {
                Condominium condominium = address.getCondominium();
                condominium.setBlock(dto.getCondominiumBlock());
                condominium.setLot(dto.getCondominiumLot());

                address.setCondominium(condominium);
            }
        }

        if (build.getClient() != null) {
            Client client = build.getClient();
            client.setName(dto.getClientName() != null ? dto.getClientName() : client.getName());
            client.setEmail(dto.getClientemail() != null ? dto.getClientemail() : client.getEmail());
            client.setPhone(dto.getClientPhone() != null ? dto.getClientPhone() : client.getPhone());
        }

        return parseObject(buildRepository.save(build), BuildResponseDTO.class);
    }

    public TotalPaidResponseDTO addPayment(Double payment, Long buildId) {
        Build build = buildRepository.findById(buildId)
                .orElseThrow(() -> new DataNotFoundException("Build with id " + buildId + " not found"));

        BigDecimal totalPaid = build.getTotalPaid().add(BigDecimal.valueOf(payment));
        build.setTotalPaid(totalPaid);
        buildRepository.save(build);
        return new TotalPaidResponseDTO(
                BigDecimal.valueOf(payment),
                totalPaid
        );
    }

    public StatusBuildResponseDTO changeStatus(StatusBuild status, Long buildId) {
        Build build = buildRepository.findById(buildId)
                .orElseThrow(() -> new DataNotFoundException("Build with id " + buildId + " not found"));

        build.setStatus(status);

        return parseObject(buildRepository.save(build), StatusBuildResponseDTO.class);
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
