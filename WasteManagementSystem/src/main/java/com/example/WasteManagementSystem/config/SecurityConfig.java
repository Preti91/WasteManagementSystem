package com.example.WasteManagementSystem.config;

import com.example.WasteManagementSystem.security.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;

import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;


@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;


    // =========================================================
    // SECURITY FILTER CHAIN
    // =========================================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http

                // -------------------------------------------------
                // CSRF
                // -------------------------------------------------

                .csrf(
                        csrf -> csrf.disable()
                )


                // -------------------------------------------------
                // CORS
                // -------------------------------------------------

                .cors(
                        cors ->
                                cors.configurationSource(
                                        corsConfigurationSource()
                                )
                )


                // -------------------------------------------------
                // SESSION
                // -------------------------------------------------

                .sessionManagement(
                        session ->
                                session.sessionCreationPolicy(
                                        SessionCreationPolicy.STATELESS
                                )
                )


                // -------------------------------------------------
                // AUTHORIZATION
                // -------------------------------------------------

                .authorizeHttpRequests(

                        auth -> auth


                                // =================================
                                // PUBLIC FRONTEND
                                // =================================

                                .requestMatchers(

                                        "/",

                                        "/index.html",

                                        "/login.html",

                                        "/register.html",

                                        "/map.html",

                                        "/user-dashboard.html",

                                        "/report.html",

                                        "/chatbot.html",

                                        "/notifications.html",

                                        "/recycling.html",

                                        "/rewards.html",

                                        "/certificates.html",

                                        "/leaderboard.html",

                                        "/admin-dashboard.html",

                                        "/cleaning-worker.html",

                                        "/recycling-worker.html",
                                        "/forgot-password.html",

                                        "/css/**",

                                        "/js/**",

                                        "/images/**",

                                        "/uploads/**",
                                        "/api/auth/**",

                                        "/favicon.ico"

                                ).permitAll()


                                // =================================
                                // AUTH
                                // =================================

                                .requestMatchers(
                                        "/api/auth/**"
                                ).permitAll()


                                // =================================
                                // AI
                                // =================================

                                .requestMatchers(
                                        "/api/ai/**"
                                ).permitAll()


                                // =================================
                                // ADMIN
                                // =================================

                                .requestMatchers(
                                        "/api/admin/**"
                                ).hasRole("ADMIN")


                                // =================================
                                // CLEANING WORKER
                                // =================================

                                .requestMatchers(
                                        "/api/cleaning-worker/**"
                                ).hasRole(
                                        "CLEANING_WORKER"
                                )


                                // =================================
                                // RECYCLING WORKER
                                // =================================

                                .requestMatchers(
                                        "/api/recycling-worker/**"
                                ).hasRole(
                                        "RECYCLING_WORKER"
                                )


                                // =================================
                                // GARBAGE
                                // =================================

                                .requestMatchers(
                                        "/api/garbage/**"
                                ).authenticated()


                                // =================================
                                // RECYCLING
                                // =================================

                                .requestMatchers(
                                        "/api/recycling/**"
                                ).authenticated()


                                // =================================
                                // REWARDS
                                // =================================

                                .requestMatchers(
                                        "/api/rewards/**"
                                ).authenticated()


                                // =================================
                                // CERTIFICATES
                                // =================================

                                .requestMatchers(
                                        "/api/certificates/**"
                                ).authenticated()


                                // =================================
                                // LEADERBOARD
                                // =================================

                                .requestMatchers(
                                        "/api/leaderboard/**"
                                ).authenticated()


                                // =================================
                                // NOTIFICATIONS
                                // =================================

                                .requestMatchers(
                                        "/api/notifications/**"
                                ).authenticated()


                                // =================================
                                // CHATBOT
                                // =================================

                                .requestMatchers(
                                        "/api/chatbot/**"
                                ).authenticated()


                                // =================================
                                // MAP
                                // =================================

                                .requestMatchers(
                                        "/api/map/**"
                                ).authenticated()


                                // =================================
                                // EVERYTHING ELSE
                                // =================================

                                .anyRequest()
                                .authenticated()
                )


                // -------------------------------------------------
                // JWT FILTER
                // -------------------------------------------------

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );


        return http.build();
    }


    // =========================================================
    // PASSWORD ENCODER
    // =========================================================

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }


    // =========================================================
    // AUTHENTICATION MANAGER
    // =========================================================

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration
    ) throws Exception {

        return configuration.getAuthenticationManager();
    }


    // =========================================================
    // CORS
    // =========================================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();


        configuration.setAllowedOrigins(

                List.of(

                        "http://localhost:8081",

                        "http://127.0.0.1:8081",

                        "http://localhost:5500",

                        "http://127.0.0.1:5500"

                )
        );


        configuration.setAllowedMethods(

                List.of(

                        "GET",

                        "POST",

                        "PUT",

                        "DELETE",

                        "PATCH",

                        "OPTIONS"

                )
        );


        configuration.setAllowedHeaders(

                List.of(

                        "Authorization",

                        "Content-Type",

                        "Accept",

                        "Origin",

                        "X-Requested-With"

                )
        );


        configuration.setExposedHeaders(

                List.of(
                        "Authorization"
                )
        );


        configuration.setAllowCredentials(
                true
        );


        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();


        source.registerCorsConfiguration(
                "/**",
                configuration
        );


        return source;
    }
}