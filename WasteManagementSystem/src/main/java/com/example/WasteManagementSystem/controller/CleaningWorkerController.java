//package com.example.WasteManagementSystem.controller;
//
//import com.example.WasteManagementSystem.dto.CleaningTaskResponse;
//import com.example.WasteManagementSystem.service.CleaningWorkerService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/cleaning-worker")
//@RequiredArgsConstructor
//public class CleaningWorkerController {
//
//    private final CleaningWorkerService cleaningWorkerService;
//
//    @GetMapping("/tasks")
//    public ResponseEntity<List<CleaningTaskResponse>> getMyTasks(
//            org.springframework.security.core.Authentication authentication) {
//
//        String email = authentication.getName();
//
//        return ResponseEntity.ok(
//                cleaningWorkerService.getMyTasks(email)
//        );
//    }
//
//    @PutMapping("/tasks/{taskId}/start")
//    public ResponseEntity<CleaningTaskResponse> startTask(
//            @PathVariable Long taskId,
//            org.springframework.security.core.Authentication authentication) {
//
//        String email = authentication.getName();
//
//        return ResponseEntity.ok(
//                cleaningWorkerService.startTask(
//                        taskId,
//                        email
//                )
//        );
//    }
//
//    @PutMapping("/tasks/{taskId}/complete")
//    public ResponseEntity<CleaningTaskResponse> completeTask(
//            @PathVariable Long taskId,
//            org.springframework.security.core.Authentication authentication) {
//
//        String email = authentication.getName();
//
//        return ResponseEntity.ok(
//                cleaningWorkerService.completeTask(
//                        taskId,
//                        email
//                )
//        );
//    }
//}
package com.example.WasteManagementSystem.controller;

import com.example.WasteManagementSystem.dto.CleaningTaskResponse;
import com.example.WasteManagementSystem.service.CleaningWorkerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cleaning-worker")
@RequiredArgsConstructor
public class CleaningWorkerController {

    private final CleaningWorkerService cleaningWorkerService;


    @GetMapping("/tasks")
    public ResponseEntity<List<CleaningTaskResponse>>
    getMyTasks(
            Authentication authentication) {

        return ResponseEntity.ok(
                cleaningWorkerService.getMyTasks(
                        authentication.getName()
                )
        );
    }


    @PutMapping("/tasks/{taskId}/start")
    public ResponseEntity<CleaningTaskResponse>
    startTask(
            @PathVariable Long taskId,
            Authentication authentication) {

        return ResponseEntity.ok(
                cleaningWorkerService.startTask(
                        taskId,
                        authentication.getName()
                )
        );
    }


    @PutMapping("/tasks/{taskId}/complete")
    public ResponseEntity<CleaningTaskResponse>
    completeTask(
            @PathVariable Long taskId,
            Authentication authentication) {

        return ResponseEntity.ok(
                cleaningWorkerService.completeTask(
                        taskId,
                        authentication.getName()
                )
        );
    }
}