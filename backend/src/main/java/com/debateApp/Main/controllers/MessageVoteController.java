package com.debateApp.Main.controllers;

import java.util.Map;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.debateApp.Main.entities.Stance;
import com.debateApp.Main.services.MessageVoteService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/messagevote")
@RequiredArgsConstructor
public class MessageVoteController {

    private final MessageVoteService messageVoteService;

    @GetMapping("/agreers/{messageId}")
    public long getAgreeCount(@PathVariable Long messageId) {
        return messageVoteService.getAgreeCount(messageId);
    }

    @GetMapping("/disagreers/{messageId}")
    public long getDisagreeCount(@PathVariable Long messageId) {
        return messageVoteService.getDisagreeCount(messageId);
    }

    @PostMapping("/addAgree")
    public Map<String, Long> agree(@RequestParam Long messageId) {
        return castVote(messageId, Stance.PRO);
    }

    @PostMapping("/addDisagree")
    public Map<String, Long> disagree(@RequestParam Long messageId) {
        return castVote(messageId, Stance.AGAINST);
    }

    private Map<String, Long> castVote(Long messageId, Stance stance){
        Long userId = (Long)SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        messageVoteService.vote(userId, messageId, stance);

        return Map.of( "agreeCount",messageVoteService.getAgreeCount(messageId),
                "disagreeCount",messageVoteService.getDisagreeCount(messageId));
    }

}
