package com.debateApp.Main.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.*;

import com.debateApp.Main.entities.MessageVote;
import com.debateApp.Main.entities.Stance;

public interface MessageVoteRepository extends JpaRepository<MessageVote, Long> {

    Optional<MessageVote> findByUserIdAndMessageId(Long userId, Long messageId);

    long countByMessageIdAndStance(Long messageId, Stance stance);

    List<MessageVote> findByUserIdAndMessageIdIn(Long userId, Collection<Long> messageIds);

    @Query("select v.messageId as messageId, v.stance as stance, count(v) as total from MessageVote v where v.messageId in :ids group by v.messageId, v.stance")
    List<VoteCount> countVotesByMessageIds(@Param("ids") Collection<Long> ids);

    interface VoteCount {
        Long getMessageId();

        Stance getStance();

        Long getTotal();
    }
}
