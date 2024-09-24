let map = L.map('map').setView([17.385044, 78.486671], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let vehicleIcon = L.icon({
    iconUrl: 'https://th.bing.com/th?id=OIP.byVfxomNuxwQvNVg8qakoQHaEP&w=330&h=189&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2',  // Update this path if needed
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});

let routeCoordinates = [
    [17.385044, 78.486671], [17.387056, 78.489743], [17.389072, 78.491829],
    [17.391086, 78.494917], [17.393097, 78.497005], [17.395108, 78.499093],
    [17.397119, 78.501181], [17.399130, 78.503269], [17.401141, 78.505357],
    [17.403152, 78.507445], [17.405163, 78.509533], [17.407174, 78.511621],
    [17.409185, 78.513709], [17.411196, 78.515797], [17.413207, 78.517885],
    [17.415218, 78.519973], [17.417229, 78.522061], [17.419240, 78.524149],
    [17.421251, 78.526237], [17.423262, 78.528325], [17.425273, 78.530413],
    [17.427284, 78.532501], [17.429295, 78.534589], [17.431306, 78.536677]
];

let routePolyline = L.polyline(routeCoordinates, { color: 'blue' }).addTo(map);

let vehicleMarker = L.marker(routeCoordinates[0], { icon: vehicleIcon }).addTo(map);

let speed = 500;  // speed in milliseconds
let positionIndex = 0;
let moving = false;
let interval = null;

// Function to start/stop movement and toggle button text
function toggleMovement() {
    let button = document.getElementById('startButton');

    if (!moving) {
        // Start the vehicle movement
        moving = true;
        button.innerText = 'Stop';  // Change button text to 'Stop'

        interval = setInterval(() => {
            vehicleMarker.setLatLng(routeCoordinates[positionIndex]);
            positionIndex = (positionIndex + 1) % routeCoordinates.length;  // Loop back to start
        }, speed);

    } else {
        // Stop the vehicle movement
        moving = false;
        button.innerText = 'Start';  // Change button text back to 'Start'
        clearInterval(interval);  // Stop the movement interval
    }
}

// Add event listener to the Start/Stop button
document.getElementById('startButton').addEventListener('click', toggleMovement);
