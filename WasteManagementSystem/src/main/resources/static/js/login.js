document.addEventListener(
    "DOMContentLoaded",
    () => {

        const form =
            document.getElementById(
                "loginForm"
            );

        if (!form) return;

        form.addEventListener(
            "submit",
            loginUser
        );
    }
);


async function loginUser(event) {

    event.preventDefault();


    const email =
        document
            .getElementById("email")
            .value
            .trim();


    const password =
        document
            .getElementById("password")
            .value;


    const message =
        document.getElementById(
            "message"
        );


    message.textContent = "";


    if (!email || !password) {

        message.textContent =
            "Enter email and password.";

        message.className =
            "text-red-400 text-center mt-4";

        return;
    }


    try {

        /*
         * ============================================
         * LOGIN
         * ============================================
         */

        const data =
            await apiPost(
                API.AUTH.LOGIN,
                {
                    email,
                    password
                }
            );


        console.log(
            "LOGIN RESPONSE:",
            data
        );


        /*
         * ============================================
         * TOKEN
         * ============================================
         */

        const token =
            data?.token;


        if (!token) {

            throw new Error(
                "Backend did not return JWT token."
            );
        }


        localStorage.setItem(
            "token",
            token
        );


        /*
         * ============================================
         * GET REAL USER FROM BACKEND
         * ============================================
         */

        const user =
            await apiGet(
                API.USERS.ME
            );


        console.log(
            "CURRENT USER:",
            user
        );


        /*
         * ============================================
         * SAVE USER
         * ============================================
         */

        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );


        /*
         * ============================================
         * NORMALIZE ROLE
         * ============================================
         */

        const role =
            String(
                user?.role || ""
            )
                .toUpperCase()
                .replace(
                    "ROLE_",
                    ""
                );


        console.log(
            "LOGIN ROLE:",
            role
        );


        message.textContent =
            "Login successful!";

        message.className =
            "text-green-400 text-center mt-4";


        /*
         * ============================================
         * REDIRECT
         * ============================================
         */

        if (role === "ADMIN") {

            window.location.href =
                "/admin-dashboard.html";

        }

        else if (
            role === "CLEANING_WORKER"
        ) {

            window.location.href =
                "/cleaning-worker.html";

        }

        else if (
            role === "RECYCLING_WORKER"
        ) {

            window.location.href =
                "/recycling-worker.html";

        }

        else {

            window.location.href =
                "/user-dashboard.html";
        }


    } catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );


        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "user"
        );


        message.textContent =
            error.message ||
            "Login failed.";

        message.className =
            "text-red-400 text-center mt-4";
    }
}