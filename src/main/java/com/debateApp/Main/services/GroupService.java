package com.debateApp.Main.services;

import org.springframework.stereotype.Service;

import com.debateApp.Main.entities.Groups;
import com.debateApp.Main.entities.Users;
import com.debateApp.Main.repositories.GroupRepository;
import com.debateApp.Main.repositories.UserRepository;

import jakarta.transaction.Transactional;

import com.debateApp.Main.dto.GroupResponseDTO;
import com.debateApp.Main.dto.CreateGroupDTO;

import lombok.*;

@Service
@RequiredArgsConstructor
public class GroupService {

    //TODO:Add addMembers() and validate the user to be the owner before deleting the group.
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

    public void deleteGroup(Long id) {
        groupRepository.deleteById(id);
    }

    public Groups updateGroup(Long id, Groups group) {

        Groups existingGroup = groupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Group not found, id : " + id));

        existingGroup.setName(group.getName());
        existingGroup.setMembers(group.getMembers());

        return groupRepository.save(existingGroup);
    }

}
