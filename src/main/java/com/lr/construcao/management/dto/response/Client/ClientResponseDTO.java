package com.lr.construcao.management.dto.response.Client;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ClientResponseDTO {
    private String name;
    private String email;
    private String phone;
    private String createAt;
    private String updateAt;
}
