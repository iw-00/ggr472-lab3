/*------------------------------------------------------------------------------
GGR472 Lab 3: Adding styling and interactivity to web maps with JavaScript.
--------------------------------------------------------------------------------*/

// Add default public map token from Mapbox.
mapboxgl.accessToken = "pk.eyJ1IjoiaXcwMCIsImEiOiJjbTV2aXFlajYwMjZmMmtvbWtrMGRhd3lkIn0.DbEVxhgWv4ANYwpIpCc4iA"; 

/*------------------------------------------------------------------------------
INITIALIZE MAP - Create map object, add mapbox controls and data
--------------------------------------------------------------------------------*/

// Create map object
// ------------------------------------------------------------
const map = new mapboxgl.Map({
    container: "service-map", // Map container ID
    style: "mapbox://styles/mapbox/light-v11", // Style URL from Mapbox for basemap
    center: [-63.115, 44.793], // Starting position [lng, lat]
    zoom: 8.8, // Starting zoom level
})


// Add mapbox controls as elements on map
// ------------------------------------------------------------

// Add zoom and rotation controls to the top left
map.addControl(new mapboxgl.NavigationControl());

// Add fullscreen option
map.addControl(new mapboxgl.FullscreenControl());

// Create geocoder as a variable
const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    countries: "ca" 
});

// Append geocoder variable to goeocoder HTML div to position on page
document.getElementById("geocoder").appendChild(geocoder.onAdd(map));


// Add data layers to map.
// ------------------------------------------------------------
map.on("load", () => {

    // Add Litter Bins from Mapbox tileset.
    map.addSource("litter-data", {
        type: "vector",
        url: "mapbox://iw00.6uyo6edm",
        "promoteId": {"Litter_Bins-16v21m": "OBJECTID"} // use OBJECTID as feature id
    });

    // Draw Litter Bins as points, by bin type.
    map.addLayer({
        id: "litter-pts",
        type: "circle",
        source: "litter-data",
        // Layer styling.
        paint: {
            // Change size based on hover
            "circle-radius": [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                6, // Hover size
                3 // Default size
            ],
            // Symbolize points by bin type.
            "circle-color": [
                "match",
                ["get", "BTYPE"],
                "WIRE", // Wire Mesh
                "#e55e5e",
                "BARR", // Barrel
                "#3bb2d0",
                "DRUM", // Drum
                "#fbb03b",
                "ORNM", // Ornamental
                "#8f72b8",
                "#1f78b4" // Other
            ],
            "circle-opacity": 0.7,
            "circle-stroke-color": "#fff024",
            "circle-stroke-width" : 1.5,
            // Change stroke opacity based on hover
            "circle-stroke-opacity": [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                1, // Hover opacity
                0 // Default opacity
            ],
        },
        "source-layer": "Litter_Bins-16v21m"
    });

    // Draw Litter Bins as points, by general location.
    map.addLayer({
        id: "litter-loc",
        type: "circle",
        source: "litter-data",
        // Layer styling.
        paint: {
            // Change size based on hover
            "circle-radius": [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                6,
                3
            ],
            // Symbolize points by general location.
            "circle-color": [
                "match",
                ["get", "LOCGEN"],
                "ROW", // Right-of-Way
                "#fc9803",
                "OSP", // Open Space Site (Park)
                "#416b31",
                "OSPREC", // Recreation Site
                "#6DD3CE",
                "#A13D63" // Other
            ],
            "circle-opacity": 0.7,
            "circle-stroke-color": "#fff024",
            "circle-stroke-width" : 1.5,
            // Change stroke opacity based on hover
            "circle-stroke-opacity": [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                1,
                0
            ],
        },
        "source-layer": "Litter_Bins-16v21m"
    });

})

/*------------------------------------------------------------------------------
CREATE LEGENDS - for bin type and general location layers
--------------------------------------------------------------------------------*/

// general location legend
// ------------------------------------------------------------
// Declare array variables for labels and colours
const loclegendlabels = [
    "Wire Mesh",
    "Barrel",
    "Drum",
    "Ornamental",
    "Other"
];

const loclegendcolours = [
    "#e55e5e",
    "#3bb2d0",
    "#fbb03b",
    "#8f72b8",
    "#1f78b4"
];

// Declare legend variable using legend div tag
const loclegend = document.getElementById("loc-legend");

// For each layer create a block to put the colour and label in
loclegendlabels.forEach((label, i) => {
    const colour = loclegendcolours[i];

    const item = document.createElement("div"); // each layer gets a "row"
    const key = document.createElement("span"); // add a "key" to the row

    key.className = "legend-key"; // take shape and style properties defined in css
    key.style.backgroundColor = colour; // retrieve background colour from colours array

    const value = document.createElement("span"); // add a value variable to the "row" in the legend
    value.innerHTML = `${label}`; // give the value variable text based on the label

    item.appendChild(key); // add colour circle to the legend row
    item.appendChild(value); // add the label to the legend row

    loclegend.appendChild(item); // add row to the legend
});


// Bin Type legend
// ------------------------------------------------------------
// Declare array variables for labels and colours
const typelegendlabels = [
    "Right-of-Way",
    "Open Space Site (Park)",
    "Recreation Site",
    "Other"
];

const typelegendcolours = [
    "#fc9803",
    "#416b31",
    "#6DD3CE",
    "#A13D63"
];

// Declare legend variable using legend div tag
const typelegend = document.getElementById("type-legend");

// For each layer create a block to put the colour and label in
typelegendlabels.forEach((label, i) => {
    const colour = typelegendcolours[i];

    const item = document.createElement("div"); // each layer gets a "row"
    const key = document.createElement("span"); // add a "key" to the row 

    key.className = "legend-key"; // take shape and style properties defined in css
    key.style.backgroundColor = colour; // retrieve background colour from colours array

    const value = document.createElement("span"); // add a value variable to the "row" in the legend
    value.innerHTML = `${label}`; // give the value variable text based on the label

    item.appendChild(key); //add colour circle to the legend row
    item.appendChild(value); //add the label to the legend row

    typelegend.appendChild(item); // add row to the legend
});

// Show location legend, hide bin type legend.
loclegend.style.display = "none";
typelegend.style.display = "block";


/*------------------------------------------------------------------------------
ADD INTERACTIVITY - Pop-ups, buttons, search bar, options switch layers.
--------------------------------------------------------------------------------*/

// 1) Description toggle.
// ------------------------------------------------------------
let desccheck = document.getElementById("desccheck"); // "Show Description" check status
const description = document.getElementById("description"); // Description object

desccheck.addEventListener("click", () => {
    // If Description button is checked, show description.
    if (desccheck.checked) {
        desccheck.checked = true;
        description.style.display = "block";
    }
    // If not, hide description.
    else {
        description.style.display = "none";
        description.checked = false;
    }
});

// 2) Button to reset map view.
// ------------------------------------------------------------
// When button is clicked, return to default map view.
document.getElementById("returnbutton").addEventListener("click", () => {
    map.flyTo({
        center: [-63.115, 44.793],
        zoom: 8.8,
        essential: true
    });
});

// 3) Button to zoom in on Halifax.
// ------------------------------------------------------------
// When button is clicked, zoom into Halifax urban area.
document.getElementById("zoombutton").addEventListener("click", () => {
    map.flyTo({
        center: [-63.589, 44.650],
        zoom: 12,
        essential: true
    });
});

// 4) Show layer based on dropdown selection
// ------------------------------------------------------------
let layervalue;
let checkedlayer; // use for layer toggle later

document.getElementById("layerfieldset").addEventListener("change",(e) => {   
    layervalue = document.getElementById("layer").value; // get selected layer value

    // if general location layer is selected
    if (layervalue == "General Location") { 
        document.getElementById("layercheck").checked = true; // check "Show Layer" box
        checkedlayer = "litter-loc"
        // turn on visibility of general location layer
        map.setLayoutProperty(
            "litter-loc",
            "visibility",
            "visible"
        );
        // turn off visibility of Bin Type layer
        map.setLayoutProperty(
            "litter-pts",
            "visibility",
            "none"
        );
        loclegend.style.display = "none"; // turn on visibility of general location legend
        typelegend.style.display = "block"; // turn off visibility of Bin Type legend
    } 
    
    // if Bin Type layer is selected
    else if (layervalue == "Bin Type") {
        document.getElementById("layercheck").checked = true; // check "Show Layer" box
        checkedlayer = "litter-pts"
        // turn on visibility of Bin Type layer
        map.setLayoutProperty(
            "litter-pts",
            "visibility",
            "visible"
        );
        // turn off visibility of general location layer
        map.setLayoutProperty(
            "litter-loc",
            "visibility",
            "none"
        );
        typelegend.style.display = "none"; // turn on visibility of Bin Type legend
        loclegend.style.display = "block"; // turn off visibility of general location legend
    }
});


// 5) Add pop-up on click.
// ------------------------------------------------------------

// Add pop-ups for general location layer
// ------------------------------------------

// Switch cursor to pointer when mouse is over litter bin point layer.
map.on("mouseenter", "litter-pts", () => {
    map.getCanvas().style.cursor = "pointer";
});

// Switch cursor back when mouse leaves layer.
map.on("mouseleave", "litter-pts", () => {
    map.getCanvas().style.cursor = ""; // Switch cursor back when mouse leaves litter bins layer
});

map.on("click", "litter-pts", (e) => {
    new mapboxgl.Popup() // Declare new popup object on each click
        .setLngLat(e.lngLat) // Use method to set coordinates of popup based on mouse click location
        .setHTML("<b>Bin Type:</b> " + e.features[0].properties.BTYPE + "<br>" +
            "General Location: " + e.features[0].properties.LOCGEN + "<br>" +
            "Owner: " + e.features[0].properties.OWNER + "<br>" + 
            "Material: " + e.features[0].properties.MAT) // Use click event properties to write text for popup
        .addTo(map); // Show popup on map
});

// Add pop-ups for Bin Type layer
// ------------------------------------------

// Switch cursor to pointer when mouse is over litter bins layer
map.on("mouseenter", "litter-loc", () => {
    map.getCanvas().style.cursor = "pointer"; 
});

// Switch cursor back when mouse leaves litter bins layer
map.on("mouseleave", "litter-loc", () => {
    map.getCanvas().style.cursor = ""; 
});

map.on("click", "litter-loc", (e) => {
    new mapboxgl.Popup() // Declare new popup object on each click
        .setLngLat(e.lngLat) // Use method to set coordinates of popup based on mouse click location
        .setHTML("<b>General Location:</b> " + e.features[0].properties.LOCGEN + "<br>" + 
            "Bin Type: " + e.features[0].properties.BTYPE + "<br>" +
            "Owner: " + e.features[0].properties.OWNER + "<br>" +
            "Material: " + e.features[0].properties.MAT) // Use click event properties to write text for popup
        .addTo(map); // Show popup on map
});

// 6) Toggle layer on and off.
// ------------------------------------------------------------
document.getElementById("layercheck").addEventListener("change", (e) => { // when layer box is unchecked
    // if general location layer is selected, turn off visibility.
    if (checkedlayer == "litter-loc") { 
        map.setLayoutProperty(
            "litter-loc",
            "visibility",
            e.target.checked ? "visible" : "none"
        );
    }
    // if Bin Type layer is selected, turn off visibility.
    else if (checkedlayer == "litter-pts") {
        map.setLayoutProperty( 
            "litter-pts",
            "visibility",
            e.target.checked ? "visible" : "none"
        );
    }

    // otherwise, turn off visibility of both layers.
    else {
        map.setLayoutProperty(
            "litter-loc",
            "visibility",
            e.target.checked ? "visible" : "none"
        );
        map.setLayoutProperty(
            "litter-pts",
            "visibility",
            e.target.checked ? "visible" : "none"
        );
    }
});

// 7) Change appearance of points on hover.
// ------------------------------------------------------------
let binID = null; //Declare initial bin ID as null

// Add hover effect for general location layer
// ------------------------------------------
map.on("mouseenter", "litter-loc", (e) => {
    // console.log(e.features[0].id) // IDs are not unique??? hovering over one point changes appearance of multiple.

    if (e.features.length > 0) { // If there are features in array enter conditional

        if (binID !== null) { // If binID IS NOT NULL set hover feature state back to false to remove size and stroke from previous highlighted point
            map.setFeatureState(
                { source: "litter-data", sourceLayer: "Litter_Bins-16v21m", id: binID },
                { hover: false }
            );
        }

        binID = e.features[0].id; // Update binID to featureID
        map.setFeatureState(
            { source: "litter-data", sourceLayer: "Litter_Bins-16v21m", id: binID },
            { hover: true } // Update hover feature state to TRUE to change size and stroke of point.
        );
    }
});

map.on("mouseleave", "litter-loc", () => { // If mouse leaves the layer, set all hover states to false and binID variable back to null
    if (binID !== null) {
        map.setFeatureState(
            { source: "litter-data", sourceLayer: "Litter_Bins-16v21m", id: binID },
            { hover: false }
        );
    }
    binID = null;
});

// Add hover effect for Bin Type layer
// ------------------------------------------
map.on("mouseenter", "litter-pts", (e) => {
    // console.log(e.features[0].id)
    console.log(e.features[0].properties["OBJECTID"])
    if (e.features.length > 0) { // If there are features in array enter conditional

        if (binID !== null) { // If binID IS NOT NULL set hover feature state back to false to remove size and stroke from previous highlighted polygon
            map.setFeatureState(
                { source: "litter-data", sourceLayer: "Litter_Bins-16v21m", id: binID },
                { hover: false }
            );
        }

        binID = e.features[0].id; //Update binID to featureID
        map.setFeatureState(
            { source: "litter-data", sourceLayer: "Litter_Bins-16v21m", id: binID },
            { hover: true } // Update hover feature state to TRUE to change size and stroke of point.
        );
    }
});

map.on("mouseleave", "litter-pts", () => { // If mouse leaves the layer, set all hover states to false and binID variable back to null
    if (binID !== null) {
        map.setFeatureState(
            { source: "litter-data", sourceLayer: "Litter_Bins-16v21m", id: binID },
            { hover: false }
        );
    }
    binID = null;
});