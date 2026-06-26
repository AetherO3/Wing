package com.debateApp.Main.services;

import org.springframework.stereotype.Service;

import com.debateApp.Main.repositories.*;
import com.debateApp.Main.dto.MessageResponseDTO;
import com.debateApp.Main.dto.AddMessageDTO;
import com.debateApp.Main.entities.Messages;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final GroupRepository groupRepository;
    private final UserRepository userRepository;

    public MessageResponseDTO addMessage(AddMessageDTO dto) {

        Messages message = new Messages();

        message.setMessage(dto.getMessage());
        message.setStance(dto.getStance());

        message.setGroup(groupRepository.findById(dto.getGroupId())
                .orElseThrow(() -> new RuntimeException("Group not found, id : " + dto.getGroupId())));

        message.setAuthor(userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found, id : " + dto.getUserId())));

        //TODO
        //User JWT to authenticate the user.
        if (dto.getParentId() != null)
            message.setParent(messageRepository.findById(dto.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent message not found, id : " + dto.getParentId())));

        messageRepository.save(message);

        return MessageResponseDTO.builder()
                .id(message.getId())
                .message(message.getMessage())
                .authorId(message.getAuthor().getId())
                .authorName(message.getAuthor().getUserName())
                .build();
    }

    public Messages getMessage(Long id) {
        return messageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Can not find the message, id : " + id));
    }

    public void deleteMessage(Long id) {
        messageRepository.deleteById(id);
    }
}
