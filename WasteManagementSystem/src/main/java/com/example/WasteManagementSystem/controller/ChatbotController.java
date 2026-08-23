package com.example.WasteManagementSystem.controller;

import com.example.WasteManagementSystem.dto.ChatbotRequest;
import com.example.WasteManagementSystem.dto.ChatbotResponse;
import com.example.WasteManagementSystem.service.ChatbotService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {

    private final ChatbotService chatbotService;

    public ChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @PostMapping("/message")
    public ResponseEntity<ChatbotResponse> sendMessage(
            @RequestBody ChatbotRequest request) {

        String response =
                chatbotService.getResponse(request.getMessage());

        return ResponseEntity.ok(
                new ChatbotResponse(response)
        );
    }
}