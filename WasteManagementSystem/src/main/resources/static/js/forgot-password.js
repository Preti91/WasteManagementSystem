document.addEventListener(
    "DOMContentLoaded",
    () => {

        const sendOtpButton =
            document.getElementById(
                "sendOtpButton"
            );

        const verifyOtpButton =
            document.getElementById(
                "verifyOtpButton"
            );

        const resetPasswordButton =
            document.getElementById(
                "resetPasswordButton"
            );


        if (sendOtpButton) {

            sendOtpButton.addEventListener(
                "click",
                sendOtp
            );
        }


        if (verifyOtpButton) {

            verifyOtpButton.addEventListener(
                "click",
                verifyOtp
            );
        }


        if (resetPasswordButton) {

            resetPasswordButton.addEventListener(
                "click",
                resetPassword
            );
        }

    }
);


// =========================================================
// SEND OTP
// =========================================================

async function sendOtp() {

    const email =
        document
            .getElementById("resetEmail")
            .value
            .trim()
            .toLowerCase();


    if (!email) {

        showMessage(
            "Please enter your registered email.",
            false
        );

        return;
    }


    try {

        const response =
            await apiPost(
                API.AUTH.FORGOT_PASSWORD,
                {
                    email: email
                }
            );


        console.log(
            "FORGOT PASSWORD RESPONSE:",
            response
        );


        // -------------------------------------------------
        // Extract OTP
        // -------------------------------------------------

        const otp =
            response
                .replace("OTP:", "")
                .trim();


        if (!/^\d{6}$/.test(otp)) {

            throw new Error(
                "Unable to generate OTP."
            );
        }


        // -------------------------------------------------
        // Show OTP on screen
        // -------------------------------------------------

        showMessage(
            "Your reset OTP is: " + otp,
            true
        );


        // -------------------------------------------------
        // Move to OTP step
        // -------------------------------------------------

        document
            .getElementById("emailStep")
            .classList
            .add("hidden");


        document
            .getElementById("otpStep")
            .classList
            .remove("hidden");


        updateStep(
            2
        );


    } catch (error) {

        console.error(
            "SEND OTP ERROR:",
            error
        );


        showMessage(
            error.message ||
            "Unable to generate OTP.",
            false
        );
    }
}


// =========================================================
// VERIFY OTP
// =========================================================

async function verifyOtp() {

    const email =
        document
            .getElementById("resetEmail")
            .value
            .trim()
            .toLowerCase();


    const otp =
        document
            .getElementById("otp")
            .value
            .trim();


    if (!/^\d{6}$/.test(otp)) {

        showMessage(
            "Enter the 6-digit OTP.",
            false
        );

        return;
    }


    try {

        const response =
            await apiPost(
                API.AUTH.VERIFY_OTP,
                {
                    email: email,
                    otp: otp
                }
            );


        showMessage(
            response,
            true
        );


        document
            .getElementById("otpStep")
            .classList
            .add("hidden");


        document
            .getElementById("passwordStep")
            .classList
            .remove("hidden");


        updateStep(
            3
        );


    } catch (error) {

        console.error(
            "VERIFY OTP ERROR:",
            error
        );


        showMessage(
            error.message ||
            "Invalid OTP.",
            false
        );
    }
}


// =========================================================
// RESET PASSWORD
// =========================================================

async function resetPassword() {

    const email =
        document
            .getElementById("resetEmail")
            .value
            .trim()
            .toLowerCase();


    const otp =
        document
            .getElementById("otp")
            .value
            .trim();


    const newPassword =
        document
            .getElementById("newPassword")
            .value;


    const confirmPassword =
        document
            .getElementById("confirmPassword")
            .value;


    if (newPassword.length < 8) {

        showMessage(
            "Password must be at least 8 characters.",
            false
        );

        return;
    }


    if (newPassword !== confirmPassword) {

        showMessage(
            "Passwords do not match.",
            false
        );

        return;
    }


    try {

        const response =
            await apiPost(
                API.AUTH.RESET_PASSWORD,
                {
                    email: email,
                    otp: otp,
                    newPassword: newPassword,
                    confirmPassword: confirmPassword
                }
            );


        showMessage(
            response,
            true
        );


        document
            .getElementById("passwordStep")
            .classList
            .add("hidden");


        setTimeout(
            () => {

                window.location.href =
                    "/login.html";

            },
            1500
        );


    } catch (error) {

        console.error(
            "RESET PASSWORD ERROR:",
            error
        );


        showMessage(
            error.message ||
            "Unable to reset password.",
            false
        );
    }
}


// =========================================================
// STEP INDICATOR
// =========================================================

function updateStep(step) {

    const step1 =
        document.getElementById(
            "step1Indicator"
        );

    const step2 =
        document.getElementById(
            "step2Indicator"
        );

    const step3 =
        document.getElementById(
            "step3Indicator"
        );


    if (step === 1) {

        step1.classList.add(
            "bg-green-400"
        );

        step2.classList.remove(
            "bg-green-400"
        );

        step3.classList.remove(
            "bg-green-400"
        );

    }

    else if (step === 2) {

        step1.classList.add(
            "bg-green-400"
        );

        step2.classList.add(
            "bg-green-400"
        );

        step3.classList.remove(
            "bg-green-400"
        );

    }

    else {

        step1.classList.add(
            "bg-green-400"
        );

        step2.classList.add(
            "bg-green-400"
        );

        step3.classList.add(
            "bg-green-400"
        );
    }
}


// =========================================================
// MESSAGE
// =========================================================

function showMessage(
    text,
    success
) {

    const message =
        document.getElementById(
            "resetMessage"
        );


    message.textContent =
        text;


    message.className =
        success
            ? "text-green-400 text-center mt-5"
            : "text-red-400 text-center mt-5";
}