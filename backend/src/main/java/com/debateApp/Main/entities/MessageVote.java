package com.debateApp.Main.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "MessageVote")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MessageVote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;
    
    @Column(nullable = false)
    private Long messageId;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Stance stance;

}
