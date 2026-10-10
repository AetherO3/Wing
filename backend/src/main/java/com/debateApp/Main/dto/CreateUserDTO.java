package com.debateApp.Main.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserDTO {

    @NotBlank(message = "User Name cannot be empty.")
    @NotNull
    @Size(min = 5, max = 20, message = "User name must be 5-20 characters")
    private String userName;

    @NotBlank(message = "Email cannot be empty.")
    @Email
    @Size(max = 100, message = "Email must be at most 100 characters")
    private String email;

    @NotBlank
    @Size(min = 8, max = 72, message = "Password must be 8-72 characters")
    private String password;
}
