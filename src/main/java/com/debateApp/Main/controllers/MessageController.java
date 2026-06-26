package com.debateApp.Main.controllers;

import org.springframework.web.bind.annotation.*;

import com.debateApp.Main.entities.Messages;
import com.debateApp.Main.services.MessageService;
import com.debateApp.Main.dto.AddMessageDTO;
import com.debateApp.Main.dto.MessageResponseDTO;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController{
    
    private final MessageService messageService;

    @PostMapping
    public MessageResponseDTO addMessage(@Valid @RequestBody AddMessageDTO dto){
        return messageService.addMessage(dto);
    }

    @GetMapping("/{id}")
    public Messages getMessage(@PathVariable Long id ){
        return messageService.getMessage(id);
    }

    @DeleteMapping("/{id}")
    public void deleteMessage(@PathVariable Long id){
        messageService.deleteMessage(id);
    }
    
}
