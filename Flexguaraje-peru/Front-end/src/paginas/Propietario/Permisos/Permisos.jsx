import React, { useState, useEffect } from "react";
import PermisosBD from "./BASE DE DATOS/PermisosBD";
import Swal from "sweetalert2";
import './Permisos.css';


function Permisos() {
    const [permisos, setPermisos] = useState([]); // Estado para guardar la lista de permisos
    const [roles, setRoles] = useState([]); // Estado para guardar los roles
    const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
    const [showModalActualizar, setShowModalActualizar] = useState(false); // Estado para controlar el modal de actualización
    const [nombrePermiso, setNombrePermiso] = useState(""); // Estado para el nombre del permiso
    const [selectedRole, setSelectedRole] = useState(""); // Estado para el rol seleccionado
    const [permisoSeleccionado, setPermisoSeleccionado] = useState(null); // Estado para el permiso a actualizar

    // Función para cerrar el modal de creación y limpiar los campos
    const handleCloseModal = () => {
        setShowModal(false); // Cierra el modal
        setNombrePermiso(""); // Limpia el campo del nombre del permiso
        setSelectedRole(""); // Limpia el rol seleccionado
    };

    // Función para obtener los permisos desde el backend
    const fetchPermisos = async () => {
        try {
            const response = await PermisosBD.listarPermisos();
            setPermisos(response.data); // Actualizamos el estado con los permisos obtenidos
        } catch (error) {
            // Usamos Swal para mostrar el error en vez de console.error
            console.error("Error al listar permisos:", error);
            await Swal.fire({
                icon: "error",
                title: "Error al obtener permisos",
                text: `No se pudieron obtener los permisos. Detalles: ${error.message}`,
            });
        }
    };

    // Función para obtener los roles activos desde el backend
    const fetchRolesActivos = async () => {
        try {
            const response = await PermisosBD.listarRolesActivos();
            setRoles(response.data); // Guardamos los roles activos en el estado
        } catch (error) {
            console.error("Error al listar Roles Activos:", error);
            await Swal.fire({
                icon: "error",
                title: "Error al obtener roles",
                text: `No se pudieron obtener los roles activos. Detalles: ${error.message}`,
            });
        }
    };

    // Llamadas a las funciones cuando se carga el componente
    useEffect(() => {
        fetchPermisos(); // Llamar al backend para obtener permisos al cargar el componente
        fetchRolesActivos(); // Llamar al backend para obtener roles activos
    }, []);

    // Función para manejar la creación del permiso
    const handleCrearPermiso = async () => {
        // Validar si los campos están vacíos
        if (!nombrePermiso.trim() && !selectedRole) {
            await Swal.fire({
                icon: "error",
                title: "Formulario vacio",
                text: "Por favor complete todos los campos antes de enviar.",
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        if (!nombrePermiso.trim()) {
            await Swal.fire({
                icon: "warning",
                title: "Atención",
                text: "El campo del nombre del permiso está vacío.",
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        if (!selectedRole) {
            await Swal.fire({
                icon: "warning",
                title: "Atención",
                text: "Por favor seleccione un rol.",
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        // Validar que el nombre del permiso solo acepte letras y espacios
        const regex = /^[a-zA-ZÁÉÍÓÚáéíóúñÑÀ-ÿ\s]+$/;
        if (!regex.test(nombrePermiso)) {
            await Swal.fire({
                icon: "error",
                title: "Nombre inválido",
                text: "El nombre del permiso solo debe contener letras y espacios.",
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        // Verificar si el permiso ya existe
        const permisoExistente = permisos.find(
            (permiso) =>
                permiso.nombrePermiso.toLowerCase() === nombrePermiso.toLowerCase() &&
                permiso.roles?.nombreRol === selectedRole
        );
        if (permisoExistente) {
            await Swal.fire({
                icon: "warning",
                title: "Permiso duplicado",
                text: "Ya existe un permiso con este nombre para el rol seleccionado.",
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        // Crear el permiso si todo está bien
        const nuevoPermiso = {
            nombreRol: selectedRole, // Asumiendo que el backend espera 'nombreRol'
            nombrePermiso: nombrePermiso,
        };

        try {
            await PermisosBD.crearPermiso(nuevoPermiso); // Llamamos al método de creación del permiso

            setShowModal(false); // Cerramos el modal después de la creación
            await Swal.fire({
                icon: "success",
                title: "Permiso creado",
                text: "El permiso se ha creado con éxito.",
                showConfirmButton: false,
                timer: 3000
            });
            setNombrePermiso(""); // Limpiamos el campo del nombre del permiso
            setSelectedRole(""); // Limpiamos el rol seleccionado
            fetchPermisos(); // Refrescamos la lista de permisos
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error al actualizar el estado",
                text: `No se pudo cambiar el estado del rol. Detalles: ${error.message}`,
            });
        }
    };

    // Función para manejar la actualización del permiso
    const handleActualizarPermiso = async () => {
        // Verificar que el nombre del permiso no esté vacío
        if (!nombrePermiso) {
            Swal.fire({
                icon: 'error',
                title: 'Formulario vacio',
                text: 'Por favor, ingrese un nuevo nombre de permiso.',
                showConfirmButton: false,
                timer: 3000,
            });
            return;
        }

        // Verificar que el nombre del permiso contenga solo letras y espacios
        if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(nombrePermiso)) {
            Swal.fire({
                icon: 'error',
                title: 'nombre no valido',
                text: 'El nombre del permiso solo puede contener letras y espacios.',
                showConfirmButton: false,
                timer: 3000,
            });
            return;
        }

        // Verificar que el nuevo nombre no sea igual al actual
        if (nombrePermiso === permisoSeleccionado.nombrePermiso) {
            Swal.fire({
                icon: 'info',
                title: 'Sin cambios',
                text: 'El nuevo nombre de permiso no puede ser igual al actual.',
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        const permisoExistente = permisos.some(
            (permiso) => permiso.nombrePermiso.trim().toLowerCase() === nombrePermiso.trim().toLowerCase()
        );
        if (permisoExistente) {
            Swal.fire({
                icon: 'error',
                title: 'Nombre duplicado',
                text: 'Ya existe un permiso con este nombre. Por favor, ingrese un nombre diferente.',
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        // Verificar el estado del permiso antes de proceder con la actualización
        if (permisoSeleccionado.estado === 'Desactivado') {
            Swal.fire({
                icon: 'error',
                title: 'Permiso Desactivado',
                text: 'Este permiso está desactivado, no se puede actualizar.',
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }


        try {
            // Datos del permiso a actualizar
            const permisoData = {
                idPermiso: String(permisoSeleccionado.idPermiso),  // Aseguramos que el ID sea un String
                nuevoNombre: nombrePermiso,                // Nuevo nombre del permiso
            };
            // Llamada al backend para actualizar el permiso
            const response = await PermisosBD.actualizarNombrePermiso(permisoData);

            setShowModalActualizar(false); // Cerrar el modal
            Swal.fire({
                icon: 'success',
                title: 'Actualizado',
                text: 'Permiso actualizado con éxito.',
                showConfirmButton: false,
                timer: 3000
            });

            fetchPermisos();  // Actualizar la lista de permisos
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error al actualizar",
                text: `No se pudo actualizar el rol. Por favor, inténtalo nuevamente. Detalle: ${error.message}`,
            });
        }
    };

    // Función para actualizar el estado del permiso
    const handleActualizarEstado = async (idPermiso, currentStatus) => {
        try {
            // Determinar el nuevo estado
            const newStatus = currentStatus === "Activo" ? "Desactivado" : "Activo";

            // Mostrar la alerta de confirmación
            const result = await Swal.fire({
                title: `¿Estás seguro de cambiar el estado del permiso a "${newStatus}"?`,
                text: `El permiso será marcado como "${newStatus}". Este cambio puede afectar su funcionalidad.`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, actualizar estado",
                cancelButtonText: "Cancelar",
            });

            // Verificar si el usuario confirmó la acción
            if (result.isConfirmed) {
                // Convertir el idPermiso a String
                const idPermisoString = String(idPermiso);

                // Llamar al backend para actualizar el estado
                await PermisosBD.actualizarEstadoPermiso(idPermisoString, newStatus);

                // Refrescamos la lista de permisos
                fetchPermisos();

                // Mostrar una alerta de éxito
                Swal.fire({
                    icon: "success",
                    title: "Estado actualizado",
                    text: `El estado del permiso ha sido cambiado a "${newStatus}".`,
                    showConfirmButton: false,
                    timer: 3000
                });
            } else {
                // Mostrar una alerta de cancelación
                Swal.fire({
                    icon: "info",
                    title: "Cambio cancelado",
                    text: "No se realizaron cambios en el estado del permiso.",
                    showConfirmButton: false,
                    timer: 3000
                });
            }
        } catch (error) {
            // Mostrar una alerta de error
            Swal.fire({
                icon: "error",
                title: "Error al actualizar el estado",
                text: `No se pudo cambiar el estado del permiso. Detalles: ${error.message}`,
            });
        }
    };

    // Función para eliminar un permiso
    const handleEliminarPermiso = async (idPermiso) => {
        // Mostrar una alerta de confirmación
        const result = await Swal.fire({
            title: `¿Estás seguro?`,
            text: "Esta acción eliminará el permiso permanentemente. No podrás deshacer este cambio.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        // Verificar si el usuario confirmó la eliminación
        if (result.isConfirmed) {
            try {
                // Llamar al método de eliminación del permiso
                await PermisosBD.eliminarPermiso(idPermiso);

                // Refrescamos la lista de permisos
                await fetchPermisos();

                // Mostrar una alerta de éxito
                Swal.fire({
                    icon: "success",
                    title: "Permiso eliminado",
                    text: `El permiso ha sido eliminado con éxito.`,
                    showConfirmButton: false,
                    timer: 3000
                });
            } catch (error) {
                // Mostrar una alerta de error si falla la eliminación
                Swal.fire({
                    icon: "error",
                    title: "Error al eliminar el permiso",
                    text: `No se pudo eliminar el permiso. Detalles: ${error.message}`,
                });
            }
        } else {
            // Mostrar una alerta de cancelación (opcional)
            Swal.fire({
                icon: "info",
                title: "Eliminación cancelada",
                text: "El permiso no ha sido eliminado.",
                showConfirmButton: false,
                timer: 2000
            });
        }
    };


    return (
        <div className="permisos-page">
            <h2 className="titulo-permisos">Gestion de permisos</h2>

            <div className="button-acciones-permisos">
                <button className="btn btn-success" onClick={() => setShowModal(true)}>Crear Permisos</button>

                {/* Modal para Crear Permiso */}
                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="modal-title">CREAR PERMISOS</h3>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label htmlFor="role">Seleccionar Rol:</label>
                                    <select
                                        className="text-center"
                                        value={selectedRole}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                    >
                                        <option value="">Seleccionar</option>
                                        {roles.map((role) => (
                                            <option key={role.idRoles} value={role.nombreRol}>
                                                {role.nombreRol}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group mt-3">
                                    <label htmlFor="permiso">Nombre Permiso:</label>
                                    <input
                                        type="text"
                                        id="permiso"
                                        className="form-control"
                                        value={nombrePermiso}
                                        onChange={(e) => setNombrePermiso(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-success" onClick={handleCrearPermiso}>Crear
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <table className="table table-primary table-hover table-bordered border-primary text-center tabla-permisos">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Roles</th>
                        <th>Nombre Permisos</th>
                        <th>Estado</th>
                        <th>Accion</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(permisos) && permisos.length > 0 ? (
                        permisos.map((permiso) => (
                            <tr key={permiso.idPermiso}>
                                <td>{permiso.idPermiso}</td>
                                <td>{permiso.roles?.nombreRol}</td>
                                <td>{permiso.nombrePermiso}</td>
                                <td className="tabla-estado-permisos">
                                    <button
                                        className={`btn ${permiso.estado === "Activo" ? "btn-light" : "btn-dark"}`}
                                        onClick={() => handleActualizarEstado(permiso.idPermiso, permiso.estado)}>
                                        {permiso.estado || "Activo"}
                                    </button>
                                </td>
                                <td className="tabla-acciones-permisos">
                                    <button className="btn btn-primary" onClick={() => {
                                        setPermisoSeleccionado(permiso);
                                        setNombrePermiso(permiso.nombrePermiso);
                                        setShowModalActualizar(true); // Abre el modal de actualización
                                    }}>Actualizar</button>

                                    {/* Modal para Actualizar Permiso */}
                                    {showModalActualizar && permisoSeleccionado && (
                                        <div className="modal-overlay">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h3 className="modal-title">ACTUALIZAR PERMISO</h3>
                                                </div>
                                                <div className="modal-body">
                                                    <div className="form-group">
                                                        <label htmlFor="nombrePermiso">Nuevo Nombre Permiso:</label>
                                                        <input
                                                            type="text"
                                                            id="nombrePermiso"
                                                            className="form-control"
                                                            value={nombrePermiso}
                                                            onChange={(e) => setNombrePermiso(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-primary" onClick={handleActualizarPermiso}>
                                                        Actualizar
                                                    </button>
                                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModalActualizar(false)}>
                                                        Cancelar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleEliminarPermiso(permiso.idPermiso)}>
                                        Eliminar
                                    </button>
                                </td>
                            </tr>

                        ))) : (
                        <tr>
                            <td colSpan="5">No hay permisos disponibles</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div >
    )
}

export default Permisos;