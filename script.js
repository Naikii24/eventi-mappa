// Inizializza la mappa
var map = L.map('map').setView([41.9028, 12.4964], 6); // Italia (Latitudine e Longitudine)

// Aggiungi la mappa di base
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Funzione per ottenere i dati CSV
function fetchData() {
    var url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSsC2LtvXVVBz1ffZqYpSXEUwb2z_27GF0zYLZkABhhcmBHQ8U0axgwoELKeUcGSAZhdWbKopHdvvnA/pub?output=csv';

    fetch(url)
        .then(response => response.text())
        .then(csvText => {
            // Converti CSV in array di oggetti
            var data = csvToArray(csvText);
            
            data.forEach(entry => {
                var name = entry["Nome Evento"];
                var address = entry["Indirizzo"];
                var lat = parseFloat(entry["Latitudine"]);
                var lon = parseFloat(entry["Longitudine"]);
                var description = entry["Descrizione"];
                var ticketLink = entry["Link Biglietti"];
                var eventDate = entry["Data Evento"];

                // Crea il contenuto per il popup
                var popupContent = `
                    <strong>${name}</strong><br>
                    <em>${address}</em><br>
                    <strong>Data evento:</strong> ${eventDate}<br>
                    <strong>Descrizione:</strong> ${description}<br>
                    <a href="${ticketLink}" target="_blank">Acquista i biglietti</a>
                `;
                
                // Aggiungi il marker per ogni evento
                var marker = L.marker([lat, lon]).addTo(map)
                    .bindPopup(popupContent);
            });
        })
    .catch(err => console.error("Errore nel caricamento dei dati:", err));

            // Aggiungi un marker per ogni evento
            L.marker([lat, lng]).addTo(map)
                .bindPopup(`<b>${nome}</b><br>${desc}<br><a href='${link}' target='_blank'>Biglietti</a>`);
        });
    })
    .catch(err => console.error("Errore nel caricamento dei dati:", err));
