package com.example.WasteManagementSystem.service;

import com.example.WasteManagementSystem.dto.LoginRequest;
import com.example.WasteManagementSystem.dto.LoginResponse;
import com.example.WasteManagementSystem.dto.RegisterRequest;
import com.example.WasteManagementSystem.entity.User;
import com.example.WasteManagementSystem.enums.Role;
import com.example.WasteManagementSystem.repository.UserRepository;
import com.example.WasteManagementSystem.security.JwtService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    private final JwtService jwtService;


    // =========================================================
    // REGISTER
    // =========================================================

    public String register(RegisterRequest request) {

        // -----------------------------------------------------
        // Check email
        // -----------------------------------------------------

        String email = request.getEmail()
                .trim()
                .toLowerCase();


        if (userRepository.existsByEmail(email)) {

            throw new RuntimeException(
                    "Email already registered"
            );
        }


        // -----------------------------------------------------
        // Get requested role
        // -----------------------------------------------------

        Role role = Role.USER;


        /*
         * If your RegisterRequest has:
         *
         * private String role;
         *
         * then this will read it.
         */

        if (request.getRole() != null &&
                !request.getRole().trim().isEmpty()) {

            String requestedRole =
                    request.getRole()
                            .trim()
                            .toUpperCase();


            try {

                role =
                        Role.valueOf(
                                requestedRole
                        );

            } catch (IllegalArgumentException e) {

                throw new RuntimeException(
                        "Invalid role: " +
                                requestedRole
                );
            }
        }


        // -----------------------------------------------------
        // NEVER allow public registration as ADMIN
        // -----------------------------------------------------

        if (role == Role.ADMIN) {

            throw new RuntimeException(
                    "ADMIN account cannot be created from public registration"
            );
        }


        // -----------------------------------------------------
        // Create user
        // -----------------------------------------------------

        User user =
                User.builder()

                        .name(
                                request.getName()
                                        .trim()
                        )

                        .email(
                                email
                        )

                        /*
                         * VERY IMPORTANT:
                         *
                         * Password is stored using BCrypt.
                         */

                        .password(
                                passwordEncoder.encode(
                                        request.getPassword()
                                )
                        )

                        .role(
                                role
                        )

                        .build();


        // -----------------------------------------------------
        // Save
        // -----------------------------------------------------

        userRepository.save(user);


        return
                role.name() +
                        " registered successfully";
    }


    // =========================================================
    // LOGIN
    // =========================================================

    public LoginResponse login(
            LoginRequest request
    ) {

        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase();


        // -----------------------------------------------------
        // Make sure user exists
        // -----------------------------------------------------

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Invalid email or password"
                                        )
                        );


        // -----------------------------------------------------
        // IMPORTANT:
        //
        // AuthenticationManager checks:
        //
        // raw password
        //        vs
        // BCrypt password in DB
        // -----------------------------------------------------

        authenticationManager.authenticate(

                new UsernamePasswordAuthenticationToken(

                        email,

                        request.getPassword()

                )
        );


        // -----------------------------------------------------
        // Create UserDetails
        // -----------------------------------------------------

        UserDetails userDetails =

                org.springframework.security.core.userdetails.User

                        .withUsername(
                                user.getEmail()
                        )

                        .password(
                                user.getPassword()
                        )

                        .roles(
                                user.getRole()
                                        .name()
                        )

                        .build();


        // -----------------------------------------------------
        // Generate JWT
        // -----------------------------------------------------

        String token =
                jwtService.generateToken(
                        userDetails
                );


        // -----------------------------------------------------
        // Return login response
        // -----------------------------------------------------

        return new LoginResponse(

                token,

                user.getName(),

                user.getEmail(),

                user.getRole().name()

        );
    }
}