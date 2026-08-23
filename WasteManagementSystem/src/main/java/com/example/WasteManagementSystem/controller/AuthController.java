package com.example.WasteManagementSystem.controller;

import com.example.WasteManagementSystem.dto.ForgotPasswordRequest;
import com.example.WasteManagementSystem.dto.LoginRequest;
import com.example.WasteManagementSystem.dto.LoginResponse;
import com.example.WasteManagementSystem.dto.RegisterRequest;
import com.example.WasteManagementSystem.dto.ResetPasswordRequest;
import com.example.WasteManagementSystem.dto.VerifyOtpRequest;
import com.example.WasteManagementSystem.service.AuthService;
import com.example.WasteManagementSystem.service.PasswordResetService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    private final PasswordResetService passwordResetService;


    // =========================================================
    // REGISTER
    // =========================================================

    @PostMapping("/register")
    public ResponseEntity<String> register(
            @Valid @RequestBody RegisterRequest request
    ) {

        return ResponseEntity.ok(
                authService.register(request)
        );
    }


    // =========================================================
    // LOGIN
    // =========================================================

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {

        return ResponseEntity.ok(
                authService.login(request)
        );
    }


    // =========================================================
    // FORGOT PASSWORD
    // =========================================================

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request
    ) {

        return ResponseEntity.ok(
                passwordResetService.sendOtp(
                        request.getEmail()
                )
        );
    }


    // =========================================================
    // VERIFY OTP
    // =========================================================

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request
    ) {

        return ResponseEntity.ok(
                passwordResetService.verifyOtp(
                        request.getEmail(),
                        request.getOtp()
                )
        );
    }


    // =========================================================
    // RESET PASSWORD
    // =========================================================

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request
    ) {

        return ResponseEntity.ok(
                passwordResetService.resetPassword(
                        request.getEmail(),
                        request.getOtp(),
                        request.getNewPassword(),
                        request.getConfirmPassword()
                )
        );
    }
}