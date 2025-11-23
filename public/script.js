// --- 1. Inicialización del Mapa ---

const initialCoords = [20.5937, -100.3929]; // Coordenadas de ejemplo (Guanajuato, MX)
// Inicializa el mapa con un nivel de zoom más alto (12)
const map = L.map('map').setView(initialCoords, 12); 

// Cargar la capa de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let markers = L.featureGroup().addTo(map); // Grupo para marcadores persistentes
let tempMarker = null; // Variable para el marcador temporal de clic

// --- 2. Lógica de Interacción con el Mapa (Click) ---

function onMapClick(e) {
    // 1. Eliminar el marcador temporal anterior si existe
    if (tempMarker) {
        map.removeLayer(tempMarker);
    }
    
    // 2. Crear un nuevo marcador temporal 
    tempMarker = L.marker(e.latlng).addTo(map);
    
    // 3. Obtener las coordenadas y formatearlas
    const lat = e.latlng.lat.toFixed(6);
    const lng = e.latlng.lng.toFixed(6);
    
    // 4. Llenar automáticamente el formulario (el campo se marcó como readonly en el HTML)
    document.getElementById('latitude').value = lat;
    document.getElementById('longitude').value = lng;
    
    // 5. Reiniciar formulario a modo "Crear"
    document.getElementById('placeId').value = ''; 
    document.getElementById('name').value = '';
    document.getElementById('description').value = '';
    document.getElementById('submitBtn').textContent = 'Guardar Lugar';
    document.getElementById('cancelBtn').style.display = 'none';

    document.getElementById('name').focus(); // Pone el foco para escribir el nombre
}

// Asignar el listener de clic al mapa
map.on('click', onMapClick);

// --- 3. Lógica del CRUD (API Calls) ---

async function loadPlaces() {
    try {
        const response = await fetch('/api/places');
        const places = await response.json();
        
        renderTable(places);
        renderMarkers(places);
    } catch (error) {
        console.error('Error al cargar lugares:', error);
        alert('No se pudieron cargar los lugares. Verifique que el servidor esté corriendo.');
    }
}

async function savePlace(event) {
    event.preventDefault();
    
    const id = document.getElementById('placeId').value;
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;
    
    const method = id ? 'PATCH' : 'POST';
    const url = id ? `/api/places/${id}` : '/api/places';
    
    const data = { name, description, latitude, longitude };
    
    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert(id ? 'Lugar actualizado con éxito.' : 'Lugar creado con éxito.');
            resetForm();
            loadPlaces(); // Recargar la tabla y el mapa
        } else {
            const errorData = await response.json();
            alert(`Error al guardar el lugar: ${errorData.details || errorData.error}`);
        }
    } catch (error) {
        console.error('Error de red:', error);
        alert('Hubo un error de conexión al servidor.');
    }
}

async function deletePlace(id) {
    if (!confirm('¿Estás seguro de que quieres borrar este lugar? ¡Es permanente!')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/places/${id}`, {
            method: 'DELETE',
        });

        if (response.status === 204) {
            alert('Lugar eliminado con éxito.');
            loadPlaces(); // Recargar la tabla y el mapa
        } else if (response.status === 404) {
            alert('Error: Lugar no encontrado.');
        } else {
            alert('Error al eliminar el lugar.');
        }
    } catch (error) {
        console.error('Error de red:', error);
        alert('Hubo un error de conexión al servidor.');
    }
}

// --- 4. Lógica del Frontend (Manipulación de DOM) ---

function renderTable(places) {
    const tbody = document.querySelector('#placesTable tbody');
    tbody.innerHTML = ''; 

    places.forEach(place => {
        const row = document.createElement('tr');
        
        let coords = place.location.coordinates;
        let [longitude, latitude] = coords;

        row.innerHTML = `
            <td>${place._id}</td>
            <td>${place.name}</td>
            <td>${latitude.toFixed(4)} / ${longitude.toFixed(4)}</td>
            <td>${new Date(place.createdAt).toLocaleString()}</td>
            <td>${new Date(place.updatedAt).toLocaleString()}</td>
            <td>
                <button onclick="editPlace('${place._id}', '${place.name}', '${place.description}', ${latitude}, ${longitude})">Editar</button>
                <button onclick="deletePlace('${place._id}')">Borrar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderMarkers(places) {
    markers.clearLayers(); 
    
    places.forEach(place => {
        const [longitude, latitude] = place.location.coordinates;
        
        const marker = L.marker([latitude, longitude]); 
        marker.bindPopup(`<b>${place.name}</b><br>${place.description || 'Sin descripción'}`);
        markers.addLayer(marker);
    });
    
    // Centrar el mapa si hay lugares
    if (places.length > 0) {
        map.fitBounds(markers.getBounds());
    } else {
         map.setView(initialCoords, 12); // Usar zoom inicial si está vacío
    }
}

function editPlace(id, name, description, lat, lon) {
    // 1. Rellenar el formulario
    document.getElementById('placeId').value = id;
    document.getElementById('name').value = name;
    document.getElementById('description').value = description === 'null' ? '' : description;
    document.getElementById('latitude').value = lat;
    document.getElementById('longitude').value = lon;
    
    // 2. Cambiar modo de formulario
    document.getElementById('submitBtn').textContent = 'Actualizar Lugar';
    document.getElementById('cancelBtn').style.display = 'inline';
    
    // 3. Quitar marcador temporal si existe y centrar en el marcador a editar
    if (tempMarker) {
        map.removeLayer(tempMarker);
        tempMarker = null;
    }
    map.setView([lat, lon], map.getZoom());
}

function resetForm() {
    // Quita el marcador temporal de clic
    if (tempMarker) {
        map.removeLayer(tempMarker);
        tempMarker = null; 
    }
    
    document.getElementById('placeForm').reset();
    document.getElementById('placeId').value = '';
    document.getElementById('submitBtn').textContent = 'Guardar Lugar';
    document.getElementById('cancelBtn').style.display = 'none';
}

// --- 5. Event Listeners y Arranque ---

document.getElementById('placeForm').addEventListener('submit', savePlace);
document.getElementById('cancelBtn').addEventListener('click', resetForm);

// Cargar datos al iniciar la aplicación
loadPlaces();