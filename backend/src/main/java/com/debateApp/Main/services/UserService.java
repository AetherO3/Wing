package com.debateApp.Main.services;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import com.debateApp.Main.dto.*;
import com.debateApp.Main.entities.Users;
import com.debateApp.Main.exceptions.ResourceNotFoundException;
import com.debateApp.Main.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordService passwordService;

    @PreAuthorize("#id == authentication.principal")
    public UserResponseDTO getUser(Long id) {

        Users user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User Not Found id : " + id));

        return UserResponseDTO.builder()
                .id(user.getId())
                .userName(user.getUserName())
                .email(user.getEmail())
                .build();

    }

    public UserResponseDTO createUser(CreateUserDTO dto) {
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
    public ResponseEntity<String> deleteUser(Long id, DeleteUserDTO dto) {

        if (validatePassword(id, dto.getPassword())){  
            userRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        else
            throw new BadCredentialsException("Invalid password");
    }

    @PreAuthorize("#id == authentication.principal")
    public UserResponseDTO updateUser(Long id, UpdateUserDTO dto) {
        Users user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User Not Found id:" + id));

        user.setUserName(dto.getUserName());
        user = userRepository.save(user);

        // TODO Email is set as not updateable rn, but later an otp confirmation can be used to update the email.

        return UserResponseDTO.builder()
                .id(user.getId())
                .userName(user.getUserName())
                .email(user.getEmail())
                .build();
    }

  @PreAuthorize("#id == authentication.principal")
    public void changePassword(Long id, ChangePasswordDTO dto) {
        Users user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found, id : " + id));

        if (validatePassword(id, dto.getOldPassword())) {

            user.setPasswordHash(passwordService.hashPassword(dto.getNewPassword()));
            userRepository.save(user);
        }

        else
            throw new BadCredentialsException("Invalid Password.");
    }

    public boolean validatePassword(Long id, String password) {

        Users user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User Not Found id:" + id));

        return passwordService.verifyPassword(password, user.getPasswordHash());

    }

}
