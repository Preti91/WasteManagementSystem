package com.example.WasteManagementSystem.controller;

import com.example.WasteManagementSystem.dto.RecyclingTaskResponse;
import com.example.WasteManagementSystem.service.RecyclingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recycling-worker")
@RequiredArgsConstructor
public class RecyclingWorkerController {

    private final RecyclingService recyclingService;


    // =========================================================
    // GET MY RECYCLING TASKS
    // =========================================================

    @GetMapping("/tasks")
    public ResponseEntity<List<RecyclingTaskResponse>> getMyTasks(
            Authentication authentication
    ) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                recyclingService.getMyTasks(email)
        );
    }


    // =========================================================
    // START RECYCLING TASK
    // =========================================================

    @PostMapping("/tasks/{taskId}/start")
    public ResponseEntity<RecyclingTaskResponse> startTask(
            @PathVariable Long taskId,
            Authentication authentication
    ) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                recyclingService.startTask(
                        taskId,
                        email
                )
        );
    }


    // =========================================================
    // COMPLETE RECYCLING TASK
    // =========================================================

    @PostMapping("/tasks/{taskId}/complete")
    public ResponseEntity<RecyclingTaskResponse> completeTask(
            @PathVariable Long taskId,
            Authentication authentication
    ) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                recyclingService.completeTask(
                        taskId,
                        email
                )
        );
    }
}