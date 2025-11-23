const map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let marker;

map.on('click', function(e) {
    const { lat, lng } = e.latlng;
    document.getElementById('latitude').value = lat;
    document.getElementById('longitude').value = lng;

    if (marker) {
        map.removeLayer(marker);
    }
    marker = L.marker([lat, lng]).addTo(map)
        .bindPopup('ubicaicon seleccionada').openPopup();
});

document.getElementById('place-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const latitude = parseFloat(document.getElementById('latitude').value);
    const longitude = parseFloat(document.getElementById('longitude').value);
    const response = await fetch('/places', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, description, latitude, longitude })
    });

    const data = await response.json();
    alert('Place added successfully!');
    locatuion.reload();
});

async function loadPlaces() {
    const response = await fetch('/places');
    const places = await response.json();
    places.forEach(place => {
        const [lng, lat] = place.location.coordinates;
        L.marker([lat, lng]).addTo(map)
            .bindPopup(`<b>${place.name}</b><br>${place.description}`);
    });
}
loadPlaces();