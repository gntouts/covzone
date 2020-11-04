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
    let deskItemNode = document.createElement('option');
    let mobItemNode = document.createElement('option');

    deskItemNode.value = item;
    mobItemNode.value = item;
    deskList.appendChild(deskItemNode);
    mobList.appendChild(mobItemNode);
}

function mobGeoSuccess() {
    $('#collapseGeolocation').collapse('hide');
}

function mobGeoError() {
    $('#collapseGeolocation').collapse('hide');
}


function deskGeoSuccess() {
    console.log('geo success - desktop');
}

function deskGeoError() {
    console.log('geo Error - desktop');
}

function collapseAll() {
    $('#collapseZipCode').collapse('hide');
    $('#collapseCounty').collapse('hide');
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
    console.log(counties);
    counties.sort();
    counties.forEach(addToDatalist);
});


document.getElementById('desk-location-button').addEventListener('click', getGeolocation);
document.getElementById('mob-location-button').addEventListener('click', getGeolocation);
document.getElementById('mob-zip-button').addEventListener('click', collapseAll);
document.getElementById('mob-county-button').addEventListener('click', collapseAll);
document.getElementById('mob-location-button').addEventListener('click', collapseAll);




