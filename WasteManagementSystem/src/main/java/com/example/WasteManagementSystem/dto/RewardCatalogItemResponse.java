package com.example.WasteManagementSystem.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RewardCatalogItemResponse {

    private Long id;

    private String name;

    private String description;

    private Integer points;

    private String icon;
}
