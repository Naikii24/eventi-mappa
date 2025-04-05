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
                var lat = parseFloat(entry["Latitudine"]);
                var lon = parseFloat(entry["Longitudine"]);
                var description = entry["Descrizione"];
                var ticketLink = entry["Link Biglietti"];
                var eventDate = entry["Data Evento"];

                // Controlla se le coordinate sono valide (latitudine e longitudine)
                if (!isNaN(lat) && !isNaN(lon)) {
                    // Crea il contenuto del popup con le informazioni dell'evento
                    var popupContent = `
                        <strong>${name}</strong><br>
                        <em>${address}</em><br>
                        <strong>Data evento:</strong> ${eventDate}<br>
                        <strong>Descrizione:</strong> ${description}<br>
                        <a href="${ticketLink}" target="_blank">Acquista i biglietti</a>
                    `;
                    
                    // Crea un marker sulla mappa con le coordinate valide
                    var marker = L.marker([lat, lon]).addTo(map)
                        .bindPopup(popupContent);
                } else {
                    // Se le coordinate non sono valide, logga un errore
                    console.error('Coordinate non valide per l\'evento:', name);
                }
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

// Creazione della mappa
var map = L.map('map').setView([41.9028, 12.4964], 6); // Posizione iniziale: Italia

// Aggiungi il layer di OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Carica i dati
fetchData();
