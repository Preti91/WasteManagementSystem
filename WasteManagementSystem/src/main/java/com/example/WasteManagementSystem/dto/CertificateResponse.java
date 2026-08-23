package com.example.WasteManagementSystem.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class CertificateResponse {

    private Long id;

    private String certificateCode;

    private String recipientName;

    private String rewardName;

    private Integer pointsSpent;

    private LocalDateTime issuedAt;

    private String message;
}
