package com.debateApp.Main.services;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import com.debateApp.Main.dto.*;
import com.debateApp.Main.entities.Users;
import com.debateApp.Main.exceptions.ResourceNotFoundException;
import com.debateApp.Main.exceptions.ResourceAlreadyExistsException;
import com.debateApp.Main.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordService passwordService;

    @PreAuthorize("#id == authentication.principal")
    public UserResponseDTO getUser(Long id) {

        Users user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User Not Found id : " + id));

        return toResponse(user);
    }

    public UserResponseDTO createUser(CreateUserDTO dto) {

        if (userRepository.existsByUserName(dto.getUserName()))
            throw new ResourceAlreadyExistsException("Username already taken.");

        if (userRepository.existsByEmail(dto.getEmail()))
            throw new ResourceAlreadyExistsException("Email already taken.");

        Users user = new Users();

        user.setUserName(dto.getUserName());
        user.setEmail(dto.getEmail());

        user.setPasswordHash(passwordService.hashPassword(dto.getPassword()));

        userRepository.save(user);

        return UserResponseDTO.builder()
                .id(user.getId())
                .userName(user.getUserName())
                .email(user.getEmail())
                .build();
    }

    @PreAuthorize("#id == authentication.principal")
    public void deleteUser(Long id, DeleteUserDTO dto) {

        Users user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found, id : " + id));

        if (!validatePassword(user.getPasswordHash(), dto.getPassword())) {
            throw new BadCredentialsException("Invalid password");
        }

        userRepository.delete(user);
    }

    @PreAuthorize("#id == authentication.principal")
    public UserResponseDTO updateUser(Long id, UpdateUserDTO dto) {
        Users user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User Not Found id:" + id));

        if (!user.getUserName().equals(dto.getUserName())
                && userRepository.existsByUserName(dto.getUserName())) {
            throw new ResourceAlreadyExistsException("Username already taken.");
        }

        if (!user.getEmail().equals(dto.getEmail())
                && userRepository.existsByEmail(dto.getEmail())) {
            throw new ResourceAlreadyExistsException("Email already taken.");
        }

        user.setUserName(dto.getUserName());
        user.setEmail(dto.getEmail());
        user = userRepository.save(user);

        return toResponse(user);
    }

    @PreAuthorize("#id == authentication.principal")
    public void changePassword(Long id, ChangePasswordDTO dto) {
        Users user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found, id : " + id));

        if (validatePassword(user.getPasswordHash(), dto.getOldPassword())) {

            user.setPasswordHash(passwordService.hashPassword(dto.getNewPassword()));
            userRepository.save(user);
        }

        else
            throw new BadCredentialsException("Invalid Password.");
    }

    public boolean validatePassword(String passwordHash, String password) {

        return passwordService.verifyPassword(password, passwordHash);

    }

    private UserResponseDTO toResponse(Users user) {
        return UserResponseDTO.builder()
                .id(user.getId())
                .userName(user.getUserName())
                .email(user.getEmail())
                .build();
    }
}
