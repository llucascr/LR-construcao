package com.lr.construcao.management.dto.response.Drilling;

import com.lr.construcao.management.dto.enuns.PaymentsStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class PaymentsStatusResponseDTO {

    private String name;
    private PaymentsStatus paymentsStatus;

}
