package com.lr.construcao.management.dto.request.User;

import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserRequestDTO {

    @Pattern(regexp = ".*\\S.*", message = "Empty fields")
    private String name;

    @Pattern(regexp = ".*\\S.*", message = "Empty fields")
    private String email;

    @Pattern(regexp = ".*\\S.*", message = "Empty fields")
    private String password;
}
