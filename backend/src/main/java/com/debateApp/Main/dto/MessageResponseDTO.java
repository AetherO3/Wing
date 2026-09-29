package com.debateApp.Main.dto;

import java.time.LocalDateTime;

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
    private Long parentId;
    private Long authorId;
    private String authorName;
    private String message;
    private String stance;
    private boolean edited;
    private int replyCount;
    private LocalDateTime createDateTime;
}
