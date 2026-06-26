package com.debateApp.Main.services;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PasswordService{
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public String hashPassword(String plainPassword){
        return encoder.encode(plainPassword);
    }

    public boolean verifyPassword(String plainPassword, String hash){
        return encoder.matches(plainPassword, hash);
    }
}
