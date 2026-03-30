# ENGO651 Lab 5 – MQTT GeoWeb Application

## Overview

This project is a simple IoT GeoWeb application built for ENGO651/551 Lab 5. The application uses:

* JavaScript Geolocation API to obtain the user's current location
* MQTT over WebSockets for communication with an MQTT broker
* Leaflet.js to display the location on an interactive map
* GeoJSON messages to share the user's current position and temperature

The app allows a user to connect to an MQTT broker, publish their location and temperature, and automatically display the received data on the map.

---

## Features

* Enter custom MQTT broker host and port
* Start and end MQTT connection
* Automatic reconnection if the connection is lost
* Obtain the user's real-time location through the browser
* Publish a GeoJSON message containing:

  * Current latitude and longitude
  * Random temperature value
* Subscribe to the MQTT topic:

```text
ENGO651/WeiHe/my_temperature
```

* Display received messages on the map using colored markers:

  * Blue: temperature below 10°C
  * Green: temperature between 10°C and 29°C
  * Red: temperature 30°C or above

---

## Technologies Used

* HTML
* CSS
* JavaScript
* Leaflet.js
* Paho MQTT JavaScript Client
* OpenStreetMap

---

## File Structure

```text
├── index.html      # Main webpage
├── style.css       # Page and map styling
├── script.js       # MQTT, geolocation, and map logic
└── README.md
```

---

## How to Run

1. Clone or download this repository.
2. Open `index.html` in a browser.
3. Allow the browser to access your location.
4. Enter the MQTT broker information:

```text
Host: broker.hivemq.com
Port: 8884
```

5. Click **Start** to connect to the broker.
6. Click **Share My Status** to send your location and temperature.
7. The marker will appear on the map after the message is received.

---

## MQTT Topic

The application publishes and subscribes to the following topic:

```text
ENGO651/WeiHe/my_temperature
```

The topic follows the required pattern:

```text
<course code>/<name>/my_temperature
```

---

## Example GeoJSON Message

```json
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [-114.0719, 51.0447]
  },
  "properties": {
    "temperature": 23
  }
}
```

---

## What the Application Does

This application allows the user to:

* Enter a custom MQTT broker host and port
* Connect and disconnect from the MQTT broker using Start and End buttons
* Automatically reconnect if the connection is lost
* Use the browser geolocation API to detect the current location
* Publish the current location together with a randomly generated temperature value
* Send the location and temperature as a GeoJSON message through MQTT
* Display the received location on an interactive Leaflet map
* Change the marker color based on the temperature value:

  * Blue for temperatures below 10°C
  * Green for temperatures from 10°C to 29°C
  * Red for temperatures of 30°C or higher
* Show the temperature inside a popup when the marker is clicked

### MQTT Topic Used

```text
ENGO651/WeiHe/my_temperature
```

### Example Broker Configuration

```text
Host: broker.hivemq.com
Port: 8884
```

### Example GeoJSON Sent by the Application

```json
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [-114.0719, 51.0447]
  },
  "properties": {
    "temperature": 23
  }
}
```

### Temperature Color Rules

```javascript
if (temp < 10) {
    color = "blue";
} else if (temp >= 10 && temp < 30) {
    color = "green";
} else {
    color = "red";
}
```

## Notes

* The browser must allow location access.
* A secure WebSocket MQTT broker is required because the application uses SSL.
* If the broker disconnects, the application will automatically attempt to reconnect after 2 seconds.
* Best tested in Google Chrome.

---

## Author
Wei He – University of Calgary
Wei He
ENGO651/551 – University of Calgary
