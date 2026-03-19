// Create map (temporary center)
var map = L.map('map').setView([0, 0], 2);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// Get user location
if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(function(position) {

        var lat = position.coords.latitude;
        var lon = position.coords.longitude;

        // Zoom to user location
        map.setView([lat, lon], 15);

        // Add marker
        L.marker([lat, lon])
            .addTo(map)
            .bindPopup("You are here")
            .openPopup();

    }, function() {
        alert("Location access denied.");
    });

} else {
    alert("Geolocation not supported.");
}

var client;

// Start connection
function startConnection() {

    client = new Paho.MQTT.Client(
        "broker.hivemq.com",
        8884,
        "/mqtt",
        "clientId_" + Math.random()
    );

    client.connect({
        onSuccess: onConnect,
        useSSL: true
    });
}

// When connected
function onConnect() {
    console.log("Connected to MQTT broker");
    client.subscribe("ENGO651/test");
    client.onMessageArrived = onMessageArrived;
}

// End connection
function endConnection() {
    if (client) {
        client.disconnect();
        console.log("Disconnected from MQTT broker");
    }
}

// Receive messages
function onMessageArrived(message) {
    console.log("Message received:", message.payloadString);
}

function shareStatus() {

    if (!client || !client.isConnected()) {
        alert("Please click Start first!");
        return;
    }

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(function(position) {

            var lat = position.coords.latitude;
            var lon = position.coords.longitude;

            // Generate random temperature
            var temp = Math.floor(Math.random() * 70) - 10;

            // Create GeoJSON
            var geojson = {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [lon, lat]
                },
                properties: {
                    temperature: temp
                }
            };

            // Convert to string
            var message = new Paho.MQTT.Message(JSON.stringify(geojson));

            // Set topic (FOLLOW YOUR LAB FORMAT)
            message.destinationName = "ENGO651/WeiHe/my_temperature";

            // Send message
            client.send(message);

            console.log("Message sent:", geojson);

        });

    } else {
        alert("Geolocation not supported.");
    }
}