package com.example.WasteManagementSystem.dto;

import com.example.WasteManagementSystem.enums.GarbageStatus;
import com.example.WasteManagementSystem.enums.WasteType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GarbageReportResponse {

    private Long id;

    private String description;

    private String location;

    private Double latitude;

    private Double longitude;

    private WasteType wasteType;

    private GarbageStatus status;

    private String imageUrl;

    private LocalDateTime createdAt;
}