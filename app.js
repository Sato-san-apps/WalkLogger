let intervalId;

document.getElementById('startButton').addEventListener('click', startLogging);
document.getElementById('stopButton').addEventListener('click', stopLogging);

function startLogging() {
    document.getElementById('output').innerHTML = "";
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

function toDegreesMinutesSeconds(coordinate) {
    const absolute = Math.abs(coordinate);
    const degrees = Math.floor(absolute);
    const minutesNotTruncated = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    const seconds = Math.round((minutesNotTruncated - minutes) * 60);
    return `${degrees}°${minutes}'${seconds}"`;
}

function showPosition(position) {
    const output = document.getElementById('output');
    const date = new Date();
    const latitude = toDegreesMinutesSeconds(position.coords.latitude);
    const longitude = toDegreesMinutesSeconds(position.coords.longitude);
    const altitude = position.coords.altitude !== null ? Math.round(position.coords.altitude) : 'N/A';
    output.innerHTML += `北緯: ${latitude}, 東経: ${longitude}, 高度: ${altitude}m, ${date.toLocaleString()}<br>`;
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