package com.lr.construcao.management.dto.request.Client;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ClientRequestDTO {

    @NotBlank(message = "")
    private String name;

    @NotBlank
    private String email;

    @NotBlank
    private String phone;
}
