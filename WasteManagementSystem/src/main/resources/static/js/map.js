/* =========================================================
   WASTE MANAGEMENT SYSTEM
   GOOGLE MAPS + LIVE LOCATION + GARBAGE REPORTS + ROUTES
   ========================================================= */


/* =========================================================
   VARIABLES
========================================================= */

let map = null;

let userMarker = null;

let accuracyCircle = null;

let watchId = null;

let reportMarkers = [];

let selectedReport = null;

let AdvancedMarkerElement = null;

let directionsService = null;

let directionsRenderer = null;


/* =========================================================
   DEFAULT KOLKATA LOCATION
========================================================= */

const DEFAULT_LOCATION = {
    lat: 22.5726,
    lng: 88.3639
};


/* =========================================================
   GOOGLE MAPS CALLBACK
========================================================= */

/*
 * IMPORTANT:
 *
 * Your HTML contains:
 *
 * callback=initMap
 *
 * Therefore Google Maps will automatically call
 * this function after the Maps API loads.
 */

async function initMap() {

    console.log("Google Maps API loaded.");

    await initializeMap();

}


/* =========================================================
   INITIALIZE GOOGLE MAP
========================================================= */

async function initializeMap() {

    try {

        /*
         * Load Google Maps library
         */

        const {
            Map
        } = await google.maps.importLibrary("maps");


        /*
         * Load marker library
         */

        const markerLibrary =
            await google.maps.importLibrary("marker");


        AdvancedMarkerElement =
            markerLibrary.AdvancedMarkerElement;


        /*
         * Find map element
         */

        const mapElement =
            document.getElementById("map");


        if (!mapElement) {

            console.error(
                "Map element not found."
            );

            return;

        }


        /*
         * Create Google Map
         */

        map = new Map(

            mapElement,

            {

                center:
                DEFAULT_LOCATION,

                zoom:
                    13,

                /*
                 * Required for AdvancedMarkerElement
                 */

                mapId:
                    "DEMO_MAP_ID",

                mapTypeControl:
                    true,

                streetViewControl:
                    false,

                fullscreenControl:
                    true

            }

        );


        console.log(
            "Google Map initialized successfully."
        );


        /*
         * Directions service + renderer
         *
         * Used to calculate and draw the route from the
         * worker/user location to a selected garbage report.
         */

        directionsService =
            new google.maps.DirectionsService();

        directionsRenderer =
            new google.maps.DirectionsRenderer({

                map:
                    map,

                suppressMarkers:
                    true,

                polylineOptions: {

                    strokeColor:
                        "#2563eb",

                    strokeOpacity:
                        0.9,

                    strokeWeight:
                        6
                }
            });


        /*
         * Setup buttons
         */

        setupButtons();


        /*
         * Check login
         */

        if (
            typeof requireLogin ===
            "function"
        ) {

            requireLogin();

        }


        updateStatus(
            "Map ready. Click My Location."
        );


    }

    catch (error) {

        console.error(
            "Google Maps initialization error:",
            error
        );


        updateStatus(
            "Google Maps could not be loaded."
        );

    }

}


/* =========================================================
   BUTTON SETUP
========================================================= */

function setupButtons() {


    const locationBtn =
        document.getElementById(
            "locationBtn"
        );


    const trackingBtn =
        document.getElementById(
            "trackingBtn"
        );


    const stopBtn =
        document.getElementById(
            "stopBtn"
        );


    const reportBtn =
        document.getElementById(
            "reportBtn"
        );


    /*
     * My Location
     */

    if (locationBtn) {

        locationBtn.addEventListener(
            "click",
            getCurrentLocation
        );

    }


    /*
     * Start Tracking
     */

    if (trackingBtn) {

        trackingBtn.addEventListener(
            "click",
            startTracking
        );

    }


    /*
     * Stop Tracking
     */

    if (stopBtn) {

        stopBtn.addEventListener(
            "click",
            stopTracking
        );

    }


    /*
     * Load Reports
     */

    if (reportBtn) {

        reportBtn.addEventListener(
            "click",
            loadGarbageReports
        );

    }

}


/* =========================================================
   GET CURRENT LOCATION
========================================================= */

function getCurrentLocation() {


    if (!navigator.geolocation) {

        alert(
            "Geolocation is not supported by this browser."
        );

        return;

    }


    updateStatus(
        "Detecting your location..."
    );


    navigator.geolocation.getCurrentPosition(

        position => {

            const {
                latitude,
                longitude,
                accuracy
            } = position.coords;


            showUserLocation(
                latitude,
                longitude,
                accuracy
            );

        },


        error => {

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
   SHOW USER LOCATION
========================================================= */

function showUserLocation(
    latitude,
    longitude,
    accuracy
) {


    const position = {

        lat:
            Number(latitude),

        lng:
            Number(longitude)

    };


    /*
     * Remove previous worker marker
     */

    if (userMarker) {

        userMarker.map = null;

    }


    /*
     * Remove previous accuracy circle
     */

    if (accuracyCircle) {

        accuracyCircle.setMap(null);

    }


    /*
     * Worker marker element
     */

    const markerElement =
        document.createElement(
            "div"
        );


    markerElement.innerHTML =
        "🚛";


    markerElement.style.fontSize =
        "32px";


    /*
     * Create worker marker
     */

    userMarker =
        new AdvancedMarkerElement({

            map:
            map,

            position:
            position,

            title:
                "Worker Current Location",

            content:
            markerElement

        });


    /*
     * Accuracy circle
     */

    accuracyCircle =
        new google.maps.Circle({

            map:
            map,

            center:
            position,

            radius:
                Number(accuracy) || 30,

            strokeColor:
                "#16a34a",

            strokeOpacity:
                0.8,

            strokeWeight:
                2,

            fillColor:
                "#22c55e",

            fillOpacity:
                0.12

        });


    /*
     * Move map to worker
     */

    map.setCenter(
        position
    );


    map.setZoom(
        16
    );


    updateStatus(

        `Worker location: ` +
        `${latitude.toFixed(6)}, ` +
        `${longitude.toFixed(6)} ` +
        `| Accuracy: ${Math.round(accuracy)}m`

    );


    /*
     * Recalculate route if report
     * was already selected
     */

    if (selectedReport) {

        calculateRoute(
            position,
            selectedReport
        );

    }

}


/* =========================================================
   START LIVE TRACKING
========================================================= */

function startTracking() {


    if (watchId !== null) {

        updateStatus(
            "Live tracking is already running."
        );

        return;

    }


    if (!navigator.geolocation) {

        alert(
            "Geolocation is not supported."
        );

        return;

    }


    updateStatus(
        "Starting live location tracking..."
    );


    watchId =
        navigator.geolocation.watchPosition(

            position => {

                const {
                    latitude,
                    longitude,
                    accuracy
                } = position.coords;


                showUserLocation(

                    latitude,

                    longitude,

                    accuracy

                );

            },


            error => {

                handleLocationError(
                    error
                );

            },


            {

                enableHighAccuracy:
                    true,

                maximumAge:
                    3000,

                timeout:
                    15000

            }

        );


    updateStatus(
        "Live tracking started."
    );

}


/* =========================================================
   STOP LIVE TRACKING
========================================================= */

function stopTracking() {


    if (watchId === null) {

        updateStatus(
            "Live tracking is not running."
        );

        return;

    }


    navigator.geolocation.clearWatch(
        watchId
    );


    watchId = null;


    updateStatus(
        "Live tracking stopped."
    );

}


/* =========================================================
   LOAD GARBAGE REPORTS
========================================================= */

async function loadGarbageReports() {


    try {

        updateStatus(
            "Loading garbage reports..."
        );


        /*
         * Check api.js
         */

        if (
            typeof apiFetch !==
            "function"
        ) {

            throw new Error(
                "apiFetch() is not available."
            );

        }


        /*
         * Get reports from Spring Boot
         */

        if (
            typeof API === "undefined" ||
            !API.GARBAGE ||
            !API.GARBAGE.MY_REPORTS
        ) {

            throw new Error(
                "API.GARBAGE.MY_REPORTS is not configured."
            );

        }


        const data =
            await apiFetch(
                API.GARBAGE.MY_REPORTS
            );


        /*
         * Support different response formats
         */

        const reports =
            Array.isArray(data)

                ? data

                : (

                    data?.content ||

                    data?.reports ||

                    data?.data ||

                    []

                );


        /*
         * Remove old markers
         */

        reportMarkers.forEach(
            marker => {

                marker.map = null;

            }
        );


        reportMarkers = [];


        /*
         * Remove old route
         */

        if (directionsRenderer) {

            directionsRenderer.setDirections(
                { routes: [] }
            );

        }


        /*
         * Add markers
         */

        reports.forEach(
            report => {


                const latitude =
                    Number(
                        report.latitude
                    );


                const longitude =
                    Number(
                        report.longitude
                    );


                /*
                 * Ignore invalid coordinates
                 */

                if (

                    !Number.isFinite(
                        latitude
                    )

                    ||

                    !Number.isFinite(
                        longitude
                    )

                ) {

                    return;

                }


                const position = {

                    lat:
                    latitude,

                    lng:
                    longitude

                };


                /*
                 * Garbage icon
                 */

                const garbageElement =
                    document.createElement(
                        "div"
                    );


                garbageElement.innerHTML =
                    "🗑️";


                garbageElement.style.fontSize =
                    "30px";


                /*
                 * Create garbage marker
                 */

                const marker =
                    new AdvancedMarkerElement({

                        map:
                        map,

                        position:
                        position,

                        title:
                            report.wasteType ||
                            "Garbage Report",

                        content:
                        garbageElement

                    });


                /*
                 * Click marker
                 */

                marker.addListener(
                    "click",
                    () => {


                        selectedReport =
                            report;


                        showGarbageInfo(
                            report
                        );


                        /*
                         * Calculate route if
                         * worker location exists
                         */

                        if (

                            userMarker &&

                            userMarker.position

                        ) {


                            const workerPosition = {

                                lat:
                                    Number(
                                        userMarker
                                            .position
                                            .lat
                                    ),

                                lng:
                                    Number(
                                        userMarker
                                            .position
                                            .lng
                                    )

                            };


                            calculateRoute(

                                workerPosition,

                                report

                            );

                        }

                    }
                );


                reportMarkers.push(
                    marker
                );

            }

        );


        updateStatus(

            `Loaded ${reports.length} ` +
            `garbage report(s).`

        );


    }

    catch (error) {

        console.error(
            "Could not load reports:",
            error
        );


        updateStatus(
            "Could not load garbage reports."
        );


        alert(

            "Could not load reports: " +
            error.message

        );

    }

}


/* =========================================================
   SHOW GARBAGE INFORMATION
========================================================= */

function showGarbageInfo(
    report
) {


    const wasteType =
        report.wasteType ||
        "Waste";


    const location =
        report.location ||
        "Unknown location";


    const status =
        report.status ||
        "Unknown";


    const description =
        report.description ||
        "No description";


    const routeStatus =
        document.getElementById(
            "routeStatus"
        );


    if (routeStatus) {

        routeStatus.textContent =

            `Selected: ${wasteType} | ` +
            `${location} | ` +
            `Status: ${status} | ` +
            `${description}`;

    }


    /*
     * Also show information in console
     */

    console.log(
        "Selected garbage report:",
        report
    );

}


/* =========================================================
   CALCULATE ROUTE
========================================================= */

function calculateRoute(
    workerPosition,
    report
) {


    const destination = {

        lat:
            Number(
                report.latitude
            ),

        lng:
            Number(
                report.longitude
            )

    };


    /*
     * Validate destination
     */

    if (

        !Number.isFinite(
            destination.lat
        )

        ||

        !Number.isFinite(
            destination.lng
        )

    ) {

        console.error(
            "Invalid garbage coordinates."
        );

        updateRouteInfo(
            "—",
            "—",
            "Invalid garbage coordinates."
        );

        return;

    }


    /*
     * Directions service must be ready.
     *
     * NOTE: the Google Maps JavaScript API does not expose
     * a "routes" library with Route.computeRoutes() - that
     * method does not exist client-side. The correct,
     * supported way to compute a route in the browser is
     * google.maps.DirectionsService, which is what we use
     * here (same approach as recycling-worker.js).
     */

    if (
        !directionsService ||
        !directionsRenderer
    ) {

        console.error(
            "Directions service is not initialized."
        );

        updateRouteInfo(
            "—",
            "—",
            "Route service is not ready."
        );

        return;

    }


    updateRouteInfo(

        "Calculating...",

        "Calculating...",

        "Calculating route..."

    );


    directionsService.route(

        {

            origin:
                workerPosition,

            destination:
                destination,

            travelMode:
                google.maps.TravelMode.DRIVING,

            provideRouteAlternatives:
                false

        },

        (result, status) => {

            if (

                status !== "OK" ||

                !result ||

                !result.routes ||

                !result.routes.length

            ) {

                console.error(
                    "Directions error:",
                    status,
                    result
                );

                updateRouteInfo(
                    "—",
                    "—",
                    "Could not calculate route."
                );

                return;

            }


            /*
             * Draw the route
             */

            directionsRenderer.setDirections(
                result
            );


            const route =
                result.routes[0];

            const leg =
                route.legs &&
                route.legs[0];


            if (!leg) {

                updateRouteInfo(
                    "—",
                    "—",
                    "Route information unavailable."
                );

                return;

            }


            updateRouteInfo(

                leg.distance?.text ||
                "—",

                leg.duration?.text ||
                "—",

                "Route calculated successfully."

            );


            console.log(
                "Route calculated:",
                route
            );

        }

    );

}


/* =========================================================
   UPDATE ROUTE INFORMATION
========================================================= */

function updateRouteInfo(
    distance,
    duration,
    status
) {


    const distanceElement =
        document.getElementById(
            "routeDistance"
        );


    const durationElement =
        document.getElementById(
            "routeDuration"
        );


    const statusElement =
        document.getElementById(
            "routeStatus"
        );


    if (distanceElement) {

        distanceElement.textContent =
            distance;

    }


    if (durationElement) {

        durationElement.textContent =
            duration;

    }


    if (statusElement) {

        statusElement.textContent =
            status;

    }

}


/* =========================================================
   UPDATE LOCATION STATUS
========================================================= */

function updateStatus(
    message
) {


    const statusElement =
        document.getElementById(
            "locationStatus"
        );


    if (statusElement) {

        statusElement.textContent =
            message;

    }


    console.log(
        message
    );

}


/* =========================================================
   LOCATION ERROR
========================================================= */

function handleLocationError(
    error
) {


    let message =
        "Unable to get your location.";


    if (
        error.code === 1
    ) {

        message =
            "Location permission was denied.";

    }


    else if (
        error.code === 2
    ) {

        message =
            "Your location could not be determined.";

    }


    else if (
        error.code === 3
    ) {

        message =
            "Location request timed out.";

    }


    updateStatus(
        message
    );


    console.error(
        "Location error:",
        error
    );


    alert(
        message
    );

}


/* =========================================================
   CLEANUP WHEN PAGE IS CLOSED
========================================================= */

window.addEventListener(
    "beforeunload",
    () => {

        if (watchId !== null) {

            navigator.geolocation.clearWatch(
                watchId
            );

        }

    }
);