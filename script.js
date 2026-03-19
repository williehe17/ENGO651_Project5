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

var client = new Paho.MQTT.Client(
    "broker.hivemq.com",
    8884,
    "/mqtt",
    "clientId_" + Math.random()
);

client.connect({
    onSuccess: onConnect,
    useSSL: true
});

function onConnect() {
    console.log("Connected to MQTT broker");

    client.subscribe("ENGO651/test");
}

client.onMessageArrived = function(message) {
    console.log("Message received:", message.payloadString);
};