package com.debateApp.Main.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
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
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    public static final String COOKIE_NAME = "auth_token";

    private final UserRepository userRepository;
    private final PasswordService passwordService;
    private final JWTService jwtService;
    private final Map<String, Bucket> loginBuckets = new ConcurrentHashMap<>();

    @Value("${app.cookie-secure}")
    private boolean cookieSecure;

    private Bucket newLoginBucket(){
        return Bucket.builder()
            .addLimit(limit -> limit.capacity(10).refillGreedy(10, Duration.ofMinutes(10)))
            .build();
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@Valid @RequestBody LoginDTO dto, HttpServletRequest request) {
        
        Bucket bucket =  loginBuckets.computeIfAbsent(request.getRemoteAddr(), ip -> newLoginBucket());
        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);

        if(!probe.isConsumed()){
            long retryAfter = Math.max(1, TimeUnit.NANOSECONDS.toSeconds(probe.getNanosToWaitForRefill()));
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .header(HttpHeaders.RETRY_AFTER, String.valueOf(retryAfter))
                .body("Too many login attempts.");
        }

        // same error to prevent from guesing the username depending on the type of
        // error code received.
        Users user = userRepository.findByUserName(dto.getUserName())
                .orElseThrow(() -> new BadCredentialsException("Invalid username or password"));

        if (!passwordService.verifyPassword(dto.getPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid username or password");
        }

        String token = jwtService.generateToken(user.getId());

        ResponseCookie cookie = ResponseCookie.from(COOKIE_NAME, token)
                .httpOnly(true)
                .secure(cookieSecure)
                // strict or lax for same sit or corss site requests
                .sameSite("Lax")
                .path("/")
                .maxAge(jwtService.getExpirationSeconds())
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("Logged In");
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        ResponseCookie cookie = ResponseCookie.from(COOKIE_NAME, "")
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite("Lax")
                .path("/")
                .maxAge(0)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("Logged Out");
    }
}
