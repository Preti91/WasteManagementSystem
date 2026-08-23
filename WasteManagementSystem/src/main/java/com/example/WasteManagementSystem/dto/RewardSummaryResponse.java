package com.example.WasteManagementSystem.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class RewardSummaryResponse {

    private Integer totalPoints;

    private List<RewardResponse> history;
}