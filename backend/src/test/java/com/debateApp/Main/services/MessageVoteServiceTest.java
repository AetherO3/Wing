package com.debateApp.Main.services;

import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.Optional;

import org.mockito.junit.jupiter.MockitoExtension;

import com.debateApp.Main.entities.MessageVote;
import com.debateApp.Main.entities.Stance;
import com.debateApp.Main.exceptions.ResourceNotFoundException;
import com.debateApp.Main.repositories.MessageRepository;
import com.debateApp.Main.repositories.MessageVoteRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith(MockitoExtension.class)
class MessageVoteServiceTest {
    @Mock
    private MessageVoteRepository messageVoteRepository;

    @Mock
    private MessageRepository messageRepository;

    @InjectMocks
    private MessageVoteService messageVoteService;

    private static final Long userId = 1L;
    private static final Long messageId = 10L;

    @Test
    void whenNoExistingVoteSaveANewVote() {

        when(messageRepository.existsById(messageId)).thenReturn(true);
        when(messageVoteRepository.findByUserIdAndMessageId(userId, messageId)).thenReturn(Optional.empty());

        messageVoteService.vote(userId, messageId, Stance.PRO);

        ArgumentCaptor<MessageVote> captor = ArgumentCaptor.forClass(MessageVote.class);

        verify(messageVoteRepository).save(captor.capture());

        MessageVote saved = captor.getValue();

        assertThat(saved.getUserId()).isEqualTo(userId);
        assertThat(saved.getMessageId()).isEqualTo(messageId);
        assertThat(saved.getStance()).isEqualTo(Stance.PRO);

    }

    @Test
    void whenSameStanceAgainRemoveTheVote() {
        MessageVote exists = MessageVote.builder()
                .userId(userId)
                .messageId(messageId)
                .stance(Stance.PRO)
                .build();

        when(messageRepository.existsById(messageId)).thenReturn(true);

        when(messageVoteRepository.findByUserIdAndMessageId(userId, messageId))
                .thenReturn(Optional.of(exists));

        messageVoteService.vote(userId, messageId, Stance.PRO);

        verify(messageVoteRepository).delete(exists);
        verify(messageVoteRepository, never()).save(any());
    }

    @Test
    void whenDifferentVoteThanExistingUpdateStance() {

        MessageVote exists = MessageVote.builder()
                .userId(userId)
                .messageId(messageId)
                .stance(Stance.PRO)
                .build();

        when(messageRepository.existsById(messageId)).thenReturn(true);

        when(messageVoteRepository.findByUserIdAndMessageId(userId, messageId)).thenReturn(Optional.of(exists));

        messageVoteService.vote(userId, messageId, Stance.AGAINST);

        assertThat(exists.getStance()).isEqualTo(Stance.AGAINST);
        verify(messageVoteRepository).save(exists);
    }

    @Test
    void whenMessageDoesNotExistThrowsError(){

        when(messageRepository.existsById(messageId)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, 
                () -> messageVoteService.vote(userId, messageId, Stance.PRO));

        verify(messageVoteRepository, never()).save(any());
        verify(messageVoteRepository, never()).delete(any());

    }
}
