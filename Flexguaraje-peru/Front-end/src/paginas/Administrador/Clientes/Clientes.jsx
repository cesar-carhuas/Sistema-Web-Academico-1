import React, { useState, useEffect } from 'react';
import './Clientes.css';
import { useNavigate } from 'react-router-dom'; // Usar react-router para redirección
import ClientesBD from './BASE DE DATOS/ClientesBD'
import Swal from 'sweetalert2';

function Clientes() {
    // variablessssssssssssssssssssssss de formulario
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    // variablessssssssssssssss de crear cliente
    const [nuevoCliente, setNuevoCliente] = useState({
        dni: '',
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        telefono: '',
        email: '',
        direccion: '',
        nota: 'Sin discapacidad'

    });
    // variables para buscar el cliente por nombre completo y DNI
    const [busqueda, setBusqueda] = useState('');
    const [tipoBusqueda, setTipoBusqueda] = useState('dni');
    const navigate = useNavigate();  // Para redirigir a otra página
    const [clientesEncontrados, setClientesEncontrados] = useState([]);

    const [discapacidad, setDiscapacidad] = useState(''); // Nuevo estado para la discapacidad

    useEffect(() => {
        setBusqueda(''); // Limpia el campo de búsqueda al cambiar el tipo de búsqueda
    }, [tipoBusqueda]);

    // funcion para poder agregar un nuevo cliente
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNuevoCliente(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleNotaChange = (e) => {
        const { value } = e.target;
        setNuevoCliente((prevState) => ({
            ...prevState,
            nota: value, // Actualiza el estado según la selección
        }));

        if (value === 'Sin discapacidad') {
            setDiscapacidad(''); // Limpia la discapacidad si seleccionan "Sin discapacidad"
        }
    };

    const handleDiscapacidadChange = (e) => {
        setDiscapacidad(e.target.value); // Actualiza solo el campo de discapacidad
    };

    const handleCrearCliente = () => {

        const camposRequeridos = [
            nuevoCliente.dni.trim(),
            nuevoCliente.nombre.trim(),
            nuevoCliente.apellido_paterno.trim(),
            nuevoCliente.apellido_materno.trim(),
            nuevoCliente.telefono.trim(),
            nuevoCliente.email.trim(),
            nuevoCliente.direccion.trim(),
        ];

        const formularioVacio = camposRequeridos.every(campo => campo === '');

        if (formularioVacio) {
            Swal.fire({
                icon: 'error',
                title: 'Formulario vacío',
                text: 'Por favor, rellena el formulario antes de enviarlo.',
                showConfirmButton: true,
            });
            return; // Detener la ejecución
        }

        const errores = [];

        // Validar cada campo y agregar el mensaje de error correspondiente
        if (!nuevoCliente.dni.trim()) {
            errores.push('El DNI no puede ir vacío.');
        } else if (!/^\d{8}$/.test(nuevoCliente.dni.trim())) {
            errores.push('El DNI debe tener exactamente 8 caracteres numéricos.');
        }

        if (!nuevoCliente.nombre.trim()) {
            errores.push('El Nombre no puede ir vacío.');
        } else if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]+$/.test(nuevoCliente.nombre.trim())) {
            errores.push('El Nombre solo debe contener letras.');
        }

        if (!nuevoCliente.apellido_paterno.trim()) {
            errores.push('El Apellido Paterno no puede ir vacío.');
        } else if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ]+$/.test(nuevoCliente.apellido_paterno.trim())) {
            errores.push('El Apellido Paterno solo debe contener letras y una palabra.');
        }

        if (!nuevoCliente.apellido_materno.trim()) {
            errores.push('El Apellido Materno no puede ir vacío.');
        } else if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ]+$/.test(nuevoCliente.apellido_materno.trim())) {
            errores.push('El Apellido Materno solo debe contener letras y una palabra.');
        }

        if (!nuevoCliente.telefono.trim()) {
            errores.push('El Teléfono no puede ir vacío.');
        } else if (!/^\d{9}$/.test(nuevoCliente.telefono.trim())) {
            errores.push('El Teléfono debe tener exactamente 9 caracteres numéricos.');
        }

        if (!nuevoCliente.email.trim()) {
            errores.push('El Correo Electrónico no puede ir vacío.');
        } else if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(nuevoCliente.email.trim())) {
            // Cambié la expresión regular para aceptar cualquier dominio válido (no solo .com y .pe)
            errores.push('El Correo Electrónico debe ser válido (ejemplo@dominio.com).');
        }

        if (!nuevoCliente.direccion.trim()) {
            errores.push('La Dirección no puede ir vacía.');
        }

        if (nuevoCliente.nota === 'Con discapacidad' && !discapacidad.trim()) {
            errores.push('Por favor, especifique la discapacidad.');
        } else if (nuevoCliente.nota === 'Con discapacidad' && !/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s,.'-]+$/.test(discapacidad.trim())) {
            // Permite letras, espacios, comas, puntos, comillas y guiones
            errores.push('La discapacidad solo puede contener letras, espacios, comas, puntos, comillas y guiones.');
        }

        if (errores.length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Errores en el formulario',
                html: errores.map(error => `<p>${error}</p>`).join(''),
                showConfirmButton: true,
            });
            return; // Detener la ejecución si hay errores
        }

        const clienteData = { ...nuevoCliente };
        if (clienteData.nota === 'Con discapacidad') {
            clienteData.nota = discapacidad; // Asigna la descripción al campo "nota"
        }


        ClientesBD.crearCliente(clienteData)
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Cliente creado exitosamente.',
                    showConfirmButton: false,
                    timer: 3000,
                });
                setMostrarFormulario(false);
                setNuevoCliente({
                    dni: '',
                    nombre: '',
                    apellido_paterno: '',
                    apellido_materno: '',
                    telefono: '',
                    email: '',
                    direccion: '',
                    nota: 'Sin discapacidad'
                });
                setDiscapacidad(''); // Reinicia el campo de discapacidad
            })
            .catch((error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al crear cliente',
                    text: error.response?.data || 'Ocurrió un error inesperado.',
                });
            });
    };

    // Función para buscar por DNI
    const handleBuscarClientePorDni = () => {
        if (!busqueda.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Error en DNI',
                text: 'El DNI no puede estar vacío.',
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        if (!busqueda.trim() || busqueda.length !== 8 || !/^\d{8}$/.test(busqueda)) {
            Swal.fire({
                icon: 'error',
                title: 'Error en DNI',
                text: 'El DNI debe tener exactamente 8 caracteres numéricos.',
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        Swal.fire({
            title: 'Buscando cliente...',
            text: 'Por favor, espere.',
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        ClientesBD.buscarCliente('dni', busqueda)  // Llamada para buscar por DNI
            .then((response) => {
                Swal.close();
                const cliente = response.data;
                if (cliente) {
                    navigate('/solicitudesclientes', { state: { cliente } });
                }
            })
            .catch((error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error en buscar al cliente',
                    text: error.response?.data || 'Error inesperado'
                });
            });
    };

    // Función para buscar por Nombre Completo
    const handleBuscarClientePorNombreCompleto = () => {
        const nombreCompleto = `${busqueda.nombre || ''} ${busqueda.apellidoPaterno || ''} ${busqueda.apellidoMaterno || ''}`;

        if (!nombreCompleto.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Error en Nombre Completo',
                text: 'El Nombre Completo no puede estar vacío.',
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        const errores = [];

        if (!(busqueda.nombre || '').trim()) {
            errores.push('El Nombre no puede estar vacío.');
        } else if (!/^[a-zA-Z ]+$/.test(busqueda.nombre)) {
            errores.push('El Nombre solo debe contener letras.');
        }

        // Validar apellido paterno: solo letras, sin espacios
        if (!(busqueda.apellidoPaterno || '').trim()) {
            errores.push('El Apellido Paterno no puede estar vacío.');
        } else if (!/^[a-zA-Z]+$/.test(busqueda.apellidoPaterno)) {
            errores.push('El Apellido Paterno solo debe contener una palabra y solo letras.');
        }

        // Validar apellido materno: solo letras, sin espacios
        if (!(busqueda.apellidoMaterno || '').trim()) {
            errores.push('El Apellido Materno no puede estar vacío.');
        } else if (!/^[a-zA-Z]+$/.test(busqueda.apellidoMaterno)) {
            errores.push('El Apellido Materno solo debe contener una palabra y solo letras.');
        }

        // Si hay errores, mostrar todos los mensajes de error al mismo tiempo
        if (errores.length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Errores de Validación',
                html: errores.map(error => `<p>${error}</p>`).join(''),
                showConfirmButton: true,
            });
            return;
        }

        Swal.fire({
            title: 'Buscando cliente...',
            text: 'Por favor, espere.',
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        ClientesBD.buscarCliente('nombre', busqueda)  // Llamada para buscar por nombre completo
            .then((response) => {
                Swal.close();
                const cliente = response.data;
                if (cliente.length === 1) {
                    // Si solo se encuentra un cliente, navegar directamente a la página de solicitudes
                    navigate('/solicitudesclientes', { state: { cliente: cliente[0] } });
                } else {
                    // Si hay más de un cliente, mostrar la tabla modal
                    setClientesEncontrados(cliente);
                }
            })
            .catch((error) => {
                Swal.close();
                if (error.response && error.response.status === 404) {
                    // Si el error es 404, mostrar el mensaje con el nombre completo
                    Swal.fire({
                        icon: 'error',
                        title: 'Cliente no encontrado',
                        text: error.response.data,  // El mensaje de error que contiene el nombre completo
                    });
                } else {
                    // Si ocurre otro tipo de error, mostrar un mensaje genérico
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al buscar cliente',
                        text: 'Ocurrió un error inesperado.',
                        showConfirmButton: false,
                        timer: 3000
                    });
                }
            });
    };

    // Función principal para manejar la búsqueda
    const handleBuscarCliente = () => {
        if (tipoBusqueda === 'dni') {
            handleBuscarClientePorDni();  // Llama a la función de búsqueda por DNI
        } else {
            handleBuscarClientePorNombreCompleto();  // Llama a la función de búsqueda por nombre completo
        }
    };

    const handleSeleccionarCliente = (cliente) => {
        navigate('/solicitudesclientes', { state: { cliente } });
    };


    return (
        <div className="clientes-page" >
            <h2 className='title-cliente'>Buscar y/o Agregar Clientes:</h2>

            <div className="formulario-busqueda">
                <select
                    value={tipoBusqueda}
                    onChange={(e) => setTipoBusqueda(e.target.value)}>
                    <option value="dni">DNI</option>
                    <option value="nombre">Nombre Completo</option>
                </select>
                {tipoBusqueda === 'dni' ? (
                    <input
                        type="text"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        placeholder="Ingrese el DNI del cliente"
                    />
                ) : (
                    <div className="nombre-completo">
                        <div className=''>
                            <input
                                type="text"
                                value={busqueda.nombre || ''}
                                onChange={(e) => setBusqueda({ ...busqueda, nombre: e.target.value })}
                                placeholder="Ingrese el Nombre del cliente"
                            />
                            <input
                                type="text"
                                value={busqueda.apellidoPaterno || ''}
                                onChange={(e) =>
                                    setBusqueda({ ...busqueda, apellidoPaterno: e.target.value })
                                }
                                placeholder="Ingrese el Apellido Paterno del cliente"
                            />
                            <input
                                type="text"
                                value={busqueda.apellidoMaterno || ''}
                                onChange={(e) =>
                                    setBusqueda({ ...busqueda, apellidoMaterno: e.target.value })
                                }
                                placeholder="Ingrese el Apellido Materno del cliente"
                            />
                        </div>

                    </div>
                )}
                <button className="btn btn-info boton-buscar" onClick={handleBuscarCliente}>Buscar</button>

                {clientesEncontrados.length > 0 && (
                    <div className="modal-overlay">
                        <div className="modal-content select-cliente-buscar">
                            <h3>Selecciona un cliente:</h3>
                            <table className="table table-primary table-hover table-bordered border-primary text-center table-seleccionar">
                                <thead>
                                    <tr>
                                        <th>DNI</th>
                                        <th>Nombres Completo</th>
                                        <th>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clientesEncontrados.map((cliente) => (
                                        <tr key={cliente.dni}>
                                            <td>{cliente.dni}</td>
                                            <td>{`${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`}</td>
                                            <td>
                                                <button
                                                    className="btn btn-primary btn-tabla-modal"
                                                    onClick={() => handleSeleccionarCliente(cliente)}
                                                >
                                                    Seleccionar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button className="btn btn-secondary btn-tabla-modal" onClick={() => setClientesEncontrados([])}>
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <button
                className="btn btn-success boton-abrir-formulario"
                onClick={() => setMostrarFormulario(true)}>
                Crear Cliente
            </button>

            {mostrarFormulario && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 className="text-center">CREAR NUEVO CLIENTE</h3>
                        <div className="formulario-campos">
                            <label>DNI:</label>
                            <input
                                type="text"
                                name="dni"
                                value={nuevoCliente.dni}
                                onChange={handleChange}
                                required
                            />
                            <label>Nombres:</label>
                            <input
                                type="text"
                                name="nombre"
                                value={nuevoCliente.nombre}
                                onChange={handleChange}
                                required
                            />
                            <label>Apellido Paterno:</label>
                            <input
                                type="text"
                                name="apellido_paterno"
                                value={nuevoCliente.apellido_paterno}
                                onChange={handleChange}
                                required
                            />
                            <label>Apellido Materno:</label>
                            <input
                                type="text"
                                name="apellido_materno"
                                value={nuevoCliente.apellido_materno}
                                onChange={handleChange}
                                required
                            />
                            <label>Teléfono:</label>
                            <input
                                type="text"
                                name="telefono"
                                value={nuevoCliente.telefono}
                                onChange={handleChange}
                                required
                            />
                            <label>Correo Electrónico:</label>
                            <input
                                type="email"
                                name="email"
                                value={nuevoCliente.email}
                                onChange={handleChange}
                                required
                            />
                            <label>Dirección:</label>
                            <input
                                type="text"
                                name="direccion"
                                value={nuevoCliente.direccion}
                                onChange={handleChange}
                                required
                            />
                            <label>¿Tiene discapacidad?</label>
                            <div className='cliente-discapacidad'>
                                <div className='form-check'>
                                    <input className='form-check-input' type="radio" name="nota" value="Sin discapacidad" checked={nuevoCliente.nota === 'Sin discapacidad'} onChange={handleNotaChange} />
                                    <label className='form-check-label'>Sin discapacidad</label>
                                </div>
                                <div className='form-check'>
                                    <input className='form-check-input' type="radio" name="nota" value="Con discapacidad" checked={nuevoCliente.nota === 'Con discapacidad'} onChange={handleNotaChange} />
                                    <label className='form-check-label'>Con discapacidad</label>
                                </div>
                            </div>

                            {nuevoCliente.nota === 'Con discapacidad' && (
                                <div>
                                    <label>Especifique la discapacidad:</label>
                                    <input
                                        type="text"
                                        value={discapacidad} // Vinculado al nuevo estado
                                        onChange={handleDiscapacidadChange} // Actualiza solo la discapacidad
                                    />
                                </div>
                            )}
                        </div>

                        <div className="formulario-botones">
                            <button className="btn btn-success" onClick={handleCrearCliente}>Crear Cliente</button>
                            <button className="btn btn-secondary" onClick={() => setMostrarFormulario(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Clientes;
