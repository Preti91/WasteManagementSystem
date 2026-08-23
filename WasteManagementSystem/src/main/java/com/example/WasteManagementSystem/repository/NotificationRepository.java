package com.example.WasteManagementSystem.repository;

import com.example.WasteManagementSystem.entity.Notification;
import com.example.WasteManagementSystem.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    // Get all notifications for a user
    List<Notification> findByUserOrderByCreatedAtDesc(User user);

    // Get only unread notifications for a user
    List<Notification> findByUserAndIsReadFalseOrderByCreatedAtDesc(
            User user);
}