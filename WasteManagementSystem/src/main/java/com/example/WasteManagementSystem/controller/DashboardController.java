//package com.example.WasteManagementSystem.controller;
//
//import com.example.WasteManagementSystem.dto.DashboardResponse;
//import com.example.WasteManagementSystem.service.DashboardService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/dashboard")
//@RequiredArgsConstructor
//public class DashboardController {
//
//    private final DashboardService dashboardService;
//
//    @GetMapping
//    public ResponseEntity<DashboardResponse> getDashboard() {
//
//        return ResponseEntity.ok(
//                dashboardService.getDashboard()
//        );
//    }
//}

package com.example.WasteManagementSystem.controller;

import com.example.WasteManagementSystem.dto.DashboardResponse;
import com.example.WasteManagementSystem.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/user")
    public ResponseEntity<DashboardResponse> getUserDashboard(
            Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(
                dashboardService.getUserDashboard(
                        authentication.getName()
                )
        );
    }
}