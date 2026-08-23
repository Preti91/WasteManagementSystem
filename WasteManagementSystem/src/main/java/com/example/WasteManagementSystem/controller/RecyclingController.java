package com.example.WasteManagementSystem.controller;

import com.example.WasteManagementSystem.dto.RecyclingRequestDTO;
import com.example.WasteManagementSystem.dto.RecyclingRequestResponse;
import com.example.WasteManagementSystem.dto.RecyclingTaskResponse;
import com.example.WasteManagementSystem.service.RecyclingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/recycling")
@RequiredArgsConstructor
public class RecyclingController {

    private final RecyclingService recyclingService;


    // =========================================================
    // USER - CREATE RECYCLING REQUEST
    // =========================================================

    @PostMapping(
            value = "/request",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<RecyclingRequestResponse> createRequest(

            @RequestParam("description")
            String description,

            @RequestParam("pickupLocation")
            String pickupLocation,

            @RequestParam("latitude")
            Double latitude,

            @RequestParam("longitude")
            Double longitude,

            @RequestPart(
                    value = "wasteImage",
                    required = false
            )
            MultipartFile wasteImage,

            Authentication authentication
    ) {

        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }

        String email = authentication.getName();

        RecyclingRequestDTO request =
                new RecyclingRequestDTO();

        request.setDescription(description);
        request.setPickupLocation(pickupLocation);
        request.setLatitude(latitude);
        request.setLongitude(longitude);

        // Keep image in DTO.
        // Actual Cloudinary upload should be handled
        // in the service when Cloudinary is connected.
        request.setWasteImage(wasteImage);

        return ResponseEntity.ok(
                recyclingService.createRequest(
                        request,
                        email
                )
        );
    }


    // =========================================================
    // USER - GET MY RECYCLING REQUESTS
    // =========================================================

    @GetMapping("/my-requests")
    public ResponseEntity<List<RecyclingRequestResponse>>
    getMyRequests(Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }

        String email = authentication.getName();

        return ResponseEntity.ok(
                recyclingService.getMyRequests(email)
        );
    }


    // =========================================================
    // ADMIN - GET ALL RECYCLING REQUESTS
    // =========================================================

    @GetMapping("/admin/all")
    public ResponseEntity<List<RecyclingRequestResponse>>
    getAllRequests() {

        return ResponseEntity.ok(
                recyclingService.getAllRequests()
        );
    }


    // =========================================================
    // ADMIN - ASSIGN RECYCLING WORKER
    // =========================================================

    @PostMapping("/admin/assign")
    public ResponseEntity<RecyclingTaskResponse>
    assignWorker(

            @RequestParam("recyclingRequestId")
            Long recyclingRequestId,

            @RequestParam("workerId")
            Long workerId
    ) {

        return ResponseEntity.ok(
                recyclingService.assignWorker(
                        recyclingRequestId,
                        workerId
                )
        );
    }


    // =========================================================
    // RECYCLING WORKER - GET MY TASKS
    // =========================================================

    @GetMapping("/worker/tasks")
    public ResponseEntity<List<RecyclingTaskResponse>>
    getMyTasks(Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }

        String email = authentication.getName();

        return ResponseEntity.ok(
                recyclingService.getMyTasks(email)
        );
    }


    // =========================================================
    // RECYCLING WORKER - START TASK
    // =========================================================

    @PutMapping("/worker/tasks/{taskId}/start")
    public ResponseEntity<RecyclingTaskResponse>
    startTask(

            @PathVariable Long taskId,

            Authentication authentication
    ) {

        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }

        String email = authentication.getName();

        return ResponseEntity.ok(
                recyclingService.startTask(
                        taskId,
                        email
                )
        );
    }


    // =========================================================
    // RECYCLING WORKER - COMPLETE TASK
    // =========================================================

    @PutMapping("/worker/tasks/{taskId}/complete")
    public ResponseEntity<RecyclingTaskResponse>
    completeTask(

            @PathVariable Long taskId,

            Authentication authentication
    ) {

        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }

        String email = authentication.getName();

        return ResponseEntity.ok(
                recyclingService.completeTask(
                        taskId,
                        email
                )
        );
    }
}