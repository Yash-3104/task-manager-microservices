package com.example.authservice.controller;

import com.example.authservice.dto.*;
import com.example.authservice.model.Role;
import com.example.authservice.model.User;
import com.example.authservice.service.UserService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService service;

    public AuthController(UserService service) {
        this.service = service;
    }

    // ✅ REGISTER (with validation + DTO)
    @PostMapping("/register")
    public UserResponse register(@Valid @RequestBody RegisterRequest request) {

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword());
        user.setRole(Role.valueOf(request.getRole()));

        User savedUser = service.register(user);
        return service.toResponse(savedUser);
    }

    // ✅ LOGIN (returns access + refresh token)
    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return service.login(request);
    }

    // ✅ REFRESH TOKEN
    @PostMapping("/refresh")
    public String refresh(@RequestBody String refreshToken) {
        return service.refreshAccessToken(refreshToken);
    }
}