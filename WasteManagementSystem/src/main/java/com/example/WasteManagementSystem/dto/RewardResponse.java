package com.example.WasteManagementSystem.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class RewardResponse {

    private Long id;

    private Integer points;

    private String reason;

    private LocalDateTime createdAt;
}