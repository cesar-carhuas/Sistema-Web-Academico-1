import React, { useEffect, useState } from 'react';
import './Espacios.css';
import Swal from 'sweetalert2';
import EspacioBD from './BASE_DE_DATOS/EspacioBD';
import AlquileresBD from './BASE_DE_DATOS/AlquileresBD';

function Espacios() {
    // ===========================================
    //  variables generales
    // ===========================================
    const [Espacios, setEspacios] = useState([]);
    const [Alquileres, setAlquileres] = useState([]);
    const [nuevoEstado, setNuevoEstado] = useState('');
    const [nuevoEspacio, setNuevoEspacio] = useState({
        dni: '',
        nombre: '',
        contacto: '',
        inicio: '',
        final: '',
        espacio: '',
        estado: 'Disponible',
    });
    const [codigoActualizar, setCodigoActualizar] = useState('');
    const [codigoEliminar, setCodigoEliminar] = useState('');
    const [accionSeleccionada, setAccionSeleccionada] = useState('');
    const [dniCliente, setDniCliente] = useState('');
    const [inicioAlquiler, setInicioAlquiler] = useState('');
    const [finAlquiler, setFinAlquiler] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('');
    // ===========================================
    // variables del formulario Modal o Flotante
    // ===========================================
    const [showModal, setShowModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const handleModalToggle = () => {
        setShowModal(!showModal);
        if (!showModal) {
            // Resetea los valores del formulario
            setNuevoEspacio({
                dni: '',
                nombre: '',
                contacto: '',
                inicio: '',
                final: '',
                espacio: '',
                estado: 'Disponible',
            });
        }
    };
    const handleUpdateModalToggle = () => {
        setShowUpdateModal(!showUpdateModal);
        if (!showUpdateModal) {
            // Resetea los valores del formulario de actualización
            setCodigoActualizar('');
            setNuevoEstado('');
            setAccionSeleccionada('');
            setDniCliente('');
            setInicioAlquiler('');
            setFinAlquiler('');
        }
    };
    const handleDeleteModalToggle = () => {
        setShowDeleteModal(!showDeleteModal);
        if (!showDeleteModal) {
            // Resetea los valores del formulario de eliminación
            setCodigoEliminar('');
        }
    };

    const mostrarErrores = (errores) => {
        if (errores.length > 0) {
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Errores en el formulario",
                html: errores.map((error) => `<p>${error}</p>`).join(""),
                showConfirmButton: true,
            });
            return true; // Indica que hay errores
        }
        return false; // No hay errores
    };
    // ===========================================
    // Funciones para cargar datos
    // ===========================================
    // para cargar la tabla espacio.
    const fetchEspacios = async () => {
        try {
            const response = await EspacioBD.getAllEspacios();
            setEspacios(response.data);
        } catch (error) {
            console.error("Error al cargar los espacios:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error al cargar los espacios',
                text: error.message || 'Ocurrió un error inesperado al cargar los espacios.',
                showConfirmButton: true,
            });
        }
    };
    // para cargar la tabla alquiler
    const fetchAlquileres = async () => {
        try {
            const response = await AlquileresBD.getAllAlquileres();
            setAlquileres(response.data);
        } catch (error) {
            console.error("Error al cargar los alquileres:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error al cargar los alquileres',
                text: error.message || 'Ocurrió un error inesperado al cargar los alquileres.',
                showConfirmButton: true,
            });
        }
    };
    // para cargar los dos juntos al mismo tiempo
    const espaciosCombinados = Espacios.map((espacio) => {
        const alquiler = Alquileres.find(
            (alquiler) => alquiler.espacio.idEspacio === espacio.idEspacio
        );
        return {
            ...espacio,
            dni: alquiler?.cliente.dni || '👻👻👻', // Datos del cliente
            nombrescompleto: alquiler
                ? `${alquiler.cliente.nombre} ${alquiler.cliente.apellidoPaterno} ${alquiler.cliente.apellidoMaterno}`
                : '👻👻👻',
            telefono: alquiler?.cliente.telefono || '👻👻👻',
            nota: alquiler?.cliente.notaAdicional || '👻👻👻',
            fechaInicioAlquiler: alquiler?.fechaInicioAlquiler || '👻👻👻',
            fechaFinAlquiler: alquiler?.fechaFinAlquiler || '👻👻👻',
            diasAlquiler: alquiler?.dias_alquiler || '👻👻👻'
        };
    });
    // para que se pueda visualizar los datos de los dos.
    useEffect(() => {
        fetchEspacios();
        fetchAlquileres();
    }, []);


    // para que se pueda visualizar datos en actualizar
    useEffect(() => {
        if (codigoActualizar && accionSeleccionada === 'Actualizar_alquiler') {
            obtenerDatosAlquiler(codigoActualizar);
        }
    }, [codigoActualizar, accionSeleccionada, Alquileres]);

    // ===========================================
    // funciones para agregar, actualizar y eliminar.
    // ===========================================
    // agregar alquiler
    const espaciosDisponibles = Espacios.filter((dato) => dato.estado === 'Disponible');

    const agregarAlquiler = async () => {
        // Verificar si el formulario está completamente vacío
        if (!nuevoEspacio.dni && !nuevoEspacio.espacio && !nuevoEspacio.final) {
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Formulario vacío",
                text: "Por favor, rellena los campos antes de enviar.",
                showConfirmButton: true,
            });
            return; // Detener la ejecución
        }

        // Fecha de inicio automática
        const fechaInicioAutomatica = new Date().toISOString().split("T")[0];

        // Inicializar una lista de errores
        const errores = [];

        // Validaciones
        if (!nuevoEspacio.dni) {
            errores.push("El campo DNI está vacío.");
        } else if (nuevoEspacio.dni.length !== 8 || isNaN(nuevoEspacio.dni)) {
            errores.push("El DNI debe contener exactamente 8 dígitos numéricos.");
        }

        if (!nuevoEspacio.espacio) {
            errores.push("Debes seleccionar un espacio disponible.");
        }

        if (!nuevoEspacio.final) {
            errores.push("Debes seleccionar una fecha de finalización.");
        } else if (nuevoEspacio.final < fechaInicioAutomatica) {
            errores.push(
                `La fecha final debe ser mayor que la fecha de inicio. <br/> fecha inicio: ${fechaInicioAutomatica} <br/> fecha final: ${nuevoEspacio.final}`
            );
        }

        // Si hay errores, mostrar un alert con todos
        if (errores.length > 0) {
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Errores en el formulario",
                html: errores.map((error) => `<p>${error}</p>`).join(""),
                showConfirmButton: true,
            });
            return; // Detener la ejecución si hay errores
        }

        // Datos a enviar
        const alquiler = {
            dni: nuevoEspacio.dni,
            codigoEspacio: nuevoEspacio.espacio,
            fechaFin: nuevoEspacio.final, // Se envía al backend
        };

        try {
            const response = await AlquileresBD.agregarAlquiler(alquiler);

            setAlquileres((prevAlquileres) => [...prevAlquileres, response.data]);

            setEspacios((prevEspacios) =>
                prevEspacios.map((espacio) =>
                    espacio.codigoEspacio === nuevoEspacio.espacio
                        ? { ...espacio, estado: 'Ocupado' }
                        : espacio
                )
            );

            setNuevoEspacio({
                dni: '',
                nombre: '',
                contacto: '',
                inicio: '',
                final: '',
                espacio: '',
                estado: 'Disponible',
            });
            setShowModal(false);

            await fetchEspacios();
            await fetchAlquileres();

            Swal.fire({
                position: "center",
                icon: "success",
                title: "¡Alquiler agregado con éxito!",
                showConfirmButton: false,
                timer: 3000,
            });
        } catch (error) {
            // Verificar si el error es 404 y mostrar mensaje personalizado
            if (error.response?.status === 404) {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Error al agregar el alquiler",
                    text: `Cliente con DNI ${nuevoEspacio.dni} no existe.`,
                    showConfirmButton: true,
                });
            } else {
                // Otros errores
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Error al agregar el alquiler",
                    text: error.response?.data?.message || "Por favor, inténtalo nuevamente.",
                    showConfirmButton: true,
                });
            }
        }
    };

    // ACTUALIZARRRRRRRRRRRRRRRRRRRRRRRRRRRRRR
    const manejarActualizacion = async () => {
        if (!accionSeleccionada) {
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Falta seleccionar una acción",
                text: "Por favor selecciona si deseas actualizar el alquiler o el estado.",
                showConfirmButton: true,
            });
            return;
        }

        if (accionSeleccionada === "Actualizar_alquiler") {
            await actualizarAlquiler();
        } else if (accionSeleccionada === "Actualizar_estado") {
            await actualizarEstado();
        }
    };

    const manejarAccionSeleccionada = (e) => {
        const accion = e.target.value;
        setAccionSeleccionada(accion);

        // Restablecer valores relacionados con la acción seleccionada
        setCodigoActualizar('');  // Limpiar el código del espacio seleccionado
        setDniCliente('');  // Limpiar el DNI del cliente cuando se cambia de acción
        setNuevoEstado('');  // Limpiar el estado cuando se cambia de acción

    };

    // actualizar alquiler

    const obtenerDatosAlquiler = (codigoEspacio) => {
        // Busca el alquiler asociado al espacio seleccionado
        const alquiler = Alquileres.find(
            (alquiler) => alquiler.espacio?.codigoEspacio === codigoEspacio
        );

        if (alquiler) {
            setDniCliente(alquiler.cliente.dni); // Establece el DNI actual
        } else {
            console.warn("No se encontró un alquiler con el código:", codigoEspacio);
            setDniCliente(''); // Limpia los valores si no se encuentra el alquiler
        }
    };

    const actualizarAlquiler = async () => {
        const errores = [];

        // Validación: Debe seleccionarse un espacio y un DNI
        if (!codigoActualizar) errores.push("Debes seleccionar un espacio para actualizar.");
        if (!dniCliente) errores.push("Debes ingresar el DNI del cliente.");

        // Validación: Verificar si el DNI tiene exactamente 8 caracteres numéricos
        if (dniCliente && (dniCliente.length !== 8 || isNaN(dniCliente))) {
            errores.push("El DNI debe contener exactamente 8 caracteres numéricos.");
        }

        // Validación: Verificar si se está ingresando el mismo DNI
        const alquilerSeleccionado = Alquileres.find((alquiler) => alquiler.espacio.codigoEspacio === codigoActualizar);
        if (alquilerSeleccionado && alquilerSeleccionado.cliente.dni === dniCliente) {
            errores.push("Estás intentando ingresar el mismo DNI.");
        }

        // Mostrar errores y detener ejecución si hay problemas
        if (mostrarErrores(errores)) return;

        try {
            const alquilerActualizado = { dni: dniCliente };
            const response = await AlquileresBD.actualizarAlquilerBD(codigoActualizar, alquilerActualizado);
            if (response.status === 200) {
                await fetchAlquileres(); // Recargar datos en tiempo real
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Alquiler actualizado correctamente",
                    showConfirmButton: false,
                    timer: 3000,
                });
                setShowUpdateModal(false);
                await fetchEspacios();
                await fetchAlquileres();
            }
        } catch (error) {
            if (error.response?.status === 404) {
                // Error 404: Cliente no encontrado
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Error al actualizar el alquiler",
                    text: `Cliente con DNI ${dniCliente} no existe.`,
                    showConfirmButton: true,
                });
            } else {
                // Otros errores
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Error al actualizar el alquiler",
                    text: error.response?.data?.message || "Por favor, inténtalo nuevamente.",
                    showConfirmButton: true,
                });
            }
        }
    };

    // Actualizar Estado

    const actualizarEstado = async () => {
        const errores = [];

        // Validación: Debe seleccionarse un espacio y un estado
        if (!codigoActualizar) errores.push("Debes seleccionar un espacio para actualizar.");
        if (!nuevoEstado) errores.push("Debes seleccionar un nuevo estado.");

        // Validación: Verificar si se está ingresando el mismo estado
        const espacioSeleccionado = Espacios.find((espacio) => espacio.codigoEspacio === codigoActualizar);
        if (espacioSeleccionado?.estado === nuevoEstado) {
            errores.push("Estás intentando ingresar el mismo estado.");
        }

        // Mostrar errores y detener ejecución si hay problemas
        if (mostrarErrores(errores)) return;

        try {
            const response = await AlquileresBD.actualizarEstadoEspacio(codigoActualizar, nuevoEstado);
            if (response.status === 200) {
                await fetchEspacios(); // Recargar datos en tiempo real
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Estado actualizado correctamente",
                    showConfirmButton: false,
                    timer: 3000,
                });
                setShowUpdateModal(false);
                await fetchEspacios();
                await fetchAlquileres();
            }
        } catch (error) {
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Error al actualizar el estado",
                text: error.response?.data?.message || "Por favor, inténtalo nuevamente.",
                showConfirmButton: true,
            });
        }
    };

    const opcionesEstado = () => {
        // Siempre devolver los tres estados disponibles
        return ['Disponible', 'Mantenimiento', 'Ocupado'];
    };



    // Eliminar Alquiler
    const espaciosOcupados = Espacios.filter((dato) => dato.estado === 'Ocupado');

    const EliminarAlquiler = async () => {
        if (!codigoEliminar) {
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Por favor selecciona un espacio para eliminar.",
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        const espacioEliminar = Espacios.find(espacio => espacio.codigoEspacio === codigoEliminar);

        if (espacioEliminar) {
            Swal.fire({
                title: "¿Estás seguro de eliminar este alquiler?",
                text: "Esta acción no se puede deshacer.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar"
            },
                setShowDeleteModal(false)

            ).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        // Llamada al backend
                        const response = await AlquileresBD.eliminarAlquilerBD(codigoEliminar);

                        // Verifica si la respuesta es exitosa
                        if (response.status === 200) {
                            // Actualiza el estado de Espacios
                            setEspacios(prevEspacios =>
                                prevEspacios.map(espacio =>
                                    espacio.codigoEspacio === codigoEliminar
                                        ? { ...espacio, estado: 'IGNORAR', subestado: 'DESACTIVADO' }
                                        : espacio
                                )
                            );

                            // Mensaje de éxito
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "Alquiler eliminado correctamente.",
                                showConfirmButton: false,
                                timer: 1500,
                            });

                            await fetchEspacios();
                            await fetchAlquileres();

                            // Cierra el modal y limpia el estado
                            setShowDeleteModal(false);
                            setCodigoEliminar('');
                        } else {
                            throw new Error("Error inesperado en la respuesta del servidor.");
                        }
                    } catch (error) {
                        Swal.fire({
                            position: "center",
                            icon: "error",
                            title: "Error al eliminar el alquiler.",
                            text: error.response?.data?.message || "Por favor, inténtalo nuevamente.",
                            showConfirmButton: true,
                        });
                    }
                }
            });
        } else {
            console.log("No se encontró el espacio con el código proporcionado.");
        }
    };

    // =========================
    // Funciones del filtro
    // =========================
    const espaciosFiltrados = filtroEstado
        ? espaciosCombinados.filter((espacio) => espacio.estado.toLowerCase() === filtroEstado.toLowerCase())
        : espaciosCombinados;
    const handleFiltroChange = (e) => setFiltroEstado(e.target.value);

    // =============================
    // Funciones para manejar cambios en el formulario
    // =============================
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNuevoEspacio({ ...nuevoEspacio, [name]: value });
    };

    // funcion de ver mas
    const [MasmodalData, MassetModalData] = useState(null);
    const [MasshowModal, MassetShowModal] = useState(false);

    const handleVerMas = (dato) => {
        MassetModalData(dato);
        MassetShowModal(true);
    };
    return (
        <div className="espacios-page">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="title-espacios">Espacios de Almacenamiento</h2>
                <div className="filtro-container">
                    <label htmlFor="filtroEstado" className="form-label">Filtrar por estado</label>
                    <select
                        id="filtroEstado" className="form-select"
                        value={filtroEstado} onChange={handleFiltroChange}>
                        <option value="">Todos</option>
                        <option value="Disponible">Disponible</option>
                        <option value="Ocupado">Ocupado</option>
                        <option value="Mantenimiento">Mantenimiento</option>
                    </select>
                </div>
            </div>

            <div className='btn-acciones'>
                <button className="btn-agregar btn btn-success" onClick={handleModalToggle}>Crear Alquiler</button>
                {showModal && (
                    <div className="modal-backdrop">
                        <div className="modal-content">
                            <h3 className='text-center'>CREAR ALQUILER</h3>
                            <form>
                                <div>
                                    <label>DNI:</label>
                                    <input
                                        type="text" name="dni" value={nuevoEspacio.dni}
                                        onChange={handleInputChange} required
                                        placeholder="Ingrese DNI del cliente" />
                                </div>
                                <div>
                                    <label>Espacio Disponible:</label>
                                    <select
                                        className='select-espacios' name="espacio"
                                        value={nuevoEspacio.espacio} onChange={handleInputChange}
                                        required>
                                        <option value="">Seleccionar</option>
                                        {espaciosDisponibles.length > 0 ? (
                                            espaciosDisponibles.map((espacio) => (
                                                <option key={espacio.codigoEspacio} value={espacio.codigoEspacio}>
                                                    {espacio.codigoEspacio}
                                                </option>
                                            ))
                                        ) : (
                                            <option>No hay espacios disponibles</option>
                                        )}
                                    </select>
                                </div>
                                <div>
                                    <label>Final del alquiler:</label>
                                    <input
                                        type="date" name="final" value={nuevoEspacio.final}
                                        onChange={handleInputChange} required />
                                </div>
                            </form>
                            <div className='modal-btn'>
                                <button className="btn btn-success" onClick={agregarAlquiler}>
                                    Crear
                                </button>
                                <button className="btn btn-secondary" onClick={handleModalToggle}>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <button className='btn-actualizar btn btn-primary' onClick={handleUpdateModalToggle}>Actualizar Alquiler y/o Estado</button>
                {showUpdateModal && (
                    <div className="modal-backdrop">
                        <div className="modal-content">
                            <h3 className='text-center'>ACTUALIZAR ALQUILER</h3>
                            <form>
                                <div>
                                    <label>Selecciona la acción:</label>
                                    <select
                                        value={accionSeleccionada} onChange={manejarAccionSeleccionada}  // Cambié el evento aquí
                                        required>
                                        <option value="">Seleccionar</option>
                                        <option value="Actualizar_alquiler">Actualizar Alquiler</option>
                                        <option value="Actualizar_estado">Actualizar Estado</option>
                                    </select>
                                </div>

                                {/* Mostrar espacios ocupados solo cuando se selecciona "Actualizar Alquiler" */}
                                {accionSeleccionada === 'Actualizar_alquiler' && (
                                    <div>
                                        <label>Seleccionar Espacio:</label>
                                        <select
                                            value={codigoActualizar}
                                            onChange={(e) => {
                                                setCodigoActualizar(e.target.value);
                                                obtenerDatosAlquiler(e.target.value); // Cargar datos al seleccionar el espacio
                                            }}
                                            required
                                        >
                                            <option value="">Seleccionar</option>
                                            {espaciosOcupados.map((espacio) => (
                                                <option key={espacio.codigoEspacio} value={espacio.codigoEspacio}>
                                                    {espacio.codigoEspacio}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {accionSeleccionada === 'Actualizar_alquiler' && codigoActualizar && (
                                    <div>
                                        <label>DNI del cliente:</label>
                                        <input
                                            type="text"
                                            value={dniCliente}
                                            onChange={(e) => setDniCliente(e.target.value)}
                                            required
                                        />
                                    </div>
                                )}

                                {/* Mostrar los 20 espacios cuando se selecciona "Actualizar Estado" */}
                                {accionSeleccionada === 'Actualizar_estado' && (
                                    <div>
                                        <label>Seleccionar Espacio:</label>
                                        <select
                                            value={codigoActualizar}
                                            onChange={(e) => setCodigoActualizar(e.target.value)}
                                            required
                                        >
                                            <option value="">Seleccionar</option>
                                            {Espacios.slice(0, 20).map((espacio) => (
                                                <option key={espacio.codigoEspacio} value={espacio.codigoEspacio}>
                                                    {espacio.codigoEspacio} - {espacio.estado}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {accionSeleccionada === 'Actualizar_estado' && codigoActualizar && (
                                    <div>
                                        <label>Nuevo Estado:</label>
                                        <select
                                            value={nuevoEstado} onChange={(e) => setNuevoEstado(e.target.value)} required>
                                            <option value="">Seleccionar</option>
                                            {opcionesEstado(
                                                Espacios.find((dato) => dato.codigoEspacio === codigoActualizar)?.estado,
                                                codigoActualizar
                                            ).map((opcion) => (
                                                <option key={opcion} value={opcion}>
                                                    {opcion}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </form>
                            <div className='modal-btn'>
                                <button
                                    className="btn btn-primary"
                                    onClick={manejarActualizacion}>
                                    Actualizar
                                </button>
                                <button className="btn btn-secondary" onClick={handleUpdateModalToggle}>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <button className='btn-eliminar btn btn-danger' onClick={handleDeleteModalToggle}>Eliminar Alquiler</button>
                {showDeleteModal && (
                    <div className="modal-backdrop">
                        <div className="modal-content">
                            <h3 className='text-center'>ELIMINAR ALQUILER</h3>
                            <form>
                                <div>
                                    <label>Seleccionar Espacio Ocupado:</label>
                                    <select
                                        value={codigoEliminar}
                                        onChange={(e) => setCodigoEliminar(e.target.value)}
                                        required
                                    >
                                        <option value="">Seleccionar</option>
                                        {espaciosOcupados.map((espacio) => (
                                            <option key={espacio.codigoEspacio} value={espacio.codigoEspacio}>
                                                {espacio.codigoEspacio}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </form>
                            <div className='modal-btn'>
                                <button className="btn btn-danger" onClick={EliminarAlquiler}>
                                    Eliminar
                                </button>
                                <button className="btn btn-secondary" onClick={handleDeleteModalToggle}>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <table className="table table-primary table-hover table-bordered border-primary text-center tabla-espacios">
                <thead>
                    <tr>
                        <th scope="col" className="espacios-n">#</th>
                        <th scope="col" className="espacios-dni">DNI</th>
                        <th scope="col" className="espacios-na">Nombres completo</th>
                        <th scope="col" className="espacios-t">Contacto</th>
                        <th scope="col" className="espacios-nt">Nota</th>
                        <th scope="col" className='espacio-costo'>Costo</th>
                        <th scope="col" className="espacios-fecha">Inicio del alquiler</th>
                        <th scope="col" className="espacios-fecha">Final del alquiler</th>
                        <th scope="col" className="espacios-dias">Dias Alquiler</th>
                        <th scope="col" className="espacios-e">Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(espaciosFiltrados) && espaciosFiltrados.length > 0 ? (

                        espaciosFiltrados.map((dato) => (
                            <tr key={dato.codigoEspacio}>
                                <th scope="row">{dato.codigoEspacio}</th>
                                <td>{dato.dni}</td>
                                <td>{dato.nombrescompleto}</td>
                                <td>{dato.telefono}</td>
                                <td>
                                    <button
                                        className="btn btn-info btn-sm ml-2"
                                        onClick={() => handleVerMas(dato)}>
                                        VER MÁS
                                    </button>
                                </td>

                                {MasshowModal && MasmodalData && (
                                    <div>
                                        <div className="modal-backdrop">
                                            <div className="modal-content">

                                                <label>Nota:</label>
                                                <p>{MasmodalData.nota}</p>

                                                <div className="modal-btn">
                                                    <button type="button" className="btn btn-secondary" onClick={() => MassetShowModal(false)}>Cerrar</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <td>S/ {dato.costo}</td>
                                <td>{dato.fechaInicioAlquiler}</td>
                                <td>{dato.fechaFinAlquiler}</td>
                                <td>{dato.diasAlquiler}</td>
                                <td className='fw-bold'>{dato.estado}</td>
                            </tr>
                        ))) : (
                        <tr>
                            <td colSpan="10">No hay Alquileres y/o espacios disponibles</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
export default Espacios;
