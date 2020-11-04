var options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
};

var touchDevice = ('ontouchstart' in document.documentElement);

if (touchDevice) {
    document.getElementById('mob-view').style.display = 'block';
} else {
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
    } else {
        var success = deskGeoSuccess;
        var error = deskGeoError;
    }
    navigator.geolocation.getCurrentPosition(success, error, options);
}

function getPosition(el) {
    var xPos = 0;
    var yPos = 0;

    while (el) {
        if (el.tagName == "BODY") {
            // deal with browser quirks with body/window/document and page scroll
            var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
            var yScroll = el.scrollTop || document.documentElement.scrollTop;

            xPos += (el.offsetLeft - xScroll + el.clientLeft);
            yPos += (el.offsetTop - yScroll + el.clientTop);
        } else {
            // for all other non-BODY elements
            xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
            yPos += (el.offsetTop - el.scrollTop + el.clientTop);
        }

        el = el.offsetParent;
    }
    return {
        x: xPos,
        y: yPos
    };
}
// $.getJSON('https://covid19clock.herokuapp.com/v1/counties', function(data) {
//     let counties = data.counties;
//     counties.sort();
//     counties.forEach(addToDatalist);
// });


document.getElementById('desk-location-button').addEventListener('click', getGeolocation);
document.getElementById('mob-location-button').addEventListener('click', getGeolocation);
document.getElementById('mob-zip-button').addEventListener('click', collapseAll);
document.getElementById('mob-county-button').addEventListener('click', collapseAll);
document.getElementById('mob-location-button').addEventListener('click', collapseAll);

// var resultView = document.getElementById('result-view');
// test = getPosition(resultView).y;
// console.log(test);

// var resDistanceToTop = window.pageYOffset + resultView.getBoundingClientRect().top;
// console.log(resDistanceToTop, window.pageYOffset);
// var avail = window.screen.availHeight;
// console.log(avail);
// resultView.style.minHeight = (avail - resDistanceToTop - resultView.style.marginTop - resultView.style.marginBottom).toString() + 'px';

// var offSet = $('#result-view').offset().top;
// console.log(offSet);

// console.log(avail);

// var remainingHeight = avail - offSet;
// console.log(remainingHeight);
// remainingHeight = remainingHeight.toString() + 'px';
// let res = document.getElementById('result-card');
// res.style.height = remainingHeight;