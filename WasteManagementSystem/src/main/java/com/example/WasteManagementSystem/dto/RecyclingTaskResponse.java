package com.example.WasteManagementSystem.dto;

import com.example.WasteManagementSystem.enums.RecyclingStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecyclingTaskResponse {

    private Long id;

    private Long recyclingRequestId;

    private String description;

    private String pickupLocation;

    /*
     * GPS coordinates of user's recycling location
     */
    private Double latitude;

    private Double longitude;

    private Long workerId;

    private String workerName;

    private RecyclingStatus status;

    private LocalDateTime assignedAt;

    private LocalDateTime completedAt;
    private String imageUrl;
}