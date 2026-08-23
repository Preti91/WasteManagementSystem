package com.example.WasteManagementSystem.controller;

import com.example.WasteManagementSystem.dto.UserResponse;
import com.example.WasteManagementSystem.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;


    @GetMapping("/me")
    public UserResponse getCurrentUser(
            Authentication authentication
    ) {

        if (authentication == null) {

            throw new RuntimeException(
                    "Not authenticated"
            );
        }

        return userService.getUserByEmail(
                authentication.getName()
        );
    }
}