document.addEventListener("DOMContentLoaded", async () => {

    if (!requireAdmin()) {
        return;
    }

    await loadAdminDashboard();
    await loadAdminReports();
    await loadAdminUsers();
    await loadAdminWorkers();
    await loadAdminRecycling();
    await loadAdminNotifications();

});


// =========================================================
// ADMIN AUTH
// =========================================================

function requireAdmin() {

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "/login.html";
        return false;
    }

    const user = getStoredUser();

    const role = String(
        user?.role ||
        user?.userRole ||
        ""
    ).toUpperCase();

    if (role !== "ADMIN") {

        alert("Admin access only.");

        window.location.href = "/user-dashboard.html";

        return false;
    }

    return true;
}


function getStoredUser() {

    try {

        const user = localStorage.getItem("user");

        return user ? JSON.parse(user) : null;

    } catch (error) {

        console.error("User parsing error:", error);

        return null;
    }
}


// =========================================================
// DASHBOARD
// =========================================================

async function loadAdminDashboard() {

    try {

        const data = await apiFetch(
            API.ADMIN.DASHBOARD
        );

        setText("totalUsers", data?.totalUsers);
        setText("totalReports", data?.totalReports);
        setText("activeWorkers", data?.totalWorkers);
        setText("totalRecycling", data?.totalRecycling);

        setText("pendingReports", data?.pendingReports);

        setText(
            "awaitingApproval",
            data?.awaitingApprovalReports ??
            data?.awaitingApproval
        );

        setText(
            "completedReports",
            data?.completedReports
        );

        setText(
            "awaitingRecyclingApproval",
            data?.awaitingRecyclingApproval
        );

    } catch (error) {

        console.error(
            "Admin dashboard error:",
            error
        );
    }
}


// =========================================================
// GARBAGE REPORTS
// =========================================================

async function loadAdminReports() {

    const box = document.getElementById("adminReports");

    if (!box) {
        return;
    }

    try {

        const reports = await apiFetch(
            API.ADMIN.GARBAGE_REPORTS
        );

        if (!Array.isArray(reports) || reports.length === 0) {

            box.innerHTML = `
                <div class="glass rounded-2xl p-6 text-gray-400">
                    No garbage reports found.
                </div>
            `;

            return;
        }

        box.innerHTML = reports
            .map(report => createReportCard(report))
            .join("");

    } catch (error) {

        console.error(
            "Loading reports failed:",
            error
        );

        box.innerHTML = `
            <div class="text-red-400 p-4">
                ${escapeHtml(error.message)}
            </div>
        `;
    }
}


function createReportCard(report) {

    let buttons = "";

    const status = String(
        report?.status || ""
    ).toUpperCase();


    // -----------------------------------------------------
    // PENDING / REJECTED
    // -----------------------------------------------------

    if (
        status === "PENDING" ||
        status === "REJECTED"
    ) {

        buttons = `
            <button
                type="button"
                onclick="assignCleaning(${report.id})"
                class="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition">
                ASSIGN WORKER
            </button>
        `;
    }


    // -----------------------------------------------------
    // AWAITING ADMIN APPROVAL
    // -----------------------------------------------------

    if (
        status === "AWAITING_APPROVAL"
    ) {

        buttons = `
            <button
                type="button"
                onclick="approveCleaning(${report.id})"
                class="px-4 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white transition">
                ✓ APPROVE
            </button>

            <button
                type="button"
                onclick="rejectCleaning(${report.id})"
                class="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white transition">
                ✕ REJECT
            </button>
        `;
    }


    return `
        <div class="glass rounded-3xl p-6">

            <div class="flex flex-col md:flex-row md:justify-between gap-4">

                <div class="min-w-0">

                    <p class="text-xs text-gray-500">
                        REPORT #${report.id}
                    </p>

                    <h3 class="text-xl font-bold mt-2">
                        ${escapeHtml(
        report?.wasteType || "Waste"
    )}
                    </h3>

                    <p class="text-gray-400 mt-2">
                        ${escapeHtml(
        report?.description || "No description"
    )}
                    </p>

                    <p class="text-gray-400 mt-2">
                        📍 ${escapeHtml(
        report?.location ||
        report?.pickupLocation ||
        "Location unavailable"
    )}
                    </p>

                    ${
        report?.latitude != null &&
        report?.longitude != null
            ? `
                                <p class="text-xs text-gray-500 mt-2">
                                    GPS:
                                    ${escapeHtml(report.latitude)},
                                    ${escapeHtml(report.longitude)}
                                </p>
                            `
            : ""
    }

                </div>

                <div class="shrink-0">

                    <span class="
                        inline-block
                        px-3
                        py-2
                        rounded-full
                        bg-white/5
                        text-sm
                    ">
                        ${escapeHtml(status || "UNKNOWN")}
                    </span>

                </div>

            </div>

            ${
        buttons
            ? `
                        <div class="flex flex-wrap gap-3 mt-5">
                            ${buttons}
                        </div>
                    `
            : ""
    }

        </div>
    `;
}


// =========================================================
// ASSIGN CLEANING WORKER
// =========================================================

async function assignCleaning(reportId) {

    try {

        const workers = await apiFetch(
            API.ADMIN.WORKERS
        );

        if (!Array.isArray(workers)) {

            alert(
                "Unable to load workers."
            );

            return;
        }


        const cleaningWorkers = workers.filter(
            worker =>
                String(
                    worker?.role || ""
                ).toUpperCase() ===
                "CLEANING_WORKER"
        );


        if (cleaningWorkers.length === 0) {

            alert(
                "No cleaning workers available."
            );

            return;
        }


        const workerText = cleaningWorkers
            .map(
                worker =>
                    `${worker.id} - ${
                        worker.name ||
                        "Unnamed worker"
                    }`
            )
            .join("\n");


        const workerId = prompt(
            "Enter cleaning worker ID:\n\n" +
            workerText
        );


        if (!workerId) {
            return;
        }


        const numericWorkerId = Number(workerId);


        if (!Number.isInteger(numericWorkerId)) {

            alert(
                "Please enter a valid worker ID."
            );

            return;
        }


        await apiFetch(
            API.ADMIN.ASSIGN_CLEANING_TASK,
            {
                method: "POST",

                body: JSON.stringify({

                    garbageReportId:
                        Number(reportId),

                    workerId:
                    numericWorkerId

                })
            }
        );


        alert(
            "Cleaning worker assigned successfully."
        );


        await refreshAdmin();

    } catch (error) {

        console.error(
            "Assign cleaning error:",
            error
        );

        alert(
            error.message ||
            "Failed to assign cleaning worker."
        );
    }
}


// =========================================================
// APPROVE CLEANING
// =========================================================

async function approveCleaning(reportId) {

    try {

        const task =
            await findCleaningTaskForReport(
                reportId
            );


        if (!task) {

            alert(
                "Cleaning task not found."
            );

            return;
        }


        await apiFetch(
            `/api/admin/cleaning-tasks/${task.id}/approve`,
            {
                method: "PUT"
            }
        );


        alert(
            "Cleaning completion approved successfully."
        );


        await refreshAdmin();

    } catch (error) {

        console.error(
            "Approve cleaning error:",
            error
        );

        alert(
            error.message ||
            "Failed to approve cleaning."
        );
    }
}


// =========================================================
// REJECT CLEANING
// =========================================================

async function rejectCleaning(reportId) {

    try {

        const task =
            await findCleaningTaskForReport(
                reportId
            );


        if (!task) {

            alert(
                "Cleaning task not found."
            );

            return;
        }


        await apiFetch(
            `/api/admin/cleaning-tasks/${task.id}/reject`,
            {
                method: "PUT"
            }
        );


        alert(
            "Cleaning completion rejected. Worker notified."
        );


        await refreshAdmin();

    } catch (error) {

        console.error(
            "Reject cleaning error:",
            error
        );

        alert(
            error.message ||
            "Failed to reject cleaning."
        );
    }
}


// =========================================================
// USERS
// =========================================================

async function loadAdminUsers() {

    const box =
        document.getElementById("adminUsers");

    if (!box) {
        return;
    }


    try {

        const users =
            await apiFetch(
                API.ADMIN.USERS
            );


        if (!Array.isArray(users) || users.length === 0) {

            box.innerHTML = `
                <div class="glass rounded-2xl p-5 text-gray-400">
                    No users found.
                </div>
            `;

            return;
        }


        box.innerHTML =
            users
                .map(user => `

                    <div class="
                        glass
                        rounded-2xl
                        p-5
                    ">

                        <h3 class="font-bold">
                            ${escapeHtml(
                    user?.name ||
                    "Unknown"
                )}
                        </h3>

                        <p class="text-gray-400">
                            ${escapeHtml(
                    user?.email ||
                    ""
                )}
                        </p>

                        <p class="text-sm text-blue-400 mt-2">
                            ${escapeHtml(
                    user?.role ||
                    ""
                )}
                        </p>

                        <button
                            type="button"
                            onclick="sendNotification(${user.id})"
                            class="
                                mt-4
                                px-4
                                py-2
                                rounded-xl
                                bg-blue-500
                                hover:bg-blue-600
                                text-white
                                transition
                            ">
                            SEND NOTIFICATION
                        </button>

                    </div>

                `)
                .join("");

    } catch (error) {

        console.error(
            "Loading users failed:",
            error
        );

        box.innerHTML = `
            <p class="text-red-400">
                ${escapeHtml(error.message)}
            </p>
        `;
    }
}


// =========================================================
// WORKERS
// =========================================================

async function loadAdminWorkers() {

    const box =
        document.getElementById("adminWorkers");

    if (!box) {
        return;
    }


    try {

        const workers =
            await apiFetch(
                API.ADMIN.WORKERS
            );


        if (!Array.isArray(workers) || workers.length === 0) {

            box.innerHTML = `
                <div class="glass rounded-2xl p-5 text-gray-400">
                    No workers found.
                </div>
            `;

            return;
        }


        box.innerHTML =
            workers
                .map(worker => `

                    <div class="
                        glass
                        rounded-2xl
                        p-5
                    ">

                        <h3 class="font-bold">
                            ${escapeHtml(
                    worker?.name ||
                    "Unknown"
                )}
                        </h3>

                        <p class="text-gray-400">
                            ${escapeHtml(
                    worker?.email ||
                    ""
                )}
                        </p>

                        <p class="text-blue-400 mt-2">
                            ${escapeHtml(
                    worker?.role ||
                    ""
                )}
                        </p>

                    </div>

                `)
                .join("");

    } catch (error) {

        console.error(
            "Loading workers failed:",
            error
        );

        box.innerHTML = `
            <p class="text-red-400">
                ${escapeHtml(error.message)}
            </p>
        `;
    }
}


// =========================================================
// RECYCLING REQUESTS
// =========================================================

async function loadAdminRecycling() {

    const box =
        document.getElementById("adminRecycling");

    if (!box) {
        return;
    }


    try {

        const requests =
            await apiFetch(
                API.ADMIN.RECYCLING_REQUESTS
            );


        if (
            !Array.isArray(requests) ||
            requests.length === 0
        ) {

            box.innerHTML = `
                <div class="glass rounded-2xl p-6 text-gray-400">
                    No recycling requests found.
                </div>
            `;

            return;
        }


        box.innerHTML =
            requests
                .map(request =>
                    createRecyclingCard(request)
                )
                .join("");

    } catch (error) {

        console.error(
            "Loading recycling requests failed:",
            error
        );

        box.innerHTML = `
            <p class="text-red-400">
                ${escapeHtml(error.message)}
            </p>
        `;
    }
}


// =========================================================
// RECYCLING CARD
// =========================================================

function createRecyclingCard(request) {

    let buttons = "";

    const status =
        String(
            request?.status ||
            ""
        ).toUpperCase();


    // -----------------------------------------------------
    // PENDING
    // -----------------------------------------------------

    if (status === "PENDING") {

        buttons = `
            <button
                type="button"
                onclick="assignRecycling(${request.id})"
                class="
                    px-4
                    py-2
                    rounded-xl
                    bg-blue-500
                    hover:bg-blue-600
                    text-white
                    transition
                ">
                ASSIGN WORKER
            </button>
        `;
    }


    // -----------------------------------------------------
    // WAITING FOR ADMIN APPROVAL
    // -----------------------------------------------------

    if (
        status === "AWAITING_APPROVAL"
    ) {

        buttons = `
            <button
                type="button"
                onclick="approveRecycling(${request.id})"
                class="
                    px-4
                    py-2
                    rounded-xl
                    bg-green-500
                    hover:bg-green-600
                    text-white
                    transition
                ">
                ✓ APPROVE
            </button>

            <button
                type="button"
                onclick="rejectRecycling(${request.id})"
                class="
                    px-4
                    py-2
                    rounded-xl
                    bg-red-500
                    hover:bg-red-600
                    text-white
                    transition
                ">
                ✕ REJECT
            </button>
        `;
    }


    return `
        <div class="
            glass
            rounded-3xl
            p-6
        ">

            <div class="
                flex
                flex-col
                md:flex-row
                md:justify-between
                gap-4
            ">

                <div class="min-w-0">

                    <p class="text-xs text-gray-500">
                        RECYCLING #${request.id}
                    </p>

                    <h3 class="text-xl font-bold mt-2">
                        ${escapeHtml(
        request?.wasteType ||
        "Recycling"
    )}
                    </h3>

                    <p class="text-gray-400 mt-2">
                        ${escapeHtml(
        request?.description ||
        "No description"
    )}
                    </p>

                    <p class="text-gray-400 mt-2">
                        📍 ${escapeHtml(
        request?.pickupLocation ||
        "Location unavailable"
    )}
                    </p>

                    ${
        request?.latitude != null &&
        request?.longitude != null
            ? `
                                <p class="text-xs text-gray-500 mt-2">
                                    GPS:
                                    ${escapeHtml(request.latitude)},
                                    ${escapeHtml(request.longitude)}
                                </p>
                            `
            : ""
    }

                </div>


                <div class="shrink-0">

                    <span class="
                        inline-block
                        px-3
                        py-2
                        rounded-full
                        bg-white/5
                        text-sm
                    ">
                        ${escapeHtml(
        status ||
        "UNKNOWN"
    )}
                    </span>

                </div>

            </div>


            ${
        buttons
            ? `
                        <div class="flex flex-wrap gap-3 mt-5">
                            ${buttons}
                        </div>
                    `
            : ""
    }

        </div>
    `;
}


// =========================================================
// ASSIGN RECYCLING WORKER
// =========================================================

async function assignRecycling(requestId) {

    try {

        const workers =
            await apiFetch(
                API.ADMIN.WORKERS
            );


        if (!Array.isArray(workers)) {

            alert(
                "Unable to load workers."
            );

            return;
        }


        const recyclingWorkers =
            workers.filter(
                worker =>
                    String(
                        worker?.role ||
                        ""
                    ).toUpperCase() ===
                    "RECYCLING_WORKER"
            );


        if (
            recyclingWorkers.length === 0
        ) {

            alert(
                "No recycling workers available."
            );

            return;
        }


        const workerText =
            recyclingWorkers
                .map(
                    worker =>
                        `${worker.id} - ${
                            worker.name ||
                            "Unnamed worker"
                        }`
                )
                .join("\n");


        const workerId =
            prompt(
                "Enter recycling worker ID:\n\n" +
                workerText
            );


        if (!workerId) {
            return;
        }


        const numericWorkerId =
            Number(workerId);


        if (
            !Number.isInteger(
                numericWorkerId
            )
        ) {

            alert(
                "Please enter a valid worker ID."
            );

            return;
        }


        await apiFetch(
            API.ADMIN.ASSIGN_RECYCLING_TASK,
            {
                method: "POST",

                body: JSON.stringify({

                    recyclingRequestId:
                        Number(requestId),

                    workerId:
                    numericWorkerId

                })
            }
        );


        alert(
            "Recycling worker assigned successfully."
        );


        await refreshAdmin();

    } catch (error) {

        console.error(
            "Assign recycling error:",
            error
        );

        alert(
            error.message ||
            "Failed to assign recycling worker."
        );
    }
}


// =========================================================
// APPROVE RECYCLING
// =========================================================

async function approveRecycling(requestId) {

    try {

        const task =
            await findRecyclingTask(
                requestId
            );


        if (!task) {

            alert(
                "Recycling task not found or it is no longer waiting for approval."
            );

            return;
        }


        await apiFetch(
            `/api/admin/recycling-tasks/${task.id}/approve`,
            {
                method: "PUT"
            }
        );


        alert(
            "Recycling completion approved. 25 reward points awarded."
        );


        await refreshAdmin();

    } catch (error) {

        console.error(
            "Approve recycling error:",
            error
        );

        alert(
            error.message ||
            "Failed to approve recycling."
        );
    }
}


// =========================================================
// REJECT RECYCLING
// =========================================================

async function rejectRecycling(requestId) {

    try {

        const task =
            await findRecyclingTask(
                requestId
            );


        if (!task) {

            alert(
                "Recycling task not found or it is no longer waiting for approval."
            );

            return;
        }


        await apiFetch(
            `/api/admin/recycling-tasks/${task.id}/reject`,
            {
                method: "PUT"
            }
        );


        alert(
            "Recycling completion rejected. Worker notified."
        );


        await refreshAdmin();

    } catch (error) {

        console.error(
            "Reject recycling error:",
            error
        );

        alert(
            error.message ||
            "Failed to reject recycling."
        );
    }
}


// =========================================================
// SEND NOTIFICATION TO USER
// =========================================================

async function sendNotification(userId) {

    const message =
        prompt(
            "Enter notification message:"
        );


    if (
        !message ||
        !message.trim()
    ) {
        return;
    }


    try {

        const response =
            await apiFetch(
                API.ADMIN.USER_NOTIFICATION,
                {
                    method: "POST",

                    body: JSON.stringify({

                        userId:
                            Number(userId),

                        message:
                            message.trim()

                    })
                }
            );


        console.log(
            "ADMIN NOTIFICATION RESPONSE:",
            response
        );


        alert(
            "Notification sent successfully."
        );

    } catch (error) {

        console.error(
            "ADMIN NOTIFICATION ERROR:",
            error
        );

        alert(
            "Notification failed: " +
            (
                error.message ||
                "Unknown error"
            )
        );
    }
}


// =========================================================
// ADMIN NOTIFICATIONS
// =========================================================

async function loadAdminNotifications() {

    const box =
        document.getElementById(
            "adminNotifications"
        );

    if (!box) {
        return;
    }


    try {

        const notifications =
            await apiFetch(
                API.NOTIFICATIONS?.MY ||
                "/api/notifications"
            );


        if (
            !Array.isArray(
                notifications
            ) ||
            notifications.length === 0
        ) {

            box.innerHTML = `
                <div class="glass rounded-2xl p-5 text-gray-400">
                    No notifications.
                </div>
            `;

            return;
        }


        box.innerHTML =
            notifications
                .map(
                    notification => {

                        const isRead =
                            notification?.read === true;


                        return `
                            <div class="
                                glass
                                rounded-2xl
                                p-5
                                ${
                            isRead
                                ? ""
                                : "border border-yellow-400/30"
                        }
                            ">

                                <div class="
                                    flex
                                    justify-between
                                    gap-3
                                ">

                                    <p class="font-semibold">
                                        ${escapeHtml(
                            notification?.message ||
                            ""
                        )}
                                    </p>

                                    ${
                            !isRead
                                ? `
                                                <span class="
                                                    text-xs
                                                    text-yellow-400
                                                    shrink-0
                                                ">
                                                    NEW
                                                </span>
                                            `
                                : ""
                        }

                                </div>


                                <p class="
                                    text-xs
                                    text-gray-500
                                    mt-2
                                ">
                                    ${escapeHtml(
                            notification?.createdAt ||
                            ""
                        )}
                                </p>


                                ${
                            !isRead
                                ? `
                                            <button
                                                type="button"
                                                onclick="
                                                    markAdminNotificationRead(
                                                        ${notification.id}
                                                    )
                                                "
                                                class="
                                                    text-blue-400
                                                    hover:text-blue-300
                                                    text-sm
                                                    mt-3
                                                ">
                                                Mark as read
                                            </button>
                                        `
                                : ""
                        }

                            </div>
                        `;
                    }
                )
                .join("");

    } catch (error) {

        console.error(
            "Loading notifications failed:",
            error
        );

        box.innerHTML = `
            <p class="text-red-400">
                ${escapeHtml(error.message)}
            </p>
        `;
    }
}


// =========================================================
// FIND CLEANING TASK
// IMPORTANT:
// Uses the endpoint that actually exists
// in AdminController.
// =========================================================

async function findCleaningTaskForReport(reportId) {

    try {

        const tasks =
            await apiFetch(
                "/api/admin/cleaning-tasks/pending-approval"
            );


        if (!Array.isArray(tasks)) {
            return null;
        }


        const task =
            tasks.find(
                task =>
                    Number(
                        task?.garbageReportId
                    ) ===
                    Number(reportId)
            );


        return task || null;

    } catch (error) {

        console.error(
            "Finding cleaning task failed:",
            error
        );

        throw error;
    }
}


// =========================================================
// FIND RECYCLING TASK
// IMPORTANT:
// DO NOT use /api/admin/recycling-tasks
//
// Correct endpoint:
// /api/admin/recycling-tasks/pending-approval
// =========================================================

async function findRecyclingTask(requestId) {

    try {

        const tasks =
            await apiFetch(
                "/api/admin/recycling-tasks/pending-approval"
            );


        if (!Array.isArray(tasks)) {
            return null;
        }


        const task =
            tasks.find(
                task =>
                    Number(
                        task?.recyclingRequestId
                    ) ===
                    Number(requestId)
            );


        return task || null;

    } catch (error) {

        console.error(
            "Finding recycling task failed:",
            error
        );

        throw error;
    }
}


// =========================================================
// MARK ADMIN NOTIFICATION READ
// =========================================================

async function markAdminNotificationRead(id) {

    try {

        await apiFetch(
            `/api/notifications/${id}/read`,
            {
                method: "PUT"
            }
        );


        await loadAdminNotifications();

    } catch (error) {

        console.error(
            "Mark notification read failed:",
            error
        );

        alert(
            error.message ||
            "Unable to mark notification as read."
        );
    }
}


// =========================================================
// REFRESH ADMIN
// =========================================================

async function refreshAdmin() {

    await Promise.all([

        loadAdminDashboard(),

        loadAdminReports(),

        loadAdminUsers(),

        loadAdminWorkers(),

        loadAdminRecycling(),

        loadAdminNotifications()

    ]);

}


// =========================================================
// UTILITY
// =========================================================

function setText(id, value) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value ?? 0;
    }
}


function escapeHtml(value) {

    return String(
        value ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );
}