package com.example.WasteManagementSystem.controller;

import com.example.WasteManagementSystem.dto.CleaningTaskRequest;
import com.example.WasteManagementSystem.dto.CleaningTaskResponse;
import com.example.WasteManagementSystem.dto.GarbageReportResponse;
import com.example.WasteManagementSystem.dto.RecyclingRequestResponse;
import com.example.WasteManagementSystem.dto.RecyclingTaskRequest;
import com.example.WasteManagementSystem.dto.RecyclingTaskResponse;
import com.example.WasteManagementSystem.service.AdminService;
import com.example.WasteManagementSystem.service.CleaningWorkerService;
import com.example.WasteManagementSystem.service.RecyclingService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final CleaningWorkerService cleaningWorkerService;
    private final RecyclingService recyclingService;


    // =========================================================
    // ADMIN DASHBOARD
    // =========================================================

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {

        return ResponseEntity.ok(
                adminService.getDashboardStats()
        );
    }


    // =========================================================
    // GET ALL USERS
    // =========================================================

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getUsers() {

        return ResponseEntity.ok(
                adminService.getUsers()
        );
    }


    // =========================================================
    // GET ALL WORKERS
    // =========================================================

    @GetMapping("/workers")
    public ResponseEntity<List<Map<String, Object>>> getWorkers() {

        return ResponseEntity.ok(
                adminService.getWorkers()
        );
    }


    // =========================================================
    // GET ALL GARBAGE REPORTS
    // =========================================================

    @GetMapping("/garbage-reports")
    public ResponseEntity<List<GarbageReportResponse>>
    getAllGarbageReports() {

        return ResponseEntity.ok(
                adminService.getAllGarbageReports()
        );
    }


    // =========================================================
    // ASSIGN CLEANING WORKER
    // =========================================================

    @PostMapping("/assign-cleaning-task")
    public ResponseEntity<CleaningTaskResponse>
    assignCleaningTask(
            @Valid @RequestBody CleaningTaskRequest request) {

        CleaningTaskResponse response =
                cleaningWorkerService.assignTask(
                        request.getGarbageReportId(),
                        request.getWorkerId()
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // =========================================================
    // GET CLEANING TASKS WAITING FOR APPROVAL
    // =========================================================

    @GetMapping("/cleaning-tasks/pending-approval")
    public ResponseEntity<List<CleaningTaskResponse>>
    getCleaningTasksPendingApproval() {

        return ResponseEntity.ok(
                adminService.getCleaningTasksPendingApproval()
        );
    }


    // =========================================================
    // APPROVE CLEANING TASK
    // =========================================================

    @PutMapping("/cleaning-tasks/{taskId}/approve")
    public ResponseEntity<Map<String, Object>>
    approveCleaningTask(
            @PathVariable Long taskId) {

        adminService.approveCleaningTask(taskId);

        Map<String, Object> response =
                new HashMap<>();

        response.put("success", true);
        response.put(
                "message",
                "Cleaning task approved. Reward and notifications processed automatically."
        );
        response.put("taskId", taskId);

        return ResponseEntity.ok(response);
    }


    // =========================================================
    // REJECT CLEANING TASK
    // =========================================================

    @PutMapping("/cleaning-tasks/{taskId}/reject")
    public ResponseEntity<Map<String, Object>>
    rejectCleaningTask(
            @PathVariable Long taskId) {

        adminService.rejectCleaningTask(taskId);

        Map<String, Object> response =
                new HashMap<>();

        response.put("success", true);
        response.put(
                "message",
                "Cleaning completion rejected. Worker has been notified."
        );
        response.put("taskId", taskId);

        return ResponseEntity.ok(response);
    }


    // =========================================================
    // GET ALL RECYCLING REQUESTS
    // =========================================================

    @GetMapping("/recycling-requests")
    public ResponseEntity<List<RecyclingRequestResponse>>
    getAllRecyclingRequests() {

        return ResponseEntity.ok(
                recyclingService.getAllRequests()
        );
    }


    // =========================================================
    // GET ALL RECYCLING TASKS
    //
    // IMPORTANT:
    // Frontend calls:
    // GET /api/admin/recycling-tasks
    // =========================================================

    @GetMapping("/recycling-tasks")
    public ResponseEntity<List<RecyclingTaskResponse>>
    getAllRecyclingTasks() {

        return ResponseEntity.ok(
                adminService.getAllRecyclingTasks()
        );
    }


    // =========================================================
    // GET RECYCLING TASKS WAITING FOR APPROVAL
    // =========================================================

    @GetMapping("/recycling-tasks/pending-approval")
    public ResponseEntity<List<RecyclingTaskResponse>>
    getRecyclingTasksPendingApproval() {

        return ResponseEntity.ok(
                adminService.getRecyclingTasksPendingApproval()
        );
    }


    // =========================================================
    // ASSIGN RECYCLING WORKER
    // =========================================================

    @PostMapping("/assign-recycling-task")
    public ResponseEntity<RecyclingTaskResponse>
    assignRecyclingTask(
            @Valid @RequestBody RecyclingTaskRequest request) {

        RecyclingTaskResponse response =
                recyclingService.assignWorker(
                        request.getRecyclingRequestId(),
                        request.getWorkerId()
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // =========================================================
    // APPROVE RECYCLING TASK
    // =========================================================

    @PutMapping("/recycling-tasks/{taskId}/approve")
    public ResponseEntity<Map<String, Object>>
    approveRecyclingTask(
            @PathVariable Long taskId) {

        adminService.approveRecyclingTask(taskId);

        Map<String, Object> response =
                new HashMap<>();

        response.put("success", true);
        response.put(
                "message",
                "Recycling task approved. Reward and notifications processed automatically."
        );
        response.put("taskId", taskId);

        return ResponseEntity.ok(response);
    }


    // =========================================================
    // REJECT RECYCLING TASK
    // =========================================================

    @PutMapping("/recycling-tasks/{taskId}/reject")
    public ResponseEntity<Map<String, Object>>
    rejectRecyclingTask(
            @PathVariable Long taskId) {

        adminService.rejectRecyclingTask(taskId);

        Map<String, Object> response =
                new HashMap<>();

        response.put("success", true);
        response.put(
                "message",
                "Recycling completion rejected. Worker has been notified."
        );
        response.put("taskId", taskId);

        return ResponseEntity.ok(response);
    }


    // =========================================================
    // ADMIN SEND NOTIFICATION TO USER
    // =========================================================

    @PostMapping("/notifications/user")
    public ResponseEntity<Map<String, Object>>
    sendUserNotification(
            @RequestBody Map<String, Object> request) {

        if (request == null ||
                request.get("userId") == null ||
                request.get("message") == null) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "success",
                                    false,
                                    "message",
                                    "userId and message are required"
                            )
                    );
        }

        Long userId;

        try {

            userId = Long.valueOf(
                    request.get("userId").toString()
            );

        } catch (NumberFormatException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "success",
                                    false,
                                    "message",
                                    "Invalid userId"
                            )
                    );
        }

        String message =
                request.get("message")
                        .toString()
                        .trim();

        if (message.isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "success",
                                    false,
                                    "message",
                                    "Notification message cannot be empty"
                            )
                    );
        }

        adminService.sendNotification(
                userId,
                message
        );

        return ResponseEntity.ok(
                Map.of(
                        "success",
                        true,
                        "message",
                        "Notification sent successfully",
                        "userId",
                        userId
                )
        );
    }


    // =========================================================
    // ADMIN SEND NOTIFICATION TO WORKER
    // =========================================================

    @PostMapping("/notifications/worker")
    public ResponseEntity<Map<String, Object>>
    sendWorkerNotification(
            @RequestBody Map<String, Object> request) {

        if (request == null ||
                request.get("workerId") == null ||
                request.get("message") == null) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "success",
                                    false,
                                    "message",
                                    "workerId and message are required"
                            )
                    );
        }

        Long workerId;

        try {

            workerId = Long.valueOf(
                    request.get("workerId").toString()
            );

        } catch (NumberFormatException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "success",
                                    false,
                                    "message",
                                    "Invalid workerId"
                            )
                    );
        }

        String message =
                request.get("message")
                        .toString()
                        .trim();

        if (message.isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "success",
                                    false,
                                    "message",
                                    "Notification message cannot be empty"
                            )
                    );
        }

        adminService.sendWorkerNotification(
                workerId,
                message
        );

        return ResponseEntity.ok(
                Map.of(
                        "success",
                        true,
                        "message",
                        "Worker notification sent successfully",
                        "workerId",
                        workerId
                )
        );
    }
}