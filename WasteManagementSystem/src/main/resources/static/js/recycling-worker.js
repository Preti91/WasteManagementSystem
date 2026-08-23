/* =========================================================
   RECYCLEX
   RECYCLING WORKER DASHBOARD
   =========================================================
   FEATURES

   - Recycling tasks
   - Start / Complete task
   - Google Maps
   - Google Routes API
   - Live worker GPS
   - Task markers
   - Real road route
   - Route distance
   - Route duration
   ========================================================= */


/* =========================================================
   GLOBAL VARIABLES
   ========================================================= */

let recyclingTasks = [];

let recyclingMap = null;


/* =========================================================
   ROUTE VARIABLES
   ========================================================= */

let recyclingRoutePolyline = null;

let selectedTask = null;

let recyclingRouteRequestRunning = false;

let recyclingLastRouteTime = 0;


/* =========================================================
   WORKER GPS
   ========================================================= */

let workerMarker = null;

let workerAccuracyCircle = null;

let watchId = null;

let workerPosition = null;


/* =========================================================
   TASK MARKERS
   ========================================================= */

let taskMarkers = [];

let RecyclingAdvancedMarkerElement = null;


/* =========================================================
   DEFAULT LOCATION
   ========================================================= */

const RECYCLING_DEFAULT_LOCATION = {
    lat: 22.5726,
    lng: 88.3639
};


/* =========================================================
   MAP ID
   ========================================================= */

const RECYCLING_MAP_ID =
    "DEMO_MAP_ID";


/* =========================================================
   PAGE START
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        try {

            /* -----------------------------------------
               CHECK TOKEN
               ----------------------------------------- */

            const token =
                localStorage.getItem("token");


            if (!token) {

                window.location.href =
                    "/login.html";

                return;
            }


            /* -----------------------------------------
               CHECK API OBJECT
               ----------------------------------------- */

            if (
                typeof apiGet !== "function" ||
                typeof apiPost !== "function"
            ) {

                throw new Error(
                    "API helper functions are not available."
                );
            }


            if (
                typeof API === "undefined"
            ) {

                throw new Error(
                    "API configuration is not available."
                );
            }


            /* -----------------------------------------
               VERIFY CURRENT USER
               ----------------------------------------- */

            const user =
                await apiGet(
                    API.USERS.ME
                );


            const role =
                String(
                    user?.role || ""
                )
                    .toUpperCase()
                    .replace(
                        "ROLE_",
                        ""
                    );


            /* -----------------------------------------
               ROLE CHECK
               ----------------------------------------- */

            if (
                role !==
                "RECYCLING_WORKER"
            ) {

                alert(
                    "Access denied. You are not a recycling worker."
                );


                localStorage.removeItem(
                    "token"
                );


                localStorage.removeItem(
                    "user"
                );


                window.location.href =
                    "/login.html";

                return;
            }


            /* -----------------------------------------
               SAVE USER
               ----------------------------------------- */

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );


            /* -----------------------------------------
               SHOW WORKER NAME
               ----------------------------------------- */

            const nameElement =
                document.querySelector(
                    "[data-user-name]"
                );


            if (nameElement) {

                nameElement.textContent =
                    user?.name ||
                    user?.email ||
                    "Recycling Worker";
            }


            /* -----------------------------------------
               LOAD TASKS
               ----------------------------------------- */

            await loadRecyclingTasks();


            /* -----------------------------------------
               MAP WILL BE INITIALIZED BY GOOGLE CALLBACK
               ----------------------------------------- */

            console.log(
                "♻️ Recycling worker dashboard loaded."
            );

        }

        catch (error) {

            console.error(
                "Worker dashboard error:",
                error
            );


            showWorkerError(
                error.message ||
                "Unable to load dashboard."
            );

        }

    }
);


/* =========================================================
   LOAD RECYCLING TASKS
   ========================================================= */

async function loadRecyclingTasks() {

    const container =
        document.getElementById(
            "taskContainer"
        );


    if (container) {

        container.innerHTML = `
            <div class="glass rounded-3xl p-8">
                Loading recycling tasks...
            </div>
        `;
    }


    try {

        const data =
            await apiGet(
                API.RECYCLING_WORKER.TASKS
            );


        recyclingTasks =
            Array.isArray(data)
                ? data
                : [];


        console.log(
            "♻️ Recycling tasks:",
            recyclingTasks
        );


        updateStatistics();

        renderTasks();

        renderTaskMarkers();

    }

    catch (error) {

        console.error(
            "Could not load recycling tasks:",
            error
        );


        if (container) {

            container.innerHTML = `
                <div class="glass rounded-3xl p-8 text-red-400">
                    ${escapeHtml(
                error.message ||
                "Could not load recycling tasks."
            )}
                </div>
            `;
        }

    }

}


/* =========================================================
   STATISTICS
   ========================================================= */

function updateStatistics() {

    setText(
        "assignedCount",
        recyclingTasks.filter(
            task =>
                String(task.status)
                    .toUpperCase() ===
                "ASSIGNED"
        ).length
    );


    setText(
        "progressCount",
        recyclingTasks.filter(
            task =>
                String(task.status)
                    .toUpperCase() ===
                "PICKUP_IN_PROGRESS"
        ).length
    );


    setText(
        "pendingCount",
        recyclingTasks.filter(
            task =>
                String(task.status)
                    .toUpperCase() ===
                "AWAITING_APPROVAL"
        ).length
    );


    setText(
        "completedCount",
        recyclingTasks.filter(
            task =>
                String(task.status)
                    .toUpperCase() ===
                "COMPLETED"
        ).length
    );

}


/* =========================================================
   RENDER TASKS
   ========================================================= */

function renderTasks() {

    const container =
        document.getElementById(
            "taskContainer"
        );


    if (!container) {

        return;
    }


    if (!recyclingTasks.length) {

        container.innerHTML = `
            <div class="glass rounded-3xl p-8 md:col-span-2 text-center">

                <div class="text-5xl mb-4">
                    ♻️
                </div>

                <h3 class="text-xl font-bold">
                    No recycling tasks assigned
                </h3>

                <p class="text-gray-400 mt-2">
                    New tasks assigned by admin will appear here.
                </p>

            </div>
        `;

        return;
    }


    container.innerHTML =
        recyclingTasks
            .map(
                renderTask
            )
            .join("");

}


/* =========================================================
   SINGLE TASK
   ========================================================= */

function renderTask(task) {

    const status =
        String(
            task?.status ||
            "UNKNOWN"
        ).toUpperCase();


    let action = "";


    /* -----------------------------------------
       ASSIGNED
       ----------------------------------------- */

    if (
        status ===
        "ASSIGNED"
    ) {

        action = `
            <button
                class="action primary"
                onclick="startRecyclingTask(${Number(task.id)})"
            >
                ▶ START PICKUP
            </button>
        `;
    }


    /* -----------------------------------------
       PICKUP IN PROGRESS
       ----------------------------------------- */

    else if (
        status ===
        "PICKUP_IN_PROGRESS"
    ) {

        action = `
            <button
                class="action success"
                onclick="completeRecyclingTask(${Number(task.id)})"
            >
                ✓ COMPLETE PICKUP
            </button>
        `;
    }


    /* -----------------------------------------
       WAITING
       ----------------------------------------- */

    else if (
        status ===
        "AWAITING_APPROVAL"
    ) {

        action = `
            <div class="notice waiting">
                ⏳ Waiting for admin approval
            </div>
        `;
    }


    /* -----------------------------------------
       COMPLETED
       ----------------------------------------- */

    else if (
        status ===
        "COMPLETED"
    ) {

        action = `
            <div class="notice done">
                ✓ Task approved and completed
            </div>
        `;
    }


    /* -----------------------------------------
       CANCELLED
       ----------------------------------------- */

    else if (
        status ===
        "CANCELLED"
    ) {

        action = `
            <div class="notice rejected">
                Task cancelled
            </div>
        `;
    }


    /* -----------------------------------------
       GPS COORDINATES
       ----------------------------------------- */
    const imageHtml =
        task?.imageUrl
            ? `
            <div class="mt-5">

                <p class="text-xs text-gray-400 mb-2">
                    WASTE IMAGE
                </p>

                <img
                    src="${escapeHtml(task.imageUrl)}"
                    alt="Recycling waste"
                    class="w-full h-56 object-cover rounded-2xl border border-gray-700"
                    loading="lazy"
                    onerror="this.style.display='none';"
                >

            </div>
          `
            : `
            <div class="mt-5 text-sm text-gray-500">
                No waste image uploaded.
            </div>
          `;
    const latitude =
        Number(
            task?.latitude
        );


    const longitude =
        Number(
            task?.longitude
        );


    const hasLocation =
        Number.isFinite(latitude) &&
        Number.isFinite(longitude);


    return `
        <article class="glass rounded-3xl p-6">

            <div class="flex justify-between gap-4">

                <div>

                    <p class="text-xs text-cyan-400">
                        RECYCLING TASK #${escapeHtml(task.id)}
                    </p>

                    <h3 class="text-xl font-bold mt-2">
                        ${escapeHtml(
        task.pickupLocation ||
        "Pickup location"
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
        "Recycling pickup"
    )}
            </p>

            ${imageHtml}
            <div class="details">

                <span>
                    Request #
                    ${escapeHtml(
        task.recyclingRequestId ??
        ""
    )}
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
                                onclick="selectRecyclingTask(${Number(task.id)})"
                            >
                                🗺 VIEW ROUTE
                            </button>
                        `

            : `
                            <span class="text-red-400 text-sm">
                                No GPS coordinates
                            </span>
                        `
    }

            </div>

        </article>
    `;

}


/* =========================================================
   START RECYCLING TASK
   ========================================================= */

async function startRecyclingTask(
    taskId
) {

    if (!taskId) {

        console.error(
            "Invalid task ID:",
            taskId
        );

        return;
    }


    try {

        console.log(
            "Starting recycling task:",
            taskId
        );


        await apiPost(
            API.RECYCLING_WORKER.START(
                taskId
            )
        );


        alert(
            "Pickup started successfully."
        );


        await loadRecyclingTasks();

    }

    catch (error) {

        console.error(
            "Start recycling task error:",
            error
        );


        alert(
            error.message ||
            "Could not start recycling task."
        );

    }

}


/* =========================================================
   COMPLETE RECYCLING TASK
   ========================================================= */

async function completeRecyclingTask(
    taskId
) {

    if (!taskId) {

        console.error(
            "Invalid task ID:",
            taskId
        );

        return;
    }


    const confirmed =
        confirm(
            "Are you sure the recycling pickup is complete?"
        );


    if (!confirmed) {

        return;
    }


    try {

        console.log(
            "Completing recycling task:",
            taskId
        );


        await apiPost(
            API.RECYCLING_WORKER.COMPLETE(
                taskId
            )
        );


        alert(
            "Completion sent to admin. The task is now waiting for approval."
        );


        await loadRecyclingTasks();

    }

    catch (error) {

        console.error(
            "Complete recycling task error:",
            error
        );


        alert(
            error.message ||
            "Could not complete recycling task."
        );

    }

}


/* =========================================================
   GOOGLE MAP INITIALIZATION
   ========================================================= */

async function initRecyclingWorkerMap() {

    console.log(
        "🔥 initRecyclingWorkerMap CALLED"
    );


    const mapElement =
        document.getElementById(
            "recyclingWorkerMap"
        );


    if (!mapElement) {

        console.error(
            "❌ #recyclingWorkerMap NOT FOUND"
        );

        return;
    }


    try {

        /* -----------------------------------------
           GOOGLE CHECK
           ----------------------------------------- */

        if (
            !window.google ||
            !window.google.maps
        ) {

            throw new Error(
                "Google Maps JavaScript API is not loaded."
            );
        }


        /* -----------------------------------------
           MAP LIBRARY
           ----------------------------------------- */

        const {
            Map
        } =
            await google.maps.importLibrary(
                "maps"
            );


        /* -----------------------------------------
           MARKER LIBRARY
           ----------------------------------------- */

        const {
            AdvancedMarkerElement
        } =
            await google.maps.importLibrary(
                "marker"
            );


        RecyclingAdvancedMarkerElement =
            AdvancedMarkerElement;


        /* -----------------------------------------
           CREATE MAP
           ----------------------------------------- */

        recyclingMap =
            new Map(
                mapElement,
                {
                    center:
                    RECYCLING_DEFAULT_LOCATION,

                    zoom:
                        13,

                    mapId:
                    RECYCLING_MAP_ID,

                    mapTypeControl:
                        true,

                    streetViewControl:
                        false,

                    fullscreenControl:
                        true
                }
            );


        console.log(
            "✅ Recycling map CREATED"
        );


        /* -----------------------------------------
           ROUTES LIBRARY
           ----------------------------------------- */

        const {
            Route
        } =
            await google.maps.importLibrary(
                "routes"
            );


        if (
            !Route ||
            typeof Route.computeRoutes !==
            "function"
        ) {

            throw new Error(
                "Google Routes API is not available."
            );
        }


        console.log(
            "✅ Google Routes API READY"
        );


        /* -----------------------------------------
           TASK MARKERS
           ----------------------------------------- */

        renderTaskMarkers();


        /* -----------------------------------------
           EXISTING GPS
           ----------------------------------------- */

        if (
            workerPosition
        ) {

            updateWorkerMarker();
        }


        /* -----------------------------------------
           START LIVE GPS
           ----------------------------------------- */

        startTracking();


        setText(
            "routeStatus",
            "Map ready • GPS starting..."
        );

    }

    catch (error) {

        console.error(
            "❌ Recycling map initialization error:",
            error
        );


        setText(
            "routeStatus",
            "Map failed to initialize"
        );

    }

}


/* =========================================================
   GOOGLE MAP CALLBACK
   ========================================================= */

window.initRecyclingWorkerMap =
    initRecyclingWorkerMap;


/* =========================================================
   RENDER TASK MARKERS
   ========================================================= */

function renderTaskMarkers() {

    if (
        !recyclingMap ||
        !window.google ||
        !window.google.maps
    ) {

        console.log(
            "Map not ready. Task markers will be rendered later."
        );

        return;
    }


    /* -----------------------------------------
       REMOVE OLD MARKERS
       ----------------------------------------- */

    taskMarkers.forEach(
        marker => {

            if (marker) {

                marker.map =
                    null;

            }

        }
    );


    taskMarkers = [];


    /* -----------------------------------------
       CREATE MARKERS
       ----------------------------------------- */

    recyclingTasks.forEach(
        task => {

            const lat =
                Number(
                    task?.latitude
                );


            const lng =
                Number(
                    task?.longitude
                );


            if (
                !Number.isFinite(lat) ||
                !Number.isFinite(lng)
            ) {

                console.warn(
                    "Task has invalid coordinates:",
                    task
                );

                return;
            }


            let marker;


            try {

                if (
                    !RecyclingAdvancedMarkerElement
                ) {

                    throw new Error(
                        "AdvancedMarkerElement unavailable"
                    );
                }


                marker =
                    new RecyclingAdvancedMarkerElement(
                        {
                            map:
                            recyclingMap,

                            position:
                                {
                                    lat,
                                    lng
                                },

                            title:
                                `Recycling Task #${task.id}`
                        }
                    );


                marker.addEventListener(
                    "gmp-click",
                    function () {

                        selectRecyclingTask(
                            task.id
                        );

                    }
                );

            }

            catch (error) {

                console.warn(
                    "Advanced marker failed. Using normal marker.",
                    error
                );


                marker =
                    new google.maps.Marker(
                        {
                            map:
                            recyclingMap,

                            position:
                                {
                                    lat,
                                    lng
                                },

                            title:
                                `Recycling Task #${task.id}`
                        }
                    );


                marker.addListener(
                    "click",
                    function () {

                        selectRecyclingTask(
                            task.id
                        );

                    }
                );

            }


            taskMarkers.push(
                marker
            );

        }
    );


    console.log(
        `✅ ${taskMarkers.length} recycling task marker(s) rendered`
    );

}


/* =========================================================
   SELECT RECYCLING TASK
   ========================================================= */

function selectRecyclingTask(
    taskId
) {

    console.log(
        "🗺 Selecting recycling task:",
        taskId
    );


    selectedTask =
        recyclingTasks.find(
            task =>
                Number(task?.id) ===
                Number(taskId)
        );


    if (!selectedTask) {

        console.error(
            "Recycling task not found:",
            taskId
        );

        return;
    }


    /* -----------------------------------------
       DESTINATION
       ----------------------------------------- */

    const destinationLat =
        Number(
            selectedTask.latitude
        );


    const destinationLng =
        Number(
            selectedTask.longitude
        );


    if (
        !Number.isFinite(destinationLat) ||
        !Number.isFinite(destinationLng)
    ) {

        setText(
            "routeStatus",
            "No GPS coordinates available"
        );

        return;
    }


    const destination = {

        lat:
        destinationLat,

        lng:
        destinationLng
    };


    setText(
        "selectedTask",
        `#${selectedTask.id}`
    );


    /* -----------------------------------------
       MOVE MAP
       ----------------------------------------- */

    if (recyclingMap) {

        recyclingMap.panTo(
            destination
        );

        recyclingMap.setZoom(
            15
        );

    }


    /* -----------------------------------------
       CALCULATE ROUTE
       ----------------------------------------- */

    if (workerPosition) {

        calculateRecyclingRoute(
            workerPosition,
            destination
        );

    }

    else {

        setText(
            "routeStatus",
            "Getting worker GPS location..."
        );


        getCurrentLocation();

    }

}


/* =========================================================
   GET CURRENT WORKER LOCATION
   ========================================================= */

function getCurrentLocation() {

    if (
        !navigator.geolocation
    ) {

        setText(
            "locationStatus",
            "Geolocation is not supported."
        );

        return;
    }


    setText(
        "locationStatus",
        "Getting your location..."
    );


    navigator.geolocation.getCurrentPosition(

        function (position) {

            updateWorkerLocation(
                position
            );

        },

        function (error) {

            handleLocationError(
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


/* =========================================================
   START LIVE TRACKING
   ========================================================= */

function startTracking() {

    if (
        !navigator.geolocation
    ) {

        setText(
            "locationStatus",
            "Geolocation is not supported."
        );

        return;
    }


    if (
        watchId !== null
    ) {

        setText(
            "locationStatus",
            "Live GPS tracking is already running."
        );

        return;
    }


    setText(
        "locationStatus",
        "Live GPS tracking started..."
    );


    watchId =
        navigator.geolocation.watchPosition(

            function (position) {

                updateWorkerLocation(
                    position
                );

            },

            function (error) {

                handleLocationError(
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


/* =========================================================
   STOP TRACKING
   ========================================================= */

function stopTracking() {

    if (
        watchId !== null
    ) {

        navigator.geolocation.clearWatch(
            watchId
        );

        watchId =
            null;
    }


    setText(
        "locationStatus",
        "GPS tracking stopped."
    );

}


/* =========================================================
   UPDATE WORKER LOCATION
   ========================================================= */

function updateWorkerLocation(
    position
) {

    if (
        !position ||
        !position.coords
    ) {

        return;
    }


    const latitude =
        Number(
            position.coords.latitude
        );


    const longitude =
        Number(
            position.coords.longitude
        );


    const accuracy =
        Number(
            position.coords.accuracy
        );


    if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
    ) {

        console.error(
            "Invalid worker GPS coordinates:",
            latitude,
            longitude
        );

        return;
    }


    workerPosition = {

        lat:
        latitude,

        lng:
        longitude

    };


    console.log(
        "📍 Worker position:",
        workerPosition
    );


    /* -----------------------------------------
       UPDATE MARKER
       ----------------------------------------- */

    updateWorkerMarker(
        accuracy
    );


    /* -----------------------------------------
       GPS STATUS
       ----------------------------------------- */

    if (
        Number.isFinite(accuracy)
    ) {

        setText(
            "locationStatus",
            `GPS active • accuracy ±${Math.round(
                accuracy
            )}m`
        );

    }

    else {

        setText(
            "locationStatus",
            "GPS active"
        );

    }


    /* -----------------------------------------
       UPDATE SELECTED ROUTE
       ----------------------------------------- */

    if (
        selectedTask
    ) {

        const destination = {

            lat:
                Number(
                    selectedTask.latitude
                ),

            lng:
                Number(
                    selectedTask.longitude
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

            /*
             * Do NOT request a route on every
             * GPS update.
             *
             * The route function itself
             * controls the request frequency.
             */

            calculateRecyclingRoute(
                workerPosition,
                destination
            );

        }

    }

}


/* =========================================================
   UPDATE WORKER MARKER
   ========================================================= */

function updateWorkerMarker(
    accuracy
) {

    if (
        !recyclingMap ||
        !window.google ||
        !window.google.maps ||
        !workerPosition
    ) {

        return;
    }


    /* -----------------------------------------
       WORKER MARKER
       ----------------------------------------- */

    if (
        !workerMarker
    ) {

        workerMarker =
            new google.maps.Marker(
                {
                    map:
                    recyclingMap,

                    position:
                    workerPosition,

                    title:
                        "My current location",

                    label:
                        "W"
                }
            );

    }

    else {

        workerMarker.setPosition(
            workerPosition
        );

    }


    /* -----------------------------------------
       ACCURACY CIRCLE
       ----------------------------------------- */

    if (
        Number.isFinite(accuracy)
    ) {

        if (
            !workerAccuracyCircle
        ) {

            workerAccuracyCircle =
                new google.maps.Circle(
                    {
                        map:
                        recyclingMap,

                        center:
                        workerPosition,

                        radius:
                        accuracy,

                        fillOpacity:
                            0.08,

                        strokeOpacity:
                            0.35
                    }
                );

        }

        else {

            workerAccuracyCircle.setCenter(
                workerPosition
            );


            workerAccuracyCircle.setRadius(
                accuracy
            );

        }

    }


    /* -----------------------------------------
       PAN ONLY IF NO TASK SELECTED
       ----------------------------------------- */

    if (
        !selectedTask
    ) {

        recyclingMap.panTo(
            workerPosition
        );

    }

}


/* =========================================================
   CALCULATE RECYCLING ROUTE
   GOOGLE ROUTES API
   ========================================================= */

async function calculateRecyclingRoute(
    origin,
    destination
) {

    console.log(
        "🚗 Calculating recycling route..."
    );


    /* -----------------------------------------
       CHECK MAP
       ----------------------------------------- */

    if (
        !recyclingMap
    ) {

        console.error(
            "❌ Recycling map is not initialized."
        );


        setText(
            "routeStatus",
            "Map is not ready"
        );

        return;
    }


    /* -----------------------------------------
       CHECK GOOGLE MAPS
       ----------------------------------------- */

    if (
        !window.google ||
        !window.google.maps
    ) {

        console.error(
            "❌ Google Maps is not loaded."
        );


        setText(
            "routeStatus",
            "Google Maps is not ready"
        );

        return;
    }


    /* -----------------------------------------
       VALIDATE ORIGIN
       ----------------------------------------- */

    const originLat =
        Number(
            origin?.lat
        );


    const originLng =
        Number(
            origin?.lng
        );


    if (
        !Number.isFinite(originLat) ||
        !Number.isFinite(originLng)
    ) {

        console.error(
            "❌ Invalid route origin:",
            origin
        );


        setText(
            "routeStatus",
            "Invalid worker location"
        );

        return;
    }


    /* -----------------------------------------
       VALIDATE DESTINATION
       ----------------------------------------- */

    const destinationLat =
        Number(
            destination?.lat
        );


    const destinationLng =
        Number(
            destination?.lng
        );


    if (
        !Number.isFinite(destinationLat) ||
        !Number.isFinite(destinationLng)
    ) {

        console.error(
            "❌ Invalid route destination:",
            destination
        );


        setText(
            "routeStatus",
            "Invalid pickup location"
        );

        return;
    }


    /* -----------------------------------------
       DUPLICATE REQUEST PROTECTION
       ----------------------------------------- */

    if (
        recyclingRouteRequestRunning
    ) {

        console.log(
            "⏳ Route request already running."
        );

        return;
    }


    /* -----------------------------------------
       REQUEST INTERVAL
       ----------------------------------------- */

    const now =
        Date.now();


    if (
        now -
        recyclingLastRouteTime <
        5000
    ) {

        console.log(
            "⏳ Waiting before next route request."
        );

        return;
    }


    recyclingLastRouteTime =
        now;


    recyclingRouteRequestRunning =
        true;


    setText(
        "routeStatus",
        "Calculating route..."
    );


    console.log(
        "📍 Origin:",
        {
            lat:
            originLat,

            lng:
            originLng
        }
    );


    console.log(
        "📍 Destination:",
        {
            lat:
            destinationLat,

            lng:
            destinationLng
        }
    );


    try {

        /* =====================================================
           LOAD ROUTES LIBRARY
           ===================================================== */

        const {
            Route
        } =
            await google.maps.importLibrary(
                "routes"
            );


        if (
            !Route ||
            typeof Route.computeRoutes !==
            "function"
        ) {

            throw new Error(
                "Google Routes API is not available."
            );
        }


        /* =====================================================
           ROUTE REQUEST

           IMPORTANT:
           ----------------
           DO NOT USE:

           languageCode

           Use:

           language

           if localization is required.

           Here we don't need either.
           ===================================================== */

        const request = {

            origin: {

                lat:
                originLat,

                lng:
                originLng

            },

            destination: {

                lat:
                destinationLat,

                lng:
                destinationLng

            },

            travelMode:
                "DRIVING",

            routingPreference:
                "TRAFFIC_AWARE",

            computeAlternativeRoutes:
                false,

            polylineQuality:
                "HIGH_QUALITY",

            fields: [

                "path",

                "distanceMeters",

                "durationMillis",

                "viewport"

            ]

        };


        console.log(
            "📡 Routes API request:",
            request
        );


        /* =====================================================
           CALL ROUTES API
           ===================================================== */

        const response =
            await Route.computeRoutes(
                request
            );


        console.log(
            "🛣 Routes API response:",
            response
        );


        /* =====================================================
           VALIDATE RESPONSE
           ===================================================== */

        if (
            !response ||
            !response.routes ||
            !response.routes.length
        ) {

            throw new Error(
                "No route was returned by Google."
            );
        }


        const route =
            response.routes[0];


        /* =====================================================
           GET ROUTE PATH
           ===================================================== */

        const path =
            route.path;


        if (
            !Array.isArray(path) ||
            !path.length
        ) {

            console.error(
                "❌ Route path missing:",
                route
            );


            throw new Error(
                "Google returned no route path."
            );
        }


        console.log(
            `✅ Route path contains ${path.length} points`
        );


        /* =====================================================
           REMOVE OLD ROUTE
           ===================================================== */

        if (
            recyclingRoutePolyline
        ) {

            recyclingRoutePolyline.setMap(
                null
            );

            recyclingRoutePolyline =
                null;
        }


        /* =====================================================
           CONVERT ROUTE PATH
           ===================================================== */

        const routePath =
            path.map(
                point => {

                    /*
                     * LatLngAltitude objects support
                     * .lat() / .lng() in some versions
                     * and .lat / .lng in others.
                     */

                    let lat;
                    let lng;


                    if (
                        typeof point.lat ===
                        "function"
                    ) {

                        lat =
                            point.lat();

                    }

                    else {

                        lat =
                            Number(
                                point.lat
                            );

                    }


                    if (
                        typeof point.lng ===
                        "function"
                    ) {

                        lng =
                            point.lng();

                    }

                    else {

                        lng =
                            Number(
                                point.lng
                            );

                    }


                    return {
                        lat,
                        lng
                    };

                }
            )
                .filter(
                    point =>
                        Number.isFinite(
                            point.lat
                        ) &&
                        Number.isFinite(
                            point.lng
                        )
                );


        if (
            !routePath.length
        ) {

            throw new Error(
                "Route path contains invalid coordinates."
            );
        }


        /* =====================================================
           DRAW ROUTE
           ===================================================== */

        recyclingRoutePolyline =
            new google.maps.Polyline(
                {

                    map:
                    recyclingMap,

                    path:
                    routePath,

                    geodesic:
                        true,

                    strokeColor:
                        "#16a34a",

                    strokeOpacity:
                        0.9,

                    strokeWeight:
                        6,

                    clickable:
                        false

                }
            );


        console.log(
            "✅ Route polyline drawn."
        );


        /* =====================================================
           DISTANCE
           ===================================================== */

        const distanceMeters =
            Number(
                route.distanceMeters
            );


        let distanceText =
            "—";


        if (
            Number.isFinite(
                distanceMeters
            )
        ) {

            if (
                distanceMeters <
                1000
            ) {

                distanceText =
                    `${Math.round(
                        distanceMeters
                    )} m`;

            }

            else {

                distanceText =
                    `${(
                        distanceMeters /
                        1000
                    ).toFixed(1)} km`;

            }

        }


        /* =====================================================
           DURATION
           ===================================================== */

        const durationMillis =
            Number(
                route.durationMillis
            );


        let durationText =
            "—";


        if (
            Number.isFinite(
                durationMillis
            )
        ) {

            const totalMinutes =
                Math.ceil(
                    durationMillis /
                    60000
                );


            if (
                totalMinutes <
                60
            ) {

                durationText =
                    `${totalMinutes} min`;

            }

            else {

                const hours =
                    Math.floor(
                        totalMinutes /
                        60
                    );


                const minutes =
                    totalMinutes %
                    60;


                durationText =
                    minutes > 0

                        ? `${hours} hr ${minutes} min`

                        : `${hours} hr`;

            }

        }


        /* =====================================================
           UPDATE DISTANCE
           ===================================================== */

        setText(
            "routeDistance",
            distanceText
        );


        /* =====================================================
           UPDATE DURATION
           ===================================================== */

        setText(
            "routeDuration",
            durationText
        );


        /* =====================================================
           ROUTE STATUS
           ===================================================== */

        setText(
            "routeStatus",
            "Route ready"
        );


        /* =====================================================
           FIT MAP TO ROUTE
           ===================================================== */

        if (
            route.viewport
        ) {

            recyclingMap.fitBounds(
                route.viewport,
                80
            );

        }

        else {

            const bounds =
                new google.maps.LatLngBounds();


            routePath.forEach(
                point => {

                    bounds.extend(
                        point
                    );

                }
            );


            recyclingMap.fitBounds(
                bounds,
                80
            );

        }


        console.log(
            "✅ Recycling route displayed successfully."
        );

    }

    catch (error) {

        console.error(
            "❌ Recycling Routes API error:",
            error
        );


        setText(
            "routeStatus",
            "Route unavailable"
        );


        setText(
            "routeDistance",
            "—"
        );


        setText(
            "routeDuration",
            "—"
        );

    }

    finally {

        recyclingRouteRequestRunning =
            false;

    }

}


/* =========================================================
   CLEAR ROUTE
   ========================================================= */

function clearRoute() {

    selectedTask =
        null;


    if (
        recyclingRoutePolyline
    ) {

        recyclingRoutePolyline.setMap(
            null
        );

        recyclingRoutePolyline =
            null;
    }


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


/* =========================================================
   LOCATION ERROR
   ========================================================= */

function handleLocationError(
    error
) {

    let message =
        "Could not get your location.";


    if (
        error?.code === 1
    ) {

        message =
            "Location permission denied.";

    }

    else if (
        error?.code === 2
    ) {

        message =
            "Location unavailable.";

    }

    else if (
        error?.code === 3
    ) {

        message =
            "Location request timed out.";

    }


    setText(
        "locationStatus",
        message
    );


    console.error(
        "Geolocation error:",
        error
    );

}


/* =========================================================
   HELPER: SET TEXT
   ========================================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (
        element
    ) {

        element.textContent =
            value;

    }

}


/* =========================================================
   HELPER: ESCAPE HTML
   ========================================================= */

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


/* =========================================================
   SHOW WORKER ERROR
   ========================================================= */

function showWorkerError(
    message
) {

    const container =
        document.getElementById(
            "taskContainer"
        );


    if (
        container
    ) {

        container.innerHTML = `
            <div class="glass rounded-3xl p-8 text-red-400">
                ${escapeHtml(message)}
            </div>
        `;

    }

}


/* =========================================================
   PAGE CLEANUP
   ========================================================= */

window.addEventListener(
    "beforeunload",
    function () {

        if (
            watchId !== null
        ) {

            navigator.geolocation.clearWatch(
                watchId
            );

            watchId =
                null;
        }

    }
);