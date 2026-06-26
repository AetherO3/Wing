package com.debateApp.Main.entities;

import java.time.LocalDateTime;
import java.util.*;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "groups")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Groups {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotBlank(message = "Group name cannot be blank.")
    private String name;

    @Column(nullable = false)
    @NotBlank(message = "Topic cannot be blank")
    private String topic;

    @ManyToOne
    @JoinColumn(name = "creator_id", nullable = false)
    @NotNull(message = "Creator cannot be null")
    private Users creator;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @ManyToMany(mappedBy = "joinedGroups")
    @JsonIgnore
    private List<Users> members = new ArrayList<>();

    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Messages> messages = new ArrayList<>();

}
