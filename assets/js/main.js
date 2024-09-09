document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    // Aquí irá el código para la simulación y la recolección de datos
});
let db;
const dbName = 'PhysicsLabDB';

const request = indexedDB.open(dbName, 1);

request.onerror = function(event) {
    console.error("Error al abrir DB:", event.target.error);
};

request.onsuccess = function(event) {
    db = event.target.result;
    cargarNotas();
};

request.onupgradeneeded = function(event) {
    db = event.target.result;
    const objectStore = db.createObjectStore("notas", { keyPath: "id", autoIncrement: true });
};

function agregarNota() {
    const nota = prompt("Ingrese su nota:");
    if (nota) {
        const transaction = db.transaction(["notas"], "readwrite");
        const objectStore = transaction.objectStore("notas");
        const request = objectStore.add({ contenido: nota, fecha: new Date() });

        request.onsuccess = function(event) {
            cargarNotas();
        };
    }
}

function cargarNotas() {
    const notasContainer = document.getElementById('notas-container');
    notasContainer.innerHTML = '';

    const objectStore = db.transaction("notas").objectStore("notas");
    objectStore.openCursor().onsuccess = function(event) {
        const cursor = event.target.result;
        if (cursor) {
            const nota = document.createElement('div');
            nota.textContent = cursor.value.contenido;
            notasContainer.appendChild(nota);
            cursor.continue();
        }
    };
}

document.getElementById('agregar-nota').addEventListener('click', agregarNota);