package com.example.taskservice.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Base64;

@Component
public class JwtUtil {

    // 🔥 SAME SECRET as auth-service
    private static final String SECRET = "mysecretkeymysecretkeymysecretkey12";

    private final Key key = Keys.hmacShaKeyFor(
            Base64.getEncoder().encode(SECRET.getBytes())
    );

    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
    public String extractRole(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("role", String.class);
    }	
}