/*
 * =========================================================
 * RECYCLEX - COMMON JAVASCRIPT
 * =========================================================
 */


/*
 * =========================================================
 * GET LOGGED-IN USER
 * =========================================================
 */

function getUser() {

    const userData =
        localStorage.getItem("user");

    if (!userData) {
        return null;
    }

    try {

        return JSON.parse(userData);

    } catch (error) {

        console.error(
            "Unable to read user data:",
            error
        );

        return null;
    }
}


/*
 * =========================================================
 * GET LOGGED-IN USER (alias)
 * =========================================================
 *
 * Several pages (dashboard.js, leaderboard.js, auth.js)
 * call getCurrentUser() instead of getUser(). Keep both
 * names working so neither script breaks.
 * =========================================================
 */

function getCurrentUser() {

    return getUser();
}


/*
 * =========================================================
 * GET JWT TOKEN
 * =========================================================
 */

function getToken() {

    return localStorage.getItem("token");

}


/*
 * =========================================================
 * CHECK LOGIN
 * =========================================================
 */

function isLoggedIn() {

    const token =
        getToken();

    return !!token;
}


/*
 * =========================================================
 * REQUIRE LOGIN
 * =========================================================
 */

function requireLogin() {

    if (!isLoggedIn()) {

        console.warn(
            "User is not logged in."
        );

        window.location.href =
            "/login.html";

        return false;
    }

    return true;
}


/*
 * =========================================================
 * LOGOUT
 * =========================================================
 */

function logout() {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href =
        "/login.html";
}


/*
 * =========================================================
 * DISPLAY USER INFORMATION
 * =========================================================
 */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const user =
            getUser();


        /*
         * USER NAME
         */

        document
            .querySelectorAll(
                "[data-user-name]"
            )
            .forEach(
                function (element) {

                    element.textContent =
                        user?.name ||
                        user?.username ||
                        user?.email ||
                        "User";

                }
            );


        /*
         * USER EMAIL
         */

        document
            .querySelectorAll(
                "[data-user-email]"
            )
            .forEach(
                function (element) {

                    element.textContent =
                        user?.email ||
                        "";

                }
            );


        /*
         * USER INITIAL (for the profile avatar chip)
         */

        document
            .querySelectorAll(
                "[data-user-initial]"
            )
            .forEach(
                function (element) {

                    const label =
                        user?.name ||
                        user?.username ||
                        user?.email ||
                        "U";

                    element.textContent =
                        label.trim().charAt(0).toUpperCase();

                }
            );


        /*
         * LOGOUT BUTTONS
         */

        document
            .querySelectorAll(
                "[data-logout]"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        logout
                    );

                }
            );

    }
);


/*
 * =========================================================
 * SHOW MESSAGE
 * =========================================================
 */

function showMessage(
    message,
    type = "success"
) {

    const box =
        document.getElementById(
            "message"
        );


    if (!box) {

        alert(message);

        return;
    }


    box.textContent =
        message;


    if (type === "success") {

        box.className =
            "text-green-400 mt-4";

    } else {

        box.className =
            "text-red-400 mt-4";

    }
    /*
 * =========================================================
 * RECYCLEX — GLOBAL PREMIUM NOTIFICATION SYSTEM
 * No browser alert()
 * No browser prompt()
 * No "localhost:8081 says"
 * Works across all pages
 * =========================================================
 */

    (function () {

        /* ---------- CREATE GLOBAL UI ---------- */

        function createNotificationUI() {

            /* Toast container */
            if (!document.getElementById("rxToastContainer")) {

                const toastContainer = document.createElement("div");

                toastContainer.id = "rxToastContainer";

                toastContainer.innerHTML = `
                <div id="rxToastIcon" class="rx-toast-icon">✓</div>

                <div class="rx-toast-content">
                    <div id="rxToastTitle" class="rx-toast-title">
                        Success
                    </div>

                    <div id="rxToastMessage" class="rx-toast-message">
                    </div>
                </div>

                <button
                    id="rxToastClose"
                    class="rx-toast-close"
                    type="button">
                    ×
                </button>

                <div id="rxToastProgress" class="rx-toast-progress"></div>
            `;

                document.body.appendChild(toastContainer);

                document
                    .getElementById("rxToastClose")
                    .addEventListener("click", function () {

                        hideToast();

                    });
            }


            /* ---------- MESSAGE MODAL ---------- */

            if (!document.getElementById("rxMessageModal")) {

                const modal = document.createElement("div");

                modal.id = "rxMessageModal";

                modal.innerHTML = `

                <div class="rx-modal-backdrop"></div>

                <div
                    class="rx-modal-card"
                    role="dialog"
                    aria-modal="true">

                    <div class="rx-modal-icon">
                        <span>✦</span>
                    </div>

                    <div class="rx-modal-title">
                        Send Notification
                    </div>

                    <div class="rx-modal-subtitle">
                        Enter the message you want to send.
                    </div>

                    <textarea
                        id="rxNotificationInput"
                        class="rx-modal-input"
                        placeholder="Type your notification..."
                        maxlength="500"
                        rows="4"></textarea>

                    <div class="rx-modal-counter">
                        <span id="rxNotificationCounter">0</span>/500
                    </div>

                    <div class="rx-modal-actions">

                        <button
                            id="rxModalCancel"
                            class="rx-modal-btn rx-modal-cancel"
                            type="button">
                            Cancel
                        </button>

                        <button
                            id="rxModalSend"
                            class="rx-modal-btn rx-modal-send"
                            type="button">
                            <span>Send Notification</span>
                            <span class="rx-send-arrow">→</span>
                        </button>

                    </div>

                </div>
            `;

                document.body.appendChild(modal);


                /* Character counter */

                const input =
                    document.getElementById(
                        "rxNotificationInput"
                    );

                const counter =
                    document.getElementById(
                        "rxNotificationCounter"
                    );

                input.addEventListener(
                    "input",
                    function () {

                        counter.textContent =
                            input.value.length;

                    }
                );


                /* Cancel */

                document
                    .getElementById("rxModalCancel")
                    .addEventListener(
                        "click",
                        function () {

                            closeMessageModal();

                        }
                    );


                /* Background click */

                document
                    .querySelector(
                        "#rxMessageModal .rx-modal-backdrop"
                    )
                    .addEventListener(
                        "click",
                        function () {

                            closeMessageModal();

                        }
                    );


                /* Escape */

                document.addEventListener(
                    "keydown",
                    function (event) {

                        if (
                            event.key === "Escape" &&
                            document
                                .getElementById(
                                    "rxMessageModal"
                                )
                                ?.classList.contains("active")
                        ) {

                            closeMessageModal();

                        }

                    }
                );

            }

        }


        /* =====================================================
           TOAST
           ===================================================== */

        let toastTimer = null;


        window.showToast = function (
            message,
            type = "success",
            title = null
        ) {

            createNotificationUI();

            const toast =
                document.getElementById(
                    "rxToastContainer"
                );

            const toastTitle =
                document.getElementById(
                    "rxToastTitle"
                );

            const toastMessage =
                document.getElementById(
                    "rxToastMessage"
                );

            const toastIcon =
                document.getElementById(
                    "rxToastIcon"
                );


            /* Titles */

            const titles = {

                success: "Success",

                error: "Something went wrong",

                warning: "Please check",

                info: "Notification"

            };


            toastTitle.textContent =
                title || titles[type] || "Notification";

            toastMessage.textContent =
                message;


            /* Icon */

            const icons = {

                success: "✓",

                error: "!",

                warning: "!",

                info: "i"

            };

            toastIcon.textContent =
                icons[type] || "✓";


            /* Type */

            toast.className =
                "rx-toast rx-toast-" +
                type;


            /* Show */

            requestAnimationFrame(function () {

                toast.classList.add("show");

            });


            /* Progress */

            const progress =
                document.getElementById(
                    "rxToastProgress"
                );

            progress.style.animation = "none";

            void progress.offsetWidth;

            progress.style.animation =
                "rxToastProgress 4s linear forwards";


            clearTimeout(toastTimer);

            toastTimer = setTimeout(
                hideToast,
                4000
            );

        };


        function hideToast() {

            const toast =
                document.getElementById(
                    "rxToastContainer"
                );

            if (!toast) return;

            toast.classList.remove("show");

        }


        /* =====================================================
           SUCCESS / ERROR HELPERS
           ===================================================== */

        window.showSuccess = function (
            message,
            title = "Success"
        ) {

            showToast(
                message,
                "success",
                title
            );

        };


        window.showError = function (
            message,
            title = "Something went wrong"
        ) {

            showToast(
                message,
                "error",
                title
            );

        };


        window.showWarning = function (
            message,
            title = "Please check"
        ) {

            showToast(
                message,
                "warning",
                title
            );

        };


        window.showInfo = function (
            message,
            title = "Notification"
        ) {

            showToast(
                message,
                "info",
                title
            );

        };


        /* =====================================================
           CUSTOM NOTIFICATION INPUT MODAL
           ===================================================== */

        window.showNotificationPrompt = function () {

            return new Promise(function (resolve) {

                createNotificationUI();

                const modal =
                    document.getElementById(
                        "rxMessageModal"
                    );

                const input =
                    document.getElementById(
                        "rxNotificationInput"
                    );

                const sendButton =
                    document.getElementById(
                        "rxModalSend"
                    );

                const cancelButton =
                    document.getElementById(
                        "rxModalCancel"
                    );


                input.value = "";

                document.getElementById(
                    "rxNotificationCounter"
                ).textContent = "0";


                modal.classList.add("active");


                setTimeout(function () {

                    input.focus();

                }, 150);


                function cleanup() {

                    sendButton.onclick = null;

                    cancelButton.onclick = null;

                }


                sendButton.onclick = function () {

                    const value =
                        input.value.trim();


                    if (!value) {

                        input.focus();

                        showError(
                            "Please enter a notification message.",
                            "Message Required"
                        );

                        return;

                    }


                    cleanup();

                    modal.classList.remove(
                        "active"
                    );

                    resolve(value);

                };


                cancelButton.onclick = function () {

                    cleanup();

                    modal.classList.remove(
                        "active"
                    );

                    resolve(null);

                };

            });

        };


        function closeMessageModal() {

            const modal =
                document.getElementById(
                    "rxMessageModal"
                );

            if (modal) {

                modal.classList.remove(
                    "active"
                );

            }

        }


        /* =====================================================
           BACKWARD COMPATIBLE showMessage()
           ===================================================== */

        window.showMessage = function (
            message,
            type = "success"
        ) {

            if (type === "success") {

                showSuccess(message);

            } else {

                showError(message);

            }

        };


        /* =====================================================
           INITIALIZE
           ===================================================== */

        if (
            document.readyState ===
            "loading"
        ) {

            document.addEventListener(
                "DOMContentLoaded",
                createNotificationUI
            );

        } else {

            createNotificationUI();

        }

    })();
}