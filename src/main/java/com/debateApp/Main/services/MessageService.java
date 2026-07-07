package com.debateApp.Main.services;

import org.apache.tomcat.util.http.parser.Authorization;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.debateApp.Main.repositories.*;
import com.debateApp.Main.dto.MessageResponseDTO;
import com.debateApp.Main.dto.AddMessageDTO;
import com.debateApp.Main.entities.Messages;
import com.debateApp.Main.entities.Stance;
import com.debateApp.Main.entities.Groups;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final GroupRepository groupRepository;
    private final UserRepository userRepository;

    public MessageResponseDTO addMessage(AddMessageDTO dto) {

        Long userId = (Long) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        Groups group = groupRepository.findById(dto.getGroupId())
                .orElseThrow(() -> new RuntimeException("Group not found, id : " + dto.getGroupId()));

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
            throw new RuntimeException("Invalid Stance");
        }

        message.setGroup(groupRepository.findById(dto.getGroupId())
                .orElseThrow(() -> new RuntimeException("Group not found, id : " + dto.getGroupId())));

        message.setAuthor(userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found, id : " + userId)));

        if (dto.getParentId() != null) {
            message.setParent(messageRepository.findById(dto.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent message not found, id : " + dto.getParentId())));
        }

        messageRepository.save(message);

        return MessageResponseDTO.builder()
                .id(message.getId())
                .message(message.getMessage())
                .authorId(message.getAuthor().getId())
                .authorName(message.getAuthor().getUserName())
                .stance(message.getStance().toString())
                .build();
    }

    public MessageResponseDTO getMessage(Long id) {
        Messages message = messageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Can not find the message, id : " + id));

        return MessageResponseDTO.builder()
                .id(message.getId())
                .message(message.getMessage())
                .authorId(message.getAuthor().getId())
                .authorName(message.getAuthor().getUserName())
                .stance(message.getStance().toString())
                .build();

    }

    public void deleteMessage(Long id) {
        Messages message = messageRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Group not found, id : " + id));

        Long userId = (Long)SecurityContextHolder.getContext()
            .getAuthentication()
            .getPrincipal();

        if(!message.getAuthor().getId().equals(userId)){
            throw new AccessDeniedException("Only the author of this message can delete it!");
        }

        messageRepository.deleteById(id);
    }
}
