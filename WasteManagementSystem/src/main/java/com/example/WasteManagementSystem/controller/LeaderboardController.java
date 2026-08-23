package com.example.WasteManagementSystem.controller;

import com.example.WasteManagementSystem.dto.LeaderboardResponse;
import com.example.WasteManagementSystem.service.RewardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {

    private final RewardService rewardService;

    @GetMapping
    public ResponseEntity<List<LeaderboardResponse>>
    getLeaderboard() {

        return ResponseEntity.ok(
                rewardService.getLeaderboard()
        );
    }
}