import { useState, useEffect } from "react";
import "./Cuenta.css";
import CuentaBD from "./BASE DE DATOS/CuentaBD";
import Swal from 'sweetalert2';

function GestionCuentas() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cuentas, setCuentas] = useState([]); // Lista de cuentas cargadas del backend
    const [dni, setDni] = useState("");

    const fetchCuentas = async () => {
        try {
            const response = await CuentaBD.listarCuentas();
            if (Array.isArray(response.data)) {
                setCuentas(response.data);
            } else {
                console.error("La respuesta no es un arreglo:", response.data);
                setCuentas([]);
            }
        } catch (error) {
            console.error("Error al obtener las cuentas del backend:", error);
            Swal.fire({
                icon: "error",
                title: "Error al cargar cuentas",
                text: "Hubo un problema al obtener la lista de cuentas.",
            });
            setCuentas([]);
        }
    };

    useEffect(() => {
        fetchCuentas();
    }, []);

    // Función para manejar la creación de cuenta (agregar la cuenta)
    const handleCrearCuenta = async () => {
        if (!dni.trim()) {
            Swal.fire({
                icon: "error",
                title: "Error en el formulario",
                text: "El campo DNI no puede estar vacío.",
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        if (!dni || !/\d{8}/.test(dni)) {
            Swal.fire({
                icon: "error",
                title: "Error en el formulario",
                text: "El DNI debe contener exactamente 8 dígitos.",
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        try {
            const response = await CuentaBD.crearCuenta({ dni });
            setIsModalOpen(false);
            Swal.fire({
                icon: "success",
                title: "Cuenta creada",
                text: response.data,
                showConfirmButton: false,
                timer: 3000
            });
            fetchCuentas();
        } catch (error) {
            console.error("Error al crear la cuenta:", error.response?.data || error.message);
            Swal.fire({
                icon: "error",
                title: "Error al crear cuenta",
                text: error.response?.data || "Hubo un error al crear la cuenta.",
            });
        }
    };

    const handleBuscarCuenta = async () => {
        if (!dni.trim()) {
            Swal.fire({
                icon: "error",
                title: "Error en la búsqueda",
                text: "El campo DNI no puede estar vacío.",
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        if (!/^\d{8}$/.test(dni.trim())) {
            Swal.fire({
                icon: "error",
                title: "Error en la búsqueda",
                text: "El DNI debe contener exactamente 8 caracteres numéricos.",
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
            const response = await CuentaBD.buscarCuenta({ dni });
            Swal.close();
            setCuentas([response.data]);
            setDni("");

        } catch (error) {
            console.error("Error al buscar la cuenta:", error);
            Swal.fire({
                icon: "error",
                title: "Error al buscar cuenta",
                text: error.response?.data || "No se pudo encontrar la cuenta.",
            });
        }
    };

    const handleNormalidad = () => {
        setDni("");
        fetchCuentas();
    };

    const toggleEstado = async (cuenta, index) => {
        const dni = cuenta.usuario.dni; // Usamos el DNI del usuario

        // Mostrar alerta de confirmación con SweetAlert2
        const result = await Swal.fire({
            title: `¿Estás seguro de ${cuenta.estado === "Activo" ? "desactivar" : "activar"} la cuenta?`,
            text: `La cuenta de ${cuenta.nombreUsuario} será ${cuenta.estado === "Activo" ? "desactivada" : "activada"}.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, actualizar estado',
            cancelButtonText: 'Cancelar',
        });

        // Si el usuario confirma la acción
        if (result.isConfirmed) {
            try {
                // Realiza la solicitud para actualizar el estado de la cuenta
                const response = await CuentaBD.actualizarEstadoCuenta(dni);
                Swal.fire({
                    icon: "success",
                    title: "Estado actualizado",
                    text: response.data, // Mostrar mensaje del backend
                    showConfirmButton: false,
                    timer: 3000
                });

                // Cambiar el estado en la interfaz
                setCuentas((prevCuentas) =>
                    prevCuentas.map((item, i) =>
                        i === index
                            ? { ...item, estado: item.estado === "Activo" ? "Desactivado" : "Activo" } // Alternar entre "Activo" y "Desactivado"
                            : item
                    )
                );
            } catch (error) {
                console.error("Error al cambiar el estado:", error.response?.data || error.message);
                Swal.fire({
                    icon: "error",
                    title: "Error al cambiar estado",
                    text: error.response?.data || "Hubo un error al intentar cambiar el estado de la cuenta.",
                });
            }
        } else {
            Swal.fire({
                icon: "info",
                title: "Cambio cancelado",
                text: "No se realizaron cambios en el estado del permiso.",
                showConfirmButton: false,
                timer: 3000
            });
        }
    };

    const handleChangePasswordClick = async (cuenta) => {
        const dni = cuenta.usuario?.dni;
        const correo = cuenta.email;

        // Validar si la cuenta está activa
        if (cuenta.estado !== "Activo") {
            Swal.fire({
                icon: "warning",
                title: "Cuenta desactivada",
                text: "No se puede cambiar la contraseña porque la cuenta está desactivada.",
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        // Confirmación antes de proceder
        const confirmacion = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Se actualizará automáticamente la contraseña de esta cuenta.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, actualizar contraseña",
            cancelButtonText: "Cancelar",
            allowOutsideClick: false, // Evita clics fuera del modal
            allowEscapeKey: false, // Evita cerrar el modal con la tecla Esc
        });

        if (!confirmacion.isConfirmed) {
            Swal.fire({
                icon: "info",
                title: "Operación cancelada",
                text: "No se ha realizado ningún cambio.",
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        // Mostrar loader mientras se procesa la solicitud
        Swal.fire({
            title: "Procesando...",
            text: "Por favor espera mientras se actualiza la contraseña.",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
        });

        try {
            // Actualizar la contraseña automáticamente
            const response = await CuentaBD.actualizarPassAuto(dni, correo);
            Swal.close();
            Swal.fire({
                icon: "success",
                title: "Contraseña actualizada",
                text: `Contraseña actualizada automáticamente para el usuario: ${cuenta.nombreUsuario}`,
                showConfirmButton: false,
                timer: 3000
            });
            await fetchCuentas();
        } catch (error) {
            console.error("Error al actualizar la contraseña:", error);
            Swal.fire({
                icon: "error",
                title: "Error al cambiar contraseña",
                text: "Hubo un error al intentar actualizar la contraseña.",
            });
        }
    };

    return (
        <div className="cuenta-page">
            <div className="titulo-cuenta">
                <h2>Gestión de Cuentas</h2>
            </div>

            <div className="botones-acciones-cuenta">
                <button className="crear-cuenta-btn btn btn-success" onClick={() => setIsModalOpen(true)}>
                    Crear Cuenta
                </button>

                {/* Modal para crear una nueva cuenta */}
                {isModalOpen && (
                    <div className="modal">
                        <div className="modal-content">
                            <h3>CREAR NUEVA CUENTA</h3>
                            <div>
                                <label>DNI:</label>
                                <input
                                    type="text"
                                    name="dni"
                                    onChange={(e) => setDni(e.target.value)}
                                />
                            </div>
                            <div className="modal-footer-cuenta">
                                <button className="btn btn-success" onClick={handleCrearCuenta}>Crear</button>
                                <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="acciones-formulario-buscar">
                    <input
                        type="text"
                        placeholder='Ingresar Dni'
                        value={dni}
                        onChange={(e) => setDni(e.target.value)}
                    />
                    <div className='btn-acciones-buscar'>
                        <button className='btn btn-info' onClick={handleBuscarCuenta}>Buscar</button>
                        <button className='btn btn-secondary' onClick={handleNormalidad}>
                            Normalidad
                        </button>
                    </div>
                </div>
            </div>



            <table className="table table-primary table-hover table-bordered border-primary text-center tabla-cuenta">
                <thead>
                    <tr>
                        <th>Rol</th>
                        <th>DNI</th>
                        <th>Correo de Empresa</th>
                        <th>Contraseña</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(cuentas) && cuentas.length > 0 ? (
                        cuentas.map((cuenta, index) => (
                            <tr key={index}>
                                <td>{cuenta.usuario?.roles?.nombreRol || 'Sin rol'}</td>
                                <td>{cuenta.usuario.dni}</td>
                                <td>{cuenta.email}</td>
                                <td>{cuenta.password} </td>
                                <td className="tabla-cuenta-estado">
                                    <button
                                        className={`btn ${cuenta.estado === "Activo" ? "btn-light" : "btn-dark"}`} // Condición para aplicar la clase correcta
                                        onClick={() => toggleEstado(cuenta, index)} // Cambiar estado real
                                    >
                                        {cuenta.estado} {/* Muestra el estado real */}
                                    </button>
                                </td>
                                <td>
                                    <div className="acciones">

                                        <button
                                            className="cambiar-pass-btn btn btn-primary"
                                            onClick={() => handleChangePasswordClick(cuenta)}
                                        >
                                            Cambiar Contraseña
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No hay cuentas disponibles</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div >
    );
}

export default GestionCuentas;
