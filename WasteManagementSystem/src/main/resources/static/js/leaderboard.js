document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (!requireLogin()) {
            return;
        }

        loadLeaderboard();
    }
);


async function loadLeaderboard() {

    const container =
        document.getElementById(
            "leaderboard"
        );


    if (!container) {
        return;
    }


    try {

        const data =
            await apiFetch(
                API.LEADERBOARD
            );


        const users =
            Array.isArray(data)
                ? data
                : data?.leaderboard ||
                data?.content ||
                [];


        if (!users.length) {

            showEmptyLeaderboard();

            return;
        }


        users.sort(
            (a, b) =>
                Number(
                    b.totalPoints ??
                    b.points ??
                    0
                )
                -
                Number(
                    a.totalPoints ??
                    a.points ??
                    0
                )
        );


        updateTopThree(
            users
        );


        container.innerHTML =
            users
                .map(
                    (user, index) =>
                        createLeaderboardRow(
                            user,
                            index
                        )
                )
                .join("");


        highlightCurrentUser();

    }

    catch (error) {

        console.error(
            "Leaderboard error:",
            error
        );


        container.innerHTML = `
            <div class="
                glass
                rounded-2xl
                p-8
                text-center
                text-red-400
            ">
                Unable to load leaderboard.
                <p class="text-sm mt-2">
                    ${escapeHtml(
            error.message
        )}
                </p>
            </div>
        `;
    }
}


function getUserPoints(
    user
) {

    return Number(
        user?.totalPoints ??
        user?.points ??
        user?.rewardPoints ??
        0
    );
}


function getUserName(
    user
) {

    return (
        user?.name ||
        user?.username ||
        user?.userName ||
        user?.email ||
        "User"
    );
}


function createLeaderboardRow(
    user,
    index
) {

    const rank =
        index + 1;


    const points =
        getUserPoints(user);


    const name =
        getUserName(user);


    const medal =
        rank === 1
            ? "🥇"
            : rank === 2
                ? "🥈"
                : rank === 3
                    ? "🥉"
                    : "#" + rank;


    return `
        <div
            class="
                leaderboard-row
                glass
                rounded-2xl
                p-5
                flex
                items-center
                justify-between
                gap-5
                mb-4
            "
            data-user-id="${
        escapeHtml(
            user?.userId ??
            user?.id ??
            ""
        )
    }"
            data-user-email="${
        escapeHtml(
            user?.email ??
            ""
        )
    }"
        >

            <div class="
                w-16
                text-center
                text-2xl
                font-bold
            ">
                ${medal}
            </div>


            <div class="flex-1">

                <h3 class="font-bold text-lg">
                    ${escapeHtml(name)}
                </h3>

                <p class="
                    text-gray-500
                    text-sm
                    mt-1
                ">
                    Eco Contributor 🌱
                </p>

            </div>


            <div class="text-right">

                <p class="
                    text-yellow-400
                    font-bold
                    text-xl
                ">
                    ⭐ ${points}
                </p>

                <p class="
                    text-gray-500
                    text-xs
                ">
                    Eco Points
                </p>

            </div>

        </div>
    `;
}


function highlightCurrentUser() {

    const currentUser =
        getCurrentUser();


    if (!currentUser) {
        return;
    }


    const rows =
        document.querySelectorAll(
            ".leaderboard-row"
        );


    rows.forEach(
        row => {

            const id =
                row.dataset.userId;


            const email =
                row.dataset.userEmail;


            const matched =
                (
                    id &&
                    currentUser.id &&
                    String(id) ===
                    String(currentUser.id)
                )
                ||
                (
                    email &&
                    currentUser.email &&
                    email ===
                    currentUser.email
                );


            if (!matched) {
                return;
            }


            row.classList.add(
                "border",
                "border-green-400/50"
            );


            const section =
                row.querySelector(
                    ".flex-1"
                );


            if (
                section &&
                !section.querySelector(
                    ".current-user"
                )
            ) {

                const badge =
                    document.createElement(
                        "span"
                    );


                badge.className =
                    "current-user inline-block mt-2 px-2 py-1 rounded-full text-xs text-green-400 bg-green-400/10";


                badge.textContent =
                    "YOU";


                section.appendChild(
                    badge
                );
            }
        }
    );
}


function updateTopThree(
    users
) {

    const top =
        users.slice(0, 3);


    const nameIds = [
        "firstName",
        "secondName",
        "thirdName"
    ];


    const pointIds = [
        "firstPoints",
        "secondPoints",
        "thirdPoints"
    ];


    nameIds.forEach(
        (id, index) => {

            const nameEl =
                document.getElementById(id);

            const pointsEl =
                document.getElementById(
                    pointIds[index]
                );

            const user =
                top[index];


            if (nameEl) {

                nameEl.textContent =
                    user
                        ? getUserName(user)
                        : "—";
            }


            if (pointsEl) {

                pointsEl.textContent =
                    user
                        ? `⭐ ${getUserPoints(user)}`
                        : "⭐ 0";
            }
        }
    );
}


function showEmptyLeaderboard() {

    const container =
        document.getElementById(
            "leaderboard"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `
        <div class="
            glass
            rounded-2xl
            p-10
            text-center
            text-gray-400
        ">
            🏆 No rankings yet.
            <p class="mt-2">
                Start recycling and earning points.
            </p>
        </div>
    `;
}


function escapeHtml(
    value
) {

    return String(value ?? "")
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