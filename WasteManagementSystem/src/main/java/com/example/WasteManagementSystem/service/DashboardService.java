//package com.example.WasteManagementSystem.service;
//
//import com.example.WasteManagementSystem.dto.DashboardResponse;
//import com.example.WasteManagementSystem.repository.UserRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//@Service
//@RequiredArgsConstructor
//public class DashboardService {
//
//    private final UserRepository userRepository;
//
//    public DashboardResponse getDashboard() {
//
//        return DashboardResponse.builder()
//                .totalUsers(userRepository.count())
//                .totalGarbageReports(0)
//                .totalRecyclingRequests(0)
//                .completedTasks(0)
//                .pendingTasks(0)
//                .build();
//    }
//}

package com.example.WasteManagementSystem.service;

import com.example.WasteManagementSystem.dto.DashboardResponse;
import com.example.WasteManagementSystem.entity.User;
import com.example.WasteManagementSystem.enums.GarbageStatus;
import com.example.WasteManagementSystem.enums.RecyclingStatus;
import com.example.WasteManagementSystem.repository.GarbageReportRepository;
import com.example.WasteManagementSystem.repository.RecyclingRequestRepository;
import com.example.WasteManagementSystem.repository.RewardRepository;
import com.example.WasteManagementSystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final GarbageReportRepository garbageReportRepository;
    private final RecyclingRequestRepository recyclingRequestRepository;
    private final RewardRepository rewardRepository;

    @Transactional(readOnly = true)
    public DashboardResponse getUserDashboard(String email) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));

        long pendingReports =
                garbageReportRepository
                        .countByUserAndStatus(
                                user,
                                GarbageStatus.PENDING
                        );

        long assignedReports =
                garbageReportRepository
                        .countByUserAndStatus(
                                user,
                                GarbageStatus.ASSIGNED
                        );

        long progressReports =
                garbageReportRepository
                        .countByUserAndStatus(
                                user,
                                GarbageStatus.IN_PROGRESS
                        );

        long awaitingReports =
                garbageReportRepository
                        .countByUserAndStatus(
                                user,
                                GarbageStatus.AWAITING_APPROVAL
                        );

        long pendingRecycling =
                recyclingRequestRepository
                        .countByUserAndStatus(
                                user,
                                RecyclingStatus.PENDING
                        );

        long assignedRecycling =
                recyclingRequestRepository
                        .countByUserAndStatus(
                                user,
                                RecyclingStatus.ASSIGNED
                        );

        long progressRecycling =
                recyclingRequestRepository
                        .countByUserAndStatus(
                                user,
                                RecyclingStatus.PICKUP_IN_PROGRESS
                        );

        long awaitingRecycling =
                recyclingRequestRepository
                        .countByUserAndStatus(
                                user,
                                RecyclingStatus.AWAITING_APPROVAL
                        );

        int rewardPoints =
                rewardRepository
                        .findByUserOrderByCreatedAtDesc(user)
                        .stream()
                        .mapToInt(reward ->
                                reward.getPoints() == null
                                        ? 0
                                        : reward.getPoints()
                        )
                        .sum();

        return DashboardResponse.builder()

                .totalReports(
                        garbageReportRepository
                                .countByUser(user)
                )

                .pendingReports(
                        pendingReports
                )

                .inProgressReports(
                        assignedReports +
                                progressReports +
                                awaitingReports
                )

                .completedReports(
                        garbageReportRepository
                                .countByUserAndStatus(
                                        user,
                                        GarbageStatus.COMPLETED
                                )
                )

                .totalRecyclingRequests(
                        recyclingRequestRepository
                                .countByUser(user)
                )

                .pendingRecyclingRequests(
                        pendingRecycling
                )

                .inProgressRecyclingRequests(
                        assignedRecycling +
                                progressRecycling +
                                awaitingRecycling
                )

                .completedRecyclingRequests(
                        recyclingRequestRepository
                                .countByUserAndStatus(
                                        user,
                                        RecyclingStatus.COMPLETED
                                )
                )

                .rewardPoints(
                        rewardPoints
                )

                .build();
    }
}