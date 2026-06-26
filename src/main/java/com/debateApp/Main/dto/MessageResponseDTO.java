package com.debateApp.Main.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponseDTO{

    @NotNull
    private Long id;

    @NotBlank
    private String message;

    @NotNull
    private Long authorId;

    @NotBlank
    private String authorName;

}
