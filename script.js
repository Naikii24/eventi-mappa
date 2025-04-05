// Funzione per caricare e visualizzare i dati dal Google Sheets
function fetchData() {
    var url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSsC2LtvXVVBz1ffZqYpSXEUwb2z_27GF0zYLZkABhhcmBHQ8U0axgwoELKeUcGSAZhdWbKopHdvvnA/pub?output=csv'; // URL del CSV

    // Ottieni il CSV dal link
    fetch(url)
        .then(response => {
            // Verifica se la risposta è ok
            if (!response.ok) {
                throw new Error('Errore di rete: ' + response.status);
            }
            return response.text();  // Ottieni il contenuto in formato testo
        })
        .then(csvText => {
            var data = csvToArray(csvText);  // Converte il CSV in un array di oggetti
            console.log(data);  // Stampa i dati per il debug

            // Itera sugli eventi del CSV
            data.forEach(entry => {
                var name = entry["Nome Evento"];
                var address = entry["Indirizzo"];
                var place = entry["Nome del Luogo"];
                var description = entry["Descrizione"];
                var ticketLink = entry["Link Biglietti"];
                var eventDate = entry["Data Evento"];

                // Chiama la funzione per ottenere le coordinate dal nome del luogo
                getCoordinates(place)
                    .then(coords => {
                        if (coords) {
                            var lat = coords.lat;
                            var lon = coords.lon;
                            
                            // Crea il contenuto del popup con le informazioni dell'evento
                            var popupContent = `
                                <strong>${name}</strong><br>
                                <em>${address}</em><br>
                                <strong>Data evento:</strong> ${eventDate}<br>
                                <strong>Descrizione:</strong> ${description}<br>
                                <a href="${ticketLink}" target="_blank">Acquista i biglietti</a>
                            `;
                            
                            // Crea un marker sulla mappa
                            var marker = L.marker([lat, lon]).addTo(map)
                                .bindPopup(popupContent);
                        } else {
                            console.error('Coordinate non trovate per l\'evento:', name);
                        }
                    })
                    .catch(error => {
                        console.error('Errore nel geocoding: ', error);
                    });
            });
        })
        .catch(error => {
            // Gestione degli errori di rete o di parsing
            console.error('Errore nel caricamento dei dati: ', error);
            alert('Errore nel caricamento dei dati. Controlla la console per maggiori dettagli.');
        });
}

// Funzione per convertire il CSV in un array di oggetti
function csvToArray(csvText) {
    var rows = csvText.split("\n");
    var headers = rows[0].split(",");
    var result = [];

    for (var i = 1; i < rows.length; i++) {
        var obj = {};
        var currentRow = rows[i].split(",");
        
        // Crea un oggetto per ogni riga
        for (var j = 0; j < headers.length; j++) {
            obj[headers[j].trim()] = currentRow[j].trim();
        }
        
        result.push(obj);
    }
    return result;
}

// Funzione per ottenere le coordinate tramite Geocoding (Nominatim API)
function getCoordinates(place) {
    return new Promise((resolve, reject) => {
        var geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`;
        
        fetch(geocodeUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    // Restituisce le prime coordinate trovate
                    resolve({
                        lat: parseFloat(data[0].lat),
                        lon: parseFloat(data[0].lon)
                    });
                } else {
                    reject('Luogo non trovato');
                }
            })
            .catch(error => {
                reject(error);
            });
    });
}

// Creazione della mappa
var map = L.map('map').setView([41.9028, 12.4964], 6); // Posizione iniziale: Italia

// Aggiungi il layer di OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Carica i dati
fetchData();
