package com.example.WasteManagementSystem.repository;

import com.example.WasteManagementSystem.entity.RecyclingTask;
import com.example.WasteManagementSystem.entity.User;
import com.example.WasteManagementSystem.enums.RecyclingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecyclingTaskRepository
        extends JpaRepository<RecyclingTask, Long> {

    /*
     * Get only tasks belonging to a particular worker
     */
    List<RecyclingTask> findByWorker(User worker);

    /*
     * Used by admin
     */
    List<RecyclingTask> findByStatus(
            RecyclingStatus status
    );
}