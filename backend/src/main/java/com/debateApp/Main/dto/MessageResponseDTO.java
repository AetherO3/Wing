package com.debateApp.Main.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponseDTO{
    private Long id;
    private String message;
    private Long authorId;
    private String authorName;
    private String stance;
}
