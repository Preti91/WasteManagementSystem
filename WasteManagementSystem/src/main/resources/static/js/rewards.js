/*
 * =========================================================
 * RECYCLEX - REWARDS PAGE
 * =========================================================
 */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (!document.getElementById("points")) {
            return;
        }

        if (!requireLogin()) {
            return;
        }

        loadRewardData();
    }
);


async function loadRewardData() {

    await loadPoints();

    await loadRewards();
}


/* =================================
   LOAD USER REWARD POINTS
================================= */

async function loadPoints() {

    try {

        const data =
            await apiFetch(
                API.REWARDS.MY_REWARDS
            );

        const points =
            Number(
                data?.totalPoints ??
                data?.points ??
                data?.rewardPoints ??
                0
            );

        const element =
            document.getElementById("points");

        if (element) {
            element.textContent = points;
        }

        updateRewardProgress(points);

    } catch (error) {

        console.error(
            "Reward points:",
            error.message
        );
    }
}


/* =================================
   LOAD REWARD CATALOGUE
================================= */

async function loadRewards() {

    const container =
        document.getElementById("rewardContainer");

    if (!container) {
        return;
    }

    container.innerHTML = `
        <div class="glass rounded-2xl p-6 text-center text-gray-500 sm:col-span-2 lg:col-span-4">
            Loading rewards...
        </div>
    `;

    let catalog = FALLBACK_REWARD_CATALOG;

    try {

        const fetched =
            await apiFetch(
                API.REWARDS.CATALOG
            );

        if (Array.isArray(fetched) && fetched.length) {
            catalog = fetched;
        }

    } catch (error) {

        console.error(
            "Reward catalog:",
            error.message
        );
    }

    renderRewardCatalog(catalog);

    try {

        const data =
            await apiFetch(
                API.REWARDS.MY_REWARDS
            );

        renderRewardHistory(data?.history || []);

    } catch (error) {

        console.error(
            "Rewards API:",
            error.message
        );
    }
}


/* =================================
   REWARD CATALOGUE (redeemable)
   Fallback used only if /api/rewards/catalog
   cannot be reached - kept in sync with the
   server-side catalogue in RewardService.
================================= */

const FALLBACK_REWARD_CATALOG = [
    { id: 1, name: "Eco Certificate", description: "A shareable digital certificate recognising your environmental contribution.", points: 100, icon: "🏆" },
    { id: 2, name: "Green Badge", description: "Unlock the Eco Champion badge on your profile.", points: 250, icon: "🌱" },
    { id: 3, name: "Eco Champion", description: "Premium recognition for outstanding environmental impact.", points: 500, icon: "♻" },
    { id: 4, name: "Reusable Tote Bag", description: "A RecycleX branded reusable shopping bag, delivered to your door.", points: 150, icon: "👜" },
    { id: 5, name: "Plantable Sapling Kit", description: "A starter kit with a sapling and soil to grow your own tree.", points: 200, icon: "🌳" },
    { id: 6, name: "Eco Store Voucher", description: "A voucher redeemable at partnered eco-friendly stores.", points: 350, icon: "🎟" },
    { id: 7, name: "Community Cleanup Kit", description: "Gloves, bags and tools to lead your own neighbourhood cleanup.", points: 450, icon: "🧤" },
    { id: 8, name: "Platinum Eco Legend", description: "The highest honour - a premium certificate and city recognition.", points: 1000, icon: "💎" }
];


function renderRewardCatalog(catalog) {

    const container =
        document.getElementById("rewardContainer");

    if (!container) {
        return;
    }

    const currentPoints =
        Number(
            document.getElementById("points")?.textContent ?? 0
        );

    container.innerHTML =
        catalog
            .slice()
            .sort((a, b) => (a.points ?? 0) - (b.points ?? 0))
            .map(reward => rewardCard(reward, currentPoints))
            .join("");
}


function rewardCard(reward, currentPoints) {

    const points =
        reward.points ??
        reward.requiredPoints ??
        reward.cost ??
        0;

    const canAfford =
        currentPoints >= points;

    return `

        <div class="glass card-3d rounded-3xl p-6 flex flex-col">

            <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-green-400/10 flex items-center justify-center text-3xl sm:text-4xl">
                ${reward.icon || "🎁"}
            </div>

            <h3 class="text-lg sm:text-xl font-bold mt-5 break-words">
                ${escapeHtml(reward.name || reward.title || "Eco Reward")}
            </h3>

            <p class="text-gray-400 text-sm mt-2 min-h-[48px] flex-1">
                ${escapeHtml(reward.description || "Environmental achievement reward.")}
            </p>

            <div class="flex flex-wrap justify-between items-center gap-3 mt-6">

                <span class="text-yellow-400 font-bold whitespace-nowrap">
                    ★ ${points}
                </span>

                <button
                    onclick="redeemReward(${reward.id}, ${points}, '${escapeHtml(reward.name || "").replace(/'/g, "\\'")}')"
                    class="eco-button text-sm ${canAfford ? "" : "opacity-50 cursor-not-allowed"}"
                    ${canAfford ? "" : "disabled"}
                >
                    ${canAfford ? "REDEEM" : "NOT ENOUGH POINTS"}
                </button>

            </div>

        </div>
    `;
}


/* =================================
   REWARD / REDEMPTION HISTORY
================================= */

function renderRewardHistory(history) {

    const container =
        document.getElementById("rewardHistory");

    if (!container) {
        return;
    }

    if (!history.length) {

        container.innerHTML = `
            <div class="glass rounded-2xl p-6 text-center text-gray-500">
                No reward activity yet. Start reporting and recycling
                to earn your first points!
            </div>
        `;

        return;
    }

    container.innerHTML =
        history
            .slice()
            .sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            )
            .map(entry => {

                const earned = Number(entry.points) >= 0;

                return `
                    <div class="glass rounded-2xl px-5 py-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                        <div class="min-w-0">
                            <p class="font-semibold break-words">
                                ${escapeHtml(entry.reason || "Reward activity")}
                            </p>
                            <p class="text-gray-500 text-xs mt-1">
                                ${entry.createdAt ? new Date(entry.createdAt).toLocaleString() : ""}
                            </p>
                        </div>
                        <span class="font-bold whitespace-nowrap ${earned ? "text-green-400" : "text-red-400"}">
                            ${earned ? "+" : ""}${entry.points}
                        </span>
                    </div>
                `;
            })
            .join("");
}


/* =================================
   REDEEM
================================= */

async function redeemReward(rewardId, points, rewardName) {

    const currentPoints =
        Number(
            document.getElementById("points")?.textContent ?? 0
        );

    if (currentPoints < points) {

        alert("You do not have enough points to redeem this reward.");

        return;
    }

    if (!confirm(`Redeem "${rewardName}" for ${points} points now?`)) {
        return;
    }

    try {

        await apiFetch(
            API.REWARDS.MY_REWARDS + "/" + rewardId + "/redeem",
            {
                method: "POST"
            }
        );

        if (confirm(`Reward redeemed! A unique certificate has been added to your account. View it now?`)) {
            window.location.href = "/certificates.html";
            return;
        }

        await loadRewardData();

    } catch (error) {

        alert("Could not redeem reward: " + error.message);
    }
}


/* =================================
   PROGRESS BAR
================================= */

function updateRewardProgress(points) {

    let previous;
    let nextReward;

    if (points < 100) {
        previous = 0;
        nextReward = 100;
    } else if (points < 250) {
        previous = 100;
        nextReward = 250;
    } else if (points < 500) {
        previous = 250;
        nextReward = 500;
    } else if (points < 1000) {
        previous = 500;
        nextReward = 1000;
    } else {
        previous = 1000;
        nextReward = 2000;
    }

    const percentage =
        Math.min(
            100,
            ((points - previous) / (nextReward - previous)) * 100
        );

    const progress =
        document.getElementById("progressBar");

    if (progress) {
        progress.style.width = percentage + "%";
    }

    const next =
        document.getElementById("nextReward");

    if (next) {
        next.textContent =
            `${Math.max(0, nextReward - points)} points until your next reward`;
    }
}


/* =================================
   HELPERS
================================= */

function escapeHtml(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
