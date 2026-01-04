package com.lr.construcao.management.dto.response.Address;

import com.lr.construcao.management.dto.CondominiumDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AddressResponseDTO {

    private String road;

    private String numberAddress;

    private String neighborhood;

    private String city;

    private String Cep;

    private CondominiumDTO condominium;

}
