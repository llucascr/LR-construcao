package com.lr.construcao.management.dto.response.Drilling;

import com.lr.construcao.management.dto.enuns.PaymentsStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class DrillingRecentResponseDTO {
    private String clientName;
    private LocalDate startDate;
    private BigInteger depth;
    private BigDecimal totalValue;
    private PaymentsStatus paymentsStatus;
}
