document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (
            !document.getElementById(
                "notifications"
            )
        ) {

            return;

        }


        requireLogin();

        loadNotifications();

    }
);


async function loadNotifications() {

    const container =
        document.getElementById(
            "notifications"
        );


    try {


        const data =
            await apiFetch(
                API.NOTIFICATIONS
            );


        const notifications =
            Array.isArray(data)
                ? data
                : data?.content ||
                data?.notifications ||
                [];


        if (
            notifications.length === 0
        ) {

            container.innerHTML = `

                <div class="
                    glass
                    rounded-2xl
                    p-8
                    text-gray-400
                ">

                    No notifications.

                </div>

            `;

            return;

        }


        container.innerHTML =
            notifications
                .map(
                    notification =>
                        createNotification(
                            notification
                        )
                )
                .join("");


    } catch (error) {

        container.innerHTML = `

            <div class="
                text-red-400
            ">

                ${error.message}

            </div>

        `;

    }

}


function createNotification(
    notification
) {

    return `

        <div class="
            glass
            rounded-2xl
            p-5
        ">

            <div class="
                flex
                justify-between
                gap-5
            ">

                <div>

                    <h3 class="
                        font-bold
                    ">

                        ${
        notification.title ||
        "Notification"
    }

                    </h3>


                    <p class="
                        text-gray-400
                        mt-2
                    ">

                        ${
        notification.message ||
        notification.content ||
        ""
    }

                    </p>


                    <p class="
                        text-gray-600
                        text-xs
                        mt-3
                    ">

                        ${
        notification.createdAt ||
        ""
    }

                    </p>

                </div>


                ${
        notification.read
            ? ""
            :
            `
                    <button
                        onclick="
                            markNotificationRead(
                                ${notification.id}
                            )
                        "
                        class="
                            text-green-400
                            text-sm
                        "
                    >
                        Mark read
                    </button>
                    `
    }

            </div>

        </div>

    `;

}


async function markNotificationRead(
    id
) {

    try {


        await apiFetch(
            API.NOTIFICATIONS +
            "/" +
            id +
            "/read",
            {

                method: "PUT"

            }
        );


        loadNotifications();


    } catch (error) {

        alert(
            error.message
        );

    }

}