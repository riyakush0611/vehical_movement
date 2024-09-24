// Initialize the tracking map with a default view
const trackingMap = L.map('tracker-map').setView([17.385044, 78.486671], 13);

// Add base layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(trackingMap);

// Icon for the vehicle (replace the URL with a suitable image)
const vehicleImage = L.icon({
    iconUrl: 'https://th.bing.com/th/id/OIP.0Ijk7_gKShv1aDjiQfxSYAAAAA?w=474&h=484&rs=1',
    iconSize: [64, 64],
    iconAnchor: [32, 32],
});

// Vehicle marker added to the map
const movingVehicle = L.marker([17.385044, 78.486671], { icon: vehicleImage }).addTo(trackingMap);

let pathControl;
let pathPoints = [];

// Replace 'YOUR_MAPBOX_TOKEN' with an actual token
const accessKey = 'sk.gsdvRhgngnhmhmmjiwiYSI6ImNsemp4ZTc0MzB0aDIya3IxMXF1NWJvbzgifQ.E4mLxZLZCph58edgsbgdn8ut';

// Add event listener to display route based on the selected trip
document.getElementById('draw-route').addEventListener('click', () => {
    const selectedJourney = document.getElementById('journey-picker').value;
    let origin, destination;

    switch (selectedJourney) {
        case 'current':
            origin = [17.385044, 78.486671];
            destination = [17.385045, 78.486672];
            break;
        case 'previous-day':
            origin = [17.395044, 78.486671];
            destination = [19.395044, 78.486676];
            break;
        case 'week-before':
            origin = [17.515044, 78.486671];
            destination = [20.765044, 81.486671];
            break;
        default:
            origin = [17.855044, 78.486671];
            destination = [20.925044, 81.486671];
            break;
    }

    // Remove the previous path if exists
    if (pathControl) {
        trackingMap.removeControl(pathControl);
    }

    // Create a new routing path on the map
    pathControl = L.Routing.control({
        waypoints: [
            L.latLng(origin),
            L.latLng(destination)
        ],
        router: L.Routing.mapbox(accessKey),
        routeWhileDragging: true,
        lineOptions: {
            styles: [{ color: 'blue', opacity: 0.8, weight: 5 }]
        }
    }).addTo(trackingMap);

    // Extract route points once path is found
    pathControl.on('routesfound', function (event) {
        pathPoints = event.routes[0].coordinates;
    });

    // Set vehicle marker at the starting point
    movingVehicle.setLatLng(origin);
    trackingMap.panTo(origin);
});

// Add event listener to move vehicle along the path
document.getElementById('activate-movement').addEventListener('click', () => {
    if (pathPoints.length === 0) return; // No movement if no route points available

    const moveDuration = 10000;
    const stepInterval = moveDuration / pathPoints.length;

    let pointIndex = 0;

    // Function to move vehicle step by step
    function moveVehicle() {
        if (pointIndex < pathPoints.length) {
            const newCoords = L.latLng(pathPoints[pointIndex].lat, pathPoints[pointIndex].lng);

            movingVehicle.setLatLng(newCoords); // Update vehicle position
            trackingMap.panTo(newCoords); // Center the map on the moving vehicle

            pointIndex++;
            setTimeout(moveVehicle, stepInterval); // Move after a delay
        }
    }

    moveVehicle(); // Begin the movement
});
