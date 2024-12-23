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
    new Medico("Aristides", "Morici", "ginecologia", ["Lunes", "martes", "Miercoles"], "08:00 - 12:00"),
    new Medico("Juliana", "Alvarau", "ginecologia", ["Jueves", "Viernes", "Sabados"], "14:00 - 18:00"),
    new Medico("Aldo", "Zunino", "traumatologia", ["Lunes", "Miercoles", "Viernes"], "10:00 - 16:00"),
    new Medico("Nicolas", "Della Guistina", "cardiologia", ["Lunes", "Miercoles", "Sabados"], "09:00 - 15:00"),
    new Medico("Lucia", "D'Agresti", "pediatria", ["Lunes", "martes", "miercoles"], "08:00 - 14:00"),
    new Medico("Pablo", "Mancini", "diabetologia", ["Lunes", "Jueves", "Sabados"], "08:00 - 16:00"),
    new Medico("Erica", "Rodriguez", "clinica medica", ["Lunes", "martes", "miercoles"], "08:00 - 16:00")
];

const especialidades = [...new Set(medicos.map(medico => medico.especialidad))];

function mostrarResultados(resultados) {
    let html = "";
    resultados.forEach(medico => {
        html += `
            <h6>Doctor/a:</h6>
            <p> ${medico.apellido} - Especialista en ${medico.especialidad}</p>
            <p>Atiende los días: ${medico.diasAtencion.join(', ')}</p>
            <p>Horarios: ${medico.horario}</p>
        `;
    });
    resultadosDiv.innerHTML = html;
    modalResultados.show()
}

formulario.addEventListener('submit', (event) => {
    event.preventDefault();

    const mensaje = mensajeInput.value.toLowerCase();
    const especialidadBuscada = especialidades.find(especialidad =>
        mensaje.includes(especialidad.toLowerCase())
    );

    if (mensaje === 'listado') {
        mostrarResultados(medicos);
    } else if (especialidadBuscada) {
        const medicosEncontrados = medicos.filter(medico =>
            medico.especialidad.toLowerCase() === especialidadBuscada.toLowerCase()
        );

        if (medicosEncontrados.length > 0) {
            mostrarResultados(medicosEncontrados);
        } else {
            resultadosDiv.innerHTML = "No se encontraron médicos para la especialidad: " + especialidadBuscada;
            modalResultados.show();
        }
    } else {
        Swal.fire({
            icon: "error",
            title: "¡Perdón!",
            text: "No se pudo encontrar lo que buscabas, por favor, volvé a intentar!",
        });
    }

    mensajeInput.value = '';
});

// a partir de aca, logica de reservar turno

const formularioReseva = document.getElementById('formularioReservas');
const medicoInput = document.getElementById('medicoNombres');
const mailInput = document.getElementById('mail');

const turnosReservados = [

];

formularioReseva.addEventListener('submit', (event) => {
    event.preventDefault();

    const medicoInputValue = medicoInput.value.toLowerCase();
    const mailInputValue = mailInput.value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(mailInputValue);

    const medicoEncontrado = medicos.find(medico => medico.nombre.toLowerCase() === medicoInputValue);

    if (medicoEncontrado && isEmailValid) {
        turnosReservados.push({
            medico: medicoEncontrado,
            email: mailInputValue
        });

        Swal.fire({
            icon: 'success',
            title: 'Turno reservado correctamente'
        });
    } else {
        if (!medicoEncontrado) {
            Swal.fire({
                icon: 'error',
                title: 'Médico no encontrado. Por favor, verifica el nombre.'
            });
        } else if (!isEmailValid) {
            Swal.fire({
                icon: 'error',
                title: 'Correo electrónico inválido. Por favor, ingresa un correo válido.'
            });
        }
    }
    const turnosReservadosString = turnosReservados;
    localStorage.setItem("turnosReservados", JSON.stringify(turnosReservados));

    medicoInput.value = '';
    mailInput.value = '';
});

limpiar.addEventListener('click', (event) => {
    event.preventDefault();

    Swal.fire({
        title: "¿Estas seguro de que deseas borrar los datos?",
        text: "Una vez borrados no se podrán recuperar.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "¡Si! Limpiar datos.",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear();
            sessionStorage.clear();
            Swal.fire({
                title: "¡Limpio!",
                text: "se han borrado todos los datos guardados.",
                icon: "success"
            });
        }
    });
})

consultar.addEventListener ('click', event => {
    event.preventDefault();

    console.log(turnosReservados);
    Swal.fire({
        title: "Turno Guardado",
        text:  "Se muestran sus turnos en consola",
        icon: "info"
    });
})