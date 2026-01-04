package com.lr.construcao.management.dto.security;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AccountCredentialsDTO {

    private String name;

    private String email;

    private String password;
}
