package com.example.WasteManagementSystem.dto;

import com.example.WasteManagementSystem.enums.GarbageStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CleaningTaskResponse {

    private Long id;

    private Long garbageReportId;

    private String description;

    private String location;

    private Double latitude;

    private Double longitude;

    private Long workerId;

    private String workerName;

    private GarbageStatus status;

    private LocalDateTime assignedAt;

    private LocalDateTime completedAt;
}