// Add default public map token from Mapbox.
mapboxgl.accessToken = "pk.eyJ1IjoiaXcwMCIsImEiOiJjbTV2aXFlajYwMjZmMmtvbWtrMGRhd3lkIn0.DbEVxhgWv4ANYwpIpCc4iA"; 

// Create map object
const map = new mapboxgl.Map({
    container: "service-map", // Map container ID
    style: "mapbox://styles/mapbox/streets-v12", // Style URL from Mapbox for basemap
    center: [-79.371, 43.715], // Starting position [lng, lat] in Toronto
    zoom: 10 // Starting zoom level
})