package com.example.WasteManagementSystem.repository;

import com.example.WasteManagementSystem.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository
        extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findTopByEmailAndOtpAndUsedFalseOrderByIdDesc(
            String email,
            String otp
    );

    void deleteByEmail(String email);
}