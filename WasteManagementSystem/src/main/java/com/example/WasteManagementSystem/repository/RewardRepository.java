package com.example.WasteManagementSystem.repository;

import com.example.WasteManagementSystem.entity.Reward;
import com.example.WasteManagementSystem.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RewardRepository
        extends JpaRepository<Reward, Long> {

    List<Reward> findByUserOrderByCreatedAtDesc(User user);
    List<Reward> findAllByOrderByCreatedAtDesc();
}