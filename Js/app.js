const formulario = document.querySelector('.chatbotFormulario')
const mensajeInput = document.getElementById('comentarios');
const modalResultados = new bootstrap.Modal(document.getElementById('modalResultados'));
const resultadosDiv = document.getElementById('resultados');

class Medico {
    constructor(nombre = '', apellido = '', especialidad = '', diasAtencion = '', horario = '') {
        this.nombre = nombre;
        this.apellido = apellido;
        this.especialidad = especialidad;
        this.diasAtencion = diasAtencion;
        this.horario = horario;
    }
}

const medicos = [
    new Medico("Aristides", "Morici", "Ginecología", ["Lunes", "martes", "Miercoles"], "08:00 - 12:00"),
    new Medico("Juliana", "Alvarau", "Ginecología", ["Jueves", "Viernes", "Sabados"], "14:00 - 18:00"),
    new Medico("Aldo", "Zunino", "Traumatología", ["Lunes", "Miercoles", "Viernes"], "10:00 - 16:00"),
    new Medico("Nicolas", "Della Guistina", "Cardiología", ["Lunes", "Miercoles", "Sabados"], "09:00 - 15:00"),
    new Medico("Lucia", "D'Agresti", "Pediatría", ["Lunes", "martes", "miercoles"], "08:00 - 14:00"),
    new Medico("Pablo", "Mancini", "Diabetología", ["Lunes", "Jueves", "Sabados"], "08:00 - 16:00"),
    new Medico("Erica", "Rodriguez", "Clínica Médica", ["Lunes", "martes", "miercoles"], "08:00 - 16:00")
];

function mostrarResultados(resultados) {
    let html = "";
    resultados.forEach(medico => {
        html += `
            <h6>Doctor/a:</h6>
            <p> ${medico.apellido} - Especialista en: ${medico.especialidad}</p>
            <p>Atiende los días: ${medico.diasAtencion.join(', ')}</p>
            <p>Horarios: ${medico.horario}</p>
        `;
    });
    resultadosDiv.innerHTML = html;
    modalResultados.show()
}

/*formulario.addEventListener('submit', (event) => {
    event.preventDefault();

    const mensaje = mensajeInput.value.toLocaleLowerCase();

    if (mensaje === 'hola') {
        mostrarResultados(medicos);
    } else {
        alert('No entendí tu consulta.');
    }

    mensajeInput.value = '';
}) */

formulario.addEventListener('submit', (event) => {
    event.preventDefault();

    const mensaje = mensajeInput.value.toLowerCase();
    const especialidadBuscada = document.getElementById('especialidad').value.toLowerCase();

    if (mensaje === 'hola') {
        mostrarResultados(medicos);
    } else if (especialidadBuscada) {
        const medicosEncontrados = medicos.filter(medico =>
            medico.especialidad.toLowerCase() === especialidadBuscada
        );

        if (medicosEncontrados.length > 0) {
            mostrarResultados(medicosEncontrados);
        } else {
            resultadosDiv.innerHTML = "No se encontraron médicos para la especialidad: " + especialidadBuscada;
            modalResultados.show();
        }
    } else {
        alert("No entendí tu consulta.");
    }

    mensajeInput.value = '';
    document.getElementById('especialidad').value = '';
});