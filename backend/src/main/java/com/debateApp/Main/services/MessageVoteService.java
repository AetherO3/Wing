package com.debateApp.Main.services;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.debateApp.Main.entities.MessageVote;
import com.debateApp.Main.entities.Stance;
import com.debateApp.Main.repositories.MessageVoteRepository;
import com.debateApp.Main.repositories.MessageRepository;
import com.debateApp.Main.exceptions.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MessageVoteService {

    private final MessageVoteRepository messageVoteRepository;
    private final MessageRepository messageRepository;

    public long getAgreeCount(Long messageId) {
        return messageVoteRepository.countByMessageIdAndStance(messageId, Stance.PRO);
    }

    public long getDisagreeCount(Long messageId) {
        return messageVoteRepository.countByMessageIdAndStance(messageId, Stance.AGAINST);
    }

    public void vote(Long userId, Long messageId, Stance stance) {
        if (!messageRepository.existsById(messageId)) {
            throw new ResourceNotFoundException("Message does not exist " + messageId);
        }

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
            try {
                messageVoteRepository.save(MessageVote.builder()
                        .userId(userId)
                        .messageId(messageId)
                        .stance(stance)
                        .build());
            } catch (DataIntegrityViolationException e) {
                if (!messageRepository.existsById(messageId)) {
                    throw new ResourceNotFoundException("Message not found, id: " + messageId);
                }
            }
        }
    }

    public String getUserVote(Long userId, Long messageId) {
        return messageVoteRepository.findByUserIdAndMessageId(userId, messageId)
                .map(vote -> vote.getStance().name()).orElse(null);
    }
}
