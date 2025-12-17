package com.lr.construcao.management.dto.request.Address;

import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AddressRequestDTO {

    @Pattern(regexp = ".*\\S.*", message = "Empty fields")
    private String road;

    @Pattern(regexp = ".*\\S.*", message = "Empty fields")
    private String numberAddress;

    @Pattern(regexp = ".*\\S.*", message = "Empty fields")
    private String neighborhood;

    @Pattern(regexp = ".*\\S.*", message = "Empty fields")
    private String city;

    @Pattern(regexp = ".*\\S.*", message = "Empty fields")
    private String Cep;

    @Pattern(regexp = ".*\\S.*", message = "Empty fields")
    private String condominiumBlock;

    @Pattern(regexp = ".*\\S.*", message = "Empty fields")
    private String condominiumLot;

}
