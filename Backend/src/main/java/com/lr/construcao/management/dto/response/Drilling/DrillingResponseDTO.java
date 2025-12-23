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

    private Boolean invoice;

    private PaymentsStatus paymentsStatus;

    private BigDecimal totalValue;

    private LocalDate startDate;

    private LocalDate endDate;

    private LocalDateTime createAt;

    private LocalDateTime updateAt;

    private AddressResponseDTO address;

    private ClientResponseDTO client;

    private UserResponseDTO user;

    public BigDecimal getTotalValue() {
        if (drillQuatities == null || depth == null || priceMeter == null) {
            return BigDecimal.ZERO; // Ou retorne null, dependendo da sua regra de negócio
        }

        BigInteger totalDepth = drillQuatities.multiply(depth);

        return new BigDecimal(totalDepth).multiply(priceMeter);
    }

}
