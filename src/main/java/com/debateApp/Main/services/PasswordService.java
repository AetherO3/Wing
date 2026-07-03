package com.debateApp.Main.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
@RequiredArgsConstructor
public class PasswordService{

    private final PasswordEncoder encoder;

    public String hashPassword(String plainPassword){
        return encoder.encode(plainPassword);
    }

    public boolean verifyPassword(String plainPassword, String hash){
        return encoder.matches(plainPassword, hash);
    }
}
