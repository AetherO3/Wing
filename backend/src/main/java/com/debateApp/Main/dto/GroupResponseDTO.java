package com.debateApp.Main.dto;

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
