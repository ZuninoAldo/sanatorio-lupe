document.addEventListener('DOMContentLoaded', async () => {
    const Medico = async () => {
        try {
            const response = await fetch('../JSON/medicos.json');
            if (!response.ok) {
                throw Swal.fire({
                    icon: "error",
                    title: "¡Algo en nuestro sistema no salio bien!",
                    text: "Algo inesperado ocurrió. Sin embargo, tus datos fueron guardados correctamente. Volvé a intentar más tarde.",
                    footer: '<a href="https://www.google.com/search?q=explicacion+de+errores+mas+comunes+en+conexion+con+servidores&sca_esv=697ac3e2085e9089&sxsrf=ADLYWIL5prudZQwskcBjQNWULFC-5cTSWA%3A1735598270060&ei=viBzZ7OuA6XE5OUP4M_aqA4&oq=explicacion+de+errores+mas+comunes+en+conexion+con+ser&gs_lp=Egxnd3Mtd2l6LXNlcnAiNmV4cGxpY2FjaW9uIGRlIGVycm9yZXMgbWFzIGNvbXVuZXMgZW4gY29uZXhpb24gY29uIHNlcioCCAAyBRAhGKABMgUQIRigAUiFRFDyB1iGOHABeAGQAQCYAaoCoAGiHaoBBjAuMjQuMrgBA8gBAPgBAZgCG6ACgB7CAgoQABiwAxjWBBhHwgIHECMYJxiuAsICBBAjGCfCAgQQIRgVmAMAiAYBkAYIkgcIMS4yNC4xLjGgB_Nh&sclient=gws-wiz-serp">¿Porqué veo este error?</a>'
                });;
            }
            const Medicos = await response.json();
            return Medicos;
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "¡Ups! Algo salió mal",
                text: "No se pudo obtener la información de los médicos. Por favor, volvé a intentar más tarde.",
            });
            return [];
        }
    }

    const medicos = await Medico();

    const formulario = document.querySelector('.chatbotFormulario')
    const mensajeInput = document.getElementById('comentarios');
    const modalResultados = new bootstrap.Modal(document.getElementById('modalResultados'));
    const resultadosDiv = document.getElementById('resultados');

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

    const turnosReservados = [];

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

    consultar.addEventListener('click', event => {
        event.preventDefault();

        const turnosReservadosMostrar = JSON.parse(localStorage.getItem("turnosReservados")) || [];
        let turnosTexto = turnosReservadosMostrar.map(turno => {
            return `Médico: ${turno.medico.nombre} ${turno.medico.apellido}, Especialidad: ${turno.medico.especialidad}, Días de atención: ${turno.medico.diasAtencion.join(', ')}, Horarios: ${turno.medico.horario}, Se enviarán los datos del turno al Email: ${turno.email}`;
        }).join('\n');

        Swal.fire({
            title: "Turnos Guardados",
            text: turnosTexto || "No hay turnos reservados.",
            icon: "info"
        });
    })
})
