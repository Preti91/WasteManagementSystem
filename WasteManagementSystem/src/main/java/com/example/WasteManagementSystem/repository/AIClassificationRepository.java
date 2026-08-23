package com.example.WasteManagementSystem.repository;

import com.example.WasteManagementSystem.entity.AIClassification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AIClassificationRepository
        extends JpaRepository<AIClassification, Long> {
}