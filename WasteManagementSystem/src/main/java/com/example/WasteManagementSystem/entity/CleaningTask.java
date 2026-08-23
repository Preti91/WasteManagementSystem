package com.example.WasteManagementSystem.entity;

import com.example.WasteManagementSystem.enums.GarbageStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "cleaning_tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CleaningTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "garbage_report_id", nullable = false)
    private GarbageReport garbageReport;

    @ManyToOne
    @JoinColumn(name = "worker_id", nullable = false)
    private User worker;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GarbageStatus status;

    private LocalDateTime assignedAt;

    private LocalDateTime completedAt;
}