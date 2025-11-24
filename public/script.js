// 1. INICIALIZAR MAPA
const map = L.map('map').setView([21.1619, -101.6860], 12); // Coordenadas ejemplo (León)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: 'OpenStreetMap'
}).addTo(map);

let markers = L.featureGroup().addTo(map); 
let tempMarker = null; 

// 2. MANEJO DE CLIC EN EL MAPA (Rellena los campos editables)
map.on('click', (e) => {
    const { lat, lng } = e.latlng;

    if (tempMarker) map.removeLayer(tempMarker);
    tempMarker = L.marker([lat, lng]).addTo(map);

    // Llenar inputs (ahora el usuario puede corregirlos si quiere)
    document.getElementById('latitude').value = lat.toFixed(6);
    document.getElementById('longitude').value = lng.toFixed(6);

    resetFormStateForCreate(); // Limpia ID y resetea botones
});

// 3. API CRUD
async function loadPlaces() {
    try {
        const res = await fetch('/api/places');
        const places = await res.json();
        renderTable(places);
        renderMarkers(places);
    } catch (error) {
        console.error("Error cargando lugares:", error);
    }
}

async function savePlace(e) {
    e.preventDefault();
    
    // Obtener valores (ya sea del clic o escritos manualmente)
    const id = document.getElementById('placeId').value;
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const lat = document.getElementById('latitude').value;
    const lng = document.getElementById('longitude').value;

    const data = { 
        name, 
        description, 
        latitude: lat, 
        longitude: lng 
    };

    const url = id ? `/api/places/${id}` : '/api/places';
    const method = id ? 'PATCH' : 'POST';

    try {
        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            resetForm();
            loadPlaces(); 
        } else {
            const err = await res.json();
            alert('Error al guardar: ' + (err.error || 'Desconocido'));
        }
    } catch (error) {
        console.error(error);
        alert('Error de conexión');
    }
}

async function deletePlace(id) {
    if(!confirm('¿Borrar registro permanentemente?')) return;
    await fetch(`/api/places/${id}`, { method: 'DELETE' });
    loadPlaces();
}

// 4. UI RENDER
function renderTable(places) {
    const tbody = document.querySelector('#placesTable tbody');
    tbody.innerHTML = '';

    places.forEach(p => {
        const [lng, lat] = p.location.coordinates;
        const date = new Date(p.updatedAt).toLocaleString(); 

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${p.name}</strong><br><small>${p.description || ''}</small></td>
            <td>${lat.toFixed(4)}, ${lng.toFixed(4)}</td>
            <td>${date}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-warning" onclick="editMode('${p._id}', '${p.name}', '${p.description}', ${lat}, ${lng})">✏️</button>
                <button class="btn btn-sm btn-danger" onclick="deletePlace('${p._id}')">🗑️</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderMarkers(places) {
    markers.clearLayers();
    if(tempMarker) map.removeLayer(tempMarker);

    places.forEach(p => {
        const [lng, lat] = p.location.coordinates;
        L.marker([lat, lng])
         .bindPopup(`<b>${p.name}</b><br>${p.description || ''}`)
         .addTo(markers);
    });
}

// 5. MODOS DE FORMULARIO
function editMode(id, name, desc, lat, lng) {
    // 1. Llenar campos
    document.getElementById('placeId').value = id;
    document.getElementById('name').value = name;
    document.getElementById('description').value = desc === 'undefined' ? '' : desc;
    document.getElementById('latitude').value = lat;
    document.getElementById('longitude').value = lng;

    // 2. Cambiar botones a modo Edición
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.textContent = 'Actualizar Datos';
    submitBtn.classList.remove('btn-success');
    submitBtn.classList.add('btn-warning');
    
    document.getElementById('cancelBtn').style.display = 'inline-block';
    
    // 3. Centrar mapa en el lugar a editar
    map.setView([lat, lng], 15);
    window.scrollTo(0, 0); // Subir para ver formulario
}

function resetFormStateForCreate() {
    document.getElementById('placeId').value = '';
    document.getElementById('name').focus(); // Foco en nombre
    
    // Restaurar botones a modo Crear
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.textContent = 'Guardar Lugar';
    submitBtn.classList.remove('btn-warning');
    submitBtn.classList.add('btn-success');
    
    document.getElementById('cancelBtn').style.display = 'none';
}

function resetForm() {
    document.getElementById('placeForm').reset();
    if(tempMarker) map.removeLayer(tempMarker);
    resetFormStateForCreate();
}

// Event Listeners
document.getElementById('placeForm').addEventListener('submit', savePlace);
document.getElementById('cancelBtn').addEventListener('click', resetForm);

// Inicio
loadPlaces();