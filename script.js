document.addEventListener('DOMContentLoaded', function() {
    fetchData();  // Carica i dati solo dopo che la pagina è caricata
});

// Creazione della mappa
var map = L.map('map').setView([41.9028, 12.4964], 6); // Centra l'Italia

// Aggiungi il layer OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Funzione per caricare i dati dal Google Sheet
function fetchData() {
    var url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSsC2LtvXVVBz1ffZqYpSXEUwb2z_27GF0zYLZkABhhcmBHQ8U0axgwoELKeUcGSAZhdWbKopHdvvnA/pub?output=csv';

    fetch(url)
        .then(response => response.text())
        .then(csvText => {
            var data = csvToArray(csvText); // Converte il CSV in array di oggetti
            console.log(data); // Debug: stampa i dati nella console

            data.forEach(entry => {
                var name = entry["Nome Evento"];
                var address = entry["Indirizzo"];
                var place = entry["Nome del Luogo"];
                var description = entry["Descrizione"];
                var ticketLink = entry["Link Biglietti"];
                var eventDate = entry["Data Evento"];

                getCoordinates(place)
                    .then(coords => {
                        if (coords) {
                            var lat = coords.lat;
                            var lon = coords.lon;

                            var popupContent = `
                                <strong>${name}</strong><br>
                                <em>${address}</em><br>
                                <strong>Data:</strong> ${eventDate}<br>
                                <strong>Descrizione:</strong> ${description}<br>
                                <a href="${ticketLink}" target="_blank">Acquista Biglietti</a>
                            `;

                            L.marker([lat, lon]).addTo(map)
                                .bindPopup(popupContent);
                        } else {
                            console.error('Coordinate non trovate per:', name);
                        }
                    })
                    .catch(error => console.error('Errore nel geocoding:', error));
            });
        })
        .catch(error => {
            console.error('Errore nel caricamento dati:', error);
            alert('Errore nel caricamento dei dati.');
        });
}

// Converte CSV in array di oggetti
function csvToArray(csvText) {
    var rows = csvText.split("\n");
    var headers = rows[0].split(",");
    var result = [];

    for (var i = 1; i < rows.length; i++) {
        var obj = {};
        var currentRow = rows[i].split(",");

        for (var j = 0; j < headers.length; j++) {
            obj[headers[j].trim()] = currentRow[j] ? currentRow[j].trim() : "";
        }
        result.push(obj);
    }
    return result;
}

// Funzione per ottenere le coordinate da un nome di luogo
function getCoordinates(place) {
    return new Promise((resolve, reject) => {
        var geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`;

        fetch(geocodeUrl)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    resolve({ lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) });
                } else {
                    reject('Luogo non trovato');
                }
            })
            .catch(error => reject(error));
    });
}
