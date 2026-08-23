document.addEventListener(
    "DOMContentLoaded",
    () => {

        const loginForm =
            document.getElementById(
                "loginForm"
            );


        if (loginForm) {

            loginForm.addEventListener(
                "submit",
                loginUser
            );

        }


        const registerForm =
            document.getElementById(
                "registerForm"
            );


        if (registerForm) {

            registerForm.addEventListener(
                "submit",
                registerUser
            );

        }

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


    try {


        const data =
            await apiFetch(
                API.AUTH.LOGIN,
                {

                    method: "POST",

                    body:
                        JSON.stringify({

                            email:
                            email,

                            password:
                            password

                        })

                }
            );


        saveLogin(data);


        const role =
            data?.role ||
            data?.user?.role ||
            getUser()?.role ||
            "USER";


        if (
            role.includes("ADMIN")
        ) {

            window.location.href =
                "/admin-dashboard.html";

        }

        else if (
            role.includes(
                "CLEANING_WORKER"
            )
        ) {

            window.location.href =
                "/cleaning-worker.html";

        }

        else if (
            role.includes(
                "RECYCLING_WORKER"
            )
        ) {

            window.location.href =
                "/recycling-worker.html";

        }

        else {

            window.location.href =
                "/user-dashboard.html";

        }


    } catch (error) {

        showMessage(
            error.message,
            "error"
        );

    }

}


async function registerUser(event) {

    event.preventDefault();


    const name =
        document
            .getElementById("name")
            .value
            .trim();


    const email =
        document
            .getElementById("email")
            .value
            .trim();


    const password =
        document
            .getElementById("password")
            .value;


    const roleElement =
        document.getElementById(
            "role"
        );


    const role =
        roleElement
            ? roleElement.value
            : "USER";


    try {


        await apiFetch(
            API.AUTH.REGISTER,
            {

                method: "POST",

                body:
                    JSON.stringify({

                        name:
                        name,

                        email:
                        email,

                        password:
                        password,

                        role:
                        role

                    })

            }
        );


        showMessage(
            "Registration successful!",
            "success"
        );


        setTimeout(
            () => {

                window.location.href =
                    "/login.html";

            },
            1200
        );


    } catch (error) {

        showMessage(
            error.message,
            "error"
        );

    }

}