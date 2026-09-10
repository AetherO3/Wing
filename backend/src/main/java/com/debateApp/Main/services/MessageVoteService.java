package com.debateApp.Main.services;

import org.springframework.stereotype.Service;

import com.debateApp.Main.entities.MessageVote;
import com.debateApp.Main.entities.Stance;
import com.debateApp.Main.repositories.MessageVoteRepository;

import lombok.RequiredArgsConstructor;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MessageVoteService {

    private final MessageVoteRepository messageVoteRepository;

    public long getAgreeCount(Long messageId) {
        return messageVoteRepository.countByMessageIdAndStance(messageId, Stance.PRO);
    }

    public long getDisagreeCount(Long messageId) {
        return messageVoteRepository.countByMessageIdAndStance(messageId, Stance.AGAINST);
    }

    public void vote(Long userId, Long messageId, Stance stance) {
        Optional<MessageVote> existing = messageVoteRepository.findByUserIdAndMessageId(userId, messageId);

        if (existing.isPresent()) {
            MessageVote messageVote = existing.get();

            if (messageVote.getStance() == stance)
                messageVoteRepository.delete(messageVote);

            else {
                messageVote.setStance(stance);
                messageVoteRepository.save(messageVote);
            }

        } else {
            messageVoteRepository.save(MessageVote.builder()
                    .userId(userId)
                    .messageId(messageId)
                    .stance(stance)
                    .build());
        }
    }
}
