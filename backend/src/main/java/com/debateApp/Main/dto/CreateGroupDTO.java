package com.debateApp.Main.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateGroupDTO {

    @Size(min = 5, max = 50)
    @NotBlank(message = "The Group name cannot be blank")
    private String name;

    @Size(min = 10, max = 100)
    @NotBlank(message = "The topic cannot be balnk.")
    private String topic;

}
