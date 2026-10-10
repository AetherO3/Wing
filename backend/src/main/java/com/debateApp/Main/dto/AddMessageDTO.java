package com.debateApp.Main.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddMessageDTO {
    
    @NotBlank
    @Size(max = 1000, message = "Message cannot exceed 1000 words.")
    private String message;

    @NotNull
    private Long groupId;

    @NotBlank
    private String stance;

    private Long parentId;

}
