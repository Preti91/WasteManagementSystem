/*
 * =========================================================
 * RECYCLEX - CERTIFICATES PAGE
 * =========================================================
 */

let ALL_CERTIFICATES = [];

document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (!document.getElementById("certificateGrid")) {
            return;
        }

        if (!requireLogin()) {
            return;
        }

        loadCertificates();

        document
            .getElementById("certificateModal")
            ?.addEventListener("click", (event) => {

                if (event.target.id === "certificateModal") {
                    closeCertificateModal();
                }
            });
    }
);


/* =================================
   LOAD CERTIFICATES
================================= */

async function loadCertificates() {

    const grid =
        document.getElementById("certificateGrid");

    if (!grid) {
        return;
    }

    try {

        const data =
            await apiFetch(API.CERTIFICATES.MINE);

        ALL_CERTIFICATES =
            Array.isArray(data) ? data : [];

        renderCertificateGrid(ALL_CERTIFICATES);

    } catch (error) {

        console.error(
            "Certificates:",
            error.message
        );

        grid.innerHTML = `
            <div class="glass rounded-2xl p-6 text-center text-gray-500 sm:col-span-2 lg:col-span-3">
                Could not load certificates: ${escapeHtml(error.message)}
            </div>
        `;
    }
}


function renderCertificateGrid(certificates) {

    const grid =
        document.getElementById("certificateGrid");

    if (!grid) {
        return;
    }

    if (!certificates.length) {

        grid.innerHTML = `
            <div class="glass rounded-2xl p-10 text-center text-gray-500 sm:col-span-2 lg:col-span-3">
                <div class="text-5xl mb-4">🏅</div>
                <p class="font-semibold text-gray-300">No certificates yet</p>
                <p class="text-sm mt-2">
                    Redeem a reward from the
                    <a href="/rewards.html" class="text-green-400 hover:underline">Rewards page</a>
                    to earn your first certificate.
                </p>
            </div>
        `;

        return;
    }

    grid.innerHTML =
        certificates
            .map((certificate, index) => certificateCard(certificate, index))
            .join("");
}


function certificateCard(certificate, index) {

    const date =
        certificate.issuedAt
            ? new Date(certificate.issuedAt).toLocaleDateString(
                undefined,
                { year: "numeric", month: "long", day: "numeric" }
            )
            : "";

    return `
        <div class="glass card-3d rounded-3xl p-6 flex flex-col">

            <div class="w-14 h-14 rounded-2xl bg-amber-400/10 flex items-center justify-center text-3xl">
                🏅
            </div>

            <h3 class="text-lg font-bold mt-4 break-words">
                ${escapeHtml(certificate.rewardName || "Eco Certificate")}
            </h3>

            <p class="text-gray-500 text-xs mt-1 certificate-code">
                ${escapeHtml(certificate.certificateCode || "")}
            </p>

            <p class="text-gray-400 text-sm mt-3 flex-1">
                Issued ${escapeHtml(date)} &middot; ${certificate.pointsSpent ?? 0} points
            </p>

            <button
                    onclick="openCertificateModal(${index})"
                    class="eco-button-outline text-sm mt-5"
            >
                View Certificate
            </button>

        </div>
    `;
}


/* =================================
   MODAL
================================= */

function openCertificateModal(index) {

    const certificate =
        ALL_CERTIFICATES[index];

    if (!certificate) {
        return;
    }

    const detail =
        document.getElementById("certificateDetail");

    const modal =
        document.getElementById("certificateModal");

    if (!detail || !modal) {
        return;
    }

    detail.innerHTML =
        certificateDetailMarkup(certificate);

    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.style.overflow = "hidden";
}


function closeCertificateModal() {

    const modal =
        document.getElementById("certificateModal");

    if (!modal) {
        return;
    }

    modal.classList.add("hidden");
    modal.classList.remove("flex");
    document.body.style.overflow = "";
}


function certificateDetailMarkup(certificate) {

    const date =
        certificate.issuedAt
            ? new Date(certificate.issuedAt).toLocaleDateString(
                undefined,
                { year: "numeric", month: "long", day: "numeric" }
            )
            : "";

    return `
        <div class="certificate-seal">🏆</div>

        <p class="text-yellow-400 text-xs sm:text-sm tracking-widest uppercase mt-5">
            RecycleX Certificate of Achievement
        </p>

        <h2 class="font-display text-2xl sm:text-3xl font-bold mt-3">
            This certifies that
        </h2>

        <p class="text-3xl sm:text-4xl font-bold text-green-400 text-glow mt-3 break-words">
            ${escapeHtml(certificate.recipientName || "RecycleX Member")}
        </p>

        <p class="text-gray-300 mt-5 max-w-lg mx-auto leading-relaxed">
            has successfully redeemed
            <span class="font-bold text-amber-300">${escapeHtml(certificate.rewardName || "an Eco Reward")}</span>
            for <span class="font-bold text-amber-300">${certificate.pointsSpent ?? 0} points</span>
            in recognition of their contribution to a cleaner community.
        </p>

        <p class="text-gray-400 italic mt-5 max-w-lg mx-auto">
            "${escapeHtml(certificate.message || "Thank you for making a difference!")}"
        </p>

        <div class="flex flex-wrap justify-center gap-x-10 gap-y-2 mt-8 text-sm text-gray-500">
            <span>Issued: ${escapeHtml(date)}</span>
            <span class="certificate-code">Certificate No. ${escapeHtml(certificate.certificateCode || "")}</span>
        </div>
    `;
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
