package com.example.WasteManagementSystem.security;

import com.example.WasteManagementSystem.entity.User;
import com.example.WasteManagementSystem.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtService jwtService;

    private final UserRepository userRepository;


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {


        // =====================================================
        // GET AUTHORIZATION HEADER
        // =====================================================

        final String authorizationHeader =
                request.getHeader("Authorization");


        // =====================================================
        // NO JWT
        // =====================================================

        if (authorizationHeader == null ||
                !authorizationHeader.startsWith("Bearer ")) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }


        // =====================================================
        // EXTRACT TOKEN
        // =====================================================

        String token =
                authorizationHeader.substring(7);


        try {

            // =================================================
            // GET EMAIL FROM JWT
            // =================================================

            String email =
                    jwtService.extractUsername(token);


            // =================================================
            // ONLY AUTHENTICATE IF NOT ALREADY AUTHENTICATED
            // =================================================

            if (email != null &&
                    SecurityContextHolder
                            .getContext()
                            .getAuthentication() == null) {


                // =============================================
                // FIND USER FROM DATABASE
                // =============================================

                User user =
                        userRepository
                                .findByEmail(email)
                                .orElse(null);


                if (user != null) {


                    // =========================================
                    // VERIFY JWT
                    // =========================================

                    UserDetails userDetails =
                            org.springframework.security.core.userdetails.User
                                    .withUsername(
                                            user.getEmail()
                                    )
                                    .password(
                                            user.getPassword()
                                    )
                                    .roles(
                                            user.getRole().name()
                                    )
                                    .build();


                    boolean valid =
                            jwtService.isTokenValid(
                                    token,
                                    userDetails
                            );


                    if (valid) {


                        // =====================================
                        // IMPORTANT
                        //
                        // .roles("RECYCLING_WORKER")
                        // creates:
                        //
                        // ROLE_RECYCLING_WORKER
                        // =====================================

                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(

                                        userDetails,

                                        null,

                                        List.of(
                                                new SimpleGrantedAuthority(
                                                        "ROLE_" +
                                                                user.getRole().name()
                                                )
                                        )
                                );


                        authentication.setDetails(
                                request
                        );


                        // =====================================
                        // PUT AUTHENTICATION INTO SECURITY
                        // CONTEXT
                        // =====================================

                        SecurityContextHolder
                                .getContext()
                                .setAuthentication(
                                        authentication
                                );


                        // =====================================
                        // DEBUG
                        // =====================================

                        System.out.println(
                                "JWT AUTHENTICATED"
                        );

                        System.out.println(
                                "EMAIL = " +
                                        user.getEmail()
                        );

                        System.out.println(
                                "ROLE = " +
                                        user.getRole().name()
                        );

                        System.out.println(
                                "AUTHORITY = ROLE_" +
                                        user.getRole().name()
                        );
                    }
                }
            }

        } catch (Exception e) {

            System.out.println(
                    "JWT ERROR = " +
                            e.getMessage()
            );

            SecurityContextHolder
                    .clearContext();
        }


        filterChain.doFilter(
                request,
                response
        );
    }
}