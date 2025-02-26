// Add default public map token from Mapbox.
mapboxgl.accessToken = "pk.eyJ1IjoiaXcwMCIsImEiOiJjbTV2aXFlajYwMjZmMmtvbWtrMGRhd3lkIn0.DbEVxhgWv4ANYwpIpCc4iA"; 

// Create map object
const map = new mapboxgl.Map({
    container: "service-map", // Map container ID
    style: "mapbox://styles/mapbox/streets-v12", // Style URL from Mapbox for basemap
    center: [-79.371, 43.715], // Starting position [lng, lat] in Toronto
    zoom: 10 // Starting zoom level
})

map.on("load", () => {

    // Add green space data from Mapbox tileset.
    map.addSource("green-space-data", {
        type: "vector",
        url: "mapbox://iw00.1c0ufy8s"
    });

    // Draw green spaces.
    map.addLayer({
        id: "green-space",
        type: "fill",
        source: "green-space-data",
        // Layer styling.
        paint: {
            "fill-color": "#86D56C",
            "fill-opacity": 0.3,
            "fill-outline-color": "#3F612D"
        },
        "source-layer": "toronto-green-0vll2h"
    });

    // Add ticks as points from GitHub (geojson).
    map.addSource("ticks-data", {
        type: "geojson",
        data: "https://iw-00.github.io/ggr472-lab2-final/data/toronto-ticks.geojson"
    });
    
    // Draw tick points.
    map.addLayer({
        id: "ticks-pts", // Layer ID
        type: "circle", // Draw as points
        source: "ticks-data",
        // Layer styling.
        paint: {
            "circle-radius": 4,
            "circle-color": "#ffd903"
        }
    });



})