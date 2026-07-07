package com.debateApp.Main.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddMessageDTO {
    // Take the author id from the JWT session.
    
    @NotBlank
    private String message;

    @NotNull
    private Long groupId;

    @NotBlank
    private String stance;

    private Long parentId;

}
