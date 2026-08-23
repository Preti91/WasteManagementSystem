package com.example.WasteManagementSystem.entity;

import com.example.WasteManagementSystem.enums.RecyclingStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "recycling_tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecyclingTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(
            name = "recycling_request_id",
            nullable = false
    )
    private RecyclingRequest recyclingRequest;

    @ManyToOne
    @JoinColumn(
            name = "worker_id",
            nullable = false
    )
    private User worker;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RecyclingStatus status;

    private LocalDateTime assignedAt;

    private LocalDateTime completedAt;
}