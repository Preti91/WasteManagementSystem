/* =========================================================
   RECYCLEX
   REPORT GARBAGE
   ========================================================= */

let map = null;
let marker = null;

let selectedLatitude = null;
let selectedLongitude = null;
let selectedLocationName = "";


/* =========================================================
   GOOGLE MAP INITIALIZATION
   ========================================================= */

async function initMap() {

    console.log("Google Maps initializing...");

    const mapElement =
        document.getElementById("map");

    if (!mapElement) {
        console.error("#map element not found.");
        return;
    }

    const defaultLocation = {
        lat: 22.5726,
        lng: 88.3639
    };

    map = new google.maps.Map(
        mapElement,
        {
            center: defaultLocation,
            zoom: 13,

            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
            zoomControl: true
        }
    );

    console.log(
        "Google Map loaded successfully."
    );

    marker =
        new google.maps.Marker({
            position: defaultLocation,
            map: map,
            title: "Garbage Report Location"
        });

    await initializePlacesAutocomplete();
}


/* =========================================================
   GOOGLE PLACES API (NEW)
   ========================================================= */

async function initializePlacesAutocomplete() {

    console.log(
        "Initializing Google Places Autocomplete..."
    );

    const container =
        document.getElementById(
            "placeAutocompleteContainer"
        );

    if (!container) {

        console.error(
            "#placeAutocompleteContainer not found."
        );

        return;
    }

    try {

        const {
            PlaceAutocompleteElement
        } = await google.maps.importLibrary(
            "places"
        );

        console.log(
            "Places API loaded successfully."
        );

        const autocomplete =
            new PlaceAutocompleteElement();

        autocomplete.placeholder =
            "Search place, area, street or landmark...";

        autocomplete.includedRegionCodes = [
            "in"
        ];

        container.appendChild(
            autocomplete
        );

        console.log(
            "Google Places search box created."
        );


        /* -------------------------------------------------
           PLACE SELECTED
           ------------------------------------------------- */

        autocomplete.addEventListener(
            "gmp-select",
            async function (event) {

                console.log(
                    "Place selected."
                );

                try {

                    const place =
                        event
                            .placePrediction
                            .toPlace();


                    await place.fetchFields({
                        fields: [
                            "displayName",
                            "formattedAddress",
                            "location"
                        ]
                    });


                    if (!place.location) {

                        showMessage(
                            "Unable to get coordinates for this place.",
                            "error"
                        );

                        return;
                    }


                    /* -----------------------------------------
                       GET LOCATION DATA
                       ----------------------------------------- */

                    selectedLatitude =
                        place.location.lat();

                    selectedLongitude =
                        place.location.lng();

                    selectedLocationName =
                        place.formattedAddress ||
                        place.displayName ||
                        "";


                    console.log(
                        "Location:",
                        selectedLocationName
                    );

                    console.log(
                        "Latitude:",
                        selectedLatitude
                    );

                    console.log(
                        "Longitude:",
                        selectedLongitude
                    );


                    /* -----------------------------------------
                       SAVE LOCATION
                       ----------------------------------------- */

                    const locationElement =
                        document.getElementById(
                            "location"
                        );

                    if (locationElement) {

                        locationElement.value =
                            selectedLocationName;

                    }


                    /* -----------------------------------------
                       SAVE LATITUDE
                       ----------------------------------------- */

                    const latitudeElement =
                        document.getElementById(
                            "latitude"
                        );

                    if (latitudeElement) {

                        latitudeElement.value =
                            selectedLatitude;

                    }


                    /* -----------------------------------------
                       SAVE LONGITUDE
                       ----------------------------------------- */

                    const longitudeElement =
                        document.getElementById(
                            "longitude"
                        );

                    if (longitudeElement) {

                        longitudeElement.value =
                            selectedLongitude;

                    }


                    /* -----------------------------------------
                       MAP POSITION
                       ----------------------------------------- */

                    const position = {

                        lat:
                        selectedLatitude,

                        lng:
                        selectedLongitude

                    };


                    if (map) {

                        map.setCenter(
                            position
                        );

                        map.setZoom(
                            17
                        );

                    }


                    /* -----------------------------------------
                       REMOVE OLD MARKER
                       ----------------------------------------- */

                    if (marker) {

                        marker.setMap(null);

                    }


                    /* -----------------------------------------
                       CREATE NEW MARKER
                       ----------------------------------------- */

                    marker =
                        new google.maps.Marker({

                            position:
                            position,

                            map:
                            map,

                            title:
                                "Garbage Report Location"

                        });


                    /* -----------------------------------------
                       INFO WINDOW
                       ----------------------------------------- */

                    const infoWindow =
                        new google.maps.InfoWindow({

                            content: `

                                <div style="
                                    padding: 8px;
                                    min-width: 220px;
                                ">

                                    <strong>
                                        Garbage Report Location
                                    </strong>

                                    <br><br>

                                    ${escapeHtml(
                                selectedLocationName
                            )}

                                    <br><br>

                                    Latitude:
                                    ${selectedLatitude.toFixed(6)}

                                    <br>

                                    Longitude:
                                    ${selectedLongitude.toFixed(6)}

                                </div>

                            `

                        });


                    infoWindow.open(
                        map,
                        marker
                    );


                    /* -----------------------------------------
                       DISPLAY COORDINATES
                       ----------------------------------------- */

                    displayCoordinates();


                    showMessage(
                        "Location selected successfully.",
                        "success"
                    );

                }

                catch (error) {

                    console.error(
                        "Place selection error:",
                        error
                    );

                    showMessage(
                        "Unable to get selected place details.",
                        "error"
                    );

                }

            }
        );

    }

    catch (error) {

        console.error(
            "Places API initialization error:",
            error
        );

        showMessage(
            "Google Places could not be loaded.",
            "error"
        );

    }

}


/* =========================================================
   CURRENT LOCATION BUTTON
   ========================================================= */

function setupLocationButton() {

    const button =
        document.getElementById(
            "locationButton"
        );

    if (!button) {

        console.warn(
            "#locationButton not found."
        );

        return;
    }

    button.addEventListener(
        "click",
        getCurrentLocation
    );

}


/* =========================================================
   GET CURRENT GPS LOCATION
   ========================================================= */

function getCurrentLocation() {

    console.log(
        "Getting current location..."
    );


    if (!navigator.geolocation) {

        showMessage(
            "Geolocation is not supported by your browser.",
            "error"
        );

        return;
    }


    const button =
        document.getElementById(
            "locationButton"
        );


    if (button) {

        button.disabled = true;

        button.textContent =
            "📍 Getting Location...";

    }


    navigator.geolocation.getCurrentPosition(

        function (position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;

            const accuracy =
                position.coords.accuracy;


            console.log(
                "Latitude:",
                latitude
            );

            console.log(
                "Longitude:",
                longitude
            );

            console.log(
                "Accuracy:",
                accuracy
            );


            selectedLatitude =
                latitude;

            selectedLongitude =
                longitude;


            /*
             * GPS does not automatically give us
             * a readable address.
             *
             * We will add Geocoding API later.
             */

            selectedLocationName =
                "Current GPS Location";


            /* -----------------------------------------
               SAVE LATITUDE
               ----------------------------------------- */

            const latitudeElement =
                document.getElementById(
                    "latitude"
                );

            if (latitudeElement) {

                latitudeElement.value =
                    latitude;

            }


            /* -----------------------------------------
               SAVE LONGITUDE
               ----------------------------------------- */

            const longitudeElement =
                document.getElementById(
                    "longitude"
                );

            if (longitudeElement) {

                longitudeElement.value =
                    longitude;

            }


            /* -----------------------------------------
               SAVE LOCATION NAME
               ----------------------------------------- */

            const locationElement =
                document.getElementById(
                    "location"
                );

            if (locationElement) {

                locationElement.value =
                    selectedLocationName;

            }


            /* -----------------------------------------
               CHECK MAP
               ----------------------------------------- */

            if (!map) {

                showMessage(
                    "Google Map is not ready. Please refresh the page.",
                    "error"
                );

                resetLocationButton();

                return;
            }


            const positionOnMap = {

                lat:
                latitude,

                lng:
                longitude

            };


            /* -----------------------------------------
               REMOVE OLD MARKER
               ----------------------------------------- */

            if (marker) {

                marker.setMap(null);

            }


            /* -----------------------------------------
               CREATE GPS MARKER
               ----------------------------------------- */

            marker =
                new google.maps.Marker({

                    position:
                    positionOnMap,

                    map:
                    map,

                    title:
                        "Current GPS Location"

                });


            /* -----------------------------------------
               INFO WINDOW
               ----------------------------------------- */

            const infoWindow =
                new google.maps.InfoWindow({

                    content: `

                        <div style="
                            padding: 8px;
                            min-width: 220px;
                        ">

                            <strong>
                                Current GPS Location
                            </strong>

                            <br><br>

                            Latitude:
                            ${latitude.toFixed(6)}

                            <br>

                            Longitude:
                            ${longitude.toFixed(6)}

                            <br>

                            Accuracy:
                            ${Math.round(accuracy)} meters

                        </div>

                    `

                });


            infoWindow.open(
                map,
                marker
            );


            /* -----------------------------------------
               CENTER MAP
               ----------------------------------------- */

            map.setCenter(
                positionOnMap
            );

            map.setZoom(
                17
            );


            /* -----------------------------------------
               DISPLAY COORDINATES
               ----------------------------------------- */

            displayCoordinates(
                `Current GPS Location`
            );


            resetLocationButton();


            showMessage(
                "Current location selected successfully.",
                "success"
            );

        },


        /* ---------------------------------------------
           GPS ERROR
           --------------------------------------------- */

        function (error) {

            console.error(
                "Location error:",
                error
            );


            let message =
                "Unable to get your location.";


            switch (error.code) {

                case error.PERMISSION_DENIED:

                    message =
                        "Location permission was denied. Please allow location access.";

                    break;


                case error.POSITION_UNAVAILABLE:

                    message =
                        "Location information is unavailable.";

                    break;


                case error.TIMEOUT:

                    message =
                        "Location request timed out.";

                    break;


                default:

                    message =
                        "An unknown location error occurred.";

            }


            showMessage(
                message,
                "error"
            );


            resetLocationButton();

        },


        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }

    );

}


/* =========================================================
   RESET LOCATION BUTTON
   ========================================================= */

function resetLocationButton() {

    const button =
        document.getElementById(
            "locationButton"
        );

    if (!button) {
        return;
    }

    button.disabled = false;

    button.textContent =
        "📍 Use My Current Location";

}


/* =========================================================
   DISPLAY COORDINATES
   ========================================================= */

function displayCoordinates(
    title = selectedLocationName
) {

    const coordinates =
        document.getElementById(
            "coordinates"
        );

    if (!coordinates) {
        return;
    }


    if (
        selectedLatitude === null ||
        selectedLongitude === null
    ) {

        coordinates.innerHTML =
            "No location selected.";

        return;

    }


    coordinates.innerHTML = `

        <strong>
            ${escapeHtml(title)}
        </strong>

        <br><br>

        Latitude:
        ${selectedLatitude.toFixed(6)}

        <br>

        Longitude:
        ${selectedLongitude.toFixed(6)}

    `;

}


/* =========================================================
   SUBMIT GARBAGE REPORT
   ========================================================= */

async function submitReport(event) {

    event.preventDefault();

    console.log(
        "Submitting garbage report..."
    );


    /* -----------------------------------------
       FORM ELEMENTS
       ----------------------------------------- */

    const wasteTypeElement =
        document.getElementById(
            "wasteType"
        );

    const locationElement =
        document.getElementById(
            "location"
        );

    const descriptionElement =
        document.getElementById(
            "description"
        );

    const latitudeElement =
        document.getElementById(
            "latitude"
        );

    const longitudeElement =
        document.getElementById(
            "longitude"
        );

    const imageElement =
        document.getElementById(
            "image"
        );


    /* -----------------------------------------
       CHECK REQUIRED ELEMENTS
       ----------------------------------------- */

    if (!wasteTypeElement) {

        showMessage(
            "Waste type field not found.",
            "error"
        );

        return;

    }


    if (!locationElement) {

        showMessage(
            "Location field not found.",
            "error"
        );

        return;

    }


    if (!descriptionElement) {

        showMessage(
            "Description field not found.",
            "error"
        );

        return;

    }


    if (!latitudeElement) {

        showMessage(
            "Latitude field not found.",
            "error"
        );

        return;

    }


    if (!longitudeElement) {

        showMessage(
            "Longitude field not found.",
            "error"
        );

        return;

    }


    /* -----------------------------------------
       GET VALUES
       ----------------------------------------- */

    const wasteType =
        wasteTypeElement.value.trim();

    const location =
        locationElement.value.trim();

    const description =
        descriptionElement.value.trim();

    const latitude =
        latitudeElement.value;

    const longitude =
        longitudeElement.value;


    /* -----------------------------------------
       VALIDATE LOCATION
       ----------------------------------------- */

    if (!latitude || !longitude) {

        showMessage(
            "Please select a location from search or use your current location.",
            "error"
        );

        return;

    }


    /* -----------------------------------------
       VALIDATE LOCATION NAME
       ----------------------------------------- */

    if (!location) {

        showMessage(
            "Please select a location.",
            "error"
        );

        return;

    }


    /* -----------------------------------------
       VALIDATE WASTE TYPE
       ----------------------------------------- */

    if (!wasteType) {

        showMessage(
            "Please select waste type.",
            "error"
        );

        return;

    }


    /* -----------------------------------------
       VALIDATE DESCRIPTION
       ----------------------------------------- */

    if (!description) {

        showMessage(
            "Please enter a description.",
            "error"
        );

        return;

    }


    /* -----------------------------------------
       SUBMIT BUTTON
       ----------------------------------------- */

    const submitButton =
        document.getElementById(
            "submitButton"
        );

    if (submitButton) {

        submitButton.disabled = true;

        submitButton.textContent =
            "SUBMITTING...";

    }


    try {

        /* -----------------------------------------
           UPLOAD PHOTO (IF PROVIDED)
           -----------------------------------------
           The <input id="image"> is optional. If the
           user picked a file, we upload it first and
           get back a URL that we attach to the report.
           ----------------------------------------- */

        let imageUrl = null;

        const imageFile =
            imageElement &&
            imageElement.files &&
            imageElement.files.length > 0
                ? imageElement.files[0]
                : null;

        if (imageFile) {

            if (submitButton) {

                submitButton.textContent =
                    "UPLOADING PHOTO...";

            }

            const formData = new FormData();

            formData.append(
                "image",
                imageFile
            );

            const uploadResponse =
                await apiFetch(
                    API.GARBAGE.UPLOAD_IMAGE,
                    {

                        method:
                            "POST",

                        body:
                            formData

                    }
                );

            imageUrl =
                uploadResponse &&
                uploadResponse.imageUrl;

            if (submitButton) {

                submitButton.textContent =
                    "SUBMITTING...";

            }

        }


        const requestBody = {

            wasteType:
            wasteType,

            location:
            location,

            description:
            description,

            latitude:
                Number(latitude),

            longitude:
                Number(longitude),

            imageUrl:
                imageUrl

        };


        console.log(
            "Report data:",
            requestBody
        );


        /* -----------------------------------------
           CHECK API HELPER
           ----------------------------------------- */

        if (
            typeof apiFetch !== "function"
        ) {

            throw new Error(
                "apiFetch() is not defined. Check your API/common JavaScript file."
            );

        }


        if (
            typeof API === "undefined" ||
            !API.GARBAGE ||
            !API.GARBAGE.REPORT
        ) {

            throw new Error(
                "API.GARBAGE.REPORT is not configured."
            );

        }


        /* -----------------------------------------
           SEND TO SPRING BOOT
           ----------------------------------------- */

        const response =
            await apiFetch(

                API.GARBAGE.REPORT,

                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            requestBody
                        )

                }

            );


        console.log(
            "Report response:",
            response
        );


        /* -----------------------------------------
           SUCCESS
           ----------------------------------------- */

        showMessage(
            "Garbage report submitted successfully!",
            "success"
        );


        /* -----------------------------------------
           REDIRECT
           ----------------------------------------- */

        setTimeout(
            function () {

                window.location.href =
                    "/user-dashboard.html";

            },
            1200
        );

    }


    catch (error) {

        console.error(
            "Report submission error:",
            error
        );


        showMessage(
            error.message ||
            "Failed to submit garbage report.",
            "error"
        );


        if (submitButton) {

            submitButton.disabled = false;

            submitButton.textContent =
                "SUBMIT REPORT";

        }

    }

}


/* =========================================================
   SHOW MESSAGE
   ========================================================= */

function showMessage(
    message,
    type = "success"
) {

    const messageElement =
        document.getElementById(
            "message"
        );


    if (!messageElement) {

        console.log(
            message
        );

        return;

    }


    messageElement.textContent =
        message;


    if (type === "success") {

        messageElement.className =
            "text-green-400 mt-4";

    }

    else {

        messageElement.className =
            "text-red-400 mt-4";

    }

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHtml(value) {

    if (!value) {
        return "";
    }

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   PAGE LOAD
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "Report page loaded."
        );


        /* -----------------------------------------
           LOGIN CHECK
           ----------------------------------------- */

        if (
            typeof requireLogin === "function"
        ) {

            requireLogin();

        }


        /* -----------------------------------------
           LOCATION BUTTON
           ----------------------------------------- */

        setupLocationButton();


        /* -----------------------------------------
           REPORT FORM
           ----------------------------------------- */

        const reportForm =
            document.getElementById(
                "reportForm"
            );


        if (reportForm) {

            reportForm.addEventListener(
                "submit",
                submitReport
            );

        }


        /* -----------------------------------------
           PHOTO PREVIEW
           ----------------------------------------- */

        setupImagePreview();

    }
);


/* =========================================================
   PHOTO PREVIEW
   =========================================================
   Shows a live thumbnail of the photo the user picked for
   this garbage report, inside a 3D glass card.
   ========================================================= */

function setupImagePreview() {

    const imageInput =
        document.getElementById(
            "image"
        );

    const previewWrap =
        document.getElementById(
            "imagePreviewWrap"
        );

    const previewImg =
        document.getElementById(
            "imagePreview"
        );

    if (!imageInput || !previewWrap || !previewImg) {

        return;

    }

    imageInput.addEventListener(
        "change",
        function () {

            const file =
                imageInput.files &&
                imageInput.files.length > 0
                    ? imageInput.files[0]
                    : null;

            if (!file) {

                previewWrap.classList.add("hidden");
                previewImg.src = "";

                return;

            }

            const reader = new FileReader();

            reader.onload = function (event) {

                previewImg.src = event.target.result;
                previewWrap.classList.remove("hidden");

            };

            reader.readAsDataURL(file);

        }
    );

}


/* =========================================================
   MAKE INITMAP AVAILABLE TO GOOGLE
   ========================================================= */

window.initMap =
    initMap;