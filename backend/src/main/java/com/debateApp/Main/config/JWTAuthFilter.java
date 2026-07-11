package com.debateApp.Main.config;

import com.debateApp.Main.controllers.AuthController;
import com.debateApp.Main.services.JWTService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.constraints.NotNull;

import java.io.IOException;
import java.util.Collections;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JWTAuthFilter extends OncePerRequestFilter {

    private final JWTService jwtService;

    private String extractToken(HttpServletRequest request) {
        Cookie cookie[] = request.getCookies();

        if (cookie == null)
            return null;

        for (Cookie c : cookie)
            if (AuthController.COOKIE_NAME.equals(c.getName()))
                return c.getValue();

        return null;
    }

    @Override
    protected void doFilterInternal(@NotNull HttpServletRequest request, @NotNull HttpServletResponse response,
            @NotNull FilterChain filterChain) throws ServletException, IOException {

        String token = extractToken(request);

        if (token != null) {
            try {
                if (jwtService.isTokenValid(token)) {
                    Long userId = jwtService.extractUserName(token);

                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userId,
                            null,
                            Collections.emptyList());

                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            } catch (Exception e) {

            }
        }
        filterChain.doFilter(request, response);
    }
}
