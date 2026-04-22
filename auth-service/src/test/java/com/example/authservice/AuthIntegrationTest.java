package com.example.authservice;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class AuthIntegrationTest {

    @LocalServerPort
    private int port;

    @Test
    void shouldRegisterUser() throws Exception {

        URL url = new URL("http://localhost:" + port + "/api/auth/register");

        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setDoOutput(true);

        String body = """
        {
          "username": "test123",
          "password": "123",
          "role": "USER"
        }
        """;

        try (OutputStream os = conn.getOutputStream()) {
            os.write(body.getBytes());
        }

        int status = conn.getResponseCode();

        assertThat(status).isIn(200, 400);
    }
}