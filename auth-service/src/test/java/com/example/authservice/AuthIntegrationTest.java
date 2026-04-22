package com.example.authservice;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class AuthIntegrationTest {

    @LocalServerPort	
    private int port;

    @Test
    void shouldRegisterAndLoginUser() throws Exception {

        String username = "user_" + System.currentTimeMillis();

        // ------------------ REGISTER ------------------
        URL registerUrl = new URL("http://localhost:" + port + "/api/auth/register");

        HttpURLConnection registerConn = (HttpURLConnection) registerUrl.openConnection();
        registerConn.setRequestMethod("POST");
        registerConn.setRequestProperty("Content-Type", "application/json");
        registerConn.setDoOutput(true);

        String registerBody = """
        {
          "username": "%s",
          "password": "123",
          "role": "USER"
        }
        """.formatted(username);

        try (OutputStream os = registerConn.getOutputStream()) {
            os.write(registerBody.getBytes());
        }

        int registerStatus = registerConn.getResponseCode();
        assertThat(registerStatus).isIn(200, 201, 400);

        // ------------------ LOGIN ------------------
        URL loginUrl = new URL("http://localhost:" + port + "/api/auth/login");

        HttpURLConnection loginConn = (HttpURLConnection) loginUrl.openConnection();
        loginConn.setRequestMethod("POST");
        loginConn.setRequestProperty("Content-Type", "application/json");
        loginConn.setDoOutput(true);

        String loginBody = """
        {
          "username": "%s",
          "password": "123"
        }
        """.formatted(username);

        try (OutputStream os = loginConn.getOutputStream()) {
            os.write(loginBody.getBytes());
        }

        int loginStatus = loginConn.getResponseCode();
        assertThat(loginStatus).isEqualTo(200);

        // Read response body
        BufferedReader reader = new BufferedReader(
                new InputStreamReader(loginConn.getInputStream())
        );

        StringBuilder response = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            response.append(line);
        }

        String responseBody = response.toString();

        // ------------------ ASSERT TOKEN ------------------
        assertThat(responseBody).contains("accessToken");
    }
}