package com.example.WasteManagementSystem.dto;

import com.example.WasteManagementSystem.enums.RecyclingStatus;
import com.example.WasteManagementSystem.enums.WasteType;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class RecyclingRequestResponse {

    private Long id;

    private String description;

    private String pickupLocation;

    private Double latitude;

    private Double longitude;

    private WasteType wasteType;

    private RecyclingStatus status;

    private String imageUrl;

    private LocalDateTime createdAt;
}