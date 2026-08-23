package com.example.WasteManagementSystem.repository;

import com.example.WasteManagementSystem.entity.CleaningTask;
import com.example.WasteManagementSystem.entity.User;
import com.example.WasteManagementSystem.enums.GarbageStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CleaningTaskRepository
        extends JpaRepository<CleaningTask, Long> {

    List<CleaningTask> findByWorker(User worker);

    List<CleaningTask> findByStatus(
            GarbageStatus status
    );
}