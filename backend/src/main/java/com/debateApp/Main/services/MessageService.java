package com.debateApp.Main.services;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;

import com.debateApp.Main.repositories.*;
import com.debateApp.Main.dto.MessageResponseDTO;
import com.debateApp.Main.dto.AddMessageDTO;
import com.debateApp.Main.dto.EditMessageDTO;
import com.debateApp.Main.entities.Messages;
import com.debateApp.Main.entities.Stance;
import com.debateApp.Main.exceptions.BadRequestException;
import com.debateApp.Main.exceptions.ResourceNotFoundException;
import com.debateApp.Main.entities.Groups;

import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final GroupRepository groupRepository;
    private final UserRepository userRepository;
    private final MessageVoteRepository messageVoteRepository;

    public MessageResponseDTO addMessage(AddMessageDTO dto) {

        Long userId = (Long) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        Groups group = groupRepository.findById(dto.getGroupId())
                .orElseThrow(() -> new ResourceNotFoundException("Group not found, id : " + dto.getGroupId()));

        boolean isMember = group.getMembers().stream()
                .anyMatch(member -> member.getId().equals(userId));

        if (!isMember) {
            throw new AccessDeniedException("Only members can message in the group.");
        }

        Messages message = new Messages();

        message.setMessage(dto.getMessage());

        try {
            message.setStance(Stance.valueOf(dto.getStance().toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid Stance");
        }

        message.setGroup(group);

        message.setAuthor(userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found, id : " + userId)));

        if (dto.getParentId() != null) {
            Messages parent = messageRepository.findById(dto.getParentId())
                    .orElseThrow(
                            () -> new ResourceNotFoundException("Parent message not found, id : " + dto.getParentId()));

            if (!parent.getGroup().getId().equals(group.getId())) {
                throw new BadRequestException("Parent message belongs to a different group.");
            }

            message.setParent(parent);
        }

        messageRepository.save(message);

        return MessageResponseDTO.builder()
                .id(message.getId())
                .message(message.getMessage())
                .authorId(userId)
                .authorName(message.getAuthor().getUserName())
                .stance(message.getStance().toString())
                .edited(false)
                .replyCount(message.getReplies().size())
                .parentId(message.getParent() != null ? message.getParent().getId() : null)
                .build();
    }

    public MessageResponseDTO getMessage(Long id) {
        Messages message = messageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Can not find the message, id : " + id));

        return toDtos(List.of(message), currentUserIdOrNull()).get(0);
    }

    private Long currentUserIdOrNull() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        return (auth != null && auth.getPrincipal() instanceof Long userId) ? userId : null;
    }

    private List<MessageResponseDTO> toDtos(List<Messages> messages, Long currentUserId) {
        if (messages.isEmpty())
            return List.of();

        List<Long> ids = messages.stream().map(Messages::getId).toList();

        Map<Long, Long> replyCounts = new HashMap<>();

        for (MessageRepository.ReplyCount r : messageRepository.countRepliesByParentId(ids)) {
            replyCounts.put(r.getParentId(), r.getTotal());
        }

        Map<Long, Long> agreeCounts = new HashMap<>();
        Map<Long, Long> disagreeCounts = new HashMap<>();

        for (MessageVoteRepository.VoteCount v : messageVoteRepository.countVotesByMessageIds(ids)) {
            if (v.getStance() == Stance.PRO) {
                agreeCounts.put(v.getMessageId(), v.getTotal());
            } else if (v.getStance() == Stance.AGAINST) {
                disagreeCounts.put(v.getMessageId(), v.getTotal());
            }
        }

        Map<Long, String> myVotes = new HashMap<>();
        if (currentUserId != null) {
            messageVoteRepository.findByUserIdAndMessageIdIn(currentUserId, ids)
                    .forEach(v -> myVotes.put(v.getMessageId(), v.getStance().name()));
        }

        return messages.stream()
                .map(m -> MessageResponseDTO.builder()
                        .id(m.getId())
                        .message(m.getMessage())
                        .authorId(m.getAuthor().getId())
                        .authorName(m.getAuthor().getUserName())
                        .stance(m.getStance().toString())
                        .edited(m.getEdited())
                        .replyCount(replyCounts.getOrDefault(m.getId(), 0L).intValue())
                        .agreeCount(agreeCounts.getOrDefault(m.getId(), 0L))
                        .disagreeCount(disagreeCounts.getOrDefault(m.getId(), 0L))
                        .myVote(myVotes.get(m.getId()))
                        .createDateTime(m.getCreateDateTime())
                        .parentId(m.getParent() != null ? m.getParent().getId() : null)
                        .build())
                .toList();

    }

    public List<MessageResponseDTO> getGroupMessages(Long id) {

        return toDtos(messageRepository.findByGroupIdOrderByCreateDateTimeDescIdDesc(id), currentUserIdOrNull());
    }

    public void deleteMessage(Long id) {
        Messages message = messageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found, id : " + id));

        Long userId = (Long) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        if (!message.getAuthor().getId().equals(userId)) {
            throw new AccessDeniedException("Only the author of this message can delete it!");
        }

        messageRepository.deleteById(id);
    }

    public void editMessage(Long id, EditMessageDTO dto) {
        Messages message = messageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found, id : " + id));

        Long userId = (Long) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        if (!message.getAuthor().getId().equals(userId)) {
            throw new AccessDeniedException("Only the author of this message can edit it!");
        }

        message.setMessage(dto.getNewMessage());
        message.setEdited(true);

        messageRepository.save(message);
    }

    public void editStance(Long id, String stance) {
        Messages message = messageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found, id : " + id));

        Long userId = (Long) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        if (!message.getAuthor().getId().equals(userId)) {
            throw new AccessDeniedException("Only the author of this message can edit it!");
        }

        try {
            message.setStance(Stance.valueOf(stance.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid Stance");
        }

        messageRepository.save(message);
    }

    public List<MessageResponseDTO> findReplies(Long id) {
        if (!messageRepository.existsById(id))
            throw new ResourceNotFoundException("Message not found id : " + id);

        return toDtos(messageRepository.findByParentIdOrderByIdAsc(id), currentUserIdOrNull());
    }

    public Long findGroupId(Long id) {
        Messages message = messageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found id : " + id));

        return message.getGroup().getId();
    }
}
