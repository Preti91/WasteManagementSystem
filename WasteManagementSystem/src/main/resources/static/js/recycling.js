/* =========================================================
   RECYCLEX
   RECYCLING PICKUP
   GOOGLE MAPS + PLACES API
   CURRENT LOCATION
   IMAGE PREVIEW
   JWT AUTHENTICATION
   ========================================================= */


/* =========================================================
   GLOBAL VARIABLES
   ========================================================= */

let recyclingMap = null;
let recyclingMarker = null;
let autocompleteElement = null;


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

let pickupLocationInput;
let latitudeInput;
let longitudeInput;
let locationStatus;


/* =========================================================
   GET JWT TOKEN
   ========================================================= */

function getAuthToken() {

    const token =
        localStorage.getItem("token");

    if (!token) {

        console.error(
            "JWT token not found in localStorage."
        );

    }

    return token;
}


/* =========================================================
   GOOGLE MAP INITIALIZATION
   ========================================================= */

window.initRecyclingMap = async function () {

    console.log("Google Maps loaded");

    try {

        /*
         * Load Google Maps libraries
         */

        const { Map } =
            await google.maps.importLibrary("maps");

        const { AdvancedMarkerElement } =
            await google.maps.importLibrary("marker");

        const { PlaceAutocompleteElement } =
            await google.maps.importLibrary("places");


        /*
         * Get HTML elements
         */

        pickupLocationInput =
            document.getElementById("pickupLocation");

        latitudeInput =
            document.getElementById("latitude");

        longitudeInput =
            document.getElementById("longitude");

        locationStatus =
            document.getElementById("locationStatus");


        /*
         * Check required elements
         */

        if (
            !pickupLocationInput ||
            !latitudeInput ||
            !longitudeInput
        ) {

            console.error(
                "Required location elements were not found."
            );

            return;
        }


        /*
         * Default location
         */

        const defaultLocation = {
            lat: 22.5726,
            lng: 88.3639
        };


        /*
         * Create map
         */

        recyclingMap =
            new Map(
                document.getElementById("recyclingMap"),
                {
                    center: defaultLocation,
                    zoom: 13,

                    mapTypeControl: true,
                    streetViewControl: false,
                    fullscreenControl: true,

                    mapId: "RECYCLEX_MAP"
                }
            );


        /*
         * Create initial marker
         */

        recyclingMarker =
            new AdvancedMarkerElement({
                map: recyclingMap,
                position: defaultLocation,
                title: "Pickup Location"
            });


        /*
         * Set default coordinates
         */

        setCoordinates(
            defaultLocation.lat,
            defaultLocation.lng
        );


        /*
         * NEW PLACE AUTOCOMPLETE
         */

        autocompleteElement =
            new PlaceAutocompleteElement();


        /*
         * Restrict to India
         */

        autocompleteElement.setAttribute(
            "included-region-codes",
            "in"
        );


        /*
         * Placeholder
         */

        autocompleteElement.placeholder =
            "Start typing your pickup address...";


        /*
         * Styling
         */

        autocompleteElement.style.width =
            "100%";

        autocompleteElement.style.display =
            "block";


        /*
         * Replace normal input
         */

        pickupLocationInput.style.display =
            "none";

        pickupLocationInput.parentNode.insertBefore(
            autocompleteElement,
            pickupLocationInput
        );


        /*
         * Place selected event
         */

        autocompleteElement.addEventListener(
            "gmp-select",
            async function (event) {

                try {

                    const placePrediction =
                        event.placePrediction;


                    if (!placePrediction) {

                        console.warn(
                            "No place prediction found."
                        );

                        return;
                    }


                    /*
                     * Convert prediction to Place
                     */

                    const place =
                        placePrediction.toPlace();


                    /*
                     * Request required fields
                     */

                    await place.fetchFields({
                        fields: [
                            "displayName",
                            "formattedAddress",
                            "location"
                        ]
                    });


                    /*
                     * Check location
                     */

                    if (!place.location) {

                        showLocationStatus(
                            "Location coordinates were not found.",
                            "error"
                        );

                        return;
                    }


                    const lat =
                        place.location.lat();

                    const lng =
                        place.location.lng();


                    /*
                     * Address
                     */

                    const address =
                        place.formattedAddress ||
                        place.displayName ||
                        "";


                    /*
                     * Save address
                     */

                    pickupLocationInput.value =
                        address;


                    /*
                     * Coordinates
                     */

                    setCoordinates(
                        lat,
                        lng
                    );


                    /*
                     * Move map
                     */

                    recyclingMap.setCenter({
                        lat: lat,
                        lng: lng
                    });

                    recyclingMap.setZoom(17);


                    /*
                     * Move marker
                     */

                    recyclingMarker.position = {
                        lat: lat,
                        lng: lng
                    };


                    /*
                     * Status
                     */

                    showLocationStatus(
                        "📍 Location selected successfully.",
                        "success"
                    );


                    console.log(
                        "Selected place:",
                        place
                    );

                    console.log(
                        "Latitude:",
                        lat
                    );

                    console.log(
                        "Longitude:",
                        lng
                    );

                } catch (error) {

                    console.error(
                        "Place selection error:",
                        error
                    );

                    showLocationStatus(
                        "Unable to select this location.",
                        "error"
                    );

                }

            }
        );


        /*
         * Map click
         */

        recyclingMap.addListener(
            "click",
            function (event) {

                if (!event.latLng) {
                    return;
                }


                const lat =
                    event.latLng.lat();

                const lng =
                    event.latLng.lng();


                /*
                 * Update coordinates
                 */

                setCoordinates(
                    lat,
                    lng
                );


                /*
                 * Move marker
                 */

                recyclingMarker.position = {
                    lat: lat,
                    lng: lng
                };


                /*
                 * Move map
                 */

                recyclingMap.panTo({
                    lat: lat,
                    lng: lng
                });


                /*
                 * Reverse geocode
                 */

                reverseGeocode(
                    lat,
                    lng
                );


                showLocationStatus(
                    "📍 Location selected from map.",
                    "success"
                );

            }
        );


        /*
         * Current location button
         */

        const getLocationBtn =
            document.getElementById(
                "getLocationBtn"
            );


        if (getLocationBtn) {

            getLocationBtn.addEventListener(
                "click",
                getCurrentLocation
            );

        }


        /*
         * Image preview
         */

        setupImagePreview();


        /*
         * Recycling form

         */

        setupRecyclingForm();


        /*
         * Load existing requests

         */

        await loadRecyclingRequests();


        console.log(
            "Recycling page initialized successfully."
        );

    } catch (error) {

        console.error(
            "Google Maps initialization error:",
            error
        );

        showLocationStatus(
            "Google Maps could not be loaded.",
            "error"
        );

    }

};


/* =========================================================
   SET COORDINATES
   ========================================================= */

function setCoordinates(lat, lng) {

    if (latitudeInput) {

        latitudeInput.value =
            Number(lat).toFixed(6);

    }

    if (longitudeInput) {

        longitudeInput.value =
            Number(lng).toFixed(6);

    }

}


/* =========================================================
   CURRENT LOCATION
   ========================================================= */

function getCurrentLocation() {

    if (!navigator.geolocation) {

        showLocationStatus(
            "Geolocation is not supported by your browser.",
            "error"
        );

        return;
    }


    showLocationStatus(
        "📍 Getting your current location...",
        "loading"
    );


    navigator.geolocation.getCurrentPosition(

        function (position) {

            const lat =
                position.coords.latitude;

            const lng =
                position.coords.longitude;


            console.log(
                "Current GPS:",
                lat,
                lng
            );


            /*
             * Coordinates
             */

            setCoordinates(
                lat,
                lng
            );


            /*
             * Map
             */

            recyclingMap.setCenter({
                lat: lat,
                lng: lng
            });

            recyclingMap.setZoom(17);


            /*
             * Marker
             */

            recyclingMarker.position = {
                lat: lat,
                lng: lng
            };


            /*
             * Reverse geocode
             */

            reverseGeocode(
                lat,
                lng
            );


            showLocationStatus(
                "📍 Current location detected.",
                "success"
            );

        },

        function (error) {

            console.error(
                "Geolocation error:",
                error
            );


            let message =
                "Unable to get your location.";


            if (error.code === 1) {

                message =
                    "Please allow location permission in your browser.";

            }

            else if (error.code === 2) {

                message =
                    "Your location could not be determined.";

            }

            else if (error.code === 3) {

                message =
                    "Location request timed out.";

            }


            showLocationStatus(
                message,
                "error"
            );

        },

        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }

    );

}


/* =========================================================
   REVERSE GEOCODING
   ========================================================= */

async function reverseGeocode(lat, lng) {

    try {

        const { Geocoder } =
            await google.maps.importLibrary(
                "geocoding"
            );


        const geocoder =
            new Geocoder();


        const response =
            await geocoder.geocode({
                location: {
                    lat: lat,
                    lng: lng
                }
            });


        if (
            response.results &&
            response.results.length > 0
        ) {

            const address =
                response.results[0]
                    .formatted_address;


            pickupLocationInput.value =
                address;


            /*
             * Put address inside
             * autocomplete field if possible
             */

            if (autocompleteElement) {

                const input =
                    autocompleteElement
                        .querySelector("input");

                if (input) {

                    input.value =
                        address;

                }

            }


            console.log(
                "Detected address:",
                address
            );

        }

    } catch (error) {

        console.error(
            "Reverse geocoding error:",
            error
        );

    }

}


/* =========================================================
   LOCATION STATUS
   ========================================================= */

function showLocationStatus(
    message,
    type
) {

    if (!locationStatus) {
        return;
    }


    locationStatus.textContent =
        message;


    locationStatus.className =
        "map-status mb-5";


    if (type === "success") {

        locationStatus.classList.add(
            "text-green-400"
        );

    }

    else if (type === "error") {

        locationStatus.classList.add(
            "text-red-400"
        );

    }

    else {

        locationStatus.classList.add(
            "text-gray-500"
        );

    }

}


/* =========================================================
   IMAGE PREVIEW
   ========================================================= */

function setupImagePreview() {

    const imageInput =
        document.getElementById(
            "wasteImage"
        );

    const previewContainer =
        document.getElementById(
            "imagePreviewContainer"
        );

    const preview =
        document.getElementById(
            "imagePreview"
        );


    if (
        !imageInput ||
        !previewContainer ||
        !preview
    ) {

        return;
    }


    imageInput.addEventListener(
        "change",
        function () {

            const file =
                imageInput.files[0];


            if (!file) {

                previewContainer.classList.add(
                    "hidden"
                );

                preview.src = "";

                return;
            }


            if (!file.type.startsWith("image/")) {

                alert(
                    "Please select an image file."
                );

                imageInput.value = "";

                return;
            }


            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    preview.src =
                        event.target.result;

                    previewContainer.classList.remove(
                        "hidden"
                    );

                };


            reader.readAsDataURL(file);

        }
    );

}


/* =========================================================
   RECYCLING FORM
   ========================================================= */

function setupRecyclingForm() {

    const form =
        document.getElementById(
            "recyclingForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const description =
                document.getElementById(
                    "description"
                ).value.trim();


            const image =
                document.getElementById(
                    "wasteImage"
                ).files[0];


            const pickupLocation =
                pickupLocationInput.value.trim();


            const latitude =
                latitudeInput.value;


            const longitude =
                longitudeInput.value;


            const message =
                document.getElementById(
                    "message"
                );


            const submitButton =
                document.getElementById(
                    "submitRecyclingBtn"
                );


            /*
             * Validation
             */

            if (!description) {

                showMessage(
                    message,
                    "Please describe your waste.",
                    "error"
                );

                return;
            }


            if (!pickupLocation) {

                showMessage(
                    message,
                    "Please select your pickup location.",
                    "error"
                );

                return;
            }


            if (!latitude || !longitude) {

                showMessage(
                    message,
                    "Please select a valid location on the map.",
                    "error"
                );

                return;
            }


            /*
             * GET JWT
             */

            const token =
                getAuthToken();


            if (!token) {

                showMessage(
                    message,
                    "You are not logged in. Please login again.",
                    "error"
                );

                return;
            }


            /*
             * Disable button
             */

            if (submitButton) {

                submitButton.disabled = true;

                submitButton.textContent =
                    "Submitting...";

            }


            try {

                /*
                 * FormData
                 */

                const formData =
                    new FormData();


                formData.append(
                    "description",
                    description
                );


                formData.append(
                    "pickupLocation",
                    pickupLocation
                );


                formData.append(
                    "latitude",
                    latitude
                );


                formData.append(
                    "longitude",
                    longitude
                );


                if (image) {

                    formData.append(
                        "wasteImage",
                        image
                    );

                }


                /*
                 * POST RECYCLING REQUEST
                 *
                 * IMPORTANT:
                 * JWT is sent here.
                 */

                const token = localStorage.getItem("token");

                if (!token) {
                    showMessage(
                        message,
                        "Please login again.",
                        "error"
                    );
                    return;
                }

                const response =
                    await fetch(
                        "/api/recycling/request",
                        {
                            method: "POST",

                            headers: {
                                "Authorization": "Bearer " + token
                            },

                            body: formData
                        }
                    );


                /*
                 * Get response
                 */

                const contentType =
                    response.headers.get(
                        "content-type"
                    );


                let result = null;


                if (
                    contentType &&
                    contentType.includes(
                        "application/json"
                    )
                ) {

                    result =
                        await response.json();

                }

                else {

                    const text =
                        await response.text();

                    result = {
                        message: text
                    };

                }


                console.log(
                    "Recycling response:",
                    result
                );


                /*
                 * Check response
                 */

                if (!response.ok) {

                    if (response.status === 401 ||
                        response.status === 403) {

                        throw new Error(
                            "Authentication failed. Please login again."
                        );

                    }


                    throw new Error(
                        result?.message ||
                        "Unable to submit recycling request."
                    );

                }


                /*
                 * Success
                 */

                showMessage(
                    message,
                    result?.message ||
                    "Recycling pickup request submitted successfully!",
                    "success"
                );


                /*
                 * Reset form
                 */

                form.reset();


                /*
                 * Reset coordinates
                 */

                setCoordinates(
                    22.5726,
                    88.3639
                );


                /*
                 * Reset image preview
                 */

                const previewContainer =
                    document.getElementById(
                        "imagePreviewContainer"
                    );

                const preview =
                    document.getElementById(
                        "imagePreview"
                    );


                if (previewContainer) {

                    previewContainer.classList.add(
                        "hidden"
                    );

                }


                if (preview) {

                    preview.src = "";

                }


                /*
                 * Reload requests
                 */

                await loadRecyclingRequests();

            } catch (error) {

                console.error(
                    "Recycling request error:",
                    error
                );


                showMessage(
                    message,
                    error.message ||
                    "Something went wrong while submitting the request.",
                    "error"
                );

            } finally {

                if (submitButton) {

                    submitButton.disabled = false;

                    submitButton.textContent =
                        "Submit Recycling Request";

                }

            }

        }
    );

}


/* =========================================================
   LOAD MY RECYCLING REQUESTS
   ========================================================= */

async function loadRecyclingRequests() {

    const token =
        getAuthToken();


    if (!token) {

        console.warn(
            "Cannot load recycling requests: JWT token not found."
        );

        return;
    }


    try {

        /*
         * IMPORTANT:
         * JWT is sent here.
         */

        const response =
            await fetch(
                "/api/recycling/my-requests",
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`,

                        "Accept":
                            "application/json"
                    }
                }
            );


        console.log(
            "Recycling requests status:",
            response.status
        );


        /*
         * Authentication error
         */

        if (
            response.status === 401 ||
            response.status === 403
        ) {

            console.error(
                "Recycling requests authentication failed."
            );

            return;
        }


        /*
         * Other errors
         */

        if (!response.ok) {

            throw new Error(
                "Unable to load recycling requests."
            );

        }


        /*
         * Read JSON
         */

        const requests =
            await response.json();


        console.log(
            "My recycling requests:",
            requests
        );


        /*
         * Display requests
         */

        displayRecyclingRequests(
            requests
        );

    } catch (error) {

        console.error(
            "Load requests error:",
            error
        );

    }

}


/* =========================================================
   DISPLAY RECYCLING REQUESTS
   ========================================================= */

function displayRecyclingRequests(requests) {

    /*
     * Try common container IDs.
     */

    const container =
        document.getElementById(
            "recyclingRequests"
        ) ||
        document.getElementById(
            "requestsContainer"
        ) ||
        document.getElementById(
            "myRecyclingRequests"
        );


    if (!container) {

        console.warn(
            "Recycling requests container not found."
        );

        return;
    }


    /*
     * Empty response
     */

    if (
        !requests ||
        !Array.isArray(requests) ||
        requests.length === 0
    ) {

        container.innerHTML = `
            <div class="text-center py-8 text-gray-400">
                No recycling requests found.
            </div>
        `;

        return;
    }


    /*
     * Create request cards
     */

    container.innerHTML =
        requests.map(
            request => {

                const status =
                    request.status ||
                    "PENDING";


                const description =
                    request.description ||
                    "No description";


                const pickupLocation =
                    request.pickupLocation ||
                    request.location ||
                    "Location not available";


                const createdAt =
                    request.createdAt ||
                    request.created_at ||
                    "";


                let dateText =
                    "";


                if (createdAt) {

                    try {

                        dateText =
                            new Date(
                                createdAt
                            ).toLocaleString();

                    } catch (error) {

                        dateText =
                            createdAt;

                    }

                }


                return `
                    <div class="bg-gray-800 rounded-xl p-5 mb-4 border border-gray-700">

                        <div class="flex justify-between items-start gap-4">

                            <div class="flex-1">

                                <h3 class="text-lg font-semibold text-white">
                                    Recycling Request
                                </h3>

                                <p class="text-gray-300 mt-2">
                                    ${escapeHtml(description)}
                                </p>

                                <p class="text-gray-400 text-sm mt-2">
                                    📍 ${escapeHtml(pickupLocation)}
                                </p>

                                ${
                    dateText
                        ? `
                                            <p class="text-gray-500 text-sm mt-2">
                                                ${escapeHtml(dateText)}
                                            </p>
                                          `
                        : ""
                }

                            </div>

                            <span class="
                                px-3
                                py-1
                                rounded-full
                                text-xs
                                font-semibold
                                bg-green-500/20
                                text-green-400
                            ">
                                ${escapeHtml(status)}
                            </span>

                        </div>

                    </div>
                `;

            }
        ).join("");

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHtml(value) {

    if (value === null ||
        value === undefined) {

        return "";

    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   SHOW MESSAGE
   ========================================================= */

function showMessage(
    element,
    message,
    type
) {

    if (!element) {

        alert(message);

        return;
    }


    element.textContent =
        message;


    element.className =
        "mt-4";


    if (type === "success") {

        element.classList.add(
            "text-green-400"
        );

    }

    else if (type === "error") {

        element.classList.add(
            "text-red-400"
        );

    }

    else {

        element.classList.add(
            "text-gray-400"
        );

    }

}