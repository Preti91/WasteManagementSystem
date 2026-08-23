//package com.example.WasteManagementSystem.repository;
//
//import com.example.WasteManagementSystem.entity.RecyclingRequest;
//import com.example.WasteManagementSystem.entity.User;
//import com.example.WasteManagementSystem.enums.RecyclingStatus;
//import org.springframework.data.jpa.repository.JpaRepository;
//
//import java.util.List;
//
//public interface RecyclingRequestRepository
//        extends JpaRepository<RecyclingRequest, Long> {
//
//    List<RecyclingRequest> findByUser(User user);
//
//    long countByStatus(RecyclingStatus status);
//}

package com.example.WasteManagementSystem.repository;

import com.example.WasteManagementSystem.entity.RecyclingRequest;
import com.example.WasteManagementSystem.entity.User;
import com.example.WasteManagementSystem.enums.RecyclingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecyclingRequestRepository
        extends JpaRepository<RecyclingRequest, Long> {

    List<RecyclingRequest> findByUser(User user);

    long countByUser(User user);

    long countByUserAndStatus(
            User user,
            RecyclingStatus status
    );

    long countByStatus(
            RecyclingStatus status
    );
}