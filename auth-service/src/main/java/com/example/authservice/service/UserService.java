package com.example.authservice.service;

import com.example.authservice.model.*;
import com.example.authservice.repository.UserRepository;
import com.example.authservice.repository.RefreshTokenRepository;
import com.example.authservice.security.JwtUtil;
import com.example.authservice.dto.LoginRequest;
import com.example.authservice.dto.LoginResponse;
import com.example.authservice.dto.UserResponse;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository repo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;
    private final RefreshTokenRepository refreshRepo;

    public UserService(UserRepository repo,
                       PasswordEncoder encoder,
                       JwtUtil jwtUtil,
                       RefreshTokenRepository refreshRepo) {
        this.repo = repo;
        this.encoder = encoder;
        this.jwtUtil = jwtUtil;
        this.refreshRepo = refreshRepo;
    }

    // ✅ REGISTER
    public User register(User user) {
        user.setPassword(encoder.encode(user.getPassword()));
        return repo.save(user);
    }

    // ✅ LOGIN (ACCESS + REFRESH TOKEN)
    public LoginResponse login(LoginRequest request) {

        User user = repo.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!encoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // 🔥 Access token (JWT)
        String accessToken = jwtUtil.generateToken(
                user.getUsername(),
                user.getRole().name()
        );

        // 🔥 Refresh token
        String refreshToken = UUID.randomUUID().toString();

        RefreshToken token = new RefreshToken();
        token.setUsername(user.getUsername());
        token.setToken(refreshToken);
        token.setExpiryDate(new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 24 * 7)); // 7 days

        refreshRepo.save(token);

        // 🔥 Response
        LoginResponse response = new LoginResponse();
        response.setAccessToken(accessToken);
        response.setRefreshToken(refreshToken);
        response.setRole(user.getRole().name());

        return response;
    }

    // ✅ REFRESH ACCESS TOKEN
    public String refreshAccessToken(String refreshToken) {

        RefreshToken token = refreshRepo.findByToken(refreshToken)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

        if (token.getExpiryDate().before(new Date())) {
            throw new RuntimeException("Refresh token expired");
        }

        // 🔥 get actual user to preserve role
        User user = repo.findByUsername(token.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return jwtUtil.generateToken(
                user.getUsername(),
                user.getRole().name()
        );
    }

    // ✅ DTO CONVERSION
    public UserResponse toResponse(User user) {
        UserResponse res = new UserResponse();
        res.setId(user.getId());
        res.setUsername(user.getUsername());
        res.setRole(user.getRole().name());
        return res;
    }
}