package com.example.taskservice.config;

import com.example.taskservice.security.JwtFilter;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;	
import com.example.taskservice.security.JwtUtil;
import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http, JwtUtil jwtUtil) throws Exception {
			
	    http
	        .csrf(AbstractHttpConfigurer::disable)
	        .headers(headers -> headers.frameOptions(frame -> frame.disable())) // 
	        .authorizeHttpRequests(auth -> auth
	            .requestMatchers("/h2-console/**").permitAll()  // 
	            .anyRequest().authenticated()
	        )
	        .addFilterBefore(new JwtFilter(jwtUtil),
	                UsernamePasswordAuthenticationFilter.class);

	    return http.build();
	}
}