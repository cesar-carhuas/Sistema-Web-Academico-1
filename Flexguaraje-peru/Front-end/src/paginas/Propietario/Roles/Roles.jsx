import React, { useState, useEffect } from "react";
import RolesBD from "./BASE DE DATOS/RolesBD";
import Swal from "sweetalert2"; // Importar SweetAlert2
import './Roles.css';


function Roles() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [roleName, setRoleName] = useState("");
    const [roles, setRoles] = useState([]);
    const [currentRole, setCurrentRole] = useState(null);

    // Función para obtener los roles desde el backend
    const fetchRoles = async () => {
        try {
            const response = await RolesBD.listarRoles();
            setRoles(response.data); // Actualizamos el estado con los datos recibidos
        } catch (error) {
            console.error("Error al obtener la lista de roles:", error);
            Swal.fire({
                icon: "error",
                title: "Error al obtener los roles",
                text: `Hubo un problema al cargar los roles: ${error.message}`,
            });
        }
    };

    useEffect(() => {
        fetchRoles(); // Llamar al backend al cargar el componente
    }, []);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setRoleName(""); // Limpia el campo del formulario al cerrar
    };

    const handleCreateRole = async () => {
        // Validar que el campo no esté vacío
        if (!roleName.trim()) {
            Swal.fire({
                icon: "error",
                title: "Campo vacío",
                text: "El nombre del rol no puede estar vacío.",
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        // Validar que el nombre del rol solo tenga letras y espacios
        const nameRegex = /^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/;
        if (!nameRegex.test(roleName)) {
            Swal.fire({
                icon: "error",
                title: "Nombre inválido",
                text: "El nombre del rol solo puede contener letras y espacios.",
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        // Verificar si el rol ya existe
        const roleExists = roles.some((role) => role.nombreRol.toLowerCase() === roleName.toLowerCase());
        if (roleExists) {
            Swal.fire({
                icon: "warning",
                title: "Rol duplicado",
                text: "Este rol ya existe. Intenta con un nombre diferente.",
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        try {
            // Llamar al backend para crear el nuevo rol
            await RolesBD.crearRol(roleName);

            // Actualizar la lista de roles después de crear uno nuevo
            fetchRoles();

            Swal.fire({
                icon: "success",
                title: "¡Rol creado!",
                text: "El rol se creó exitosamente.",
                showConfirmButton: false,
                timer: 3000
            });

            handleCloseModal(); // Cerrar el modal
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error al actualizar",
                text: `No se pudo actualizar el rol. Por favor, inténtalo nuevamente. Detalle: ${error.message}`,
            });
        }
    };

    const handleOpenUpdateModal = (role) => {
        setCurrentRole(role);
        setRoleName(role.nombreRol); // Inicializar el campo con el nombre actual del rol
        setIsUpdateModalOpen(true);
    };

    const handleCloseUpdateModal = () => {
        setIsUpdateModalOpen(false);
        setRoleName("");
        setCurrentRole(null);
    };

    const handleUpdateRole = async () => {
        try {
            // Validar que el campo no esté vacío
            if (!roleName.trim()) {
                Swal.fire({
                    icon: "warning",
                    title: "Campo vacío",
                    text: "El nombre del rol no puede estar vacío.",
                    showConfirmButton: false,
                    timer: 3000
                });
                return;
            }

            // Validar que solo contenga letras y espacios
            const regex = /^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/;
            if (!regex.test(roleName)) {
                Swal.fire({
                    icon: "warning",
                    title: "Nombre no válido",
                    text: "El nombre del rol solo puede contener letras y espacios.",
                    showConfirmButton: false,
                    timer: 3000
                });
                return;
            }

            // Validar que no sea el mismo nombre actual
            if (roleName.trim() === currentRole.nombreRol.trim()) {
                Swal.fire({
                    icon: "info",
                    title: "Sin cambios",
                    text: "El nuevo nombre debe ser diferente al actual.",
                    showConfirmButton: false,
                    timer: 3000
                });
                return;
            }

            // Verificar si el nombre ya existe
            const nombreExiste = roles.some(
                (role) => role.nombreRol.trim().toLowerCase() === roleName.trim().toLowerCase()
            );
            if (nombreExiste) {
                Swal.fire({
                    icon: "error",
                    title: "Nombre duplicado",
                    text: "El nombre del rol ya existe. Por favor, ingrese un nombre diferente.",
                    showConfirmButton: false,
                    timer: 3000
                });
                return;
            }

            // Verificar si el rol está desactivado
            if (currentRole.estado === "Desactivado") {
                Swal.fire({
                    icon: "error",
                    title: "Rol desactivado",
                    text: "No se puede actualizar un rol desactivado. Actívalo antes de realizar cambios.",
                    showConfirmButton: false,
                    timer: 3000
                });
                return;
            }

            // Actualizar el nombre del rol en el backend
            await RolesBD.actualizarNombreRol(String(currentRole.idRoles), roleName);

            // Actualizar la lista de roles para reflejar los cambios
            fetchRoles();

            // Alerta de éxito
            Swal.fire({
                icon: "success",
                title: "Rol actualizado",
                text: "El rol se ha actualizado exitosamente.",
                showConfirmButton: false,
                timer: 3000
            });

            // Cerrar el modal
            handleCloseUpdateModal();
        } catch (error) {
            // Alerta de error
            Swal.fire({
                icon: "error",
                title: "Error al actualizar",
                text: `No se pudo actualizar el rol. Por favor, inténtalo nuevamente. Detalle: ${error.message}`,
            });
        }
    };

    const toggleRoleStatus = async (roleId, currentStatus) => {
        try {
            // Determinar el nuevo estado
            const newStatus = currentStatus === "Activo" ? "Desactivado" : "Activo";

            // Mostrar una alerta de confirmación
            const result = await Swal.fire({
                title: `¿Estás seguro de cambiar el estado del rol a "${newStatus}"?`,
                text: `El rol será marcado como "${newStatus}". Este cambio puede afectar su funcionalidad.`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, actualizar estado",
                cancelButtonText: "Cancelar",
            });

            // Verificar si el usuario confirmó la acción
            if (result.isConfirmed) {
                // Convertir el idRol a String
                const idRolString = String(roleId);

                // Llamar al backend para actualizar el estado
                await RolesBD.actualizarEstadoRol(idRolString, newStatus);

                // Actualizar el estado en el frontend
                const updatedRoles = roles.map((role) =>
                    role.idRoles === roleId ? { ...role, estado: newStatus } : role
                );
                setRoles(updatedRoles);

                // Mostrar una alerta de éxito
                Swal.fire({
                    icon: "success",
                    title: "Estado actualizado",
                    text: `El estado del rol ha sido cambiado a "${newStatus}".`,
                    showConfirmButton: false,
                    timer: 3000
                });
            } else {
                // Mostrar una alerta de cancelación (opcional)
                Swal.fire({
                    icon: "info",
                    title: "Cambio cancelado",
                    text: "No se realizaron cambios en el estado del rol.",
                    showConfirmButton: false,
                    timer: 3000
                });
            }
        } catch (error) {
            // Mostrar una alerta de error
            Swal.fire({
                icon: "error",
                title: "Error al actualizar el estado",
                text: `No se pudo cambiar el estado del rol. Detalles: ${error.message}`,
            });
        }
    };

    const handleDeleteRole = async (idRol) => {
        try {
            // Mostrar una alerta de confirmación
            const result = await Swal.fire({
                title: "¿Estás seguro?",
                text: "Esta acción eliminará el rol permanentemente. No podrás deshacer este cambio.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
            });

            // Verificar si el usuario confirmó la eliminación
            if (result.isConfirmed) {
                // Llamar al backend para eliminar el rol
                await RolesBD.eliminarRol(idRol);

                // Actualizar la lista de roles después de eliminar el rol
                await fetchRoles();

                // Mostrar una alerta de éxito
                Swal.fire({
                    icon: "success",
                    title: "Rol eliminado",
                    text: "El rol se eliminó exitosamente.",
                    showConfirmButton: false,
                    timer: 3000
                });
            } else {
                // Mostrar una alerta de cancelación (opcional)
                Swal.fire({
                    icon: "info",
                    title: "Operación cancelada",
                    text: "El rol no fue eliminado.",
                    showConfirmButton: false,
                    timer: 3000
                });
            }
        } catch (error) {
            // Mostrar una alerta de error
            Swal.fire({
                icon: "error",
                title: "Error al eliminar el rol",
                text: `No se pudo eliminar el rol. Detalles: ${error.message}`,
            });
        }
    };

    return (
        <div className="roles-page">
            <h2 className="titulo-roles">Gestion de Roles</h2>

            <div className="button-acciones-roles">
                <button className="btn btn-success" onClick={handleOpenModal}>Crear Rol</button>

                {/* Modal personalizado */}
                {isModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3>CREAR NUEVO ROL</h3>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="form-group">
                                        <label htmlFor="roleName">Nombre del Rol:</label>
                                        <input
                                            type="text"
                                            id="roleName"
                                            value={roleName}
                                            onChange={(e) => setRoleName(e.target.value)}
                                            placeholder="Ingrese el nombre del rol"
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-success" onClick={handleCreateRole}>
                                    Crear
                                </button>
                                <button className="btn btn-secondary" onClick={handleCloseModal}>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <table className="table table-primary table-hover table-bordered border-primary text-center tabla-roles">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nombre Rol</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(roles) && roles.length > 0 ? (
                        roles.map((role) => (
                            <tr key={role.idRoles}>
                                <th>{role.idRoles}</th>
                                <td>{role.nombreRol}</td>
                                <td className="table-estado-roles">
                                    <button
                                        className={`btn ${role.estado === "Activo" ? "btn-light" : "btn-dark"}`}
                                        onClick={() => toggleRoleStatus(role.idRoles, role.estado)}>
                                        {role.estado || "Activo"}
                                    </button>
                                </td>
                                <td className="table-acciones-roles">
                                    <button className="btn btn-primary" onClick={() => handleOpenUpdateModal(role)}
                                    >Actualizar</button>

                                    {/* Modal para actualizar roles */}
                                    {isUpdateModalOpen && (
                                        <div className="modal-overlay">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h3>ACTUALIZAR ROL</h3>
                                                </div>
                                                <div className="modal-body">
                                                    <form>
                                                        <div className="form-group">
                                                            <label htmlFor="roleName">Nombre del Rol:</label>
                                                            <input
                                                                type="text"
                                                                id="roleName"
                                                                value={roleName}
                                                                onChange={(e) => setRoleName(e.target.value)}
                                                                placeholder="Ingrese el nuevo nombre del rol"
                                                            />
                                                        </div>
                                                    </form>
                                                </div>
                                                <div className="modal-footer">
                                                    <button className="btn btn-primary" onClick={handleUpdateRole}>
                                                        Actualizar
                                                    </button>
                                                    <button className="btn btn-secondary" onClick={handleCloseUpdateModal}>
                                                        Cancelar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <button className="btn btn-danger" onClick={() => handleDeleteRole(role.idRoles)}
                                    >Eliminar</button>
                                </td>
                            </tr>
                        ))) : (
                        <tr>
                            <td colSpan="4">No hay Roles disponibles</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default Roles;