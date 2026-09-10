package com.debateApp.Main.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

import com.debateApp.Main.entities.MessageVote;
import com.debateApp.Main.entities.Stance;

public interface MessageVoteRepository extends JpaRepository<MessageVote, Long>{

    Optional<MessageVote> findByUserIdAndMessageId(Long userId, Long messageId);

    long countByMessageIdAndStance(Long messageId, Stance stance);
    
}
