package com.debateApp.Main.controllers;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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
    public Page<GroupResponseDTO> searchGroups(@RequestParam String name, @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 50);
        String query = name.length() > 50 ? name.substring(0, 50) : name;

        return groupService.searchGroups(query, PageRequest.of(safePage, safeSize));
    }

    @GetMapping("/joinedGroups")
    public List<GroupResponseDTO> getJoinedGroups(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();

        return groupService.getJoinedGroups(userId);
    }

    @DeleteMapping("/{id}/leaveGroup")
    public void leaveGroup(@PathVariable Long id) {
        groupService.removeMember(id);
    }

    @PostMapping("/create")
    public GroupResponseDTO createGroup(@Valid @RequestBody CreateGroupDTO dto) {
        return groupService.createGroup(dto);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteGroup(@PathVariable Long id) {
        groupService.deleteGroup(id);
    }

    @PatchMapping("/update/{id}")
    public GroupResponseDTO updateGroup(@PathVariable Long id, @Valid @RequestBody UpdateGroupDTO dto) {
        return groupService.updateGroup(id, dto);
    }

    @PostMapping("/{id}/addMember")
    public void addMember(@PathVariable Long id) {
        groupService.addMember(id);
    }
}
