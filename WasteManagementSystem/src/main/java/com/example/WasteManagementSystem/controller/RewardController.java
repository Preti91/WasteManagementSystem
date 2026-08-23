package com.example.WasteManagementSystem.controller;

import com.example.WasteManagementSystem.dto.LeaderboardResponse;
import com.example.WasteManagementSystem.dto.RewardCatalogItemResponse;
import com.example.WasteManagementSystem.dto.RewardSummaryResponse;
import com.example.WasteManagementSystem.service.RewardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rewards")
@RequiredArgsConstructor
public class RewardController {

    private final RewardService rewardService;


    // =========================================================
    // USER - GET MY REWARDS
    // =========================================================

    @GetMapping
    public ResponseEntity<RewardSummaryResponse> getMyRewards(
            Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }

        String email = authentication.getName();

        return ResponseEntity.ok(
                rewardService.getMyRewards(email)
        );
    }


    // =========================================================
    // USER - GET TOTAL POINTS
    // =========================================================

    @GetMapping("/points")
    public ResponseEntity<Integer> getMyPoints(
            Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }

        String email = authentication.getName();

        return ResponseEntity.ok(
                rewardService.getTotalPoints(email)
        );
    }


    // =========================================================
    // GET REWARD CATALOG
    // =========================================================

    @GetMapping("/catalog")
    public ResponseEntity<List<RewardCatalogItemResponse>>
    getCatalog() {

        return ResponseEntity.ok(
                rewardService.getCatalog()
        );
    }


    // =========================================================
    // GET LEADERBOARD
    // =========================================================

    @GetMapping("/leaderboard")
    public ResponseEntity<List<LeaderboardResponse>>
    getLeaderboard() {

        return ResponseEntity.ok(
                rewardService.getLeaderboard()
        );
    }


    // =========================================================
    // USER - REDEEM A REWARD
    // =========================================================

    @PostMapping("/{rewardId}/redeem")
    public ResponseEntity<RewardSummaryResponse> redeemReward(
            @PathVariable Long rewardId,
            Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }

        String email = authentication.getName();

        return ResponseEntity.ok(
                rewardService.redeemReward(email, rewardId)
        );
    }
}