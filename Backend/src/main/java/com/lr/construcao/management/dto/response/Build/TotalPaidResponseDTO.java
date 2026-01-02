package com.lr.construcao.management.dto.response.Build;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class TotalPaidResponseDTO {
    private BigDecimal addedValue;
    private BigDecimal totalPaid;
}
