package com.debateApp.Main.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateGroupDTO {

    @NotBlank(message = "The username cannot be blank")
   private String name; 

    @NotBlank(message = "The topic cannot be balnk.")
   private String topic; 

    @NotNull(message = "There needs to be a valid author.")
   private Long authorId; 
    
}
