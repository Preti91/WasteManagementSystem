package com.example.WasteManagementSystem.service;

import com.example.WasteManagementSystem.dto.CleaningTaskResponse;
import com.example.WasteManagementSystem.dto.GarbageReportResponse;
import com.example.WasteManagementSystem.dto.RecyclingTaskResponse;

import com.example.WasteManagementSystem.entity.CleaningTask;
import com.example.WasteManagementSystem.entity.GarbageReport;
import com.example.WasteManagementSystem.entity.RecyclingRequest;
import com.example.WasteManagementSystem.entity.RecyclingTask;
import com.example.WasteManagementSystem.entity.User;

import com.example.WasteManagementSystem.enums.GarbageStatus;
import com.example.WasteManagementSystem.enums.RecyclingStatus;
import com.example.WasteManagementSystem.enums.Role;

import com.example.WasteManagementSystem.repository.CleaningTaskRepository;
import com.example.WasteManagementSystem.repository.GarbageReportRepository;
import com.example.WasteManagementSystem.repository.RecyclingRequestRepository;
import com.example.WasteManagementSystem.repository.RecyclingTaskRepository;
import com.example.WasteManagementSystem.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;


@Service
@RequiredArgsConstructor
@Transactional
public class AdminService {

    private final GarbageReportRepository garbageReportRepository;

    private final UserRepository userRepository;

    private final CleaningTaskRepository cleaningTaskRepository;

    private final RecyclingTaskRepository recyclingTaskRepository;

    private final RecyclingRequestRepository recyclingRequestRepository;

    private final NotificationService notificationService;

    private final RewardService rewardService;


    // =========================================================
    // ADMIN DASHBOARD
    // =========================================================

    @Transactional(readOnly = true)
    public Map<String, Object> getDashboardStats() {

        long totalUsers =
                userRepository.countByRole(Role.USER);

        long cleaningWorkers =
                userRepository.countByRole(
                        Role.CLEANING_WORKER
                );

        long recyclingWorkers =
                userRepository.countByRole(
                        Role.RECYCLING_WORKER
                );

        long totalWorkers =
                cleaningWorkers + recyclingWorkers;


        long totalReports =
                garbageReportRepository.count();

        long pendingReports =
                garbageReportRepository.countByStatus(
                        GarbageStatus.PENDING
                );

        long assignedReports =
                garbageReportRepository.countByStatus(
                        GarbageStatus.ASSIGNED
                );

        long inProgressReports =
                garbageReportRepository.countByStatus(
                        GarbageStatus.IN_PROGRESS
                );

        long awaitingApprovalReports =
                garbageReportRepository.countByStatus(
                        GarbageStatus.AWAITING_APPROVAL
                );

        long completedReports =
                garbageReportRepository.countByStatus(
                        GarbageStatus.COMPLETED
                );


        long totalRecycling =
                recyclingRequestRepository.count();

        long pendingRecycling =
                recyclingRequestRepository.countByStatus(
                        RecyclingStatus.PENDING
                );

        long assignedRecycling =
                recyclingRequestRepository.countByStatus(
                        RecyclingStatus.ASSIGNED
                );

        long recyclingInProgress =
                recyclingRequestRepository.countByStatus(
                        RecyclingStatus.PICKUP_IN_PROGRESS
                );

        long awaitingRecyclingApproval =
                recyclingRequestRepository.countByStatus(
                        RecyclingStatus.AWAITING_APPROVAL
                );

        long completedRecycling =
                recyclingRequestRepository.countByStatus(
                        RecyclingStatus.COMPLETED
                );


        long totalCleaningTasks =
                cleaningTaskRepository.count();

        long totalRecyclingTasks =
                recyclingTaskRepository.count();


        Map<String, Object> result =
                new LinkedHashMap<>();


        result.put(
                "totalUsers",
                totalUsers
        );

        result.put(
                "cleaningWorkers",
                cleaningWorkers
        );

        result.put(
                "recyclingWorkers",
                recyclingWorkers
        );

        result.put(
                "totalWorkers",
                totalWorkers
        );

        result.put(
                "totalReports",
                totalReports
        );

        result.put(
                "pendingReports",
                pendingReports
        );

        result.put(
                "assignedReports",
                assignedReports
        );

        result.put(
                "inProgressReports",
                inProgressReports
        );

        result.put(
                "awaitingApprovalReports",
                awaitingApprovalReports
        );

        result.put(
                "completedReports",
                completedReports
        );

        result.put(
                "totalRecycling",
                totalRecycling
        );

        result.put(
                "pendingRecycling",
                pendingRecycling
        );

        result.put(
                "assignedRecycling",
                assignedRecycling
        );

        result.put(
                "recyclingInProgress",
                recyclingInProgress
        );

        result.put(
                "awaitingRecyclingApproval",
                awaitingRecyclingApproval
        );

        result.put(
                "completedRecycling",
                completedRecycling
        );

        result.put(
                "totalCleaningTasks",
                totalCleaningTasks
        );

        result.put(
                "totalRecyclingTasks",
                totalRecyclingTasks
        );


        return result;
    }


    // =========================================================
    // ALL GARBAGE REPORTS
    // =========================================================

    @Transactional(readOnly = true)
    public List<GarbageReportResponse>
    getAllGarbageReports() {

        return garbageReportRepository
                .findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    // =========================================================
    // ALL USERS
    // =========================================================

    @Transactional(readOnly = true)
    public List<Map<String, Object>>
    getUsers() {

        return userRepository
                .findByRole(Role.USER)
                .stream()
                .map(this::convertUserToMap)
                .toList();
    }


    // =========================================================
    // ALL WORKERS
    // =========================================================

    @Transactional(readOnly = true)
    public List<Map<String, Object>>
    getWorkers() {

        List<User> workers =
                new ArrayList<>();

        workers.addAll(
                userRepository.findByRole(
                        Role.CLEANING_WORKER
                )
        );

        workers.addAll(
                userRepository.findByRole(
                        Role.RECYCLING_WORKER
                )
        );

        return workers
                .stream()
                .map(this::convertUserToMap)
                .toList();
    }


    // =========================================================
    // USER MAP
    // =========================================================

    private Map<String, Object>
    convertUserToMap(User user) {

        Map<String, Object> map =
                new LinkedHashMap<>();

        map.put(
                "id",
                user.getId()
        );

        map.put(
                "name",
                user.getName()
        );

        map.put(
                "email",
                user.getEmail()
        );

        map.put(
                "role",
                user.getRole()
        );

        return map;
    }


    // =========================================================
    // CLEANING TASKS WAITING FOR APPROVAL
    // =========================================================

    @Transactional(readOnly = true)
    public List<CleaningTaskResponse>
    getCleaningTasksPendingApproval() {

        return cleaningTaskRepository
                .findByStatus(
                        GarbageStatus.AWAITING_APPROVAL
                )
                .stream()
                .map(this::convertCleaningTaskToResponse)
                .toList();
    }


    // =========================================================
    // APPROVE CLEANING TASK
    // =========================================================

    public CleaningTask approveCleaningTask(
            Long taskId) {

        CleaningTask task =
                cleaningTaskRepository
                        .findById(taskId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Cleaning task not found"
                                )
                        );


        if (task.getStatus() !=
                GarbageStatus.AWAITING_APPROVAL) {

            throw new RuntimeException(
                    "This cleaning task is not waiting for approval"
            );
        }


        GarbageReport report =
                task.getGarbageReport();


        if (report == null) {

            throw new RuntimeException(
                    "Garbage report not found"
            );
        }


        User user =
                report.getUser();


        if (user == null) {

            throw new RuntimeException(
                    "User not found for garbage report"
            );
        }


        task.setStatus(
                GarbageStatus.COMPLETED
        );

        report.setStatus(
                GarbageStatus.COMPLETED
        );


        garbageReportRepository.save(report);

        CleaningTask savedTask =
                cleaningTaskRepository.save(task);


        rewardService.addPoints(
                user,
                10,
                "Garbage cleaning completed"
        );


        notificationService.createNotification(
                user,
                "Your garbage report #" +
                        report.getId() +
                        " has been approved and completed. " +
                        "You earned 10 reward points."
        );


        if (task.getWorker() != null) {

            notificationService.createNotification(
                    task.getWorker(),
                    "Admin approved your cleaning task #" +
                            task.getId() +
                            ". Thank you for completing the work."
            );
        }


        return savedTask;
    }


    // =========================================================
    // REJECT CLEANING TASK
    // =========================================================

    public CleaningTask rejectCleaningTask(
            Long taskId) {

        CleaningTask task =
                cleaningTaskRepository
                        .findById(taskId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Cleaning task not found"
                                )
                        );


        if (task.getStatus() !=
                GarbageStatus.AWAITING_APPROVAL) {

            throw new RuntimeException(
                    "This cleaning task is not waiting for approval"
            );
        }


        GarbageReport report =
                task.getGarbageReport();


        task.setStatus(
                GarbageStatus.IN_PROGRESS
        );


        if (report != null) {

            report.setStatus(
                    GarbageStatus.IN_PROGRESS
            );

            garbageReportRepository.save(report);
        }


        CleaningTask savedTask =
                cleaningTaskRepository.save(task);


        if (task.getWorker() != null) {

            notificationService.createNotification(
                    task.getWorker(),
                    "Admin rejected completion of cleaning task #" +
                            task.getId() +
                            ". Please continue the work and submit again."
            );
        }


        if (report != null &&
                report.getUser() != null) {

            notificationService.createNotification(
                    report.getUser(),
                    "Your garbage report #" +
                            report.getId() +
                            " is still in progress."
            );
        }


        return savedTask;
    }


    // =========================================================
    // ALL RECYCLING TASKS
    // =========================================================
    //
    // This fixes:
    //
    // GET /api/admin/recycling-tasks
    //
    // =========================================================

    @Transactional(readOnly = true)
    public List<RecyclingTaskResponse>
    getAllRecyclingTasks() {

        return recyclingTaskRepository
                .findAll()
                .stream()
                .map(this::convertRecyclingTaskToResponse)
                .toList();
    }


    // =========================================================
    // RECYCLING TASKS WAITING FOR APPROVAL
    // =========================================================

    @Transactional(readOnly = true)
    public List<RecyclingTaskResponse>
    getRecyclingTasksPendingApproval() {

        return recyclingTaskRepository
                .findByStatus(
                        RecyclingStatus.AWAITING_APPROVAL
                )
                .stream()
                .map(this::convertRecyclingTaskToResponse)
                .toList();
    }


    // =========================================================
    // APPROVE RECYCLING TASK
    // =========================================================

    public RecyclingTask approveRecyclingTask(
            Long taskId) {

        RecyclingTask task =
                recyclingTaskRepository
                        .findById(taskId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Recycling task not found"
                                )
                        );


        if (task.getStatus() !=
                RecyclingStatus.AWAITING_APPROVAL) {

            throw new RuntimeException(
                    "This recycling task is not waiting for approval"
            );
        }


        RecyclingRequest request =
                task.getRecyclingRequest();


        if (request == null) {

            throw new RuntimeException(
                    "Recycling request not found"
            );
        }


        User user =
                request.getUser();


        if (user == null) {

            throw new RuntimeException(
                    "User not found for recycling request"
            );
        }


        // =====================================================
        // FINAL STATUS
        // =====================================================

        task.setStatus(
                RecyclingStatus.COMPLETED
        );

        request.setStatus(
                RecyclingStatus.COMPLETED
        );


        recyclingRequestRepository.save(
                request
        );


        RecyclingTask savedTask =
                recyclingTaskRepository.save(
                        task
                );


        // =====================================================
        // REWARD
        // =====================================================

        rewardService.addPoints(
                user,
                25,
                "Recycling pickup completed"
        );


        // =====================================================
        // USER NOTIFICATION
        // =====================================================

        notificationService.createNotification(
                user,
                "Your recycling request #" +
                        request.getId() +
                        " has been approved and completed. " +
                        "You earned 25 reward points."
        );


        // =====================================================
        // WORKER NOTIFICATION
        // =====================================================

        if (task.getWorker() != null) {

            notificationService.createNotification(
                    task.getWorker(),
                    "Admin approved your recycling task #" +
                            task.getId() +
                            ". Thank you for completing the pickup."
            );
        }


        return savedTask;
    }


    // =========================================================
    // REJECT RECYCLING TASK
    // =========================================================

    public RecyclingTask rejectRecyclingTask(
            Long taskId) {

        RecyclingTask task =
                recyclingTaskRepository
                        .findById(taskId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Recycling task not found"
                                )
                        );


        if (task.getStatus() !=
                RecyclingStatus.AWAITING_APPROVAL) {

            throw new RuntimeException(
                    "This recycling task is not waiting for approval"
            );
        }


        RecyclingRequest request =
                task.getRecyclingRequest();


        task.setStatus(
                RecyclingStatus.PICKUP_IN_PROGRESS
        );


        if (request != null) {

            request.setStatus(
                    RecyclingStatus.PICKUP_IN_PROGRESS
            );

            recyclingRequestRepository.save(
                    request
            );
        }


        RecyclingTask savedTask =
                recyclingTaskRepository.save(
                        task
                );


        if (task.getWorker() != null) {

            notificationService.createNotification(
                    task.getWorker(),
                    "Admin rejected completion of recycling task #" +
                            task.getId() +
                            ". Please continue the pickup and submit again."
            );
        }


        if (request != null &&
                request.getUser() != null) {

            notificationService.createNotification(
                    request.getUser(),
                    "Your recycling request #" +
                            request.getId() +
                            " is still being processed."
            );
        }


        return savedTask;
    }


    // =========================================================
    // ADMIN SEND NOTIFICATION TO USER
    // =========================================================

    public void sendNotification(
            Long userId,
            String message) {

        if (userId == null) {

            throw new IllegalArgumentException(
                    "User ID is required"
            );
        }


        if (message == null ||
                message.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Notification message cannot be empty"
            );
        }


        User user =
                userRepository
                        .findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        notificationService.createNotification(
                user,
                message.trim()
        );
    }


    // =========================================================
    // ADMIN SEND NOTIFICATION TO WORKER
    // =========================================================

    public void sendWorkerNotification(
            Long workerId,
            String message) {

        if (workerId == null) {

            throw new IllegalArgumentException(
                    "Worker ID is required"
            );
        }


        if (message == null ||
                message.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Notification message cannot be empty"
            );
        }


        User worker =
                userRepository
                        .findById(workerId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Worker not found"
                                )
                        );


        if (worker.getRole() !=
                Role.CLEANING_WORKER &&
                worker.getRole() !=
                        Role.RECYCLING_WORKER) {

            throw new RuntimeException(
                    "Selected user is not a worker"
            );
        }


        notificationService.createNotification(
                worker,
                message.trim()
        );
    }


    // =========================================================
    // CONVERT GARBAGE REPORT
    // =========================================================

    private GarbageReportResponse
    convertToResponse(
            GarbageReport report) {

        return new GarbageReportResponse(
                report.getId(),
                report.getDescription(),
                report.getLocation(),
                report.getLatitude(),
                report.getLongitude(),
                report.getWasteType(),
                report.getStatus(),
                report.getImageUrl(),
                report.getCreatedAt()
        );
    }


    // =========================================================
    // CONVERT CLEANING TASK
    // =========================================================

    private CleaningTaskResponse
    convertCleaningTaskToResponse(
            CleaningTask task) {

        GarbageReport report =
                task.getGarbageReport();

        User worker =
                task.getWorker();


        return new CleaningTaskResponse(

                task.getId(),

                report != null
                        ? report.getId()
                        : null,

                report != null
                        ? report.getDescription()
                        : null,

                report != null
                        ? report.getLocation()
                        : null,

                report != null
                        ? report.getLatitude()
                        : null,

                report != null
                        ? report.getLongitude()
                        : null,

                worker != null
                        ? worker.getId()
                        : null,

                worker != null
                        ? worker.getName()
                        : null,

                task.getStatus(),

                task.getAssignedAt(),

                task.getCompletedAt()
        );
    }


    // =========================================================
    // CONVERT RECYCLING TASK
    // =========================================================

    private RecyclingTaskResponse
    convertRecyclingTaskToResponse(
            RecyclingTask task) {

        RecyclingRequest request =
                task.getRecyclingRequest();

        User worker =
                task.getWorker();


        return new RecyclingTaskResponse(

                task.getId(),

                request.getId(),

                request.getDescription(),

                request.getPickupLocation(),

                request.getLatitude(),

                request.getLongitude(),

                worker.getId(),

                worker.getName(),

                task.getStatus(),

                task.getAssignedAt(),

                task.getCompletedAt(),

                request.getImageUrl()
        );
    }
}