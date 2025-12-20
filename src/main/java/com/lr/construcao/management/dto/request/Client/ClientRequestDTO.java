package com.lr.construcao.management.dto.request.Client;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ClientRequestDTO {

    @Pattern(regexp = ".*\\S.*", message = "Empty fields")
    private String name;

    @Pattern(regexp = ".*\\S.*", message = "Empty fields")
    @Email(message = "Email does not exist")
    private String email;

    @Pattern(regexp = ".*\\S.*", message = "Empty fields")
    private String phone;
}
