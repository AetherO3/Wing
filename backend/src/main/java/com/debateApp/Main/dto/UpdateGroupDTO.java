package com.debateApp.Main.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateGroupDTO {

    @Size(min = 5, max = 50)
    @Pattern(regexp = ".*\\S.*", message = "Name cannot be space.")
    private String name;

    @Size(min = 10, max = 100)
    @Pattern(regexp = ".*\\S.*", message = "Topic cannot be space.")
    private String topic;
}
