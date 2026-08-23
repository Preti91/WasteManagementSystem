package com.example.WasteManagementSystem.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LeaderboardResponse {

    private int rank;

    private Long userId;

    private String name;

    private String email;

    private int totalPoints;
}