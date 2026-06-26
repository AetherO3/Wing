package com.debateApp.Main.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserDTO {
@NotBlank
@Size(min = 5, max = 20)
    private String userName;

@NotBlank
@Email
    private String email;
}
