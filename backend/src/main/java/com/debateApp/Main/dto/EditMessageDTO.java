package com.debateApp.Main.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EditMessageDTO {

    @NotBlank(message = "New message cannot be blank.")
    @Size(max = 1000, message = "Message cannot exceed 1000 words.")
    private String newMessage;
    
}
