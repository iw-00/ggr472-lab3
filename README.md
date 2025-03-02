# GGR472 - Lab 3

Code and data for GGR472 Lab 3: Adding styling and interactivity to web maps with JavaScript.

### Objective

Creating a web map that contains the following:

* A layer with data/symbology that has been classified in some way
* Pop-up windows that appear on a mouse click or hover
* A method that changes the visualization of a layer based on an event
* Map controls and HTML elements
* A legend

## Description

Web map showing inventory of litter bins in Halifax Regional Municipality. Shown as points, classified by General Location and Bin Type. Data from [HRM Open Data](https://data-hrm.hub.arcgis.com/datasets/HRM::litter-bins/about).

Features include:

* Map controls
    * Search, fullscreen, zoom, and pitch options
    * Buttons to zoom to Halifax urban core and to show full map extent
* Map view options
    * Toggle layer visibility
    * Toggle description visibility
    * Select attribute to view (General Location or Bin Type)
* Pop-ups on click showing bin type, general location, owner, and bin material
* Size and stroke of points changing on hover

## Repository Contents

`index.html`: HTML file to render map, geocoder, legend, buttons, checkboxes, and dropdown.

`script.jss`: JavaScript file containing code to add elements to map, add interactivity based on HTML element events.

`style.css`: CSS file for styling and positioning map interface and elements.