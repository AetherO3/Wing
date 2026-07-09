package com.debateApp.Main.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateGroupDTO {

    @NotBlank(message = "The Group name cannot be blank")
    private String name;

    @NotBlank(message = "The topic cannot be balnk.")
    private String topic;

}
