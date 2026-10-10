package com.debateApp.Main.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "MessageVote",uniqueConstraints = @UniqueConstraint(name = "uq_vote_user_message", columnNames = {"user_id", "message_id"}), indexes = @Index  (name = "idx_vote_message_id", columnList = "message_id"))
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
