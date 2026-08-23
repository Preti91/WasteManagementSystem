package com.example.WasteManagementSystem.controller;

import com.example.WasteManagementSystem.dto.AIClassificationRequest;
import com.example.WasteManagementSystem.entity.AIClassification;
import com.example.WasteManagementSystem.service.AIService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/classify")
    public ResponseEntity<AIClassification> classifyWaste(
            @RequestBody AIClassificationRequest request) {

        AIClassification result = aiService.classifyWaste(request);

        return ResponseEntity.ok(result);
    }
}