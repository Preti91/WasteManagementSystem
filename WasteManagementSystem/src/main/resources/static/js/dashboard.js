// document.addEventListener(
//     "DOMContentLoaded",
//     async () => {
//
//         if (!document.getElementById("reportCount")) {
//             return;
//         }
//
//         if (!requireLogin()) {
//             return;
//         }
//
//         const user =
//             getCurrentUser();
//
//         const name =
//             user?.name ||
//             user?.username ||
//             user?.userName ||
//             "User";
//
//         setText(
//             // "userName",
//             name
//         );
//
//         await loadDashboard();
//     }
// );
//
//
// async function loadDashboard() {
//
//     try {
//
//         const data =
//             await apiFetch(
//                 API.DASHBOARD.USER
//             );
//
//
//         setText(
//             "reportCount",
//             data?.totalReports ?? 0
//         );
//
//
//         setText(
//             "recyclingCount",
//             data?.totalRecyclingRequests ?? 0
//         );
//
//
//         setText(
//             "rewardPoints",
//             data?.rewardPoints ?? 0
//         );
//
//
//         setText(
//             "completedReportCount",
//             data?.completedReports ?? 0
//         );
//
//
//         setText(
//             "pendingReportCount",
//             data?.pendingReports ?? 0
//         );
//
//
//         setText(
//             "completedRecyclingCount",
//             data?.completedRecyclingRequests ?? 0
//         );
//
//
//         setText(
//             "pendingRecyclingCount",
//             data?.pendingRecyclingRequests ?? 0
//         );
//
//     }
//
//     catch (error) {
//
//         console.error(
//             "Dashboard error:",
//             error
//         );
//
//         const errorBox =
//             document.getElementById(
//                 "dashboardError"
//             );
//
//         if (errorBox) {
//
//             errorBox.textContent =
//                 "Unable to load dashboard: " +
//                 error.message;
//
//             errorBox.classList.remove(
//                 "hidden"
//             );
//         }
//     }
//
//
//     await loadNotificationCount();
// }
//
//
// async function loadNotificationCount() {
//
//     try {
//
//         const data =
//             await apiFetch(
//                 API.NOTIFICATIONS +
//                 "/unread"
//             );
//
//
//         const count =
//             Array.isArray(data)
//                 ? data.length
//                 : Number(
//                     data?.count ?? 0
//                 );
//
//
//         setText(
//             "notificationCount",
//             count
//         );
//
//     }
//
//     catch (error) {
//
//         console.error(
//             "Notification error:",
//             error
//         );
//     }
// }
//
//
// function setText(
//     id,
//     value
// ) {
//
//     const element =
//         document.getElementById(id);
//
//     if (element) {
//
//         element.textContent =
//             value;
//     }
// }


document.addEventListener(
    "DOMContentLoaded",
    async () => {

        if (!document.getElementById("reportCount")) {
            return;
        }

        if (!requireLogin()) {
            return;
        }

        const user =
            getCurrentUser();

        const name =
            user?.name ||
            user?.username ||
            user?.userName ||
            "User";

        setText(
            "userName",
            name
        );

        await loadDashboard();
    }
);


async function loadDashboard() {

    try {

        const data =
            await apiFetch(
                API.DASHBOARD.USER
            );


        setText(
            "reportCount",
            data?.totalReports ?? 0
        );


        setText(
            "recyclingCount",
            data?.totalRecyclingRequests ?? 0
        );


        setText(
            "rewardPoints",
            data?.rewardPoints ?? 0
        );


        setText(
            "completedReportCount",
            data?.completedReports ?? 0
        );


        setText(
            "pendingReportCount",
            data?.pendingReports ?? 0
        );


        setText(
            "completedRecyclingCount",
            data?.completedRecyclingRequests ?? 0
        );


        setText(
            "pendingRecyclingCount",
            data?.pendingRecyclingRequests ?? 0
        );

    }

    catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

        const errorBox =
            document.getElementById(
                "dashboardError"
            );

        if (errorBox) {

            errorBox.textContent =
                "Unable to load dashboard: " +
                error.message;

            errorBox.classList.remove(
                "hidden"
            );
        }
    }


    await loadNotificationCount();
}


async function loadNotificationCount() {

    try {

        const data =
            await apiFetch(
                API.NOTIFICATIONS +
                "/unread"
            );


        const count =
            Array.isArray(data)
                ? data.length
                : Number(
                    data?.count ?? 0
                );


        setText(
            "notificationCount",
            count
        );

    }

    catch (error) {

        console.error(
            "Notification error:",
            error
        );
    }
}


function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent =
            value;
    }
}