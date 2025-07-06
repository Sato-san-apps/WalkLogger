let intervalId;
let gpxData = '';
let fileName = '';

document.getElementById('startButton').addEventListener('click', startLogging);
document.getElementById('stopButton').addEventListener('click', stopLogging);

function startLogging() {
    document.getElementById('output').innerHTML = "";
    const gpxCheckbox = document.getElementById('gpxCheckbox');
    if (gpxCheckbox.checked) {
        const date = new Date();
        const dateString = date.toISOString().slice(0, 10).replace(/-/g, '');
        let sequence = 1;
        fileName = `${dateString}-${String(sequence).padStart(3, '0')}.gpx`;
        gpxData = `<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="WalkLogger">\n<trk>\n<trkseg>\n`;
    }
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                showPosition(position);
                if (gpxCheckbox.checked) {
                    addGPXPoint(position);
                }
                intervalId = setInterval(() => {
                    navigator.geolocation.getCurrentPosition(pos => {
                        showPosition(pos);
                        if (gpxCheckbox.checked) {
                            addGPXPoint(pos);
                        }
                    }, showError);
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
    output.scrollTop = output.scrollHeight;
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

function addGPXPoint(position) {
    const date = new Date();
    gpxData += `<trkpt lat="${position.coords.latitude}" lon="${position.coords.longitude}">\n` +
               `<ele>${position.coords.altitude !== null ? position.coords.altitude : 0}</ele>\n` +
               `<time>${date.toISOString()}</time>\n</trkpt>\n`;
}

function stopLogging() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
    const gpxCheckbox = document.getElementById('gpxCheckbox');
    if (gpxCheckbox.checked) {
        gpxData += '</trkseg>\n</trk>\n</gpx>';
        downloadGPXFile();
    }
    document.getElementById('output').innerHTML += "Logging stopped.<br><br>";
}

function downloadGPXFile() {
    const blob = new Blob([gpxData], { type: 'application/gpx+xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    document.getElementById('output').innerHTML += `GPXファイルが生成されました: ${fileName}<br>`;
} 