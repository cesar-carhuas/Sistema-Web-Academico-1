import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SolicitudesClientes.css';
import ClientesBD from './BASE DE DATOS/ClientesBD';
import SolicitudesBD from './BASE DE DATOS/SolicitudesBD';
import Swal from 'sweetalert2';

function SolicitudesClientes() {
    const location = useLocation();
    const navigate = useNavigate();
    const { cliente } = location.state || {};
    const [solicitudes, setSolicitudes] = useState([]);
    const [clienteActualizado, setClienteActualizado] = useState(cliente);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [mostrarFormularioACT, setMostrarFormularioACT] = useState(false);
    const [mostrarFormularioRESPUESTA, setMostrarFormularioRESPUESTA] = useState(false);
    const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
    const [mostrarFormularioCOMPLETO, setMostrarFormularioCOMPLETO] = useState(false);
    const [filtroSolicitud, setFiltroSolicitud] = useState({
        tipo: 'Todos',
        categoria: 'Todos',
        prioridad: 'Todos',
        estado: 'Todos',
        subestado: 'Todos'
    });
    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltroSolicitud(prevFiltro => ({
            ...prevFiltro,
            [name]: value
        }));
    };

    // Estados para modales de solicitudes
    const [formCrear, setFormCrear] = useState({
        dniCliente: cliente?.dni || '',
        tipoSolicitud: '',
        categoria: '',
        descripcion: '',
        prioridad: '',
        estado: '',
        subestado: ''
    });
    const [formActualizar, setFormActualizar] = useState({
        codigoSolicitud: '',
        descripcion: '',
        prioridad: '',
        estado: ''
    });
    const [formRespuesta, setFormRespuesta] = useState({
        idSolicitud: '',
        respuesta: '',
        subestado: ''
    });

    /* Estado para el formulario modal de actualizar cliente */
    const [formData, setFormData] = useState({
        dni: cliente.dni,
        nombre: cliente.nombre,
        apellido_paterno: cliente.apellidoPaterno,
        apellido_materno: cliente.apellidoMaterno,
        telefono: cliente.telefono,
        email: cliente.email,
        direccion: cliente.direccion,
        nota: cliente.notaAdicional
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const [isUpdated, setIsUpdated] = useState(false);
    const limpiarFormulario = () => {
        setFormCrear({
            dniCliente: cliente?.dni || '',
            tipoSolicitud: '',
            categoria: '',
            descripcion: '',
            prioridad: '',
            estado: '',
            subestado: ''
        });
    };
    const cerrarModal = () => {
        limpiarFormulario(); // Limpiar el formulario al cerrar el modal
        setMostrarFormulario(false); // Suponiendo que tienes un estado para el modal
    };

    if (!cliente) {
        return (
            <div className='solicitud-page'>
                <h2>No se encontraron datos del cliente.</h2>
            </div>
        );
    }

    useEffect(() => {
        if (cliente?.dni) {
            obtenerSolicitudes(cliente.dni);
        }
    }, [cliente?.dni]);

    useEffect(() => {
        if (cliente?.dni) {
            const obtenerDatosCliente = async () => {
                try {
                    const response = await ClientesBD.buscarCliente('dni', cliente.dni);
                    setClienteActualizado(response.data);
                    setFormData(response.data);
                } catch (error) {
                    console.error('Error al obtener los datos del cliente', error);
                }
            };
            obtenerDatosCliente();
        }
    }, [cliente?.dni]); // Se ejecuta cada vez que el DNI cambia

    useEffect(() => {
        if (clienteActualizado?.dni) {
            const obtenerDatosCliente = async () => {
                try {
                    const response = await ClientesBD.buscarCliente('dni', clienteActualizado.dni);
                    setClienteActualizado(response.data);
                    setFormData({
                        dni: response.data.dni,
                        nombre: response.data.nombre,
                        apellido_paterno: response.data.apellidoPaterno,  // Asegurar que sean los correctos
                        apellido_materno: response.data.apellidoMaterno,
                        telefono: response.data.telefono,
                        email: response.data.email,
                        direccion: response.data.direccion,
                        nota: response.data.notaAdicional
                    });
                } catch (error) {
                    console.error('Error al obtener los datos del cliente', error);
                }
            };
            obtenerDatosCliente();
        }
    }, [isModalOpen]);  // Se ejecuta cuando se abre el modal

    const obtenerSolicitudes = async (dni) => {
        try {
            const response = await SolicitudesBD.buscarSolicitudesPorDni(dni);
            setSolicitudes(response.data);
        } catch (error) {
            console.error("Error al obtener solicitudes:", error.response?.data || error.message);
            Swal.fire({
                icon: 'error',
                title: 'Error al obtener solicitudes',
                text: 'No se pudieron cargar las solicitudes del cliente.' + error.response?.data || error.message,
            });
        }
    };

    /* Handlers para actualizar cliente */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => {
            const updatedData = {
                ...prevState,
                [name]: value,
            };
            if (updatedData[name] !== cliente[name]) {
                setIsUpdated(true);
            }
            return updatedData;
        });
    };

    const actualizarinfocliente = async () => {
        const formulariovacio = `${formData.nombre || ''} ${formData.apellido_paterno || ''} 
        ${formData.apellido_materno || ''} ${formData.telefono || ''} ${formData.email || ''} 
        ${formData.direccion || ''} ${formData.nota || ''}`;

        if (!formulariovacio.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Formulario Vacío',
                text: 'El formulario no puede estar vacío, por favor rellene los datos.',
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        if (!isUpdated) {
            Swal.fire({
                icon: 'info',
                title: 'No se han realizado cambios',
                text: 'No has realizado ninguna actualización en los datos.',
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        const errores = [];

        if (!formData.nombre.trim()) {
            errores.push('El Nombre no puede ir vacío.');
        } else if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]+$/.test(formData.nombre.trim())) {
            errores.push('El Nombre solo debe contener letras.');
        }

        if (!formData.apellido_paterno.trim()) {
            errores.push('El Apellido Paterno no puede ir vacío.');
        } else if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ]+$/.test(formData.apellido_paterno.trim())) {
            errores.push('El Apellido Paterno solo debe contener letras y una palabra.');
        }

        if (!formData.apellido_materno.trim()) {
            errores.push('El Apellido Materno no puede ir vacío.');
        } else if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ]+$/.test(formData.apellido_materno.trim())) {
            errores.push('El Apellido Materno solo debe contener letras y una palabra.');
        }

        if (!formData.telefono.trim()) {
            errores.push('El Teléfono no puede ir vacío.');
        } else if (!/^\d{9}$/.test(formData.telefono.trim())) {
            errores.push('El Teléfono debe tener exactamente 9 caracteres numéricos.');
        }

        if (!formData.email.trim()) {
            errores.push('El Correo Electrónico no puede ir vacío.');
        } else if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email.trim())) {
            errores.push('El Correo Electrónico debe ser válido (ejemplo@dominio.com).');
        }

        if (!formData.direccion.trim()) {
            errores.push('La Dirección no puede ir vacía.');
        }

        if (!formData.nota.trim()) {
            errores.push('La Nota no puede ir vacía.');
        } else if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s,.-]+$/.test(formData.nota.trim())) {
            errores.push('La Nota solo puede contener letras, espacios, comas, guiones y puntos.');
        }

        if (errores.length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Errores en el formulario',
                html: errores.map(error => `<p>${error}</p>`).join(''),
                showConfirmButton: true,
            });
            return;
        }

        try {
            await ClientesBD.actualizarCliente(formData);
            const response = await ClientesBD.buscarCliente('dni', formData.dni);
            setClienteActualizado(response.data);
            setFormData(response.data);

            Swal.fire({
                icon: 'success',
                title: 'Cliente actualizado exitosamente',
                showConfirmButton: false,
                timer: 3000,
            });

            closeModal(); // Cierra el modal después de actualizar

            // 🔹 Refresca la página sin recargar completamente
            navigate(`/solicitudesclientes`, { state: { cliente: response.data } });
        } catch (error) {
            console.error("Error en actualizar al cliente la informacion:", error.response?.data || error.message);
            Swal.fire({
                icon: 'error',
                title: 'Error al actualizar el cliente',
                text: error.response?.data || 'Error inesperado',
            });
        }
    };

    const handleVolver = () => {
        navigate('/clientes');
    };

    const handleCancelar = () => {
        setFormData({
            dni: cliente.dni,
            nombre: cliente.nombre,
            apellido_paterno: cliente.apellidoPaterno,
            apellido_materno: cliente.apellidoMaterno,
            telefono: cliente.telefono,
            email: cliente.email,
            direccion: cliente.direccion,
            nota: cliente.notaAdicional
        });
        closeModal();
    };

    /* Handlers para el formulario de crear solicitud */
    const handleCrearChange = (e) => {
        const { name, value } = e.target;
        setFormCrear(prev => ({ ...prev, [name]: value }));
    };

    const handleCrearSolicitud = async () => {
        if (
            !formCrear.tipoSolicitud.trim() &&
            !formCrear.categoria.trim() &&
            !formCrear.descripcion.trim() &&
            !formCrear.prioridad.trim() &&
            !formCrear.estado.trim() &&
            !formCrear.subestado.trim()
        ) {
            Swal.fire({
                icon: 'error',
                title: 'Formulario Vacío',
                text: 'El formulario no puede estar vacío, por favor ingrese datos.',
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        let errores = [];

        // Validación de Tipo de Solicitud
        if (!formCrear.tipoSolicitud.trim()) {
            errores.push("Debes seleccionar un tipo de solicitud.");
        }

        // Validación de Categoría
        if (!formCrear.categoria.trim()) {
            errores.push("Debes seleccionar una categoría.");
        }

        // Validación de Descripción
        if (!formCrear.descripcion.trim()) {
            errores.push("La descripción no puede estar vacía.");
        }

        // Validación de Prioridad
        if (!formCrear.prioridad.trim()) {
            errores.push("Debes seleccionar una prioridad.");
        }

        // Validación de Estado
        if (!formCrear.estado.trim()) {
            errores.push("Debes seleccionar un estado.");
        }

        if (errores.length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Errores en el formulario',
                html: errores.join("<br/>") // Cada mensaje en una línea distinta
            });
            return;
        }

        try {
            await SolicitudesBD.crearSolicitud(formCrear);
            Swal.fire({
                icon: 'success',
                title: '¡Solicitud creada!',
                text: 'La solicitud ha sido registrada exitosamente.',
                showConfirmButton: false,
                timer: 3000
            });
            obtenerSolicitudes(cliente.dni);
            setMostrarFormulario(false);
            setFormCrear({
                dniCliente: cliente.dni,
                tipoSolicitud: '',
                categoria: '',
                descripcion: '',
                prioridad: '',
                estado: '',
                subestado: ''
            });
        } catch (error) {
            console.error("Error en crearSolicitud:", error.response?.data || error.message);
            // Intenta mostrar el mensaje devuelto por el backend, si existe
            Swal.fire({
                icon: 'error',
                title: 'Error al crear la solicitud',
                text: error.response?.data || error.message,
            });
        }
    };

    /* Handlers para el formulario de actualizar solicitud */
    const handleActualizarChange = (e) => {
        const { name, value } = e.target;
        setFormActualizar(prev => ({ ...prev, [name]: value }));
    };

    const [codigoBusqueda, setCodigoBusqueda] = useState('');

    const handleBuscarPorCodigo = async () => {
        if (!codigoBusqueda.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Campo vacío',
                text: 'Debe ingresar un código de solicitud para buscar.',
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        Swal.fire({
            title: "Buscando cuenta...",
            text: "Por favor espera mientras buscamos la cuenta.",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
        });

        try {
            const response = await SolicitudesBD.buscarSolicitudesPorCodigo(codigoBusqueda, cliente.dni);
            Swal.close();
            setSolicitudes(response.data);
        } catch (error) {
            console.error("Error en buscar solicitud:", error.response?.data || error.message);
            Swal.fire({
                icon: 'error',
                title: 'Error en la búsqueda',
                text: error.response?.data || error.message
            });
        }
    };

    const handleActualizarSolicitud = async () => {

        if (
            !formActualizar.descripcion.trim() &&
            !formActualizar.prioridad.trim() &&
            !formActualizar.estado.trim()
        ) {
            Swal.fire({
                icon: 'error',
                title: 'Formulario Vacío',
                text: 'El formulario no puede estar vacío, por favor ingrese datos.',
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        let errores = [];

        if (!formActualizar.descripcion.trim()) errores.push("La descripción no puede estar vacía.");
        if (!formActualizar.prioridad.trim()) errores.push("Debes seleccionar una prioridad.");
        if (!formActualizar.estado.trim()) errores.push("Debes seleccionar un estado.");

        if (errores.length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Errores en el formulario',
                html: errores.join("<br/>") // Cada mensaje en una línea distinta
            });
            return;
        }

        try {
            await SolicitudesBD.actualizarSolicitud(formActualizar);
            Swal.fire({
                icon: 'success',
                title: '¡Solicitud actualizada!',
                text: 'La solicitud ha sido actualizada correctamente.',
                showConfirmButton: false,
                timer: 3000
            });
            obtenerSolicitudes(cliente.dni);
            setMostrarFormularioACT(false);
        } catch (error) {
            console.error("Error en actualizarSolicitud:", error.response?.data || error.message);
            Swal.fire({
                icon: 'error',
                title: 'Error al actualizar la solicitud',
                text: error.response?.data || error.message,
            });
        }
    };

    /* Handlers para el formulario de responder solicitud */
    const handleRespuestaChange = (e) => {
        const { name, value } = e.target;
        setFormRespuesta(prev => ({ ...prev, [name]: value }));
    };

    const handleResponderSolicitud = async () => {
        if (formRespuesta.respuesta.trim() === "" && formRespuesta.subestado.trim() === "") {
            Swal.fire({
                icon: 'error',
                title: 'Formulario Vacío',
                text: 'Debe completar todos los campos antes de enviar la respuesta.',
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        let errores = [];

        // Validar que la respuesta no esté vacía
        if (!formRespuesta.respuesta || formRespuesta.respuesta.trim() === "") {
            errores.push("La respuesta no puede estar vacía.");
        }

        // Validar que el subestado esté seleccionado y no sea "Seleccione"
        if (!formRespuesta.subestado || formRespuesta.subestado.trim() === "" || formRespuesta.subestado === "Seleccione") {
            errores.push("Debes seleccionar un subestado.");
        }

        if (errores.length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Errores en el formulario',
                html: errores.join("<br/>"),
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        try {
            await SolicitudesBD.responderSolicitud(formRespuesta.codigoSolicitud, {
                respuesta: formRespuesta.respuesta,
                subestado: formRespuesta.subestado
            });
            Swal.fire({
                icon: 'success',
                title: '¡Solicitud respondida!',
                text: 'La respuesta ha sido enviada correctamente.',
                showConfirmButton: false,
                timer: 3000
            });
            obtenerSolicitudes(cliente.dni);
            setMostrarFormularioRESPUESTA(false);
            setFormRespuesta({ codigoSolicitud: '', respuesta: '', subestado: '' });
        } catch (error) {
            console.error("Error al responder:", error.response?.data || error.message);
            Swal.fire({
                icon: 'error',
                title: 'Error al responder la solicitud',
                text: error.response?.data || error.message || 'No se pudo enviar la respuesta.',
            });
        }
    };

    const solicitudesFiltradas = solicitudes.filter((solicitud) => {
        return (
            (filtroSolicitud.tipo === 'Todos' || solicitud.tipoSolicitud === filtroSolicitud.tipo) &&
            (filtroSolicitud.categoria === 'Todos' || solicitud.categoria === filtroSolicitud.categoria) &&
            (filtroSolicitud.prioridad === 'Todos' || solicitud.prioridad === filtroSolicitud.prioridad) &&
            (filtroSolicitud.estado === 'Todos' || solicitud.estado === filtroSolicitud.estado) &&
            (filtroSolicitud.subestado === 'Todos' || (solicitud.subestado ? solicitud.subestado : '') === filtroSolicitud.subestado)

        );
    });


    return (
        <div className="solicitud-page">
            <div className='informacion-cliente'>
                <h2 className='title-solicitud'>Información del cliente</h2>
                <div className='contenido-cliente'>
                    <div className='info-cliente row'>
                        <div className='info-dni'>
                            <h3>DNI</h3>
                            <p>{clienteActualizado.dni}</p>
                        </div>
                        <div className='info-nombre-completo'>
                            <h3>Nombre Completo</h3>
                            <p>{`${clienteActualizado.nombre} ${clienteActualizado.apellidoPaterno} ${clienteActualizado.apellidoMaterno}`}</p>
                        </div>
                        <div className='info-telefono'>
                            <h3>Teléfono</h3>
                            <p>{clienteActualizado.telefono}</p>
                        </div>
                        <div className='info-email'>
                            <h3>Email</h3>
                            <p>{clienteActualizado.email}</p>
                        </div>
                        <div className='info-direccion'>
                            <h3>Dirección</h3>
                            <p>{clienteActualizado.direccion}</p>
                        </div>
                        <div className='info-notas'>
                            <h3>Notas</h3>
                            <p>{clienteActualizado.notaAdicional}</p>
                        </div>
                    </div>

                    <div className='btn-acciones-infocliente'>
                        <button className='btn btn-primary btn-act-cliente' onClick={() => {
                            setFormData({
                                dni: clienteActualizado.dni,
                                nombre: clienteActualizado.nombre,
                                apellido_paterno: clienteActualizado.apellidoPaterno,  // Asegurar que los datos sean los correctos
                                apellido_materno: clienteActualizado.apellidoMaterno,
                                telefono: clienteActualizado.telefono,
                                email: clienteActualizado.email,
                                direccion: clienteActualizado.direccion,
                                nota: clienteActualizado.notaAdicional
                            });
                            openModal();
                        }}>
                            Actualizar
                        </button>
                        {isModalOpen && (
                            <div className="modal-overlay">
                                <div className="modal-content">
                                    <h2 className="text-center">ACTUALIZAR INFORMACIÓN DEL CLIENTE</h2>
                                    <div className="formulario-campos">
                                        <label>DNI:</label>
                                        <input type="text" name="dni" value={formData.dni} disabled />
                                        <label>Nombre:</label>
                                        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} />
                                        <label>Apellido Paterno:</label>
                                        <input type="text" name="apellido_paterno" value={formData.apellido_paterno || ''} onChange={handleChange} />
                                        <label>Apellido Materno:</label>
                                        <input type="text" name="apellido_materno" value={formData.apellido_materno || ''} onChange={handleChange} />
                                        <label>Teléfono:</label>
                                        <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} />
                                        <label>Email:</label>
                                        <input type="email" name="email" value={formData.email} onChange={handleChange} />
                                        <label>Dirección:</label>
                                        <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} />
                                        <label>Notas:</label>
                                        <input type="text" name="nota" value={formData.nota || ''} onChange={handleChange} />
                                    </div>
                                    <div className="formulario-botones">
                                        <button type="button" className="btn btn-primary" onClick={actualizarinfocliente}>Actualizar</button>
                                        <button type="button" className="btn btn-secondary" onClick={handleCancelar}>Cancelar</button>
                                    </div>
                                </div>
                            </div>
                        )}
                        <button type="button" className="btn btn-secondary btn-act-cliente" onClick={handleVolver}>Volver</button>
                    </div>
                </div>
            </div>

            <div className="solicitud-cliente">
                <div className='acciones-usuario'>
                    <div className='acciones-btn-usuario'>
                        <button className='btn btn-success' onClick={() => setMostrarFormulario(true)}>Crear Solicitud</button>

                        {mostrarFormulario && (
                            <div className="modal-overlay">
                                <div className="modal-content">
                                    <h3 className="text-center">CREAR NUEVA SOLICITUD</h3>
                                    <div className="formulario-campos">
                                        <label>Tipo Solicitud:</label>
                                        <select className='text-center' name="tipoSolicitud" value={formCrear.tipoSolicitud} onChange={handleCrearChange}>
                                            <option value="">Sin seleccionar</option>
                                            <option value="Consulta">Consulta</option>
                                            <option value="Problema">Problema</option>
                                            <option value="Reclamo">Reclamo</option>
                                        </select>
                                        <label>Categoria:</label>
                                        <select className='text-center' name="categoria" value={formCrear.categoria} onChange={handleCrearChange}>
                                            <option value="">Sin seleccionar</option>
                                            <option value="Espacio">Espacio</option>
                                            <option value="Cliente">Cliente</option>
                                            <option value="Alquiler">Alquiler</option>
                                            <option value="Boleta">Boleta</option>
                                        </select>
                                        <label>Descripción:</label>
                                        <textarea className='p-2 w-100 text-center' type="text" name="descripcion" value={formCrear.descripcion} onChange={handleCrearChange} required />
                                        <label>Prioridad:</label>
                                        <select className='text-center' name="prioridad" value={formCrear.prioridad} onChange={handleCrearChange}>
                                            <option value="">Sin seleccionar</option>
                                            <option value="Baja">Baja</option>
                                            <option value="Media">Media</option>
                                            <option value="Alta">Alta</option>
                                        </select>
                                        <label>Estado:</label>
                                        <select className='text-center' name="estado" value={formCrear.estado} onChange={handleCrearChange}>
                                            <option value="">Sin seleccionar</option>
                                            <option value="Pendiente">Pendiente</option>
                                            <option value="Cerrado">Cerrado</option>
                                        </select>
                                        <label>Sub estado:</label>
                                        <select className='text-center' name="subestado" value={formCrear.subestado} onChange={handleCrearChange}>
                                            <option value="">Sin seleccionar</option>
                                            <option value="Acogido">Acogido</option>
                                            <option value="No_acogido">No_acogido</option>
                                        </select>
                                    </div>

                                    <div className="formulario-botones">
                                        <button className="btn btn-success" onClick={handleCrearSolicitud}>Crear</button>
                                        <button className="btn btn-secondary" onClick={cerrarModal}>Cancelar</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="formulario-buscar-infocliente">
                        <input
                            type="text"
                            placeholder='Codigo Solicitud'
                            value={codigoBusqueda}
                            onChange={(e) => setCodigoBusqueda(e.target.value)}
                        />
                        <div className='btn-acciones-buscar'>
                            <button className='btn btn-info' onClick={handleBuscarPorCodigo}>Buscar</button>
                            <button className='btn btn-secondary' onClick={() => {
                                setCodigoBusqueda('');
                                SolicitudesBD.listarSolicitudes()
                                    .then(response => {
                                        setSolicitudes(response.data);
                                    })
                                    .catch(error => {
                                        console.error("Error al listar solicitud:", error);
                                    });
                            }}>
                                Normalidad
                            </button>
                        </div>
                    </div>
                </div>

                <table className='table table-primary table-hover table-bordered border-primary text-center tabla-espacios'>
                    <thead>
                        <tr>
                            <th>codigo Solicitud</th>
                            <th>Fecha</th>
                            <th >Tipo
                                <select className='filtro-table' name="tipo" value={filtroSolicitud.tipo} onChange={handleFiltroChange}>
                                    <option value="Todos">Todos</option>
                                    <option value="Consulta">Consulta</option>
                                    <option value="Problema">Problema</option>
                                    <option value="Reclamo">Reclamo</option>
                                </select>
                            </th>
                            <th >Categoria
                                <select className='filtro-table' name="categoria" value={filtroSolicitud.categoria} onChange={handleFiltroChange}>
                                    <option value="Todos">Todos</option>
                                    <option value="Espacio">Espacio</option>
                                    <option value="Cliente">Cliente</option>
                                    <option value="Alquiler">Alquiler</option>
                                    <option value="Boleta">Boleta</option>
                                </select>
                            </th>
                            <th >Prioridad
                                <select className='filtro-table' name="prioridad" value={filtroSolicitud.prioridad} onChange={handleFiltroChange}>
                                    <option value="Todos">Todos</option>
                                    <option value="Baja">Baja</option>
                                    <option value="Media">Media</option>
                                    <option value="Alta">Alta</option>
                                </select>
                            </th>
                            <th >Estado
                                <select className='filtro-table' name="estado" value={filtroSolicitud.estado} onChange={handleFiltroChange}>
                                    <option value="Todos">Todos</option>
                                    <option value="Cancelado">Cancelado</option>
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="Cerrado">Cerrado</option>
                                </select>
                            </th>
                            <th >Sub estado
                                <select className='filtro-table' name="subestado" value={filtroSolicitud.subestado} onChange={handleFiltroChange}>
                                    <option value="Todos">Todos</option>
                                    <option value="Acogido">Acogido</option>
                                    <option value="No acogido">No acogido</option>
                                </select>
                            </th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {solicitudes.length === 0 ? (
                            <tr>
                                <td colSpan="8">No hay solicitudes registradas.</td>
                            </tr>
                        ) : solicitudesFiltradas.length > 0 ? (
                            solicitudesFiltradas.map((solicitud, index) => (
                                <tr key={solicitud.codigoSolicitud || `solicitud-${index}`}>
                                    <td>
                                        <button className='btn-codigo' onClick={() => {
                                            setSolicitudSeleccionada(solicitud);
                                            setMostrarFormularioCOMPLETO(true);
                                        }}>{solicitud.codigoSolicitud}
                                        </button>
                                        {mostrarFormularioCOMPLETO && (
                                            <div className="modal-overlay modal-Arreglo-2">
                                                <div className="modal-content-completo">
                                                    <div className='titulo-completo-modal'>
                                                        <h3 className="text-center">INFORMACIÓN COMPLETA DE LA SOLICITUD</h3>
                                                    </div>
                                                    <div className="formulario-campos-completo">
                                                        <div>
                                                            <div className='campos-datos'>
                                                                <label>Codigo Solicitud:</label>
                                                                <input type="text" value={solicitudSeleccionada.codigoSolicitud} disabled />
                                                            </div>
                                                            <div className='campos-datos'>
                                                                <label>Tipo de solicitud:</label>
                                                                <input type="text" value={solicitudSeleccionada.tipoSolicitud} disabled />
                                                            </div>
                                                            <div className='campos-datos'>
                                                                <label>Categoria:</label>
                                                                <input type="text" value={solicitudSeleccionada.categoria} disabled />
                                                            </div>
                                                            <div className='campos-datos'>
                                                                <label>Prioridad:</label>
                                                                <input type="text" value={solicitudSeleccionada.prioridad} disabled />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className='campos-datos'>
                                                                <label>Fecha Solicitud:</label>
                                                                <input type="text" value={solicitudSeleccionada.fechaSolicitud} disabled />
                                                            </div>
                                                            <div className='campos-datos'>
                                                                <label>Descripción:</label>
                                                                <textarea className='p-2 w-100 text-center' type="text" value={solicitudSeleccionada.descripcion} disabled />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className='campos-datos'>
                                                                <label>Fecha Respuesta:</label>
                                                                <input type="text" value={solicitudSeleccionada.fechaRespuesta || '👻👻👻'} disabled />
                                                            </div>
                                                            <div className='campos-datos'>
                                                                <label>Respuesta:</label>
                                                                <textarea className='p-2 w-100 text-center' type="text" value={solicitudSeleccionada.respuesta || '👻👻👻'} disabled />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className='campos-datos'>
                                                                <label>Estado:</label>
                                                                <input type="text" value={solicitudSeleccionada.estado} disabled />
                                                            </div>
                                                            <div className='campos-datos'>
                                                                <label>Sub estado:</label>
                                                                <input type="text" value={solicitudSeleccionada.subestado || '👻👻👻'} disabled />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="formulario-botones-completo">
                                                        <button className="btn btn-secondary" onClick={() => setMostrarFormularioCOMPLETO(false)}>Volver</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                    <td>{solicitud.fechaSolicitud}</td>
                                    <td>{solicitud.tipoSolicitud}</td>
                                    <td>{solicitud.categoria}</td>
                                    <td>{solicitud.prioridad}</td>
                                    <td className='fw-bold'>{solicitud.estado}</td>
                                    <td>{solicitud.subestado || "👻👻👻"}</td>
                                    <td className='tabla-acciones-permisos'>
                                        <button className='btn btn-primary' onClick={() => {
                                            if (solicitud.estado === "Cancelado" || solicitud.estado === "Cerrado") {
                                                Swal.fire({
                                                    icon: 'error',
                                                    title: 'No se puede actualizar',
                                                    text: `La solicitud está en estado ${solicitud.estado}. Solo las solicitudes en estado PENDIENTE pueden actualizarse.`,
                                                    showConfirmButton: false,
                                                    timer: 3000
                                                });
                                                return; // Evita que el formulario se abra
                                            }

                                            // Si el estado es PENDIENTE, permite la actualización
                                            setFormActualizar({
                                                codigoSolicitud: solicitud.codigoSolicitud,
                                                descripcion: solicitud.descripcion,
                                                prioridad: solicitud.prioridad,
                                                estado: solicitud.estado
                                            });
                                            setMostrarFormularioACT(true);
                                        }}>
                                            Actualizar
                                        </button>
                                        {mostrarFormularioACT && (
                                            <div className="modal-overlay modal-Arreglo-2">
                                                <div className="modal-content">
                                                    <h3 className="text-center">ACTUALIZAR SOLICITUD</h3>
                                                    <div className="formulario-campos">
                                                        <label>Descripción:</label>
                                                        <textarea className='p-2 w-100'
                                                            type="text"
                                                            name="descripcion"
                                                            value={formActualizar.descripcion}
                                                            onChange={handleActualizarChange}
                                                            required
                                                        />
                                                        <label>Prioridad:</label>
                                                        <select className='text-center' name="prioridad" value={formActualizar.prioridad} onChange={handleActualizarChange}>
                                                            <option value="">Sin seleccionar</option>
                                                            <option value="Baja">Baja</option>
                                                            <option value="Media">Media</option>
                                                            <option value="Alta">Alta</option>
                                                        </select>
                                                        <label>Estado:</label>
                                                        <select className='text-center' name="estado" value={formActualizar.estado} onChange={handleActualizarChange}>
                                                            <option value="">Sin seleccionar</option>
                                                            <option value="Cancelado">Cancelado</option>
                                                            <option value="Pendiente">Pendiente</option>
                                                        </select>
                                                    </div>
                                                    <div className="formulario-botones">
                                                        <button className="btn btn-primary" onClick={handleActualizarSolicitud}>Actualizar</button>
                                                        <button className="btn btn-secondary" onClick={() => setMostrarFormularioACT(false)}>Cancelar</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <button className='btn btn-success' onClick={() => {
                                            if (solicitud.estado === "Cancelado" || solicitud.estado === "Cerrado") {
                                                Swal.fire({
                                                    icon: 'error',
                                                    title: 'No se puede responder',
                                                    text: `La solicitud está en estado ${solicitud.estado}. Solo las solicitudes en estado PENDIENTE pueden responderse.`,
                                                    showConfirmButton: false,
                                                    timer: 5000
                                                });
                                                return; // Evita que el formulario se abra
                                            }

                                            // Si el estado es PENDIENTE, permite la respuesta
                                            setFormRespuesta({
                                                codigoSolicitud: solicitud.codigoSolicitud,
                                                respuesta: '',
                                                subestado: ''
                                            });
                                            setMostrarFormularioRESPUESTA(true);
                                        }}>
                                            Responder
                                        </button>
                                        {mostrarFormularioRESPUESTA && (
                                            <div className="modal-overlay modal-Arreglo-2">
                                                <div className="modal-content">
                                                    <h3 className="text-center">RESPONDER SOLICITUD</h3>
                                                    <div className="formulario-campos">
                                                        <label>Respuesta:</label>
                                                        <textarea className='p-2 w-100'
                                                            type="text"
                                                            name="respuesta"
                                                            value={formRespuesta.respuesta}
                                                            onChange={handleRespuestaChange}
                                                            required
                                                        />
                                                        <label>Sub estado:</label>
                                                        <select className='text-center' name="subestado" value={formRespuesta.subestado} onChange={handleRespuestaChange}>
                                                            <option value="">Sin seleccionar</option>
                                                            <option value="Acogido">Acogido</option>
                                                            <option value="No_acogido">No_acogido</option>
                                                        </select>
                                                    </div>
                                                    <div className="formulario-botones">
                                                        <button className="btn btn-success" onClick={handleResponderSolicitud}>Responder</button>
                                                        <button className="btn btn-secondary" onClick={() => setMostrarFormularioRESPUESTA(false)}>Cancelar</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8">No se encontraron solicitudes del filtrado.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default SolicitudesClientes;
