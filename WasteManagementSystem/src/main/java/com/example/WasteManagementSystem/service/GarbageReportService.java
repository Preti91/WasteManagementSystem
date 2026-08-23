package com.example.WasteManagementSystem.service;

import com.example.WasteManagementSystem.dto.GarbageReportRequest;
import com.example.WasteManagementSystem.dto.GarbageReportResponse;
import com.example.WasteManagementSystem.entity.GarbageReport;
import com.example.WasteManagementSystem.entity.User;
import com.example.WasteManagementSystem.enums.GarbageStatus;
import com.example.WasteManagementSystem.repository.GarbageReportRepository;
import com.example.WasteManagementSystem.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class GarbageReportService {

    private final GarbageReportRepository garbageReportRepository;
    private final UserRepository userRepository;
    private final RewardService rewardService;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public GarbageReportService(
            GarbageReportRepository garbageReportRepository,
            UserRepository userRepository,
            RewardService rewardService) {

        this.garbageReportRepository = garbageReportRepository;
        this.userRepository = userRepository;
        this.rewardService = rewardService;
    }


    // =========================================================
    // USER CREATES GARBAGE REPORT
    // =========================================================

    public GarbageReportResponse createReport(
            GarbageReportRequest request,
            String email) {

        // =====================================================
        // 1. FIND LOGGED-IN USER
        // =====================================================

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));


        // =====================================================
        // 2. CREATE GARBAGE REPORT
        // =====================================================

        GarbageReport report =
                GarbageReport.builder()

                        .description(
                                request.getDescription()
                        )

                        .location(
                                request.getLocation()
                        )

                        .latitude(
                                request.getLatitude()
                        )

                        .longitude(
                                request.getLongitude()
                        )

                        .wasteType(
                                request.getWasteType()
                        )

                        .status(
                                GarbageStatus.PENDING
                        )

                        .imageUrl(
                                request.getImageUrl()
                        )

                        .createdAt(
                                LocalDateTime.now()
                        )

                        .user(
                                user
                        )

                        .build();


        // =====================================================
        // 3. SAVE REPORT
        // =====================================================

        GarbageReport savedReport =
                garbageReportRepository.save(report);


        // =====================================================
        // 4. GIVE REWARD POINTS
        // =====================================================

        rewardService.addPoints(
                user,
                10,
                "Garbage report submitted"
        );


        // =====================================================
        // 5. RETURN RESPONSE
        // =====================================================

        return convertToResponse(
                savedReport
        );
    }


    // =========================================================
    // USER SEES OWN REPORTS
    // =========================================================

    public List<GarbageReportResponse> getMyReports(
            String email) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));


        return garbageReportRepository
                .findByUser(user)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    // =========================================================
    // USER GETS REPORT BY ID
    // =========================================================

    public GarbageReportResponse getReportById(
            Long id,
            String email) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));


        GarbageReport report =
                garbageReportRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Garbage report not found"
                                ));


        // =====================================================
        // CHECK OWNERSHIP
        // =====================================================

        if (!report.getUser()
                .getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "You are not allowed to view this report"
            );
        }


        return convertToResponse(
                report
        );
    }


    // =========================================================
    // CONVERT ENTITY → RESPONSE
    // =========================================================

    private GarbageReportResponse convertToResponse(
            GarbageReport report) {

        return new GarbageReportResponse(

                report.getId(),

                report.getDescription(),

                report.getLocation(),

                report.getLatitude(),

                report.getLongitude(),

                report.getWasteType(),

                report.getStatus(),

                report.getImageUrl(),

                report.getCreatedAt()
        );
    }
}