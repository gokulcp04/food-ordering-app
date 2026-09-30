package com.foodapp.security;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHashGenerator {

    public static void main(String[] args) {

        BCryptPasswordEncoder encoder =
                new BCryptPasswordEncoder();

        String password = "Admin@12345";

        String hash = encoder.encode(password);

        System.out.println("Password: " + password);
        System.out.println("BCrypt hash: " + hash);
    }
}