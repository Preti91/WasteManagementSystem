//package com.example.WasteManagementSystem.dto;
//
//import lombok.*;
//
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class DashboardResponse {
//
//    private long totalUsers;
//
//    private long totalGarbageReports;
//
//    private long totalRecyclingRequests;
//
//    private long completedTasks;
//
//    private long pendingTasks;
//}

package com.example.WasteManagementSystem.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {

    private long totalReports;
    private long pendingReports;
    private long inProgressReports;
    private long completedReports;

    private long totalRecyclingRequests;
    private long pendingRecyclingRequests;
    private long inProgressRecyclingRequests;
    private long completedRecyclingRequests;

    private int rewardPoints;
}