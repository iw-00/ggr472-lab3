// Add default public map token from Mapbox.
mapboxgl.accessToken = "pk.eyJ1IjoiaXcwMCIsImEiOiJjbTV2aXFlajYwMjZmMmtvbWtrMGRhd3lkIn0.DbEVxhgWv4ANYwpIpCc4iA"; 

// Create map object
const map = new mapboxgl.Map({
    container: "service-map", // Map container ID
    style: "mapbox://styles/mapbox/light-v11", // Style URL from Mapbox for basemap
    center: [-63.115, 44.793], // Starting position [lng, lat] in Toronto
    zoom: 8.8, // Starting zoom level
})


/*--------------------------------------------------------------------
Add mapbox controls as map elements.
--------------------------------------------------------------------*/
// Add search control to map overlay
map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        countries: "ca" // Limit to Canada only
    })
);

// Add zoom and rotation controls to the top left of the map
map.addControl(new mapboxgl.NavigationControl());

// Add fullscreen option to the map
map.addControl(new mapboxgl.FullscreenControl());


/*--------------------------------------------------------------------
Add data layers to map.
--------------------------------------------------------------------*/
map.on("load", () => {

    // Add Litter Bins from Mapbox tileset.
    map.addSource("litter-data", {
        type: "vector",
        url: "mapbox://iw00.6uyo6edm"
    });

    // Draw Litter Bins as points.
    map.addLayer({
        id: "litter-pts",
        type: "circle",
        source: "litter-data",
        // Layer styling.
        paint: {
            "circle-radius": 3,
            // Symbolize points by bin type.
            // Tutorial: https://docs.mapbox.com/mapbox-gl-js/example/data-driven-circle-colors/
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
                "#919191" // Other
            ]

        },
        "source-layer": "Litter_Bins-16v21m"
    });

    //Add another visualization of the polygon of provinces. Note we do not use addsource again
    map.addLayer({
        "id": "litter-hl", //Update id to represent highlighted layer
        "type": "circle",
        "source": "litter-data",
        "paint": {
            "circle-color": "white",
            'circle-stroke-color': 'white'
            // "fill-opacity": 0.5, //Opacity set to 0.5
        },
        "source-layer": "Litter_Bins-16v21m",
        "filter": ["==", ["get", "OBJECTID"], ""] //Set an initial filter to return nothing
    });

})


/*--------------------------------------------------------------------
SIMPLE HOVER EVENT
--------------------------------------------------------------------*/
 map.on("mousemove", "litter-hl", (e) => {
    if (e.features.length > 0) { //if there are features in the event features array (i.e features under the mouse hover) then go into the conditional

        //set the filter of the provinces-hl to display the feature you"re hovering over
        //e.features[0] is the first feature in the array and properties.PRUID is the Province ID for that feature
        map.setFilter("litter-hl", ["==", ["get", "OBJECTID"], e.features[0].properties.OBJECTID]);

    }
 });


/*--------------------------------------------------------------------
ADD POP-UP ON CLICK EVENT
--------------------------------------------------------------------*/
map.on('mouseenter', 'litter-pts', () => {
    map.getCanvas().style.cursor = 'pointer'; //Switch cursor to pointer when mouse is over provterr-fill layer
});

map.on('mouseleave', 'litter-pts', () => {
    map.getCanvas().style.cursor = ''; //Switch cursor back when mouse leaves provterr-fill layer
    // map.setFilter("provterr-hl", ['==', ['get', 'PRUID'], '']); //Reset filter for highlighted layer after mouse leaves feature
});

map.on('click', 'litter-pts', (e) => {
    new mapboxgl.Popup() //Declare new popup object on each click
        .setLngLat(e.lngLat) //Use method to set coordinates of popup based on mouse click location
        .setHTML("Bin Type: " + e.features[0].properties.BTYPE + "<br>" +
            "Owner: " + e.features[0].properties.OWNER + "<br>" +
            "General Location: " + e.features[0].properties.LOCGEN) //Use click event properties to write text for popup
        .addTo(map); //Show popup on map
});