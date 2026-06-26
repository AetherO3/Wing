package com.debateApp.Main.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupResponseDTO {
   private Long id;
   private String name;
   private String topic;
   private Long creatorId;
   private String creatorName; 
}
