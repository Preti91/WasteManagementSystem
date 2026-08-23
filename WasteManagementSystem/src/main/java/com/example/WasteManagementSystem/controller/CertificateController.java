package com.example.WasteManagementSystem.controller;

import com.example.WasteManagementSystem.dto.CertificateResponse;
import com.example.WasteManagementSystem.service.RewardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
public class CertificateController {

    private final RewardService rewardService;


    // =========================================================
    // GET MY CERTIFICATES
    // =========================================================

    @GetMapping
    public ResponseEntity<List<CertificateResponse>> getMyCertificates(
            Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(
                rewardService.getMyCertificates(
                        authentication.getName()
                )
        );
    }


    // =========================================================
    // GET ONE CERTIFICATE BY CODE
    // =========================================================

    @GetMapping("/{code}")
    public ResponseEntity<CertificateResponse> getCertificate(
            @PathVariable String code,
            Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(
                rewardService.getCertificateByCode(
                        authentication.getName(),
                        code
                )
        );
    }
}
