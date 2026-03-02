import React, { useEffect, useState } from 'react';
import UsuarioBD from './BASE DE DATOS/UsuarioBD';
import Swal from 'sweetalert2';
import './Usuario.css';


function Usuario() {
    const [usuarios, setUsuarios] = useState([]);
    const [rolesActivos, setRolesActivos] = useState([]);
    const [dniBuscar, setDniBuscar] = useState('');
    const [modalVisible, setModalVisible] = useState(false); // Estado para mostrar el modal
    const [nuevoUsuario, setNuevoUsuario] = useState({
        nombreRol: '',
        dni: '',
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        email: '',
        telefono: ''
    });
    // Función para limpiar el formulario
    const limpiarFormulario = () => {
        setNuevoUsuario({
            nombreRol: '',
            dni: '',
            nombre: '',
            apellidoPaterno: '',
            apellidoMaterno: '',
            email: '',
            telefono: ''
        });
    };
    const [modalVisibleActualizar, setModalVisibleActualizar] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState({
        dni: '',
        nombreRol: '',
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        email: '',
        telefono: ''
    });
    const [usuarioOriginal, setUsuarioOriginal] = useState({
        nombreRol: '',
        dni: '',
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        email: '',
        telefono: ''
    });
    // Abrir y cerrar el modal
    const abrirModal = () => setModalVisible(true);
    const cerrarModal = () => {
        limpiarFormulario(); // Limpiar el formulario al cerrar el modal
        setModalVisible(false); // Suponiendo que tienes un estado para el modal
    };
    const abrirModalActualizar = (usuario) => {
        setUsuarioSeleccionado({
            ...usuario,
            nombreRol: usuario.roles?.nombreRol || ''
        });
        setUsuarioOriginal({ ...usuario });
        setModalVisibleActualizar(true);
    };

    const cerrarModalActualizar = () => setModalVisibleActualizar(false);

    useEffect(() => {
        // Llamada al backend para obtener la lista de usuarios
        UsuarioBD.listarUsuarios()
            .then(response => {
                setUsuarios(response.data); // Actualizamos el estado con los usuarios obtenidos
            })
            .catch(error => {
                console.error("Error al listar usuarios:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al listar usuarios',
                    text: error.message || 'Ocurrió un error inesperado al obtener los usuarios.',
                    showConfirmButton: true,
                });
            });
    }, []);

    useEffect(() => {
        UsuarioBD.obtenerRolesActivos()
            .then(response => {
                setRolesActivos(response.data);
            })
            .catch(error => {
                console.error("Error al obtener roles activos:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al listar Roles',
                    text: error.message || 'Ocurrió un error inesperado al obtener los Roles.',
                    showConfirmButton: true,
                });
            });
    }, []);

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setNuevoUsuario({ ...nuevoUsuario, [name]: value });
    };

    const manejarCambioActualizar = (e) => {
        const { name, value } = e.target;
        setUsuarioSeleccionado({ ...usuarioSeleccionado, [name]: value });
    };

    const buscarUsuario = () => {
        // Verificar si el campo DNI está vacío
        if (dniBuscar.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Formulario vacío',
                text: 'Por favor, ingrese un DNI.',
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        // Verificar que el DNI contenga solo 8 caracteres numéricos
        if (!/^\d{8}$/.test(dniBuscar)) {
            Swal.fire({
                icon: 'error',
                title: 'Dato inválido',
                text: 'El DNI a buscar debe tener 8 caracteres numéricos.',
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        // Mostrar alert de búsqueda en proceso
        Swal.fire({
            title: 'Buscando...',
            text: 'Estamos buscando al usuario, por favor espere.',
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // Realizar la búsqueda en la base de datos
        UsuarioBD.buscarUsuarioPorDni(dniBuscar)
            .then(response => {
                Swal.close(); // Cerrar el alerta de búsqueda

                // Verificar si la respuesta contiene un mensaje indicando que no se encuentra el usuario
                if (typeof response.data === 'string' && response.data.includes("no se encuentra")) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Usuario no encontrado',
                        text: response.data, // El mensaje que indica que no se encontró el cliente
                        showConfirmButton: false,
                        timer: 3000
                    });
                } else if (response.data) {
                    // Si la respuesta es un objeto de usuario válido, mostrar los datos
                    setUsuarios([response.data]);
                }

                // Limpiar el campo de búsqueda después de la búsqueda
                setDniBuscar('');
            })
            .catch(error => {
                Swal.close(); // Cerrar el alerta de búsqueda
                Swal.fire({
                    icon: 'error',
                    title: 'Error al buscar usuario',
                    text: 'Ocurrió un error inesperado.',
                });
                // Limpiar el campo de búsqueda después de un error
                setDniBuscar('');
            });
    };

    // Enviar los datos al backend para crear un usuario
    const CrearUsuario = () => {
        // Validar si el formulario está vacío
        const formulariovacio = `${nuevoUsuario.dni || ''} ${nuevoUsuario.nombre || ''} ${nuevoUsuario.apellidoPaterno || ''}
            ${nuevoUsuario.apellidoMaterno || ''} ${nuevoUsuario.email || ''} ${nuevoUsuario.telefono || ''} ${nuevoUsuario.nombreRol || ''}`;
        if (!formulariovacio.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Formulario Vacio',
                text: 'El formulario no puede estar vacio, por favor rellenar datos.',
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        const errores = [];

        // Validar selección de rol
        if (!nuevoUsuario.nombreRol || nuevoUsuario.nombreRol.trim() === "") {
            errores.push("Debe seleccionar un rol.");
        }
        // Validar el DNI: solo 8 caracteres numéricos
        if (!nuevoUsuario.dni || nuevoUsuario.dni.trim() === "") {
            errores.push("El DNI no puede estar vacío.");
        } else if (!/^\d{8}$/.test(nuevoUsuario.dni.trim())) {
            errores.push("El DNI debe tener exactamente 8 caracteres numéricos.");
        }

        // Validar el nombre: no vacío y solo letras y espacios
        if (!nuevoUsuario.nombre || nuevoUsuario.nombre.trim() === "") {
            errores.push("El nombre no puede estar vacío.");
        } else if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/.test(nuevoUsuario.nombre.trim())) {
            errores.push("El nombre solo puede contener letras y espacios.");
        }

        // Validar apellido paterno: no vacío y solo acepta letras
        if (!nuevoUsuario.apellidoPaterno || nuevoUsuario.apellidoPaterno.trim() === "") {
            errores.push("El apellido paterno no puede estar vacío.");
        } else if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ]+$/.test(nuevoUsuario.apellidoPaterno.trim())) {
            errores.push("El apellido paterno solo puede contener letras.");
        }

        // Validar apellido materno: no vacío y solo acepta letras
        if (!nuevoUsuario.apellidoMaterno || nuevoUsuario.apellidoMaterno.trim() === "") {
            errores.push("El apellido materno no puede estar vacío.");
        } else if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ]+$/.test(nuevoUsuario.apellidoMaterno.trim())) {
            errores.push("El apellido materno solo puede contener letras.");
        }

        // Validar correo electrónico: no vacío y debe seguir el formato estándar
        if (!nuevoUsuario.email || nuevoUsuario.email.trim() === "") {
            errores.push("El correo electrónico no puede estar vacío.");
        } else if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(nuevoUsuario.email.trim())) {
            errores.push("El correo electrónico no tiene un formato válido.");
        }

        // Validar teléfono: no vacío y debe tener 9 caracteres numéricos
        if (!nuevoUsuario.telefono || nuevoUsuario.telefono.trim() === "") {
            errores.push("El teléfono no puede estar vacío.");
        } else if (!/^\d{9}$/.test(nuevoUsuario.telefono.trim())) {
            errores.push("El teléfono debe tener 9 caracteres numéricos.");
        }

        // Si hay errores, mostrar el alert con los mensajes
        if (errores.length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error al crear usuario',
                html: errores.join('<br>'),
                showConfirmButton: true
            });
            return;
        }
        // Si no hay errores, continuar con la creación del usuario
        UsuarioBD.crearUsuario(nuevoUsuario)
            .then(response => {
                Swal.fire({
                    icon: 'success',
                    title: 'Usuario creado con éxito',
                    text: 'El nuevo usuario ha sido creado correctamente.',
                    showConfirmButton: false,
                    timer: 3000
                });
                limpiarFormulario(); // Limpiar el formulario después de crear el usuario
                cerrarModal(); // Cerrar el modal
                // Recargar la lista de usuarios después de crear uno
                UsuarioBD.listarUsuarios()
                    .then(res => setUsuarios(res.data))
                    .catch(err => console.error(err));
            })
            .catch(error => {
                // Verificar si el backend devuelve un error con el mensaje "El DNI {dni} ya existe."
                if (error.response && error.response.data.includes("ya existe")) {
                    Swal.fire({
                        icon: 'error',
                        title: 'DNI Duplicado',
                        text: error.response.data,
                        showConfirmButton: false,
                        timer: 3000
                    });
                } else {
                    // Manejar otros errores del backend
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al crear usuario',
                        text: 'Ocurrió un error al intentar guardar el usuario. Inténtalo nuevamente.',
                        showConfirmButton: true
                    });
                }
            });
    };


    const actualizarUsuario = () => {
        const formulariovacio = `${usuarioSeleccionado.nombre || ''} ${usuarioSeleccionado.apellidoPaterno || ''} 
            ${usuarioSeleccionado.apellidoMaterno || ''} ${usuarioSeleccionado.email || ''} ${usuarioSeleccionado.telefono || ''} ${usuarioSeleccionado.nombreRol || ''}`;

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

        const errores = [];

        // Validar selección de rol
        if (!usuarioSeleccionado.nombreRol || usuarioSeleccionado.nombreRol.trim() === "") {
            errores.push("Debe seleccionar un rol.");
        }

        // Validar el nombre: no vacío y solo letras y espacios
        if (!usuarioSeleccionado.nombre || usuarioSeleccionado.nombre.trim() === "") {
            errores.push("El nombre no puede estar vacío.");
        } else if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/.test(usuarioSeleccionado.nombre.trim())) {
            errores.push("El nombre solo puede contener letras y espacios.");
        }

        // Validar apellido paterno: no vacío y solo acepta letras
        if (!usuarioSeleccionado.apellidoPaterno || usuarioSeleccionado.apellidoPaterno.trim() === "") {
            errores.push("El apellido paterno no puede estar vacío.");
        } else if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ]+$/.test(usuarioSeleccionado.apellidoPaterno.trim())) {
            errores.push("El apellido paterno solo puede contener letras.");
        }

        // Validar apellido materno: no vacío y solo acepta letras
        if (!usuarioSeleccionado.apellidoMaterno || usuarioSeleccionado.apellidoMaterno.trim() === "") {
            errores.push("El apellido materno no puede estar vacío.");
        } else if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ]+$/.test(usuarioSeleccionado.apellidoMaterno.trim())) {
            errores.push("El apellido materno solo puede contener letras.");
        }

        // Validar correo electrónico: no vacío y debe seguir el formato estándar
        if (!usuarioSeleccionado.email || usuarioSeleccionado.email.trim() === "") {
            errores.push("El correo electrónico no puede estar vacío.");
        } else if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(usuarioSeleccionado.email.trim())) {
            errores.push("El correo electrónico no tiene un formato válido.");
        }

        // Validar teléfono: no vacío y debe tener 9 caracteres numéricos
        if (!usuarioSeleccionado.telefono || usuarioSeleccionado.telefono.trim() === "") {
            errores.push("El teléfono no puede estar vacío.");
        } else if (!/^\d{9}$/.test(usuarioSeleccionado.telefono.trim())) {
            errores.push("El teléfono debe tener 9 caracteres numéricos.");
        }

        const datosActualizados = {
            dni: (usuarioSeleccionado.dni || "").trim(),
            nombre: (usuarioSeleccionado.nombre || "").trim(),
            apellidoPaterno: (usuarioSeleccionado.apellidoPaterno || "").trim(),
            apellidoMaterno: (usuarioSeleccionado.apellidoMaterno || "").trim(),
            email: (usuarioSeleccionado.email || "").trim(),
            telefono: (usuarioSeleccionado.telefono || "").trim(),
            nombreRol: (usuarioSeleccionado.nombreRol || "").trim(),
        };

        const noCambios =
            datosActualizados.dni === (usuarioOriginal.dni || "").trim() &&
            datosActualizados.nombre === (usuarioOriginal.nombre || "").trim() &&
            datosActualizados.apellidoPaterno === (usuarioOriginal.apellidoPaterno || "").trim() &&
            datosActualizados.apellidoMaterno === (usuarioOriginal.apellidoMaterno || "").trim() &&
            datosActualizados.email === (usuarioOriginal.email || "").trim() &&
            datosActualizados.telefono === (usuarioOriginal.telefono || "").trim() &&
            datosActualizados.nombreRol === (usuarioOriginal.roles?.nombreRol || "").trim();

        if (noCambios) {
            Swal.fire({
                icon: 'info',
                title: 'Sin cambios',
                text: 'No se realizaron cambios en la información del usuario.',
                showConfirmButton: false,
                timer: 3000
            });
            return; // Detener la ejecución si no hubo cambios
        }

        // Si hay errores, mostrar el alert con los mensajes
        if (errores.length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error al actualizar usuario',
                html: errores.join('<br>'),
                showConfirmButton: true
            });
            return;
        }

        // Si no hay errores, continuar con la actualización del usuario
        UsuarioBD.actualizarUsuario(datosActualizados)
            .then(response => {
                Swal.fire({
                    icon: 'success',
                    title: 'Usuario actualizado con éxito',
                    text: 'El usuario ha sido actualizado correctamente.',
                    showConfirmButton: false,
                    timer: 3000
                });
                setModalVisibleActualizar(false);
                // Recargar la lista de usuarios después de actualizar uno
                UsuarioBD.listarUsuarios()
                    .then(res => setUsuarios(res.data))
                    .catch(err => console.error(err));
            })
            .catch(error => {
                console.error("Error al actualizar usuario:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al actualizar usuario',
                    text: 'Ocurrió un error al intentar actualizar el usuario. Inténtalo nuevamente.',
                    showConfirmButton: true
                });
            });
    };

    const ActualizarEstado = (usuario) => {
        const nuevoEstado = usuario.estado === "Activo" ? "Desactivado" : "Activo";

        // Mostrar alerta de confirmación
        Swal.fire({
            title: `¿Estás seguro de cambiar el estado del usuario a "${nuevoEstado}"?`,
            text: `El usuario será marcado como "${nuevoEstado}". Este cambio puede afectar su funcionalidad.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, actualizar estado',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                // Si el usuario confirma el cambio
                UsuarioBD.actualizarEstadoUsuario({ dni: usuario.dni })
                    .then(response => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Estado actualizado',
                            text: `El usuario ahora está "${nuevoEstado}".`,
                            showConfirmButton: false,
                            timer: 2000,
                        });

                        // Actualizar el estado en el frontend
                        setUsuarios(prevUsuarios => prevUsuarios.map(u =>
                            u.dni === usuario.dni ? { ...u, estado: nuevoEstado } : u
                        ));
                    })
                    .catch(error => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error al actualizar estado',
                            text: error.response?.data || 'Ocurrió un error al cambiar el estado.',
                        });
                    });
            } else {
                // Si el usuario cancela el cambio
                Swal.fire({
                    icon: 'info',
                    title: 'Cambio cancelado',
                    text: 'No se realizó ningún cambio en el estado del usuario.',
                    showConfirmButton: false,
                    timer: 2000,
                });
            }
        });
    };

    return (
        <div className="usuario-page">
            <h2 className='titulo-usuario'>Gestion de usuario</h2>

            <div className='acciones-usuario'>
                <div className='acciones-btn-usuario'>
                    <button className='btn btn-success' onClick={abrirModal}>Crear Usuario</button>

                    {/* Modal */}
                    {modalVisible && (
                        <div className="modal">
                            <div className="modal-content">
                                <h3>CREAR USUARIO</h3>
                                <form>
                                    <div className="form-group">
                                        <label>Nombre Rol:</label>
                                        <select
                                            name="nombreRol"
                                            value={nuevoUsuario.nombreRol || ''}
                                            onChange={manejarCambio} className='text-center'>
                                            <option value="">Seleccione un rol</option>
                                            {rolesActivos.map((rol, index) => (
                                                <option key={rol.idRol || index} value={rol.nombreRol}>{rol.nombreRol}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>DNI:</label>
                                        <input type="text" name="dni" value={nuevoUsuario.dni} onChange={manejarCambio} />
                                    </div>
                                    <div className="form-group">
                                        <label>Nombre:</label>
                                        <input type="text" name="nombre" value={nuevoUsuario.nombre} onChange={manejarCambio} />
                                    </div>
                                    <div className="form-group">
                                        <label>Apellido Paterno:</label>
                                        <input type="text" name="apellidoPaterno" value={nuevoUsuario.apellidoPaterno} onChange={manejarCambio} />
                                    </div>
                                    <div className="form-group">
                                        <label>Apellido Materno:</label>
                                        <input type="text" name="apellidoMaterno" value={nuevoUsuario.apellidoMaterno} onChange={manejarCambio} />
                                    </div>
                                    <div className="form-group">
                                        <label>Email:</label>
                                        <input type="email" name="email" value={nuevoUsuario.email} onChange={manejarCambio} />
                                    </div>
                                    <div className="form-group">
                                        <label>Teléfono:</label>
                                        <input type="text" name="telefono" value={nuevoUsuario.telefono} onChange={manejarCambio} />
                                    </div>
                                </form>
                                <div className="modal-actions">
                                    <button className='btn btn-success' onClick={CrearUsuario}>Crear</button>
                                    <button className='btn btn-secondary' onClick={cerrarModal}>Cancelar</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="acciones-formulario-buscar">
                    <input
                        type="text"
                        placeholder='Ingresar Dni'
                        value={dniBuscar}
                        onChange={(e) => setDniBuscar(e.target.value)}
                    />
                    <div className='btn-acciones-buscar'>
                        <button className='btn btn-info' onClick={buscarUsuario}>Buscar</button>
                        <button className='btn btn-secondary' onClick={() => {
                            setDniBuscar('');
                            UsuarioBD.listarUsuarios()
                                .then(response => {
                                    setUsuarios(response.data);
                                })
                                .catch(error => {
                                    console.error("Error al listar usuarios:", error);
                                });
                        }}>
                            Normalidad
                        </button>
                    </div>
                </div>
            </div>

            <table className='table table-primary table-hover table-bordered border-primary text-center tabla-usuario'>
                <thead>
                    <tr>
                        <th>Rol</th>
                        <th>Dni</th>
                        <th>Nombres Completo</th>
                        <th>Nombre Usuario</th>
                        <th>Email Personal</th>
                        <th>Telefono</th>
                        <th>Estado</th>
                        <th>Accion</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(usuarios) && usuarios.length > 0 ? (
                        usuarios.map(usuario => (
                            <tr key={usuario.dni}>
                                <td>{usuario.roles?.nombreRol}</td>
                                <td>{usuario.dni}</td>
                                <td>{`${usuario.nombre} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno}`}</td>
                                <td>{usuario.nombreUsuario}</td>
                                <td>{usuario.email}</td>
                                <td>{usuario.telefono}</td>
                                <td className='tabla-estado-usuario'>
                                    <button
                                        className={`btn ${usuario.estado === 'Activo' ? 'btn-light' : 'btn-dark'}`}
                                        onClick={() => ActualizarEstado(usuario)}
                                    >
                                        {usuario.estado}
                                    </button>
                                </td>
                                <td>
                                    <button className='btn btn-primary btn-actualizar-usuario' onClick={() => abrirModalActualizar(usuario)}>Actualizar</button>

                                    {/* Modal Actualizar Usuario */}
                                    {modalVisibleActualizar && usuarioSeleccionado.dni === usuario.dni && (
                                        <div className="modal">
                                            <div className="modal-content">
                                                <h3>ACTUALIZAR USUARIO</h3>
                                                <form>
                                                    <div className="form-group">
                                                        <label>Nombre Rol:</label>
                                                        <select
                                                            name="nombreRol"
                                                            value={usuarioSeleccionado.nombreRol || ''}
                                                            onChange={manejarCambioActualizar} className='text-center'>
                                                            {usuarioSeleccionado.nombreRol === '' && (
                                                                <option value="">Seleccione un rol</option>
                                                            )}
                                                            {rolesActivos.map((rol, index) => (
                                                                <option key={rol.idRol || index} value={rol.nombreRol}>
                                                                    {rol.nombreRol}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>DNI:</label>
                                                        <input
                                                            type="text"
                                                            name="dni"
                                                            value={usuarioSeleccionado.dni}
                                                            disabled // No editable
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Nombre:</label>
                                                        <input
                                                            type="text"
                                                            name="nombre"
                                                            value={usuarioSeleccionado.nombre}
                                                            onChange={manejarCambioActualizar}
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Apellido Paterno:</label>
                                                        <input
                                                            type="text"
                                                            name="apellidoPaterno"
                                                            value={usuarioSeleccionado.apellidoPaterno}
                                                            onChange={manejarCambioActualizar}
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Apellido Materno:</label>
                                                        <input
                                                            type="text"
                                                            name="apellidoMaterno"
                                                            value={usuarioSeleccionado.apellidoMaterno}
                                                            onChange={manejarCambioActualizar}
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Email:</label>
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            value={usuarioSeleccionado.email}
                                                            onChange={manejarCambioActualizar}
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Teléfono:</label>
                                                        <input
                                                            type="text"
                                                            name="telefono"
                                                            value={usuarioSeleccionado.telefono}
                                                            onChange={manejarCambioActualizar}
                                                        />
                                                    </div>
                                                </form>
                                                <div className="actualizar-btn-usuario">
                                                    <button className="btn btn-primary" onClick={actualizarUsuario}>Actualizar</button>
                                                    <button className="btn btn-secondary" onClick={cerrarModalActualizar}>Cancelar</button>
                                                </div>

                                            </div>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8">No hay usuarios disponibles</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default Usuario;