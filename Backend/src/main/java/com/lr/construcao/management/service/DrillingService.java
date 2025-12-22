package com.lr.construcao.management.service;

import com.lr.construcao.management.dto.enuns.PaymentsStatus;
import com.lr.construcao.management.dto.request.Address.AddressRequestDTO;
import com.lr.construcao.management.dto.request.Client.ClientRequestDTO;
import com.lr.construcao.management.dto.request.Drilling.DrillingRequestDTO;
import com.lr.construcao.management.dto.response.Drilling.DrillingResponseDTO;
import com.lr.construcao.management.exception.DataNotFoundException;
import com.lr.construcao.management.exception.EntityAlreadyExistExcpetion;
import com.lr.construcao.management.model.Drilling;
import com.lr.construcao.management.repository.DrillingRepository;
import com.lr.construcao.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import static com.lr.construcao.management.mapper.ObjectMapper.*;

@RequiredArgsConstructor
@Service
public class DrillingService {

    private final DrillingRepository drillingRepository;
    private final UserRepository userRepository;

    private final AddressService addressService;
    private final ClientService clientService;

    public DrillingResponseDTO create(DrillingRequestDTO dto, Long userId) {
        if (drillingRepository.findDrillingByName(dto.getName()).isPresent()) {
            throw new EntityAlreadyExistExcpetion("Drilling with name " + dto.getName() + " already exist");
        }

        Drilling drilling = Drilling.builder()
                .name(dto.getName())
                .drillSize(dto.getDrillSize())
                .depth(dto.getDepth())
                .drillQuatities(dto.getDrillQuatities())
                .priceMeter(dto.getPriceMeter())
                .invoice(dto.isInvoice())
                .paymentsStatus(PaymentsStatus.NAO_PAGO)
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

        return parseObject(drillingRepository.save(drilling), DrillingResponseDTO.class);
    }

}
