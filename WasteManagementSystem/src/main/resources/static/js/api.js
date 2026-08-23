/*
 * =========================================================
 * RECYCLEX - API CONFIGURATION
 * =========================================================
 *
 * Central place for every backend endpoint used by the
 * frontend. Keep this in sync with the Spring Boot
 * @RequestMapping paths in the controller classes.
 * =========================================================
 */

const API = {

    BASE_URL: "",


    /*
     * =====================================================
     * AUTH
     * =====================================================
     */

    AUTH: {

        LOGIN:
            "/api/auth/login",

        REGISTER:
            "/api/auth/register",

        /*
         * Password Reset
         */

        FORGOT_PASSWORD:
            "/api/auth/forgot-password",

        VERIFY_OTP:
            "/api/auth/verify-otp",

        RESET_PASSWORD:
            "/api/auth/reset-password"
    },


    /*
     * =====================================================
     * USERS
     * =====================================================
     */

    USERS: {

        ME:
            "/api/users/me"
    },


    /*
     * =====================================================
     * CHATBOT
     * =====================================================
     */

    CHATBOT:
        "/api/chatbot/message",


    /*
     * =====================================================
     * GARBAGE
     * =====================================================
     */

    GARBAGE: {

        REPORT:
            "/api/garbage/report",

        MY_REPORTS:
            "/api/garbage/my-reports",

        UPLOAD_IMAGE:
            "/api/garbage/upload-image",

        BY_ID: (id) =>
            `/api/garbage/${id}`
    },


    /*
     * =====================================================
     * RECYCLING
     * =====================================================
     */

    RECYCLING: {

        REQUEST:
            "/api/recycling/request",

        MY_REQUESTS:
            "/api/recycling/my-requests"
    },


    /*
     * =====================================================
     * DASHBOARD
     * =====================================================
     */

    DASHBOARD: {

        USER:
            "/api/dashboard/user"
    },


    /*
     * =====================================================
     * CLEANING WORKER
     * =====================================================
     */

    CLEANING_WORKER: {

        TASKS:
            "/api/cleaning-worker/tasks",

        START: (taskId) =>
            `/api/cleaning-worker/tasks/${taskId}/start`,

        COMPLETE: (taskId) =>
            `/api/cleaning-worker/tasks/${taskId}/complete`
    },


    /*
     * =====================================================
     * RECYCLING WORKER
     * =====================================================
     */

    RECYCLING_WORKER: {

        TASKS:
            "/api/recycling-worker/tasks",

        START: (taskId) =>
            `/api/recycling-worker/tasks/${taskId}/start`,

        COMPLETE: (taskId) =>
            `/api/recycling-worker/tasks/${taskId}/complete`
    },


    /*
     * =====================================================
     * NOTIFICATIONS
     * =====================================================
     */

    NOTIFICATIONS:
        "/api/notifications",


    /*
     * =====================================================
     * REWARDS
     * =====================================================
     */

    REWARDS: {

        MY_REWARDS:
            "/api/rewards",

        POINTS:
            "/api/rewards/points",

        CATALOG:
            "/api/rewards/catalog",

        LEADERBOARD:
            "/api/rewards/leaderboard"
    },


    /*
     * =====================================================
     * CERTIFICATES
     * =====================================================
     */

    CERTIFICATES: {

        MINE:
            "/api/certificates",

        BY_CODE: (code) =>
            `/api/certificates/${code}`
    },


    /*
     * =====================================================
     * LEADERBOARD
     * =====================================================
     */

    LEADERBOARD:
        "/api/leaderboard",


    /*
     * =====================================================
     * ADMIN
     * =====================================================
     */

    ADMIN: {

        DASHBOARD:
            "/api/admin/dashboard",

        USERS:
            "/api/admin/users",

        WORKERS:
            "/api/admin/workers",

        GARBAGE_REPORTS:
            "/api/admin/garbage-reports",

        CLEANING_TASKS:
            "/api/admin/cleaning-tasks",

        RECYCLING_REQUESTS:
            "/api/admin/recycling-requests",

        RECYCLING_TASKS:
            "/api/admin/recycling-tasks",

        ASSIGN_CLEANING_TASK:
            "/api/admin/assign-cleaning-task",

        ASSIGN_RECYCLING_TASK:
            "/api/admin/assign-recycling-task",

        /*
         * Admin approves worker's completed
         * recycling task.
         */

        APPROVE_RECYCLING_TASK: (taskId) =>
            `/api/admin/recycling-tasks/${taskId}/approve`,

        USER_NOTIFICATION:
            "/api/admin/notifications/user",

        WORKER_NOTIFICATION:
            "/api/admin/notifications/worker"
    }
};


/*
 * =========================================================
 * TOKEN
 * =========================================================
 */

function getAuthToken() {

    return localStorage.getItem("token");
}


/*
 * =========================================================
 * API REQUEST
 * =========================================================
 */

async function apiRequest(
    url,
    options = {}
) {

    const headers = {
        ...(options.headers || {})
    };


    /*
     * =====================================================
     * JSON CONTENT TYPE
     * =====================================================
     *
     * Only add application/json when the body is a string.
     *
     * FormData is NOT modified because the browser must
     * automatically create the multipart boundary.
     * =====================================================
     */

    if (
        options.body &&
        typeof options.body === "string" &&
        !headers["Content-Type"]
    ) {

        headers["Content-Type"] =
            "application/json";
    }


    /*
     * =====================================================
     * JWT
     * =====================================================
     */

    const token =
        getAuthToken();

    if (token) {

        headers["Authorization"] =
            `Bearer ${token}`;
    }


    /*
     * =====================================================
     * SEND REQUEST
     * =====================================================
     */

    let response;

    try {

        response =
            await fetch(
                API.BASE_URL + url,
                {
                    ...options,
                    headers
                }
            );

    } catch (error) {

        console.error(
            "API FETCH ERROR:",
            error
        );

        throw new Error(
            "Could not connect to the backend server."
        );
    }


    /*
     * =====================================================
     * UNAUTHORIZED
     * =====================================================
     */

    if (response.status === 401) {

        localStorage.removeItem("token");

        localStorage.removeItem("user");


        /*
         * Do not redirect password-reset requests to login.
         *
         * Forgot-password endpoints do not require JWT.
         */

        const isPasswordResetRequest =
            url === API.AUTH.FORGOT_PASSWORD ||
            url === API.AUTH.VERIFY_OTP ||
            url === API.AUTH.RESET_PASSWORD;


        if (
            !isPasswordResetRequest &&
            !window.location.pathname
                .endsWith("/login.html")
        ) {

            window.location.href =
                "/login.html";
        }


        throw new Error(
            "Session expired. Please login again."
        );
    }


    return response;
}


/*
 * =========================================================
 * API FETCH
 * =========================================================
 */

async function apiFetch(
    url,
    options = {}
) {

    const response =
        await apiRequest(
            url,
            options
        );


    const text =
        await response.text();


    let data = null;


    /*
     * =====================================================
     * PARSE RESPONSE
     * =====================================================
     */

    if (text) {

        try {

            data =
                JSON.parse(text);

        } catch {

            data = text;
        }
    }


    /*
     * =====================================================
     * HANDLE ERROR
     * =====================================================
 */

    if (!response.ok) {

        let message =
            `Request failed (${response.status})`;


        if (
            data &&
            typeof data === "object"
        ) {

            message =
                data.message ||
                data.error ||
                data.detail ||
                message;
        }

        else if (
            typeof data === "string" &&
            data.trim()
        ) {

            message = data;
        }


        throw new Error(message);
    }


    return data;
}


/*
 * =========================================================
 * GET
 * =========================================================
 */

function apiGet(url) {

    return apiFetch(
        url,
        {
            method: "GET"
        }
    );
}


/*
 * =========================================================
 * POST
 * =========================================================
 *
 * Supports:
 *
 * apiPost("/api/test");
 *
 * and:
 *
 * apiPost("/api/test", {
 *     name: "Preti"
 * });
 *
 * =========================================================
 */

function apiPost(
    url,
    data = null
) {

    const options = {
        method: "POST"
    };


    if (
        data !== null &&
        data !== undefined
    ) {

        options.body =
            JSON.stringify(data);
    }


    return apiFetch(
        url,
        options
    );
}


/*
 * =========================================================
 * PUT
 * =========================================================
 */

function apiPut(
    url,
    data = null
) {

    const options = {
        method: "PUT"
    };


    if (
        data !== null &&
        data !== undefined
    ) {

        options.body =
            JSON.stringify(data);
    }


    return apiFetch(
        url,
        options
    );
}


/*
 * =========================================================
 * PATCH
 * =========================================================
 */

function apiPatch(
    url,
    data = null
) {

    const options = {
        method: "PATCH"
    };


    if (
        data !== null &&
        data !== undefined
    ) {

        options.body =
            JSON.stringify(data);
    }


    return apiFetch(
        url,
        options
    );
}


/*
 * =========================================================
 * DELETE
 * =========================================================
 */

function apiDelete(url) {

    return apiFetch(
        url,
        {
            method: "DELETE"
        }
    );
}


/*
 * =========================================================
 * READY
 * =========================================================
 */

console.log(
    "RecycleX API configuration loaded."
);