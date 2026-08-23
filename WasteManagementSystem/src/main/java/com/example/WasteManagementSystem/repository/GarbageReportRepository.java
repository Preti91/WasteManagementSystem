//package com.example.WasteManagementSystem.repository;
//
//import com.example.WasteManagementSystem.entity.GarbageReport;
//import com.example.WasteManagementSystem.entity.User;
//import com.example.WasteManagementSystem.enums.GarbageStatus;
//
//import org.springframework.data.jpa.repository.JpaRepository;
//
//import java.util.List;
//
//public interface GarbageReportRepository
//        extends JpaRepository<GarbageReport, Long> {
//
//    List<GarbageReport> findByUser(User user);
//
//    long countByStatus(GarbageStatus status);
//}
package com.example.WasteManagementSystem.repository;

import com.example.WasteManagementSystem.entity.GarbageReport;
import com.example.WasteManagementSystem.entity.User;
import com.example.WasteManagementSystem.enums.GarbageStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GarbageReportRepository
        extends JpaRepository<GarbageReport, Long> {

    List<GarbageReport> findByUser(User user);

    long countByUser(User user);

    long countByUserAndStatus(
            User user,
            GarbageStatus status
    );

    long countByStatus(
            GarbageStatus status
    );
}