let intervalId;

document.getElementById('startButton').addEventListener('click', startLogging);
document.getElementById('stopButton').addEventListener('click', stopLogging);

function startLogging() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                showPosition(position);
                intervalId = setInterval(() => {
                    navigator.geolocation.getCurrentPosition(showPosition, showError);
                }, 3000);
            },
            showError
        );
    } else {
        document.getElementById('output').innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    const output = document.getElementById('output');
    const date = new Date();
    output.innerHTML += `Latitude: ${position.coords.latitude}<br>Longitude: ${position.coords.longitude}<br>Timestamp: ${date.toLocaleString()}<br><br>`;
}

function showError(error) {
    const output = document.getElementById('output');
    switch(error.code) {
        case error.PERMISSION_DENIED:
            output.innerHTML = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            output.innerHTML = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            output.innerHTML = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            output.innerHTML = "An unknown error occurred.";
            break;
    }
}

function stopLogging() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
    document.getElementById('output').innerHTML += "Logging stopped.<br><br>";
} 