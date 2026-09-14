function filterExtensions() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const rows = document.querySelectorAll('#extensionsTable tbody tr');
  let visibleCount = 0;
  rows.forEach(row => {
    const contact = row.cells[0].textContent.toLowerCase();
    const extension = row.cells[1].textContent.toLowerCase();
    if (contact.includes(input) || extension.includes(input)) {
      row.classList.remove('hidden');
      visibleCount++;
    } else if (visibleCount >= 12 && input === '') {
      row.classList.add('hidden');
    } else if (input !== '') {
      row.classList.add('hidden');
    }
  });
}

const bookmarkFileInput = document.getElementById('bookmarkFile');
const bookmarkList = document.getElementById('bookmarkList');
const clearBookmarksBtn = document.getElementById('clearBookmarksBtn');

function loadBookmarks() {
  const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
  bookmarkList.innerHTML = '';
  bookmarks.forEach((bookmark, index) => {
    if (bookmark.url && bookmark.name) {
      const li = document.createElement('li');
      li.className = 'bookmark-item';
      const a = document.createElement('a');
      a.href = bookmark.url;
      a.textContent = bookmark.name;
      a.className = 'bookmark-link';
      a.target = '_blank';
      const img = document.createElement('img');
      img.src = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(bookmark.url)}`;
      img.alt = '';
      img.onerror = () => { img.src = 'https://via.placeholder.com/16'; };
      a.prepend(img);
      const deleteBtn = document.createElement('span');
      deleteBtn.textContent = 'X';
      deleteBtn.className = 'delete-bookmark';
      deleteBtn.onclick = () => deleteBookmark(index);
      li.appendChild(a);
      li.appendChild(deleteBtn);
      bookmarkList.appendChild(li);
    }
  });
  console.log(`Marcadores cargados: ${bookmarks.length}`);
}

function parseBookmarkHTML(html) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const bookmarks = [];

    function extractBookmarks(nodes) {
      Array.from(nodes).forEach(node => {
        if (node.tagName === 'A') {
          const url = node.getAttribute('href');
          const name = node.textContent.trim() || url;
          if (url && url.startsWith('http')) {
            bookmarks.push({ name, url });
          } else {
            console.warn(`Bookmark ignorado: URL inválida (${url})`);
          }
        } else if (node.tagName === 'DL' || node.tagName === 'DT') {
          extractBookmarks(node.children);
        }
      });
    }

    const dl = doc.querySelector('dl') || doc.body;
    if (!dl) {
      throw new Error('No se encontró la estructura de marcadores (DL) en el archivo HTML');
    }
    extractBookmarks(dl.children);
    if (bookmarks.length === 0) {
      throw new Error('No se encontraron marcadores válidos en el archivo');
    }
    return bookmarks;
  } catch (error) {
    console.error('Error al parsear el archivo HTML:', error);
    throw error;
  }
}

bookmarkFileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    console.log(`Archivo seleccionado: ${file.name}, tipo: ${file.type}, tamaño: ${file.size} bytes`);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const bookmarks = parseBookmarkHTML(e.target.result);
        console.log(`Marcadores extraídos: ${bookmarks.length}`, bookmarks);
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        loadBookmarks();
        alert(`Se cargaron ${bookmarks.length} marcadores con éxito.`);
      } catch (error) {
        console.error('Error al procesar el archivo:', error);
        alert('Error al cargar el archivo de marcadores. Asegúrate de que sea un archivo HTML válido exportado desde Edge o Chrome.');
      }
    };
    reader.onerror = () => {
      console.error('Error al leer el archivo:', reader.error);
      alert('Error al leer el archivo. Por favor, intenta de nuevo.');
    };
    reader.readAsText(file);
  } else {
    console.warn('No se seleccionó ningún archivo');
    alert('Por favor, selecciona un archivo HTML de marcadores.');
  }
});

function clearBookmarks() {
  if (confirm('¿Estás seguro de que deseas limpiar todos los marcadores?')) {
    localStorage.removeItem('bookmarks');
    bookmarkList.innerHTML = '';
    console.log('Marcadores eliminados de localStorage');
    alert('Marcadores limpiados con éxito.');
  }
}

function deleteBookmark(index) {
  if (confirm('¿Deseas eliminar este marcador?')) {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    bookmarks.splice(index, 1);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    loadBookmarks();
    console.log(`Marcador eliminado en índice ${index}`);
    alert('Marcador eliminado con éxito.');
  }
}

clearBookmarksBtn.addEventListener('click', clearBookmarks);

const notepad = document.getElementById('notepad');

function loadNotes() {
  const savedNotes = localStorage.getItem('notes');
  if (savedNotes) {
    notepad.value = savedNotes;
  }
}

notepad.addEventListener('input', () => {
  localStorage.setItem('notes', notepad.value);
});

function updateParallax() {
  const parallax = document.getElementById('imageParallax');
  const images = parallax.getElementsByClassName('parallax-image');
  let currentIndex = 0;

  setInterval(() => {
    images[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % images.length;
    images[currentIndex].classList.add('active');
  }, 10000); // Cambia cada 10 segundos
}

document.addEventListener('DOMContentLoaded', () => {
  filterExtensions();
  loadBookmarks();
  loadNotes();
  updateParallax();
  // Inicializar la primera imagen como activa
  document.querySelector('.parallax-image').classList.add('active');
});

// 1. Base de datos centralizada
const directorio = [
  { contacto: "Coordinaciones Clínicas", ext: "30224" },
  { contacto: "Administración de Dirección", ext: "30298" },
  { contacto: "Dirección de Experiencia al Cliente", ext: "30155" },
  { contacto: "Dirección de Planificación", ext: "30169" },
  { contacto: "Dirección de Infraestructura", ext: "30180" },
  { contacto: "Calidad", ext: "30154" },
  { contacto: "Dirección de Finanzas", ext: "30190" },
  { contacto: "Terapia Intensiva Adultos", ext: "30251" },
  { contacto: "Terapia Intensiva Neonatal", ext: "30222" },
  { contacto: "Urgencias", ext: "30401" },
  { contacto: "Nutrición", ext: "30262" },
  { contacto: "Farmacovigilancia", ext: "30112" },
  { contacto: "Vigilancia Epidemiológica", ext: "30263" },
  { contacto: "Inhaloterapia", ext: "30266" },
  { contacto: "Clínica Control de Peso", ext: "30267" },
  { contacto: "Terapia Física", ext: "30269" },
  { contacto: "Residencia Médica", ext: "30243" },
  { contacto: "Laboratorio", ext: "30405" },
  { contacto: "Laboratorio Recepción", ext: "30406" },
  { contacto: "Ultrasonido", ext: "30104" },
  { contacto: "Tomografía", ext: "30404" },
  { contacto: "Biomédica", ext: "30410" },
  { contacto: "Archivo Clínico", ext: "30172" },
  { contacto: "Activación de Código", ext: "70" },
  { contacto: "Dalinde Recepción", ext: "10000" },
  { contacto: "HSAI UNIVERSIDAD", ext: "021" },
  { contacto: "HSAI CHAPULTEPEC", ext: "31000" },
  { contacto: "HSAI DEL VALLE", ext: "33100" },
  { contacto: "HSAI PATRIOTISMO", ext: "32057" },
  { contacto: "Quirófano", ext: "30260" },
  { contacto: "Quirófano 2", ext: "30261" },
  { contacto: "Recuperación", ext: "30265" },
  { contacto: "Descanso Médicos", ext: "30252" },
  { contacto: "CEyE", ext: "30262" },
  { contacto: "Coordinación de Enfermería", ext: "30250" },
  { contacto: "Coordinación de Enseñanza", ext: "30266" },
  { contacto: "Supervisión de Enfermería", ext: "30253" },
  { contacto: "Central de Enfermería \"PB\"", ext: "30100" },
  { contacto: "Central de Enfermería \"2A\"", ext: "30200" },
  { contacto: "Central de Enfermería \"2B\"", ext: "30219" },
  { contacto: "Central de Enfermería Cuneros", ext: "30220" },
  { contacto: "Central de Enfermería UCIN", ext: "30222" },
  { contacto: "Central de Enfermería UCIA", ext: "30251" },
  { contacto: "Central de Enfermería Urgencias", ext: "30401" },
  { contacto: "Seguridad Hospitalaria", ext: "30156" },
  { contacto: "Mantenimiento", ext: "30407" },
  { contacto: "Tecnologías de la Información", ext: "30175" },
  { contacto: "Servicios Generales / Ropería", ext: "30201" },
  { contacto: "Vigilancia", ext: "30408" },
  { contacto: "Cafetería", ext: "30400" },
  { contacto: "Cocina", ext: "30411" },
  { contacto: "Relaciones Públicas", ext: "30294" },
  { contacto: "Coordinación de Admisión", ext: "30111" },
  { contacto: "Caja", ext: "30151" },
  { contacto: "Admisión Principal", ext: "30152" },
  { contacto: "Recepción Principal", ext: "30150" },
  { contacto: "Recepción 2", ext: "30199" },
  { contacto: "Recepción Urgencias", ext: "30402" },
  { contacto: "Mesa de Control Aseguradoras", ext: "30174" },
  { contacto: "Recepción Consultorio 1", ext: "30177" },
  { contacto: "Recepción Consultorio 2", ext: "30178" },
  { contacto: "Mesa de Control", ext: "30173" },
  { contacto: "Analista CxC", ext: "30412" },
  { contacto: "Embajador Comercial", ext: "30126" },
  { contacto: "Coordinación de Contabilidad", ext: "30190" },
  { contacto: "Coordinación de Cuentas por Cobrar", ext: "30181" },
  { contacto: "Auxiliar Cuentas por Cobrar", ext: "30182" },
  { contacto: "Contador General", ext: "30167" },
  { contacto: "Contabilidad Egresos", ext: "30170" },
  { contacto: "Contabilidad Ingresos", ext: "30189" },
  { contacto: "Coordinación de Compras", ext: "30165" },
  { contacto: "Compras", ext: "30158" },
  { contacto: "Coordinación de Almacún", ext: "30409" },
  { contacto: "Coordinación de Farmacia", ext: "30259" },
  { contacto: "Almacún de Farmacia", ext: "30227" },
  { contacto: "Coordinación de Capital Humano", ext: "30162" },
  { contacto: "Reclutamiento", ext: "30161" },
  { contacto: "Nóminas", ext: "30166" },
  { contacto: "Sala de Usos Múltiples (SUM)", ext: "30179" },
  { contacto: "Habitación 101", ext: "30101" },
  { contacto: "Habitación 102", ext: "30102" },
  { contacto: "Habitación 103", ext: "30103" },
  { contacto: "Habitación 104", ext: "30104" },
  { contacto: "Habitación 106", ext: "30106" },
  { contacto: "Habitación 107", ext: "30107" },
  { contacto: "Habitación 108", ext: "30108" },
  { contacto: "Habitación 109", ext: "30109" },
  { contacto: "Habitación 110", ext: "30110" },
  { contacto: "Habitación 202", ext: "30202" },
  { contacto: "Habitación 203", ext: "30203" },
  { contacto: "Habitación 204", ext: "30204" },
  { contacto: "Habitación 205", ext: "30205" },
  { contacto: "Habitación 206", ext: "30206" },
  { contacto: "Habitación 207", ext: "30207" },
  { contacto: "Habitación 208", ext: "30208" },
  { contacto: "Habitación 209", ext: "30209" },
  { contacto: "Habitación 210", ext: "30210" },
  { contacto: "Habitación 211", ext: "30211" },
  { contacto: "Habitación 212", ext: "30212" },
  { contacto: "Habitación 213", ext: "30213" },
  { contacto: "Habitación 214", ext: "30214" },
  { contacto: "Habitación 215", ext: "30215" },
  { contacto: "Habitación 216", ext: "30216" },
  { contacto: "Habitación 217", ext: "30217" },
  { contacto: "Habitación 218", ext: "30218" }
];

const tbody = document.getElementById("extensionsBody");
const searchInput = document.getElementById("searchInput");

// 2. Función para renderizar filas
function renderTable(data) {
  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="2" style="text-align:center; color:#888;">No se encontraron contactos</td></tr>`;
    return;
  }
  
  tbody.innerHTML = data.map(item => `
    <tr>
      <td>${item.contacto}</td>
      <td><strong>${item.ext}</strong></td>
    </tr>
  `).join('');
}

// 3. Función de búsqueda (insensible a acentos y mayúsculas)
function filterExtensions() {
  const query = searchInput.value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // Ignora acentos al buscar

  const filtered = directorio.filter(item => {
    const contactoNorm = item.contacto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return contactoNorm.includes(query) || item.ext.includes(query);
  });

  renderTable(filtered);
}

// Event Listeners e inicialización
searchInput.addEventListener("input", filterExtensions);
renderTable(directorio);