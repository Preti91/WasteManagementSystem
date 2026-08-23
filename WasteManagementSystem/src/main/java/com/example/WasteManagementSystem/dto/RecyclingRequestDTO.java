package com.example.WasteManagementSystem.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;
@Getter
@Setter
public class RecyclingRequestDTO {

    @NotBlank(message = "Description cannot be empty")
    private String description;

    @NotBlank(message = "Pickup location cannot be empty")
    private String pickupLocation;

    private Double latitude;

    private Double longitude;

    private String imageUrl;

    private MultipartFile wasteImage;
}