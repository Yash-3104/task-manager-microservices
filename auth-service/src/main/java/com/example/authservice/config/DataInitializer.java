package com.example.authservice.config;

import com.example.authservice.model.Role;
import com.example.authservice.model.User;
import com.example.authservice.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initAdmin(UserRepository repo, PasswordEncoder encoder) {
        return args -> {

            if (repo.findByUsername("admin").isEmpty()) {

                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(encoder.encode("admin@123"));
                admin.setRole(Role.ADMIN);

                repo.save(admin);

                System.out.println("🔥 Default admin created: admin / admin@123");
            }
        };
    }
}