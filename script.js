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

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(serviceWorker => {
            console.log('Service Worker registered');
            window.serviceWorker = serviceWorker
        });
}

window.addEventListener('beforeinstallprompt', e => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
        // don't display install banner when installed
        return e.preventDefault();
    } else {
        const btn = document.querySelector('#install')
        btn.hidden = false;
        btn.onclick = _ => e.prompt();
        return e.preventDefault();
    }
});

function hideMenuDropdowns() {
    $('#navbarDropdownMenuLink2').dropdown('hide');
    $('#navbarDropdownMenuLink1').dropdown('hide');
}

function collapseMenu() {
    $('#navbarNav').collapse('hide');
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

function onGetButtonClick() {
    collapseAll();
    hideMenuDropdowns();
    collapseMenu();
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

$.getJSON('https://covid19clock.herokuapp.com/v1/counties', function(data) {
    let counties = data.counties;
    counties.sort();
    counties.forEach(addToDatalist);
});

$('#modeSelectionAccordion').click(collapseMenu);

document.getElementById('desk-location-button').addEventListener('click', getDataByGeolocation);
document.getElementById('mob-location-button').addEventListener('click', getDataByGeolocation);


document.getElementById('mob-zip-button').addEventListener('click', onGetByZipButtonClick);
document.getElementById('desk-zip-button').addEventListener('click', onGetByZipButtonClick);


document.getElementById('mob-county-button').addEventListener('click', onGetByCountyButtonClick);
document.getElementById('desk-county-button').addEventListener('click', onGetByCountyButtonClick);


document.getElementById('mob-location-button').addEventListener('click', onGetButtonClick);

function onGetByZipButtonClick() {
    onGetButtonClick();
    getDataByZipCode();
}

function onGetByCountyButtonClick() {
    onGetButtonClick();
    getDataByCounty();
}

function getDataByGeolocation() {
    $('#collapseGeolocation').collapse('hide');
    navigator.geolocation.getCurrentPosition(geoSucces, geoError, options);
}

function geoSucces(position) {
    let url = 'https://nominatim.openstreetmap.org/reverse?format=json&lat=' + position.coords.latitude;
    url += '&lon=' + position.coords.longitude;
    $.getJSON(url).done(function(location) {
        let zip = location.address.postcode;
        getCovidDataByZip(zip);
    });
}

function getCovidDataByZip(zip) {
    let covidUrl = 'https://covid19clock.herokuapp.com/v1/zip/';
    covidUrl += zip;
    $.getJSON(covidUrl).done(function(answer) {
        showResult(answer.full_name, answer.name, answer.full_level, answer.color);
    });
}

function getCovidDataByCounty(county) {
    let covidUrl = 'https://covid19clock.herokuapp.com/v1/counties/';
    covidUrl += county;
    $.getJSON(covidUrl).done(function(answer) {
        showResult(answer.full_name, answer.name, answer.full_level, answer.color);
    });
}

function showResult(fullName, name, fullLevel, color) {
    document.getElementById('perioxi').innerText = fullName;
    document.getElementById('status').innerText = fullLevel;

    if (color == 'grey') {
        let color = 'black';
        document.getElementById('perioxi').style.color = 'white';
        document.getElementById('status').style.color = 'white';
        document.getElementById('result-container').style.backgroundColor = color;
    } else if (color == 'red') {
        let color = '#AC242A';
        document.getElementById('perioxi').style.color = 'white';
        document.getElementById('status').style.color = 'white';
        document.getElementById('result-container').style.backgroundColor = color;
    } else {
        let color = '#F6BC26';
        document.getElementById('perioxi').style.color = 'black';
        document.getElementById('status').style.color = 'black';
        document.getElementById('result-container').style.backgroundColor = color;
    }
    document.getElementById('latest-news').href = 'https://news.google.com/search?q=κορωνοϊός ' + name + ' when:2d';
    document.getElementById('result-container').style.display = "block";
}

function geoError(err) {
    document.getElementById('perioxi').innerText = 'ΚΑΝΕΝΑ ΑΠΟΤΕΛΕΣΜΑ';
    document.getElementById('status').innerText = `ERROR(${err.code}): ${err.message}`;
    document.getElementById('perioxi').style.color = 'black';
    document.getElementById('status').style.color = 'black';
    document.getElementById('result-container').style.backgroundColor = 'gray';
    document.getElementById('result-container').style.display = "block";
}

function getDataByZipCode() {
    if (touchDevice) {
        var inputId = 'mob-zip';
    } else {
        var inputId = 'desk-zip';
    }
    let tk = document.getElementById(inputId).value;
    tk = tk.toString();
    getCovidDataByZip(tk);
}

function getDataByCounty() {
    if (touchDevice) {
        var inputId = 'mob-county';
    } else {
        var inputId = 'desk-county';
    }
    let county = document.getElementById(inputId).value;
    getCovidDataByCounty(county);
}

function collapseAll() {
    $('#collapseZipCode').collapse('hide');
    $('#collapseCounty').collapse('hide');
}