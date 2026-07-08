package com.debateApp.Main.services;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.debateApp.Main.entities.Groups;
import com.debateApp.Main.entities.Users;
import com.debateApp.Main.exceptions.BadRequestException;
import com.debateApp.Main.exceptions.ResourceNotFoundException;
import com.debateApp.Main.repositories.GroupRepository;
import com.debateApp.Main.repositories.UserRepository;

import jakarta.transaction.Transactional;

import com.debateApp.Main.dto.GroupResponseDTO;
import com.debateApp.Main.dto.CreateGroupDTO;
import com.debateApp.Main.dto.UpdateGroupDTO;

import lombok.*;

@Service
@RequiredArgsConstructor
public class GroupService {

    private final GroupRepository groupRepository;
    private final UserRepository userRepository;

    public GroupResponseDTO getGroup(Long id) {

        Groups group = groupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("The group was not found, id : " + id));

        return GroupResponseDTO.builder()
                .id(group.getId())
                .name(group.getName())
                .topic(group.getTopic())
                .creatorId(group.getCreator().getId())
                .creatorName(group.getCreator().getUserName())
                .build();
    }

    @Transactional
    public GroupResponseDTO createGroup(CreateGroupDTO dto) {

        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Users creator = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("The user was not found, id : " + userId));

        Groups group = new Groups();
        group.setName(dto.getName());
        group.setTopic(dto.getTopic());
        group.setCreator(creator);

        group = groupRepository.save(group);

        creator.getJoinedGroups().add(group);
        userRepository.save(creator);

        return GroupResponseDTO.builder()
                .id(group.getId())
                .name(group.getName())
                .topic(group.getTopic())
                .creatorId(group.getCreator().getId())
                .creatorName(group.getCreator().getUserName())
                .build();

    }

    public ResponseEntity<String> deleteGroup(Long id) {
        Groups group = groupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("The groups does not exist, id : " + id));

        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (group.getCreator().getId().equals(userId)) {
            groupRepository.deleteById(id);
            return ResponseEntity.ok("The Group was Deleted!!!");
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only the author can delete the group!");
        }
    }

    public GroupResponseDTO updateGroup(Long id, UpdateGroupDTO dto) {
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Groups existingGroup = groupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("The group not found, id : " + id));

        if (!existingGroup.getCreator().getId().equals(userId))
            throw new AccessDeniedException("Only the creator can upadte the group");

        if (dto.getName() != null)
            existingGroup.setName(dto.getName());

        if (dto.getTopic() != null)
            existingGroup.setTopic(dto.getTopic());

        groupRepository.save(existingGroup);

        return GroupResponseDTO.builder()
                .id(existingGroup.getId())
                .name(existingGroup.getName())
                .topic(existingGroup.getTopic())
                .creatorId(existingGroup.getCreator().getId())
                .creatorName(existingGroup.getCreator().getUserName())
                .build();

    }

    @Transactional
    public void addMember(Long id) {
        Groups existingGroup = groupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found, id : " + id));

        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (existingGroup.getMembers().stream().anyMatch(member -> member.getId().equals(userId)))
            throw new BadRequestException("You are already a member of this group.");

        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found, id : " + userId));

        user.getJoinedGroups().add(existingGroup);
        userRepository.save(user);
    }

}
