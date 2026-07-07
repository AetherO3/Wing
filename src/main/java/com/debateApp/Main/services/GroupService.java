package com.debateApp.Main.services;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.debateApp.Main.entities.Groups;
import com.debateApp.Main.entities.Users;
import com.debateApp.Main.repositories.GroupRepository;
import com.debateApp.Main.repositories.UserRepository;

import jakarta.transaction.Transactional;

import com.debateApp.Main.dto.GroupResponseDTO;
import com.debateApp.Main.dto.CreateGroupDTO;
import com.debateApp.Main.dto.UpdateGroupDTO;
import com.debateApp.Main.dto.AddMemberDTO;

import lombok.*;

@Service
@RequiredArgsConstructor
public class GroupService {

    private final GroupRepository groupRepository;
    private final UserRepository userRepository;

    public GroupResponseDTO getGroup(Long id) {

        Groups group = groupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("The group was not found, id : " + id));

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

        Users creator = userRepository.findById(dto.getAuthorId())
                .orElseThrow(() -> new RuntimeException("The user was not found, id : " + dto.getAuthorId()));

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
            .orElseThrow(() -> new RuntimeException("The groups does not exist, id : " + id));

        Long userId = (Long)SecurityContextHolder.getContext()
            .getAuthentication()
            .getPrincipal();

        if(group.getCreator().getId().equals(userId)){
            groupRepository.deleteById(id);
            return ResponseEntity.ok("The Group was Deleted!!!");
        }
        else{
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only the author can delete the group!");
        }
    }

    public GroupResponseDTO updateGroup(Long id, UpdateGroupDTO dto) {

        Groups existingGroup = groupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("The group not found, id : " + id));

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
    public void addMember(Long id, AddMemberDTO dto) {
        Groups existingGroup = groupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Group not found, id : " + id));

        Users user = userRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Group not found, id : " + dto.getId()));

        user.getJoinedGroups().add(existingGroup);
        userRepository.save(user);
    }

}
