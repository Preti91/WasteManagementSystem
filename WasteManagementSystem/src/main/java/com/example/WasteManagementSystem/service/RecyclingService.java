package com.example.WasteManagementSystem.service;

import com.example.WasteManagementSystem.dto.AIClassificationRequest;
import com.example.WasteManagementSystem.dto.RecyclingRequestDTO;
import com.example.WasteManagementSystem.dto.RecyclingRequestResponse;
import com.example.WasteManagementSystem.dto.RecyclingTaskResponse;
import com.example.WasteManagementSystem.entity.AIClassification;
import com.example.WasteManagementSystem.entity.RecyclingRequest;
import com.example.WasteManagementSystem.entity.RecyclingTask;
import com.example.WasteManagementSystem.entity.User;
import com.example.WasteManagementSystem.enums.RecyclingStatus;
import com.example.WasteManagementSystem.enums.Role;
import com.example.WasteManagementSystem.enums.WasteType;
import com.example.WasteManagementSystem.repository.AIClassificationRepository;
import com.example.WasteManagementSystem.repository.RecyclingRequestRepository;
import com.example.WasteManagementSystem.repository.RecyclingTaskRepository;
import com.example.WasteManagementSystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class RecyclingService {

    private final RecyclingRequestRepository recyclingRequestRepository;
    private final UserRepository userRepository;
    private final RecyclingTaskRepository recyclingTaskRepository;

    private final NotificationService notificationService;
    private final RewardService rewardService;
    private final AIService aiService;
    private final AIClassificationRepository aiClassificationRepository;
    private final FileStorageService fileStorageService;

    // =========================================================
    // USER CREATES RECYCLING REQUEST
    // =========================================================

    public RecyclingRequestResponse createRequest(
            RecyclingRequestDTO request,
            String email
    ) {

        if (request == null) {
            throw new IllegalArgumentException(
                    "Recycling request cannot be null"
            );
        }

        if (request.getDescription() == null ||
                request.getDescription().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Description cannot be empty"
            );
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );


        // =====================================================
        // AI CLASSIFICATION
        // =====================================================

        AIClassificationRequest aiRequest =
                new AIClassificationRequest();

        aiRequest.setText(
                request.getDescription().trim()
        );

        AIClassification aiResult;

        try {

            aiResult =
                    aiService.classifyWaste(aiRequest);

        } catch (Exception e) {

            /*
             * AI failure should NOT prevent the user
             * from submitting a recycling request.
             */

            aiResult = new AIClassification();

            aiResult.setWasteType(
                    WasteType.OTHER.name()
            );
        }


        // =====================================================
        // SAVE AI RESULT
        // =====================================================

        AIClassification savedAI =
                aiClassificationRepository.save(
                        aiResult
                );


        // =====================================================
        // CONVERT AI RESULT TO ENUM
        // =====================================================

        WasteType wasteType =
                convertWasteType(
                        savedAI.getWasteType()
                );


        // =====================================================
        // IMAGE
        // =====================================================

        String imageUrl = null;

        if (
                request.getWasteImage() != null &&
                        !request.getWasteImage().isEmpty()
        ) {

            imageUrl =
                    fileStorageService.storeRecyclingImage(
                            request.getWasteImage()
                    );
        }

        // =====================================================
        // CREATE RECYCLING REQUEST
        // =====================================================

        RecyclingRequest recyclingRequest =
                RecyclingRequest.builder()

                        .description(
                                request.getDescription()
                                        .trim()
                        )

                        .pickupLocation(
                                request.getPickupLocation()
                        )

                        .latitude(
                                request.getLatitude()
                        )

                        .longitude(
                                request.getLongitude()
                        )

                        .wasteType(
                                wasteType
                        )

                        .status(
                                RecyclingStatus.PENDING
                        )

                        .createdAt(
                                LocalDateTime.now()
                        )

                        .user(
                                user
                        )

                        .imageUrl(
                                imageUrl
                        )

                        .build();


        // =====================================================
        // SAVE REQUEST
        // =====================================================

        RecyclingRequest saved =
                recyclingRequestRepository.save(
                        recyclingRequest
                );


        // =====================================================
        // NOTIFY USER
        // =====================================================

        notificationService.createNotification(
                user,
                "Your recycling request #" +
                        saved.getId() +
                        " has been submitted successfully and is waiting for admin assignment."
        );


        return convertToResponse(saved);
    }


    // =========================================================
    // CONVERT AI WASTE TYPE SAFELY
    // =========================================================

    private WasteType convertWasteType(
            String aiWasteType
    ) {

        if (aiWasteType == null ||
                aiWasteType.trim().isEmpty()) {

            return WasteType.OTHER;
        }

        String normalized =
                aiWasteType
                        .trim()
                        .toUpperCase()
                        .replace("-", "_")
                        .replace(" ", "_");


        /*
         * Handle common AI responses that may not exactly
         * match the WasteType enum.
         */

        switch (normalized) {

            case "NON_BIODEGRADABLE":
                return WasteType.OTHER;

            case "NONBIODEGRADABLE":
                return WasteType.OTHER;

            case "BIODEGRADABLE":
                return getWasteTypeOrOther(
                        "BIODEGRADABLE"
                );

            case "E_WASTE":
            case "EWASTE":
                return getWasteTypeOrOther(
                        "E_WASTE"
                );

            case "PLASTIC":
                return getWasteTypeOrOther(
                        "PLASTIC"
                );

            case "PAPER":
                return getWasteTypeOrOther(
                        "PAPER"
                );

            case "GLASS":
                return getWasteTypeOrOther(
                        "GLASS"
                );

            case "METAL":
                return getWasteTypeOrOther(
                        "METAL"
                );

            case "ORGANIC":
                return getWasteTypeOrOther(
                        "ORGANIC"
                );

            default:
                return getWasteTypeOrOther(
                        normalized
                );
        }
    }


    // =========================================================
    // SAFE ENUM CONVERSION
    // =========================================================

    private WasteType getWasteTypeOrOther(
            String value
    ) {

        try {

            return WasteType.valueOf(value);

        } catch (IllegalArgumentException e) {

            return WasteType.OTHER;
        }
    }


    // =========================================================
    // USER SEES OWN RECYCLING REQUESTS
    // =========================================================

    @Transactional(readOnly = true)
    public List<RecyclingRequestResponse> getMyRequests(
            String email
    ) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        return recyclingRequestRepository
                .findByUser(user)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    // =========================================================
    // ADMIN SEES ALL RECYCLING REQUESTS
    // =========================================================

    @Transactional(readOnly = true)
    public List<RecyclingRequestResponse> getAllRequests() {

        return recyclingRequestRepository
                .findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    // =========================================================
    // ADMIN ASSIGNS RECYCLING WORKER
    // =========================================================

    public RecyclingTaskResponse assignWorker(
            Long recyclingRequestId,
            Long workerId
    ) {

        if (recyclingRequestId == null) {

            throw new IllegalArgumentException(
                    "Recycling request ID is required"
            );
        }

        if (workerId == null) {

            throw new IllegalArgumentException(
                    "Worker ID is required"
            );
        }


        // =====================================================
        // FIND REQUEST
        // =====================================================

        RecyclingRequest request =
                recyclingRequestRepository
                        .findById(recyclingRequestId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Recycling request not found"
                                )
                        );


        // =====================================================
        // FIND WORKER
        // =====================================================

        User worker =
                userRepository
                        .findById(workerId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Worker not found"
                                )
                        );


        // =====================================================
        // CHECK WORKER ROLE
        // =====================================================

        if (worker.getRole() !=
                Role.RECYCLING_WORKER) {

            throw new RuntimeException(
                    "Selected user is not a recycling worker"
            );
        }


        // =====================================================
        // CHECK REQUEST STATUS
        // =====================================================

        if (request.getStatus() ==
                RecyclingStatus.ASSIGNED) {

            throw new RuntimeException(
                    "This recycling request is already assigned"
            );
        }


        if (request.getStatus() ==
                RecyclingStatus.PICKUP_IN_PROGRESS) {

            throw new RuntimeException(
                    "This recycling request is already in progress"
            );
        }


        if (request.getStatus() ==
                RecyclingStatus.AWAITING_APPROVAL) {

            throw new RuntimeException(
                    "This recycling request is waiting for admin approval"
            );
        }


        if (request.getStatus() ==
                RecyclingStatus.COMPLETED) {

            throw new RuntimeException(
                    "This recycling request is already completed"
            );
        }


        // =====================================================
        // CREATE TASK
        // =====================================================

        RecyclingTask task =
                RecyclingTask.builder()

                        .recyclingRequest(
                                request
                        )

                        .worker(
                                worker
                        )

                        .status(
                                RecyclingStatus.ASSIGNED
                        )

                        .assignedAt(
                                LocalDateTime.now()
                        )

                        .build();


        // =====================================================
        // UPDATE REQUEST
        // =====================================================

        request.setStatus(
                RecyclingStatus.ASSIGNED
        );

        recyclingRequestRepository.save(
                request
        );


        // =====================================================
        // SAVE TASK
        // =====================================================

        RecyclingTask savedTask =
                recyclingTaskRepository.save(
                        task
                );


        // =====================================================
        // NOTIFY WORKER
        // =====================================================

        notificationService.createNotification(
                worker,
                "New recycling pickup task #" +
                        savedTask.getId() +
                        " has been assigned to you."
        );


        // =====================================================
        // NOTIFY USER
        // =====================================================

        notificationService.createNotification(
                request.getUser(),
                "Your recycling request #" +
                        request.getId() +
                        " has been assigned to a recycling worker."
        );


        return convertTaskToResponse(
                savedTask
        );
    }


    // =========================================================
    // WORKER SEES ASSIGNED TASKS
    // =========================================================

    @Transactional(readOnly = true)
    public List<RecyclingTaskResponse> getMyTasks(
            String email
    ) {

        User worker =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Worker not found"
                                )
                        );


        if (worker.getRole() !=
                Role.RECYCLING_WORKER) {

            throw new RuntimeException(
                    "User is not a recycling worker"
            );
        }


        return recyclingTaskRepository
                .findByWorker(worker)
                .stream()
                .map(this::convertTaskToResponse)
                .toList();
    }


    // =========================================================
    // WORKER STARTS TASK
    // =========================================================

    public RecyclingTaskResponse startTask(
            Long taskId,
            String email
    ) {

        User worker =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Worker not found"
                                )
                        );


        if (worker.getRole() !=
                Role.RECYCLING_WORKER) {

            throw new RuntimeException(
                    "User is not a recycling worker"
            );
        }


        RecyclingTask task =
                recyclingTaskRepository
                        .findById(taskId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Task not found"
                                )
                        );


        // =====================================================
        // CHECK OWNERSHIP
        // =====================================================

        checkWorkerOwnership(
                task,
                worker
        );


        // =====================================================
        // CHECK STATUS
        // =====================================================

        if (task.getStatus() ==
                RecyclingStatus.COMPLETED) {

            throw new RuntimeException(
                    "Task is already completed"
            );
        }


        if (task.getStatus() ==
                RecyclingStatus.PICKUP_IN_PROGRESS) {

            throw new RuntimeException(
                    "Task is already in progress"
            );
        }


        if (task.getStatus() ==
                RecyclingStatus.AWAITING_APPROVAL) {

            throw new RuntimeException(
                    "Task is already waiting for admin approval"
            );
        }


        if (task.getStatus() !=
                RecyclingStatus.ASSIGNED) {

            throw new RuntimeException(
                    "Only assigned tasks can be started"
            );
        }


        // =====================================================
        // UPDATE TASK
        // =====================================================

        task.setStatus(
                RecyclingStatus.PICKUP_IN_PROGRESS
        );


        // =====================================================
        // UPDATE REQUEST
        // =====================================================

        RecyclingRequest request =
                task.getRecyclingRequest();

        if (request == null) {

            throw new RuntimeException(
                    "Recycling request not found"
            );
        }


        request.setStatus(
                RecyclingStatus.PICKUP_IN_PROGRESS
        );


        recyclingRequestRepository.save(
                request
        );


        RecyclingTask savedTask =
                recyclingTaskRepository.save(
                        task
                );


        // =====================================================
        // NOTIFY ADMIN
        // =====================================================

        notificationService.notifyAdmins(
                "Recycling worker " +
                        worker.getName() +
                        " started task #" +
                        savedTask.getId() +
                        " for recycling request #" +
                        request.getId() +
                        "."
        );


        // =====================================================
        // NOTIFY USER
        // =====================================================

        notificationService.createNotification(
                request.getUser(),
                "A recycling worker has started work on your pickup request #" +
                        request.getId() +
                        "."
        );


        return convertTaskToResponse(
                savedTask
        );
    }


    // =========================================================
    // WORKER SUBMITS COMPLETION
    // =========================================================

    public RecyclingTaskResponse completeTask(
            Long taskId,
            String email
    ) {

        User worker =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Worker not found"
                                )
                        );


        if (worker.getRole() !=
                Role.RECYCLING_WORKER) {

            throw new RuntimeException(
                    "User is not a recycling worker"
            );
        }


        RecyclingTask task =
                recyclingTaskRepository
                        .findById(taskId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Task not found"
                                )
                        );


        // =====================================================
        // CHECK OWNERSHIP
        // =====================================================

        checkWorkerOwnership(
                task,
                worker
        );


        // =====================================================
        // CHECK CURRENT STATUS
        // =====================================================

        if (task.getStatus() ==
                RecyclingStatus.COMPLETED) {

            throw new RuntimeException(
                    "Task is already completed"
            );
        }


        if (task.getStatus() ==
                RecyclingStatus.AWAITING_APPROVAL) {

            throw new RuntimeException(
                    "Completion has already been sent to admin"
            );
        }


        // =====================================================
        // ONLY IN-PROGRESS TASK CAN BE SUBMITTED
        // =====================================================

        if (task.getStatus() !=
                RecyclingStatus.PICKUP_IN_PROGRESS) {

            throw new RuntimeException(
                    "Only an in-progress task can be submitted for completion"
            );
        }


        RecyclingRequest request =
                task.getRecyclingRequest();


        if (request == null) {

            throw new RuntimeException(
                    "Recycling request not found"
            );
        }


        // =====================================================
        // WORKER SUBMITS FOR ADMIN APPROVAL
        // =====================================================

        task.setStatus(
                RecyclingStatus.AWAITING_APPROVAL
        );


        request.setStatus(
                RecyclingStatus.AWAITING_APPROVAL
        );


        task.setCompletedAt(
                LocalDateTime.now()
        );


        // =====================================================
        // SAVE REQUEST
        // =====================================================

        recyclingRequestRepository.save(
                request
        );


        // =====================================================
        // SAVE TASK
        // =====================================================

        RecyclingTask savedTask =
                recyclingTaskRepository.save(
                        task
                );


        // =====================================================
        // NOTIFY ADMIN
        // =====================================================

        notificationService.notifyAdmins(
                "Recycling worker " +
                        worker.getName() +
                        " submitted completion for recycling request #" +
                        request.getId() +
                        ". Admin approval is required."
        );


        /*
         * IMPORTANT:
         *
         * Do NOT give reward points here.
         *
         * Do NOT mark the request COMPLETED here.
         *
         * Do NOT tell the user that recycling is completed here.
         *
         * Admin approval should do those things.
         */


        return convertTaskToResponse(
                savedTask
        );
    }


    // =========================================================
    // CHECK WORKER OWNERSHIP
    // =========================================================

    private void checkWorkerOwnership(
            RecyclingTask task,
            User worker
    ) {

        if (task.getWorker() == null) {

            throw new RuntimeException(
                    "This task has no assigned worker"
            );
        }


        if (!task.getWorker()
                .getId()
                .equals(worker.getId())) {

            throw new RuntimeException(
                    "You are not assigned to this task"
            );
        }
    }


    // =========================================================
    // CONVERT REQUEST TO RESPONSE
    // =========================================================

    private RecyclingRequestResponse convertToResponse(
            RecyclingRequest request
    ) {

        return new RecyclingRequestResponse(

                request.getId(),

                request.getDescription(),

                request.getPickupLocation(),

                request.getLatitude(),

                request.getLongitude(),

                request.getWasteType(),

                request.getStatus(),

                request.getImageUrl(),

                request.getCreatedAt()
        );
    }


    // =========================================================
    // CONVERT TASK TO RESPONSE
    // =========================================================

    private RecyclingTaskResponse convertTaskToResponse(
            RecyclingTask task
    ) {

        RecyclingRequest request =
                task.getRecyclingRequest();

        if (request == null) {

            throw new RuntimeException(
                    "Recycling request not found for task"
            );
        }


        User worker =
                task.getWorker();

        if (worker == null) {

            throw new RuntimeException(
                    "Worker not assigned to task"
            );
        }


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