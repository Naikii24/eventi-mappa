// Inizializza la mappa
var map = L.map('map').setView([41.9028, 12.4964], 6); // Italia

// Aggiungi la mappa di base
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Esempio di evento
var marker = L.marker([45.4642, 9.1900]).addTo(map) // Milano
    .bindPopup("<b>Concerto Rock</b><br>Stasera alle 21:00<br><a href='#'>Acquista biglietti</a>")
    .openPopup();
