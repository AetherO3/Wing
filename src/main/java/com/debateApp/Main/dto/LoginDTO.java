package com.debateApp.Main.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginDTO {

    @NotBlank(message = "User name cannot be empty.")
    private String userName;

    @NotBlank(message = "Password cannot be empty.")
    private String password;
} 
