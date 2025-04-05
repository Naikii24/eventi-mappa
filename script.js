// Inizializza la mappa
var map = L.map('map').setView([41.9028, 12.4964], 6); // Italia (Latitudine e Longitudine)

// Aggiungi la mappa di base
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Carica gli eventi da Google Sheets
fetch("https://docs.google.com/spreadsheets/d/1sz5yRujumvBDYH6qGjKUhJ0Q2vBbQe1aZB4pUZg-oSE/gviz/tq?tqx=out:json")
    .then(response => {
        // Controlliamo che la risposta sia ok
        if (!response.ok) {
            throw new Error("Errore nel caricamento dei dati da Google Sheets");
        }
        return response.text();
    })
    .then(data => {
        // A questo punto, i dati sono stati ricevuti correttamente
        let json = JSON.parse(data.substr(47).slice(0, -2));
        // Ciclo attraverso i dati
        json.table.rows.forEach(row => {
            let nome = row.c[0].v;
            let lat = parseFloat(row.c[1].v);
            let lng = parseFloat(row.c[2].v);
            let desc = row.c[3].v;
            let link = row.c[4].v;

            // Aggiungi un marker per ogni evento
            L.marker([lat, lng]).addTo(map)
                .bindPopup(`<b>${nome}</b><br>${desc}<br><a href='${link}' target='_blank'>Biglietti</a>`);
        });
    })
    .catch(err => console.error("Errore nel caricamento dei dati:", err));
