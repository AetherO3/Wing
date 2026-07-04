package com.debateApp.Main.services;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;

@Service
public class JWTService {

    private final SecretKey key;
    private final long expirationTime;

    public JWTService(@Value("${JWT_SECRET}") String secret, @Value("${JWT_EXPIRATION_MS:3600000}") long expirationMs){
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        this.expirationTime = expirationMs;
    }


    public String generateToken(String userName){
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationTime);

        return Jwts.builder()
            .subject(userName)
            .issuedAt(now)
            .expiration(expiry)
            .signWith(key)
            .compact();
    }

    public String extractUserName(String token){
        return parseClaims(token).getSubject();
    }

    public boolean isTokenValid(String token){
        try{
            Claims claim = parseClaims(token);
            return claim.getExpiration().after(new Date());
        }
        catch(Exception e){
            return false;
        }
    }

    public Claims parseClaims(String token){
        return Jwts.parser()
            .verifyWith(key)
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }
}
