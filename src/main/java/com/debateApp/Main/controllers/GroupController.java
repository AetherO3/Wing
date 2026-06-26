package com.debateApp.Main.controllers;

import org.springframework.web.bind.annotation.*;

import com.debateApp.Main.entities.Groups;
import com.debateApp.Main.services.GroupService;
import com.debateApp.Main.dto.GroupResponseDTO;
import com.debateApp.Main.dto.CreateGroupDTO;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;

    @GetMapping("/{id}")
    public GroupResponseDTO getGroup(@PathVariable Long id) {
        return groupService.getGroup(id);
    }

    @PostMapping
    public GroupResponseDTO createGroup(@Valid @RequestBody CreateGroupDTO dto) {
        return groupService.createGroup(dto);
    }

    @DeleteMapping("/{id}")
    public void deleteGroup(@PathVariable Long id) {
        groupService.deleteGroup(id);
    }

    @PutMapping("/{id}")
    public Groups updateGroup(@PathVariable Long id, @Valid @RequestBody Groups group) {
        return groupService.updateGroup(id, group);
    }
}
