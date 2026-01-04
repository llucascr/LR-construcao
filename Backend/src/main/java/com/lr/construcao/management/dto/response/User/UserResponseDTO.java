package com.lr.construcao.management.dto.response.User;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDTO {
    private String name;
    private String email;
    private Boolean active;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;
}
