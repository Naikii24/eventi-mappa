// Inizializza la mappa
var map = L.map('map').setView([41.9028, 12.4964], 6); // Italia (Latitudine e Longitudine)

// Aggiungi la mappa di base
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Funzione per caricare gli eventi da Google Sheets
fetch("https://docs.google.com/spreadsheets/d/1sz5yRujumvBDYH6qGjKUhJ0Q2vBbQe1aZB4pUZg-oSE/gviz/tq?tqx=out:json")
    .then(res => res.text())
    .then(data => {
        let json = JSON.parse(data.substr(47).slice(0, -2));
        
        // Ottieni la data di oggi
        let today = new Date();
        let startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Inizio settimana (domenica)
        let endOfWeek = new Date(today.setDate(today.getDate() + 6)); // Fine settimana (sabato)
        
        // Filtra gli eventi per la settimana corrente
        let eventsThisWeek = [];
        
        json.table.rows.forEach(row => {
            let nome = row.c[0].v;
            let lat = parseFloat(row.c[1].v);
            let lng = parseFloat(row.c[2].v);
            let desc = row.c[3].v;
            let link = row.c[4].v;
            let date = new Date(row.c[5].v); // Data dell'evento
            
            // Aggiungi evento solo se è nella settimana corrente
            if (date >= startOfWeek && date <= endOfWeek) {
                eventsThisWeek.push({ nome, lat, lng, desc, link, date });
                
                // Aggiungi un marker per ogni evento
                L.marker([lat, lng]).addTo(map)
                    .bindPopup(`<b>${nome}</b><br>${desc}<br><a href='${link}' target='_blank'>Biglietti</a>`);
            }
        });
        
        // Mostra gli eventi della settimana nella lista
        let eventsContainer = document.getElementById('events-container');
        eventsThisWeek.forEach(event => {
            eventsContainer.innerHTML += `
                <li>
                    <b>${event.nome}</b><br>
                    ${event.desc}<br>
                    <a href="${event.link}" target="_blank">Compra i biglietti</a>
                </li>
            `;
        });
    })
    .catch(err => console.error("Errore nel caricamento dei dati:", err));

            // Aggiungi un marker per ogni evento
            L.marker([lat, lng]).addTo(map)
                .bindPopup(`<b>${nome}</b><br>${desc}<br><a href='${link}' target='_blank'>Biglietti</a>`);
        });
    })
    .catch(err => console.error("Errore nel caricamento dei dati:", err));
