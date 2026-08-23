package com.example.WasteManagementSystem.dto;

import com.example.WasteManagementSystem.enums.WasteType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GarbageReportRequest {

    private String description;

    private String location;

    private Double latitude;

    private Double longitude;

    private WasteType wasteType;

    private String imageUrl;
}