package com.example.WasteManagementSystem.controller;

import com.example.WasteManagementSystem.dto.GarbageReportRequest;
import com.example.WasteManagementSystem.dto.GarbageReportResponse;
import com.example.WasteManagementSystem.service.FileStorageService;
import com.example.WasteManagementSystem.service.GarbageReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/garbage")
@RequiredArgsConstructor
public class GarbageReportController {

    private final GarbageReportService garbageReportService;
    private final FileStorageService fileStorageService;

    /**
     * Uploads a garbage photo and returns its public URL. The frontend
     * calls this first, then sends the returned imageUrl along with the
     * rest of the report to POST /api/garbage/report. No database change
     * needed - GarbageReport already has an imageUrl column.
     */
    @PostMapping(value = "/upload-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadImage(
            @RequestParam("image") MultipartFile image) {

        String imageUrl = fileStorageService.storeGarbageImage(image);

        return ResponseEntity.ok(Map.of("imageUrl", imageUrl));
    }

    @PostMapping("/report")
    public ResponseEntity<GarbageReportResponse> createReport(
            @Valid @RequestBody GarbageReportRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        GarbageReportResponse report =
                garbageReportService.createReport(
                        request,
                        email
                );

        return ResponseEntity.ok(report);
    }

    @GetMapping("/my-reports")
    public ResponseEntity<List<GarbageReportResponse>> getMyReports(
            Authentication authentication) {

        String email = authentication.getName();

        List<GarbageReportResponse> reports =
                garbageReportService.getMyReports(email);

        return ResponseEntity.ok(reports);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GarbageReportResponse> getReportById(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();

        GarbageReportResponse report =
                garbageReportService.getReportById(
                        id,
                        email
                );

        return ResponseEntity.ok(report);
    }
}