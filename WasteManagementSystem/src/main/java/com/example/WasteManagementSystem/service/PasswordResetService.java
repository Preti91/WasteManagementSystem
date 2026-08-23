package com.example.WasteManagementSystem.service;

import com.example.WasteManagementSystem.entity.PasswordResetToken;
import com.example.WasteManagementSystem.entity.User;
import com.example.WasteManagementSystem.repository.PasswordResetTokenRepository;
import com.example.WasteManagementSystem.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final UserRepository userRepository;

    private final PasswordResetTokenRepository passwordResetTokenRepository;

    private final PasswordEncoder passwordEncoder;


    // =========================================================
    // SEND OTP
    // =========================================================

    public String sendOtp(String email) {

        String normalizedEmail =
                email.trim().toLowerCase();


        // -----------------------------------------------------
        // Find user
        // -----------------------------------------------------

        User user =
                userRepository
                        .findByEmail(normalizedEmail)
                        .orElse(null);


        if (user == null) {

            throw new RuntimeException(
                    "No account found with this email."
            );
        }


        // -----------------------------------------------------
        // Delete old OTP
        // -----------------------------------------------------

        passwordResetTokenRepository
                .deleteByEmail(normalizedEmail);


        // -----------------------------------------------------
        // Generate new 6 digit OTP
        // -----------------------------------------------------

        String otp =
                generateOtp();


        // -----------------------------------------------------
        // OTP valid for 10 minutes
        // -----------------------------------------------------

        LocalDateTime expiresAt =
                LocalDateTime.now()
                        .plusMinutes(10);


        PasswordResetToken resetToken =
                PasswordResetToken.builder()

                        .email(normalizedEmail)

                        .otp(otp)

                        .expiresAt(expiresAt)

                        .used(false)

                        .build();


        passwordResetTokenRepository
                .save(resetToken);


        /*
         * LOCAL PROJECT MODE
         *
         * No Gmail.
         * No Google verification.
         * No SMS service.
         *
         * OTP is returned to the frontend.
         */

        return "OTP:" + otp;
    }


    // =========================================================
    // VERIFY OTP
    // =========================================================

    public String verifyOtp(
            String email,
            String otp
    ) {

        String normalizedEmail =
                email.trim().toLowerCase();


        PasswordResetToken token =
                passwordResetTokenRepository
                        .findTopByEmailAndOtpAndUsedFalseOrderByIdDesc(
                                normalizedEmail,
                                otp.trim()
                        )
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Invalid OTP."
                                        )
                        );


        // -----------------------------------------------------
        // Check expiry
        // -----------------------------------------------------

        if (
                token.getExpiresAt()
                        .isBefore(
                                LocalDateTime.now()
                        )
        ) {

            throw new RuntimeException(
                    "OTP has expired. Please request a new OTP."
            );
        }


        return "OTP verified successfully.";
    }


    // =========================================================
    // RESET PASSWORD
    // =========================================================

    public String resetPassword(
            String email,
            String otp,
            String newPassword,
            String confirmPassword
    ) {

        String normalizedEmail =
                email.trim().toLowerCase();


        // -----------------------------------------------------
        // Check password
        // -----------------------------------------------------

        if (!newPassword.equals(confirmPassword)) {

            throw new RuntimeException(
                    "Passwords do not match."
            );
        }


        if (newPassword.length() < 8) {

            throw new RuntimeException(
                    "Password must be at least 8 characters."
            );
        }


        // -----------------------------------------------------
        // Find valid OTP
        // -----------------------------------------------------

        PasswordResetToken token =
                passwordResetTokenRepository
                        .findTopByEmailAndOtpAndUsedFalseOrderByIdDesc(
                                normalizedEmail,
                                otp.trim()
                        )
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Invalid OTP."
                                        )
                        );


        // -----------------------------------------------------
        // Check OTP expiry
        // -----------------------------------------------------

        if (
                token.getExpiresAt()
                        .isBefore(
                                LocalDateTime.now()
                        )
        ) {

            throw new RuntimeException(
                    "OTP has expired. Please request a new OTP."
            );
        }


        // -----------------------------------------------------
        // Find user / worker
        // -----------------------------------------------------

        User user =
                userRepository
                        .findByEmail(normalizedEmail)
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Account not found."
                                        )
                        );


        // -----------------------------------------------------
        // Encode new password
        // -----------------------------------------------------

        user.setPassword(
                passwordEncoder.encode(
                        newPassword
                )
        );


        // -----------------------------------------------------
        // Save password
        // -----------------------------------------------------

        userRepository.save(user);


        // -----------------------------------------------------
        // Mark OTP as used
        // -----------------------------------------------------

        token.setUsed(true);

        passwordResetTokenRepository.save(token);


        return
                "Password reset successfully.";
    }


    // =========================================================
    // GENERATE OTP
    // =========================================================

    private String generateOtp() {

        SecureRandom random =
                new SecureRandom();


        int number =
                100000 +
                        random.nextInt(900000);


        return String.valueOf(number);
    }
}