/*
 * =========================================================
 * RECYCLEX - CLEANING WORKER DASHBOARD
 * =========================================================
 *
 * Features:
 * - Load assigned cleaning tasks
 * - Start task
 * - Complete task
 * - Google Map
 * - Garbage/task markers
 * - Worker GPS
 * - Live worker marker
 * - Accuracy circle
 * - Google Routes API
 * - No database changes
 *
 * IMPORTANT:
 * Uses the current Google Routes Library.
 * Does NOT use DirectionsService or DirectionsRenderer.
 * =========================================================
 */

let cleaningMap = null;

let CleaningRoute = null;
let CleaningAdvancedMarkerElement = null;

let cleaningWorkerMarker = null;
let cleaningAccuracyCircle = null;

let cleaningWatchId = null;

let cleaningTasks = [];
let cleaningTaskMarkers = [];

let cleaningSelectedTask = null;
let cleaningWorkerPosition = null;

let cleaningRoutePolylines = [];

let cleaningRouteRequestRunning = false;
let cleaningLastRouteTime = 0;

const CLEANING_DEFAULT_LOCATION = {
    lat: 22.5726,
    lng: 88.3639
};

const CLEANING_MAP_ID = "DEMO_MAP_ID";


/*
 * =========================================================
 * PAGE START
 * =========================================================
 */

document.addEventListener("DOMContentLoaded", () => {

    if (!document.getElementById("taskContainer")) {
        return;
    }

    if (!requireLogin()) {
        return;
    }

    loadCleaningTasks();
});


/*
 * =========================================================
 * GOOGLE MAP INITIALIZATION
 * =========================================================
 */

async function initCleaningWorkerMap() {

    const mapEl =
        document.getElementById(
            "cleaningWorkerMap"
        );

    if (!mapEl) {
        console.warn(
            "cleaningWorkerMap element not found."
        );
        return;
    }

    try {

        /*
         * Load Google libraries
         */

        const { Map } =
            await google.maps.importLibrary(
                "maps"
            );

        const {
            AdvancedMarkerElement
        } =
            await google.maps.importLibrary(
                "marker"
            );

        const {
            Route
        } =
            await google.maps.importLibrary(
                "routes"
            );

        CleaningRoute = Route;

        CleaningAdvancedMarkerElement =
            AdvancedMarkerElement;


        /*
         * Create map
         */

        cleaningMap =
            new Map(
                mapEl,
                {
                    center:
                    CLEANING_DEFAULT_LOCATION,

                    zoom: 13,

                    mapId:
                    CLEANING_MAP_ID,

                    streetViewControl:
                        false,

                    fullscreenControl:
                        true,

                    mapTypeControl:
                        false
                }
            );


        setText(
            "routeStatus",
            "Map ready"
        );


        /*
         * Load task markers
         */

        await loadTasksOnMap();


        /*
         * Start GPS automatically
         *
         * User can still use the
         * Start Tracking button.
         */

        startTracking();


    } catch (error) {

        console.error(
            "Cleaning map initialization error:",
            error
        );

        setText(
            "routeStatus",
            "Map failed to initialize"
        );
    }
}


/*
 * =========================================================
 * LOAD CLEANING TASKS
 * =========================================================
 */

async function loadCleaningTasks() {

    const container =
        document.getElementById(
            "taskContainer"
        );

    if (!container) {
        return;
    }

    try {

        const data =
            await apiFetch(
                API.CLEANING_WORKER.TASKS
            );

        cleaningTasks =
            Array.isArray(data)
                ? data
                : [];


        updateCleaningStatistics(
            cleaningTasks
        );


        if (!cleaningTasks.length) {

            container.innerHTML = `
                <div class="glass rounded-3xl p-8 text-gray-400">
                    No cleaning tasks are currently assigned to you.
                </div>
            `;

        } else {

            container.innerHTML =
                cleaningTasks
                    .map(
                        createCleaningTaskCard
                    )
                    .join("");
        }


        renderCleaningTaskMarkers(
            cleaningTasks
        );

    } catch (error) {

        console.error(
            "Loading cleaning tasks failed:",
            error
        );

        container.innerHTML = `
            <div class="glass rounded-3xl p-6 text-red-400">
                ${escapeHtml(error.message)}
            </div>
        `;
    }
}


/*
 * =========================================================
 * CLEANING TASK CARD
 * =========================================================
 */

function createCleaningTaskCard(task) {

    const status =
        task.status ||
        "PENDING";

    let action = "";


    if (status === "ASSIGNED") {

        action = `
            <button
                onclick="startCleaningTask(${task.id})"
                class="action primary">
                ▶ START TASK
            </button>
        `;

    } else if (status === "IN_PROGRESS") {

        action = `
            <button
                onclick="completeCleaningTask(${task.id})"
                class="action success">
                ✓ SEND COMPLETION TO ADMIN
            </button>
        `;

    } else if (
        status ===
        "AWAITING_APPROVAL"
    ) {

        action = `
            <div class="notice waiting">
                ⏳ Completion sent. Waiting for admin approval.
            </div>
        `;

    } else if (
        status ===
        "COMPLETED"
    ) {

        action = `
            <div class="notice done">
                ✓ Approved and completed
            </div>
        `;

    } else if (
        status ===
        "REJECTED"
    ) {

        action = `
            <div class="notice rejected">
                ✕ Rejected — check admin notification
            </div>
        `;
    }


    const hasLocation =
        Number.isFinite(
            Number(task.latitude)
        ) &&
        Number.isFinite(
            Number(task.longitude)
        );


    return `
        <article class="glass card rounded-3xl p-6">

            <div class="flex justify-between gap-3">

                <div>

                    <p class="muted">
                        CLEANING TASK #${task.id ?? "-"}
                    </p>

                    <h3 class="text-xl font-bold mt-2">
                        ${escapeHtml(
        task.location ||
        "Garbage location"
    )}
                    </h3>

                </div>

                <span class="status">
                    ${escapeHtml(status)}
                </span>

            </div>


            <p class="text-gray-400 mt-4">
                ${escapeHtml(
        task.description ||
        "Garbage collection task"
    )}
            </p>


            <div class="details">

                <span>
                    Report #${task.garbageReportId ?? "-"}
                </span>

                <span>
                    Worker:
                    ${escapeHtml(
        task.workerName ||
        "You"
    )}
                </span>

            </div>


            <div class="actions">

                ${action}

                ${
        hasLocation
            ? `
                            <button
                                class="action secondary"
                                onclick="selectCleaningTask(${task.id})">
                                🗺 VIEW ROUTE
                            </button>
                        `
            : ""
    }

            </div>

        </article>
    `;
}


/*
 * =========================================================
 * START CLEANING TASK
 * =========================================================
 */

async function startCleaningTask(
    taskId
) {

    try {

        await apiFetch(
            API.CLEANING_WORKER.START(
                taskId
            ),
            {
                method: "PUT"
            }
        );

        alert(
            "Task started. Admin has been notified."
        );

        await loadCleaningTasks();

    } catch (error) {

        console.error(error);

        alert(
            error.message
        );
    }
}


/*
 * =========================================================
 * COMPLETE CLEANING TASK
 * =========================================================
 */

async function completeCleaningTask(
    taskId
) {

    if (
        !confirm(
            "Confirm that you have finished this cleaning work. It will be sent to admin for approval."
        )
    ) {
        return;
    }


    try {

        await apiFetch(
            API.CLEANING_WORKER.COMPLETE(
                taskId
            ),
            {
                method: "PUT"
            }
        );


        alert(
            "Completion sent to admin. The task will become COMPLETED only after admin approval."
        );


        await loadCleaningTasks();

    } catch (error) {

        console.error(error);

        alert(
            error.message
        );
    }
}


/*
 * =========================================================
 * STATISTICS
 * =========================================================
 */

function updateCleaningStatistics(
    tasks
) {

    setText(
        "assignedCount",
        tasks.filter(
            t =>
                t.status ===
                "ASSIGNED"
        ).length
    );


    setText(
        "pendingCount",
        tasks.filter(
            t =>
                t.status ===
                "AWAITING_APPROVAL"
        ).length
    );


    setText(
        "progressCount",
        tasks.filter(
            t =>
                t.status ===
                "IN_PROGRESS"
        ).length
    );


    setText(
        "completedCount",
        tasks.filter(
            t =>
                t.status ===
                "COMPLETED"
        ).length
    );
}


/*
 * =========================================================
 * LOAD TASKS ON MAP
 * =========================================================
 */

async function loadTasksOnMap() {

    if (!cleaningMap) {
        return;
    }


    if (!cleaningTasks.length) {

        try {

            const data =
                await apiFetch(
                    API.CLEANING_WORKER.TASKS
                );

            cleaningTasks =
                Array.isArray(data)
                    ? data
                    : [];

            updateCleaningStatistics(
                cleaningTasks
            );

        } catch (error) {

            console.error(error);

            return;
        }
    }


    renderCleaningTaskMarkers(
        cleaningTasks
    );
}


/*
 * =========================================================
 * RENDER TASK MARKERS
 * =========================================================
 */

function renderCleaningTaskMarkers(
    tasks
) {

    if (
        !cleaningMap ||
        !CleaningAdvancedMarkerElement
    ) {
        return;
    }


    /*
     * Remove old markers
     */

    cleaningTaskMarkers.forEach(
        marker => {

            marker.map = null;

        }
    );

    cleaningTaskMarkers = [];


    const valid =
        tasks.filter(
            task =>
                Number.isFinite(
                    Number(task.latitude)
                ) &&
                Number.isFinite(
                    Number(task.longitude)
                )
        );


    if (!valid.length) {

        setText(
            "routeStatus",
            "No task coordinates available"
        );

        return;
    }


    const bounds =
        new google.maps.LatLngBounds();


    valid.forEach(
        task => {

            const position = {
                lat:
                    Number(
                        task.latitude
                    ),

                lng:
                    Number(
                        task.longitude
                    )
            };


            const marker =
                new CleaningAdvancedMarkerElement(
                    {
                        map:
                        cleaningMap,

                        position,

                        title:
                            `Cleaning task #${task.id}`
                    }
                );


            marker.addEventListener(
                "gmp-click",
                () => {

                    selectCleaningTask(
                        task.id
                    );

                }
            );


            cleaningTaskMarkers.push(
                marker
            );


            bounds.extend(
                position
            );
        }
    );


    if (!cleaningWorkerPosition) {

        cleaningMap.fitBounds(
            bounds
        );
    }
}


/*
 * =========================================================
 * SELECT CLEANING TASK
 * =========================================================
 */

function selectCleaningTask(
    taskId
) {

    const task =
        cleaningTasks.find(
            t =>
                Number(t.id) ===
                Number(taskId)
        );


    if (!task) {
        return;
    }


    cleaningSelectedTask =
        task;


    setText(
        "selectedTask",
        `#${task.id}`
    );


    const lat =
        Number(
            task.latitude
        );

    const lng =
        Number(
            task.longitude
        );


    if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng)
    ) {

        setText(
            "routeStatus",
            "This task has no GPS coordinates"
        );

        return;
    }


    const destination = {
        lat,
        lng
    };


    if (cleaningMap) {

        cleaningMap.panTo(
            destination
        );

        cleaningMap.setZoom(
            15
        );
    }


    if (
        cleaningWorkerPosition
    ) {

        calculateCleaningRoute(
            cleaningWorkerPosition,
            destination
        );

    } else {

        setText(
            "routeStatus",
            "Getting worker GPS location..."
        );

        getCurrentLocation();
    }
}


/*
 * =========================================================
 * GOOGLE ROUTES API
 * =========================================================
 */

async function calculateCleaningRoute(
    origin,
    destination
) {

    if (
        !cleaningMap ||
        !CleaningRoute
    ) {

        setText(
            "routeStatus",
            "Google Routes is not ready"
        );

        return;
    }


    /*
     * Prevent too many requests
     *
     * GPS may update frequently.
     */

    const now =
        Date.now();


    if (
        now -
        cleaningLastRouteTime <
        10000
    ) {

        return;
    }


    if (
        cleaningRouteRequestRunning
    ) {

        return;
    }


    cleaningLastRouteTime =
        now;

    cleaningRouteRequestRunning =
        true;


    setText(
        "routeStatus",
        "Calculating route..."
    );


    try {

        clearCleaningRouteOnly();


        const request = {

            origin: {
                lat:
                    Number(
                        origin.lat
                    ),

                lng:
                    Number(
                        origin.lng
                    )
            },

            destination: {
                lat:
                    Number(
                        destination.lat
                    ),

                lng:
                    Number(
                        destination.lng
                    )
            },

            travelMode:
                "DRIVING",

            routingPreference:
                "TRAFFIC_AWARE",

            fields: [
                "path",
                "distanceMeters",
                "durationMillis",
                "localizedValues"
            ],

            language:
                "en",

            units:
            google.maps.UnitSystem.METRIC
        };


        const result =
            await CleaningRoute.computeRoutes(
                request
            );


        if (
            !result ||
            !result.routes ||
            !result.routes.length
        ) {

            setText(
                "routeStatus",
                "Route unavailable"
            );

            return;
        }


        const route =
            result.routes[0];


        /*
         * Draw route
         */

        cleaningRoutePolylines =
            route.createPolylines(
                {
                    polylineOptions: {
                        strokeWeight: 6
                    }
                }
            );


        cleaningRoutePolylines.forEach(
            polyline => {

                polyline.setMap(
                    cleaningMap
                );

            }
        );


        /*
         * Distance
         */

        const distanceMeters =
            Number(
                route.distanceMeters ||
                0
            );


        const distanceText =
            distanceMeters >= 1000
                ?
                `${(
                    distanceMeters /
                    1000
                ).toFixed(1)} km`
                :
                `${Math.round(
                    distanceMeters
                )} m`;


        /*
         * Duration
         */

        const durationMillis =
            Number(
                route.durationMillis ||
                0
            );


        const totalMinutes =
            Math.ceil(
                durationMillis /
                60000
            );


        const durationText =
            totalMinutes >= 60
                ?
                `${Math.floor(
                    totalMinutes / 60
                )}h ${
                    totalMinutes % 60
                }m`
                :
                `${totalMinutes} min`;


        setText(
            "routeDistance",
            distanceText
        );


        setText(
            "routeDuration",
            durationText
        );


        setText(
            "routeStatus",
            "Route ready"
        );


    } catch (error) {

        console.error(
            "Google Routes error:",
            error
        );


        setText(
            "routeStatus",
            "Route unavailable"
        );

    } finally {

        cleaningRouteRequestRunning =
            false;
    }
}


/*
 * =========================================================
 * CLEAR ONLY ROUTE
 * =========================================================
 */

function clearCleaningRouteOnly() {

    cleaningRoutePolylines.forEach(
        polyline => {

            polyline.setMap(
                null
            );

        }
    );


    cleaningRoutePolylines = [];
}


/*
 * =========================================================
 * CLEAR EVERYTHING
 * =========================================================
 */

function clearRoute() {

    clearCleaningRouteOnly();


    cleaningSelectedTask =
        null;


    setText(
        "selectedTask",
        "None"
    );


    setText(
        "routeDistance",
        "—"
    );


    setText(
        "routeDuration",
        "—"
    );


    setText(
        "routeStatus",
        "Waiting"
    );
}


/*
 * =========================================================
 * GET CURRENT LOCATION
 * =========================================================
 */

function getCurrentLocation() {

    if (
        !navigator.geolocation
    ) {

        alert(
            "Geolocation is not supported by this browser."
        );

        return;
    }


    setText(
        "locationStatus",
        "Getting your GPS location..."
    );


    navigator.geolocation.getCurrentPosition(

        position => {

            updateCleaningWorkerLocation(
                position
            );

        },

        error => {

            handleCleaningLocationError(
                error
            );

        },

        {
            enableHighAccuracy:
                true,

            timeout:
                15000,

            maximumAge:
                0
        }
    );
}


/*
 * =========================================================
 * START LIVE TRACKING
 * =========================================================
 */

function startTracking() {

    if (
        !navigator.geolocation
    ) {

        alert(
            "Geolocation is not supported by this browser."
        );

        return;
    }


    if (
        cleaningWatchId !== null
    ) {

        setText(
            "locationStatus",
            "Live GPS tracking is already running."
        );

        return;
    }


    setText(
        "locationStatus",
        "Live GPS tracking started."
    );


    cleaningWatchId =
        navigator.geolocation.watchPosition(

            position => {

                updateCleaningWorkerLocation(
                    position
                );

            },

            error => {

                handleCleaningLocationError(
                    error
                );

            },

            {
                enableHighAccuracy:
                    true,

                timeout:
                    15000,

                maximumAge:
                    3000
            }
        );
}


/*
 * =========================================================
 * STOP TRACKING
 * =========================================================
 */

function stopTracking() {

    if (
        cleaningWatchId !== null
    ) {

        navigator.geolocation.clearWatch(
            cleaningWatchId
        );

        cleaningWatchId =
            null;
    }


    setText(
        "locationStatus",
        "GPS tracking stopped."
    );
}


/*
 * =========================================================
 * UPDATE WORKER GPS
 * =========================================================
 */

function updateCleaningWorkerLocation(
    position
) {

    const lat =
        Number(
            position.coords.latitude
        );

    const lng =
        Number(
            position.coords.longitude
        );

    const accuracy =
        Number(
            position.coords.accuracy
        );


    if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng)
    ) {

        return;
    }


    cleaningWorkerPosition = {
        lat,
        lng
    };


    /*
     * Worker marker
     */

    if (
        cleaningMap &&
        CleaningAdvancedMarkerElement
    ) {

        if (
            !cleaningWorkerMarker
        ) {

            cleaningWorkerMarker =
                new CleaningAdvancedMarkerElement(
                    {
                        map:
                        cleaningMap,

                        position:
                        cleaningWorkerPosition,

                        title:
                            "My live location"
                    }
                );

        } else {

            cleaningWorkerMarker.position =
                cleaningWorkerPosition;
        }


        /*
         * Accuracy circle
         */

        if (
            !cleaningAccuracyCircle
        ) {

            cleaningAccuracyCircle =
                new google.maps.Circle(
                    {
                        map:
                        cleaningMap,

                        center:
                        cleaningWorkerPosition,

                        radius:
                        accuracy,

                        fillOpacity:
                            0.08,

                        strokeOpacity:
                            0.35
                    }
                );

        } else {

            cleaningAccuracyCircle.setCenter(
                cleaningWorkerPosition
            );

            cleaningAccuracyCircle.setRadius(
                accuracy
            );
        }


        /*
         * Center map
         */

        cleaningMap.panTo(
            cleaningWorkerPosition
        );
    }


    setText(
        "locationStatus",
        `GPS active • accuracy ±${Math.round(
            accuracy
        )} m`
    );


    /*
     * Recalculate selected route
     */

    if (
        cleaningSelectedTask
    ) {

        const destination = {

            lat:
                Number(
                    cleaningSelectedTask.latitude
                ),

            lng:
                Number(
                    cleaningSelectedTask.longitude
                )
        };


        if (
            Number.isFinite(
                destination.lat
            ) &&
            Number.isFinite(
                destination.lng
            )
        ) {

            calculateCleaningRoute(
                cleaningWorkerPosition,
                destination
            );
        }
    }
}


/*
 * =========================================================
 * LOCATION ERROR
 * =========================================================
 */

function handleCleaningLocationError(
    error
) {

    const messages = {

        1:
            "Location permission denied.",

        2:
            "Current location is unavailable.",

        3:
            "Location request timed out."
    };


    setText(
        "locationStatus",
        messages[error.code] ||
        "Could not get GPS location."
    );
}


/*
 * =========================================================
 * HELPERS
 * =========================================================
 */

function setText(
    id,
    value
) {

    const el =
        document.getElementById(
            id
        );


    if (el) {

        el.textContent =
            value;
    }
}


function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )
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