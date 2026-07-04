package com.debateApp.Main.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.authentication.BadCredentialsException;

import com.debateApp.Main.dto.LoginDTO;
import com.debateApp.Main.entities.Users;
import com.debateApp.Main.repositories.UserRepository;
import com.debateApp.Main.services.JWTService;
import com.debateApp.Main.services.PasswordService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordService passwordService;
    private final JWTService jwtService;

    @PostMapping("/login")
    public ResponseEntity<String> login(@Valid @RequestBody LoginDTO dto){
        Users user = userRepository.findByUserName(dto.getUserName())
            .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if(!passwordService.verifyPassword(dto.getPassword(), user.getPasswordHash())){
            throw new BadCredentialsException("Invalid username or password");
        }

        String token = jwtService.generateToken(dto.getUserName());

        return ResponseEntity.ok(token);
    }
}
