var options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
};

var touchDevice = ('ontouchstart' in document.documentElement);

if (touchDevice) {
    document.getElementById('mob-view').style.display = 'block';
}
else {
    document.getElementById('desk-view').style.display = 'block';
}

function addToDatalist(item) {
    let deskList = document.getElementById('desk-counties');
    let mobList = document.getElementById('mob-counties');
    let itemNode = document.createElement('option');
    itemNode.value = item;
    deskList.appendChild(itemNode);
    mobList.appendChild(itemNode);
}

function mobGeoSuccess() {
    console.log('geo success - mobile');
}

function mobGeoError() {
    console.log('geo Error - mobile');
}


function deskGeoSuccess() {
    console.log('geo success - desktop');
}

function deskGeoError() {
    console.log('geo Error - desktop');
}

function getGeolocation() {
    if (touchDevice) {
        var success = mobGeoSuccess;
        var error = mobGeoError;
    }
    else {
        var success = deskGeoSuccess;
        var error = deskGeoError;
    }
    navigator.geolocation.getCurrentPosition(success, error, options);
}

$.getJSON('https://covid19clock.herokuapp.com/v1/counties', function (data) {
    let counties = data.counties;
    counties.sort();
    counties.forEach(addToDatalist);
});


document.getElementById('desk-location-button').addEventListener('click', getGeolocation);
document.getElementById('mob-location-button').addEventListener('click', getGeolocation);