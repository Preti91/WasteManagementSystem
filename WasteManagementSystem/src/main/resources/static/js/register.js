document.addEventListener(
    "DOMContentLoaded",
    () => {

        const form =
            document.getElementById(
                "registerForm"
            );


        if (!form) {

            return;
        }


        form.addEventListener(
            "submit",
            registerUser
        );

    }
);


async function registerUser(event) {

    event.preventDefault();


    // =========================
    // GET FORM VALUES
    // =========================

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


    const role =
        document
            .getElementById("role")
            .value;


    const message =
        document
            .getElementById("message");


    // =========================
    // VALIDATION
    // =========================

    if (!name || !email || !password) {

        message.textContent =
            "Please fill all required fields.";

        message.className =
            "text-red-400 text-center mt-4";

        return;
    }


    try {

        // =========================
        // SEND TO SPRING BOOT
        // =========================

        const response =
            await apiFetch(
                API.AUTH.REGISTER,
                {
                    method: "POST",

                    body:
                        JSON.stringify({

                            name: name,

                            email: email,

                            password: password,

                            role: role

                        })
                }
            );


        console.log(
            "Registration response:",
            response
        );


        // =========================
        // SUCCESS
        // =========================

        message.textContent =
            "Registration successful!";

        message.className =
            "text-green-400 text-center mt-4";


        setTimeout(
            () => {

                window.location.href =
                    "/login.html";

            },
            1000
        );


    } catch (error) {

        console.error(
            "Registration error:",
            error
        );


        // =========================
        // ERROR
        // =========================

        message.textContent =
            error.message ||
            "Registration failed.";

        message.className =
            "text-red-400 text-center mt-4";
    }
}