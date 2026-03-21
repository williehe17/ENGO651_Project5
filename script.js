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

function startConnection() {

    const hostInput = document.getElementById("host");
    const portInput = document.getElementById("port");

    const host = hostInput.value;
    const port = parseInt(portInput.value);

    client = new Paho.MQTT.Client(
        host,
        port,
        "/mqtt",
        "clientId_" + Math.random()
    );

    client.onConnectionLost = function(responseObject) {
        console.log("Connection lost");

        alert("Connection lost. Reconnecting...");

        setTimeout(() => {
            startConnection();
        }, 2000);
    };
    
    client.connect({
        onSuccess: onConnect,
        useSSL: true
    });

    // Disable inputs after connection
    hostInput.disabled = true;
    portInput.disabled = true;
}

// When connected
function onConnect() {
    console.log("Connected to MQTT broker");
    client.subscribe("ENGO651/WeiHe/my_temperature");
    client.onMessageArrived = onMessageArrived;
}

function endConnection() {
    if (client) {
        client.disconnect();
    }

    document.getElementById("host").disabled = false;
    document.getElementById("port").disabled = false;
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

            // Random temperature
            var temp = Math.floor(Math.random() * 70) - 10;

            // GeoJSON
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

            var message = new Paho.MQTT.Message(JSON.stringify(geojson));

            message.destinationName = "ENGO651/WeiHe/my_temperature";

            client.send(message);

            console.log("Message sent:", geojson);

        });

    } else {
        alert("Geolocation not supported.");
    }
}

function onMessageArrived(message) {

    console.log("Message received:", message.payloadString);

    // Parse GeoJSON
    var data = JSON.parse(message.payloadString);

    var lon = data.geometry.coordinates[0];
    var lat = data.geometry.coordinates[1];
    var temp = data.properties.temperature;

    // Determine color based on temperature
    var color;

    if (temp < 10) {
        color = "blue";
    } else if (temp >= 10 && temp < 30) {
        color = "green";
    } else {
        color = "red";
    }

    // Add circle marker
    L.circleMarker([lat, lon], {
        radius: 8,
        color: color,
        fillColor: color,
        fillOpacity: 0.8
    })
    .addTo(map)
    .bindPopup("Temperature: " + temp + "°C");
}