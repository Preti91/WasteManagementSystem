package com.example.WasteManagementSystem.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RecyclingTaskRequest {

    @NotNull
    private Long recyclingRequestId;

    @NotNull
    private Long workerId;
}