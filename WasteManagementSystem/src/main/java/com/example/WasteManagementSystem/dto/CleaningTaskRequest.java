package com.example.WasteManagementSystem.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CleaningTaskRequest {

    @NotNull
    private Long garbageReportId;

    @NotNull
    private Long workerId;
}