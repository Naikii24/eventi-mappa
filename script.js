function fetchData() {
    var url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSsC2LtvXVVBz1ffZqYpSXEUwb2z_27GF0zYLZkABhhcmBHQ8U0axgwoELKeUcGSAZhdWbKopHdvvnA/pub?output=csv';

    fetch(url)
        .then(response => response.text())
        .then(csvText => {
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
        .catch(error => {
            console.error('Errore nel caricamento dei dati: ', error);
            alert('Errore nel caricamento dei dati. Controlla la console per maggiori dettagli.');
        });
}

function csvToArray(csvText) {
    var rows = csvText.split('\n');
    var headers = rows[0].split(',');

    return rows.slice(1).map(function(row) {
        var values = row.split(',');
        var obj = {};
        headers.forEach(function(header, i) {
            obj[header.trim()] = values[i]?.trim(); // Aggiungi ? per evitare errori in caso di valori mancanti
        });
        return obj;
    });
}
