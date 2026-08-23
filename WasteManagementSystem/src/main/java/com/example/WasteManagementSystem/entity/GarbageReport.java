//package com.example.WasteManagementSystem.entity;
//
//import com.example.WasteManagementSystem.enums.GarbageStatus;
//import com.example.WasteManagementSystem.enums.WasteType;
//import jakarta.persistence.*;
//import lombok.*;
//
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "garbage_reports")
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class GarbageReport {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(nullable = false)
//    private String description;
//
//    @Column(nullable = false)
//    private String location;
//
//    private Double latitude;
//
//    private Double longitude;
//
//    @Enumerated(EnumType.STRING)
//    @Column(nullable = false)
//    private WasteType wasteType;
//
//    @Enumerated(EnumType.STRING)
//    @Column(nullable = false)
//    private GarbageStatus status;
//
//    private String imageUrl;
//
//    @Column(nullable = false)
//    private LocalDateTime createdAt;
//
//    @ManyToOne
//    @JoinColumn(name = "user_id", nullable = false)
//    private User user;
//}

package com.example.WasteManagementSystem.entity;

import com.example.WasteManagementSystem.enums.GarbageStatus;
import com.example.WasteManagementSystem.enums.WasteType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "garbage_reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GarbageReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String location;

    private Double latitude;

    private Double longitude;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WasteType wasteType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GarbageStatus status;

    private String imageUrl;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}