package com.debateApp.Main.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.debateApp.Main.services.GroupService;
import com.debateApp.Main.dto.GroupResponseDTO;
import com.debateApp.Main.dto.CreateGroupDTO;
import com.debateApp.Main.dto.UpdateGroupDTO;

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

    @GetMapping("/search")
    public List<GroupResponseDTO> searchGroups(@RequestParam String name) {
        return groupService.searchGroups(name);
    }

    @GetMapping("/joinedGroups")
    public List<GroupResponseDTO> getJoinedGroups(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();

        return groupService.getJoinedGroups(userId);
    }

    @GetMapping("/{id}/leaveGroup")
    public void leaveGroup(@PathVariable Long id){
        groupService.removeMember(id);
    }

    @PostMapping
    public GroupResponseDTO createGroup(@Valid @RequestBody CreateGroupDTO dto) {
        return groupService.createGroup(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteGroup(@PathVariable Long id) {
        return groupService.deleteGroup(id);
    }

    @PatchMapping("/{id}")
    public GroupResponseDTO updateGroup(@PathVariable Long id, @Valid @RequestBody UpdateGroupDTO dto) {
        return groupService.updateGroup(id, dto);
    }

    @PostMapping("/{id}/addMember")
    public void addMember(@PathVariable Long id) {
        groupService.addMember(id);
    }
}
