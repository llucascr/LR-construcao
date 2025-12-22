package com.lr.construcao.management.dto.response.Drilling;

import com.lr.construcao.management.dto.enuns.PaymentsStatus;
import com.lr.construcao.management.dto.response.Address.AddressResponseDTO;
import com.lr.construcao.management.dto.response.Client.ClientResponseDTO;
import com.lr.construcao.management.dto.response.User.UserResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class DrillingResponseDTO {

    private String name;

    private BigDecimal drillSize;

    private BigInteger depth;

    private BigInteger drillQuatities;

    private BigDecimal priceMeter;

    private boolean invoice;

    private PaymentsStatus paymentsStatus;

    private LocalDate startDate;

    private LocalDate endDate;

    private LocalDateTime createAt;

    private LocalDateTime updateAt;

    private AddressResponseDTO address;

    private ClientResponseDTO client;

    private UserResponseDTO user;

}
