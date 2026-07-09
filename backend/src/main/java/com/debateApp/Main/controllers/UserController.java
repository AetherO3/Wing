package com.debateApp.Main.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.debateApp.Main.dto.*;
import com.debateApp.Main.services.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    // The error is because lombok works at the run time but the
    // error analyzer works statically so it shows error even though
    // it the code complies just fine
    private final UserService userService;

    @PostMapping
    public UserResponseDTO createUser(@Valid @RequestBody CreateUserDTO dto) {
        return userService.createUser(dto);
    }

    @GetMapping("/{id}")
    public UserResponseDTO getUser(@PathVariable Long id) {
        return userService.getUser(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id, @Valid @RequestBody DeleteUserDTO dto) {
        return userService.deleteUser(id, dto);
    }

    @PutMapping("/{id}")
    public UserResponseDTO updateUser(@PathVariable Long id, @Valid @RequestBody UpdateUserDTO dto) {
        return userService.updateUser(id, dto);
    }

    @PatchMapping("/{id}")
    public void changePassword(@PathVariable Long id, @Valid @RequestBody ChangePasswordDTO dto){
        userService.changePassword(id, dto);
    }
}
