//package com.example.WasteManagementSystem.service;
//
//import com.example.WasteManagementSystem.dto.CleaningTaskResponse;
//import com.example.WasteManagementSystem.entity.CleaningTask;
//import com.example.WasteManagementSystem.entity.User;
//import com.example.WasteManagementSystem.enums.GarbageStatus;
//import com.example.WasteManagementSystem.repository.CleaningTaskRepository;
//import com.example.WasteManagementSystem.repository.GarbageReportRepository;
//import com.example.WasteManagementSystem.repository.UserRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDateTime;
//import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//public class CleaningWorkerService {
//
//    private final CleaningTaskRepository cleaningTaskRepository;
//    private final GarbageReportRepository garbageReportRepository;
//    private final UserRepository userRepository;
//    private final NotificationService notificationService;
//    private final RewardService rewardService;
//
//
//    // =========================================================
//    // 1. ADMIN ASSIGNS CLEANING TASK
//    // =========================================================
//
//    public CleaningTaskResponse assignTask(
//            Long garbageReportId,
//            Long workerId) {
//
//        var report = garbageReportRepository
//                .findById(garbageReportId)
//                .orElseThrow(() ->
//                        new RuntimeException(
//                                "Garbage report not found"));
//
//        User worker = userRepository
//                .findById(workerId)
//                .orElseThrow(() ->
//                        new RuntimeException(
//                                "Worker not found"));
//
//        // Check that selected user is a worker
//        if (!worker.getRole().name().equals("CLEANING_WORKER")) {
//            throw new RuntimeException(
//                    "Selected user is not a cleaning worker");
//        }
//
//        CleaningTask task = CleaningTask.builder()
//                .garbageReport(report)
//                .worker(worker)
//                .status(GarbageStatus.ASSIGNED)
//                .assignedAt(LocalDateTime.now())
//                .build();
//
//        // Change garbage report status
//        report.setStatus(GarbageStatus.ASSIGNED);
//
//        garbageReportRepository.save(report);
//
//        // Save cleaning task
//        CleaningTask savedTask =
//                cleaningTaskRepository.save(task);
//
//        // Notify cleaning worker
//        notificationService.createNotification(
//                worker,
//                "New cleaning task assigned to you."
//        );
//
//        return convertToResponse(savedTask);
//    }
//
//
//    // =========================================================
//    // 2. GET MY CLEANING TASKS
//    // =========================================================
//
//    public List<CleaningTaskResponse> getMyTasks(
//            String email) {
//
//        User worker = userRepository
//                .findByEmail(email)
//                .orElseThrow(() ->
//                        new RuntimeException(
//                                "Worker not found"));
//
//        return cleaningTaskRepository
//                .findByWorker(worker)
//                .stream()
//                .map(this::convertToResponse)
//                .toList();
//    }
//
//
//    // =========================================================
//    // 3. WORKER STARTS CLEANING
//    // =========================================================
//
//    public CleaningTaskResponse startTask(
//            Long taskId,
//            String email) {
//
//        User worker = getWorker(email);
//
//        CleaningTask task =
//                cleaningTaskRepository
//                        .findById(taskId)
//                        .orElseThrow(() ->
//                                new RuntimeException(
//                                        "Task not found"));
//
//        // Make sure this task belongs to this worker
//        checkWorker(task, worker);
//
//        // Change task status
//        task.setStatus(GarbageStatus.IN_PROGRESS);
//
//        // Change garbage report status
//        task.getGarbageReport()
//                .setStatus(GarbageStatus.IN_PROGRESS);
//
//        // Save garbage report
//        garbageReportRepository.save(
//                task.getGarbageReport()
//        );
//
//        // Save task
//        CleaningTask savedTask =
//                cleaningTaskRepository.save(task);
//
//        return convertToResponse(savedTask);
//    }
//
//
//    // =========================================================
//    // 4. WORKER COMPLETES CLEANING
//    // =========================================================
//
//    public CleaningTaskResponse completeTask(
//            Long taskId,
//            String email) {
//
//        User worker = getWorker(email);
//
//        CleaningTask task =
//                cleaningTaskRepository
//                        .findById(taskId)
//                        .orElseThrow(() ->
//                                new RuntimeException(
//                                        "Task not found"));
//
//        // Make sure this task belongs to this worker
//        checkWorker(task, worker);
//
//        // Change cleaning task status
//        task.setStatus(GarbageStatus.COMPLETED);
//
//        // Change garbage report status
//        task.getGarbageReport()
//                .setStatus(GarbageStatus.COMPLETED);
//
//        // Set completion time
//        task.setCompletedAt(LocalDateTime.now());
//
//        // Save garbage report
//        garbageReportRepository.save(
//                task.getGarbageReport()
//        );
//
//        // =====================================================
//        // GIVE REWARD POINTS TO THE USER WHO REPORTED GARBAGE
//        // =====================================================
//
//        rewardService.addPoints(
//                task.getGarbageReport().getUser(),
//                10,
//                "Garbage cleaning completed"
//        );
//
//        // Save completed task
//        CleaningTask savedTask =
//                cleaningTaskRepository.save(task);
//
//        return convertToResponse(savedTask);
//    }
//
//
//    // =========================================================
//    // 5. GET WORKER
//    // =========================================================
//
//    private User getWorker(String email) {
//
//        return userRepository
//                .findByEmail(email)
//                .orElseThrow(() ->
//                        new RuntimeException(
//                                "Worker not found"));
//    }
//
//
//    // =========================================================
//    // 6. CHECK TASK OWNER
//    // =========================================================
//
//    private void checkWorker(
//            CleaningTask task,
//            User worker) {
//
//        if (!task.getWorker()
//                .getId()
//                .equals(worker.getId())) {
//
//            throw new RuntimeException(
//                    "You are not assigned to this task");
//        }
//    }
//
//
//    // =========================================================
//    // 7. CONVERT ENTITY TO RESPONSE
//    // =========================================================
//
//    private CleaningTaskResponse convertToResponse(
//            CleaningTask task) {
//
//        return new CleaningTaskResponse(
//                task.getId(),
//                task.getGarbageReport().getId(),
//                task.getGarbageReport().getDescription(),
//                task.getGarbageReport().getLocation(),
//                task.getWorker().getId(),
//                task.getWorker().getName(),
//                task.getStatus(),
//                task.getAssignedAt(),
//                task.getCompletedAt()
//        );
//    }
//}

package com.example.WasteManagementSystem.service;

import com.example.WasteManagementSystem.dto.CleaningTaskResponse;
import com.example.WasteManagementSystem.entity.CleaningTask;
import com.example.WasteManagementSystem.entity.GarbageReport;
import com.example.WasteManagementSystem.entity.User;
import com.example.WasteManagementSystem.enums.GarbageStatus;
import com.example.WasteManagementSystem.enums.Role;
import com.example.WasteManagementSystem.repository.CleaningTaskRepository;
import com.example.WasteManagementSystem.repository.GarbageReportRepository;
import com.example.WasteManagementSystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CleaningWorkerService {

    private final CleaningTaskRepository cleaningTaskRepository;
    private final GarbageReportRepository garbageReportRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;


    // =========================================================
    // ADMIN ASSIGNS CLEANING TASK
    // =========================================================

    public CleaningTaskResponse assignTask(
            Long garbageReportId,
            Long workerId) {

        GarbageReport report =
                garbageReportRepository
                        .findById(garbageReportId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Garbage report not found"
                                ));

        User worker =
                userRepository
                        .findById(workerId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Worker not found"
                                ));


        if (worker.getRole() != Role.CLEANING_WORKER) {

            throw new RuntimeException(
                    "Selected user is not a cleaning worker"
            );
        }


        if (report.getStatus() == GarbageStatus.COMPLETED) {

            throw new RuntimeException(
                    "This report is already completed"
            );
        }


        if (report.getStatus() == GarbageStatus.ASSIGNED ||
                report.getStatus() == GarbageStatus.IN_PROGRESS ||
                report.getStatus() ==
                        GarbageStatus.AWAITING_APPROVAL) {

            throw new RuntimeException(
                    "This report is already assigned"
            );
        }


        CleaningTask task =
                CleaningTask.builder()
                        .garbageReport(report)
                        .worker(worker)
                        .status(GarbageStatus.ASSIGNED)
                        .assignedAt(LocalDateTime.now())
                        .build();


        report.setStatus(
                GarbageStatus.ASSIGNED
        );


        garbageReportRepository.save(report);

        CleaningTask savedTask =
                cleaningTaskRepository.save(task);


        // Notify worker
        notificationService.createNotification(
                worker,
                "New garbage cleaning task #" +
                        savedTask.getId() +
                        " has been assigned to you."
        );


        return convertToResponse(savedTask);
    }


    // =========================================================
    // WORKER GETS TASKS
    // =========================================================

    @Transactional(readOnly = true)
    public List<CleaningTaskResponse> getMyTasks(
            String email) {

        User worker =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Worker not found"
                                ));

        return cleaningTaskRepository
                .findByWorker(worker)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    // =========================================================
    // WORKER STARTS TASK
    // =========================================================

    public CleaningTaskResponse startTask(
            Long taskId,
            String email) {

        User worker =
                getWorker(email);

        CleaningTask task =
                cleaningTaskRepository
                        .findById(taskId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Task not found"
                                ));


        checkWorker(task, worker);


        if (task.getStatus() !=
                GarbageStatus.ASSIGNED) {

            throw new RuntimeException(
                    "Only assigned tasks can be started"
            );
        }


        task.setStatus(
                GarbageStatus.IN_PROGRESS
        );


        GarbageReport report =
                task.getGarbageReport();

        report.setStatus(
                GarbageStatus.IN_PROGRESS
        );


        garbageReportRepository.save(report);

        CleaningTask savedTask =
                cleaningTaskRepository.save(task);

        // Tell every admin that the worker has started the task.
        notificationService.notifyAdmins(
                "Cleaning worker " + worker.getName() +
                        " started task #" + savedTask.getId() +
                        " for garbage report #" + report.getId() + "."
        );

        // Tell the reporting user that work has started.
        notificationService.createNotification(
                report.getUser(),
                "A cleaning worker has started work on your garbage report #" +
                        report.getId() + "."
        );

        return convertToResponse(savedTask);
    }


    // =========================================================
    // WORKER SUBMITS COMPLETION
    // =========================================================

    public CleaningTaskResponse completeTask(
            Long taskId,
            String email) {

        User worker =
                getWorker(email);

        CleaningTask task =
                cleaningTaskRepository
                        .findById(taskId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Task not found"
                                ));


        checkWorker(task, worker);


        if (task.getStatus() !=
                GarbageStatus.IN_PROGRESS) {

            throw new RuntimeException(
                    "Only in-progress tasks can be completed"
            );
        }


        /*
         * IMPORTANT:
         *
         * Worker does NOT set COMPLETED.
         *
         * Worker sends completion request to admin.
         */

        task.setStatus(
                GarbageStatus.AWAITING_APPROVAL
        );


        GarbageReport report =
                task.getGarbageReport();

        report.setStatus(
                GarbageStatus.AWAITING_APPROVAL
        );


        task.setCompletedAt(
                LocalDateTime.now()
        );


        garbageReportRepository.save(report);

        CleaningTask savedTask =
                cleaningTaskRepository.save(task);


        // Notify admin
        notificationService.notifyAdmins(
                "Cleaning worker " +
                        worker.getName() +
                        " submitted completion for garbage report #" +
                        report.getId() +
                        ". Admin approval is required."
        );


        // The user is notified only after ADMIN approval.
        // This avoids showing "completed" before verification.

        return convertToResponse(savedTask);
    }


    // =========================================================
    // GET WORKER
    // =========================================================

    private User getWorker(String email) {

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Worker not found"
                        ));
    }


    // =========================================================
    // CHECK WORKER
    // =========================================================

    private void checkWorker(
            CleaningTask task,
            User worker) {

        if (task.getWorker() == null ||
                !task.getWorker()
                        .getId()
                        .equals(worker.getId())) {

            throw new RuntimeException(
                    "You are not assigned to this task"
            );
        }
    }


    // =========================================================
    // RESPONSE
    // =========================================================

    private CleaningTaskResponse convertToResponse(
            CleaningTask task) {

        return new CleaningTaskResponse(

                task.getId(),

                task.getGarbageReport().getId(),

                task.getGarbageReport().getDescription(),

                task.getGarbageReport().getLocation(),

                task.getGarbageReport().getLatitude(),

                task.getGarbageReport().getLongitude(),

                task.getWorker().getId(),

                task.getWorker().getName(),

                task.getStatus(),

                task.getAssignedAt(),

                task.getCompletedAt()
        );

    }
}