/*
 * =========================================================
 * RECYCLEX - WASTEBOT
 * =========================================================
 */


/*
 * =========================================================
 * INITIALIZE CHATBOT
 * =========================================================
 */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "WasteBot JavaScript loaded."
        );


        /*
         * Require login
         */

        if (!requireLogin()) {

            return;
        }


        /*
         * Find chat form
         */

        const form =
            document.getElementById(
                "chatForm"
            );


        if (!form) {

            console.error(
                "Chat form not found."
            );

            return;
        }


        /*
         * Submit event
         */

        form.addEventListener(
            "submit",
            sendMessage
        );


        console.log(
            "WasteBot initialized successfully."
        );

    }
);


/*
 * =========================================================
 * ADD CHAT MESSAGE
 * =========================================================
 */

function addChatMessage(
    text,
    type
) {

    const container =
        document.getElementById(
            "messages"
        );


    if (!container) {

        console.error(
            "Messages container not found."
        );

        return;
    }


    const message =
        document.createElement(
            "div"
        );


    if (type === "user") {

        message.className = `
            ml-auto
            bg-green-500/20
            border
            border-green-400/10
            rounded-2xl
            p-4
            max-w-[80%]
            mb-4
        `;

    } else {

        message.className = `
            glass
            rounded-2xl
            p-4
            max-w-[80%]
            mb-4
        `;

    }


    message.textContent =
        text;


    container.appendChild(
        message
    );


    container.scrollTop =
        container.scrollHeight;

}


/*
 * =========================================================
 * SEND MESSAGE
 * =========================================================
 */

async function sendMessage(
    event
) {

    event.preventDefault();


    const input =
        document.getElementById(
            "message"
        );


    const sendButton =
        document.getElementById(
            "sendButton"
        );


    if (!input) {

        return;
    }


    const text =
        input.value.trim();


    if (!text) {

        return;
    }


    /*
     * Display user's message
     */

    addChatMessage(
        text,
        "user"
    );


    /*
     * Clear input
     */

    input.value = "";


    /*
     * Disable send button
     */

    if (sendButton) {

        sendButton.disabled =
            true;

        sendButton.textContent =
            "Sending...";

    }


    try {

        console.log(
            "Sending chatbot request:",
            text
        );


        /*
         * Send chatbot request
         */

        const response =
            await apiFetch(
                API.CHATBOT,
                {

                    method: "POST",

                    body:
                        JSON.stringify({

                            message:
                            text

                        })

                }
            );


        console.log(
            "Chatbot response:",
            response
        );


        /*
         * Extract answer
         */

        const answer =
            response?.response ||
            response?.message ||
            response?.answer ||
            "Sorry, I couldn't understand that.";


        /*
         * Display bot response
         */

        addChatMessage(
            answer,
            "bot"
        );

    }

    catch (error) {

        console.error(
            "Chatbot error:",
            error
        );


        addChatMessage(

            "Sorry, I couldn't connect to the chatbot server. Please try again.",

            "bot"

        );

    }

    finally {

        if (sendButton) {

            sendButton.disabled =
                false;

            sendButton.textContent =
                "Send";

        }


        input.focus();

    }

}