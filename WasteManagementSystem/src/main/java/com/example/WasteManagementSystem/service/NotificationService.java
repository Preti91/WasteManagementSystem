//package com.example.WasteManagementSystem.service;
//
//import com.example.WasteManagementSystem.entity.Notification;
//import com.example.WasteManagementSystem.entity.User;
//import com.example.WasteManagementSystem.repository.NotificationRepository;
//import com.example.WasteManagementSystem.repository.UserRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDateTime;
//import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//public class NotificationService {
//
//    private final NotificationRepository notificationRepository;
//    private final UserRepository userRepository;
//
//    // Create notification
//    public Notification createNotification(
//            User user,
//            String message) {
//
//        Notification notification = Notification.builder()
//                .user(user)
//                .message(message)
//                .isRead(false)
//                .createdAt(LocalDateTime.now())
//                .build();
//
//        return notificationRepository.save(notification);
//    }
//
//    // Get all notifications of logged-in user
//    public List<Notification> getMyNotifications(
//            String email) {
//
//        User user = userRepository.findByEmail(email)
//                .orElseThrow(() ->
//                        new RuntimeException("User not found"));
//
//        return notificationRepository
//                .findByUserOrderByCreatedAtDesc(user);
//    }
//
//    // Get only unread notifications
//    public List<Notification> getUnreadNotifications(
//            String email) {
//
//        User user = userRepository.findByEmail(email)
//                .orElseThrow(() ->
//                        new RuntimeException("User not found"));
//
//        return notificationRepository
//                .findByUserAndIsReadFalseOrderByCreatedAtDesc(user);
//    }
//
//    // Mark notification as read
//    public void markAsRead(
//            Long notificationId,
//            String email) {
//
//        User user = userRepository.findByEmail(email)
//                .orElseThrow(() ->
//                        new RuntimeException("User not found"));
//
//        Notification notification =
//                notificationRepository.findById(notificationId)
//                        .orElseThrow(() ->
//                                new RuntimeException(
//                                        "Notification not found"));
//
//        if (!notification.getUser()
//                .getId()
//                .equals(user.getId())) {
//
//            throw new RuntimeException(
//                    "You cannot update this notification");
//        }
//
//        notification.setRead(true);
//
//        notificationRepository.save(notification);
//    }
//}

package com.example.WasteManagementSystem.service;

import com.example.WasteManagementSystem.entity.Notification;
import com.example.WasteManagementSystem.entity.User;
import com.example.WasteManagementSystem.enums.Role;
import com.example.WasteManagementSystem.repository.NotificationRepository;
import com.example.WasteManagementSystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;


    // =========================================================
    // CREATE NOTIFICATION
    // =========================================================

    public Notification createNotification(
            User user,
            String message) {

        if (user == null) {
            throw new IllegalArgumentException(
                    "Notification user cannot be null"
            );
        }

        if (message == null ||
                message.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Notification message cannot be empty"
            );
        }

        Notification notification =
                Notification.builder()
                        .user(user)
                        .message(message.trim())
                        .isRead(false)
                        .createdAt(LocalDateTime.now())
                        .build();

        return notificationRepository.save(notification);
    }


    // =========================================================
    // NOTIFY ALL ADMINS
    // =========================================================

    public void notifyAdmins(String message) {

        List<User> admins =
                userRepository.findByRole(Role.ADMIN);

        for (User admin : admins) {

            createNotification(
                    admin,
                    message
            );
        }
    }


    // =========================================================
    // GET MY NOTIFICATIONS
    // =========================================================

    public List<Notification> getMyNotifications(
            String email) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));

        return notificationRepository
                .findByUserOrderByCreatedAtDesc(user);
    }


    // =========================================================
    // GET UNREAD NOTIFICATIONS
    // =========================================================

    public List<Notification> getUnreadNotifications(
            String email) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));

        return notificationRepository
                .findByUserAndIsReadFalseOrderByCreatedAtDesc(
                        user
                );
    }


    // =========================================================
    // MARK AS READ
    // =========================================================

    public void markAsRead(
            Long notificationId,
            String email) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));

        Notification notification =
                notificationRepository
                        .findById(notificationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found"
                                ));

        if (!notification.getUser()
                .getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "You cannot update this notification"
            );
        }

        notification.setRead(true);

        notificationRepository.save(notification);
    }
}