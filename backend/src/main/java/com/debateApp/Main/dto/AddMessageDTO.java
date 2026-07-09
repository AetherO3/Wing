package com.debateApp.Main.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddMessageDTO {
    
    @NotBlank
    private String message;

    @NotNull
    private Long groupId;

    @NotBlank
    private String stance;

    private Long parentId;

}
