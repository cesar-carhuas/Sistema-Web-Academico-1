import React, { useState } from 'react';
import './Boleta.css';
import BoletasBD from './BASE DE DATOS/BoletasBD';
import Swal from 'sweetalert2'; // Importa SweetAlert2
import Info_Boleta from './info-boleta';

function Boleta() {
    const [dni, setDni] = useState('');
    const [espaciosActivos, setEspaciosActivos] = useState([]);
    const [espacioSeleccionado, setEspacioSeleccionado] = useState('');
    const [clienteValido, setClienteValido] = useState(false);
    const [codigoBoleta, setCodigoBoleta] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [boletaEncontrada, setBoletaEncontrada] = useState(null);

    // Función para manejar la búsqueda de la boleta
    const handleBuscarBoleta = () => {
        if (boletaEncontrada && boletaEncontrada.codigoBoleta === codigoBoleta) {
            Swal.fire({
                icon: 'warning',
                title: 'Boleta ya mostrada',
                text: 'La boleta que buscas ya está visualizada. Por favor, presiona "Limpiar" antes de buscar nuevamente.',
                showConfirmButton: false,
                timer: 3000,
            });
            return;
        }

        if (!codigoBoleta) {
            Swal.fire({
                icon: 'warning',
                title: 'Campo vacío',
                text: 'Por favor, ingresa un código de boleta.',
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        if (codigoBoleta.length !== 15) {
            Swal.fire({
                icon: 'warning',
                title: 'Código incorrecto',
                text: 'El código de boleta debe tener exactamente 15 caracteres.',
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        const loadingAlert = Swal.fire({
            title: 'Buscando boleta...',
            text: 'Por favor, espere.',
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        BoletasBD.buscarBoleta(codigoBoleta)
            .then((response) => {
                loadingAlert.close();
                if (response && response !== null) {
                    setBoletaEncontrada(response);
                }
            })
            .catch((error) => {
                loadingAlert.close();
                if (error.response && error.response.status === 404) {
                    // Mostrar alerta específica para el error 404
                    Swal.fire({
                        icon: 'error',
                        title: 'Boleta no encontrada',
                        text: `El código de boleta ${codigoBoleta} no existe.`,
                        showConfirmButton: false,
                        timer: 3000
                    });
                } else {
                    // Mostrar una alerta genérica para otros errores
                    console.error('Error al buscar la boleta:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al buscar boleta',
                        text: 'Hubo un error al buscar la boleta. Intenta nuevamente más tarde.',
                        showConfirmButton: false,
                        timer: 3000
                    });
                }
            });
    };

    const handleLimpiarBusqueda = () => {
        setCodigoBoleta('');
        setBoletaEncontrada(null); // Limpiar el estado de la boleta encontrada
    };

    const handleCerrarModal = () => {
        setShowModal(false);
        setClienteValido(false);
        setDni('');
        setEspaciosActivos([]);
        setEspacioSeleccionado('');
    };

    const handleBuscarEspacios = async () => {
        if (!dni) {
            Swal.fire({
                icon: 'warning',
                title: 'Campo vacío',
                text: 'Por favor, ingresa un DNI.',
                showConfirmButton: false,
                timer: 3000,
            });
            return;
        }

        if (!/^\d{8}$/.test(dni)) {
            Swal.fire({
                icon: 'warning',
                title: 'DNI incorrecto',
                text: 'El DNI debe contener solo números y tener exactamente 8 caracteres.',
                showConfirmButton: false,
                timer: 3000,
            });
            return;
        }

        try {
            // Llamada al backend para obtener espacios activos
            const espacios = await BoletasBD.obtenerEspaciosActivosPorDni(dni);

            // Comprobamos el mensaje de la respuesta
            if (typeof espacios === 'string') {
                if (espacios === 'CLIENTE NO EXISTE') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Cliente no encontrado',
                        text: `El cliente con el DNI ${dni} no existe.`,
                        showConfirmButton: true,
                    });
                } else if (espacios === 'No se encontraron espacios activos para este DNI.') {
                    Swal.fire({
                        icon: 'info',
                        title: 'Sin espacios activos',
                        text: `El cliente con DNI ${dni} no tiene espacios alquilados.`,
                        showConfirmButton: true,
                    });
                } else if (espacios === `El cliente con DNI ${dni} ya tiene todos sus alquileres con boleta asociada.`) {
                    Swal.fire({
                        icon: 'info',
                        title: 'Alquileres con boleta asociada',
                        text: `El cliente con DNI ${dni} ya tiene todos sus alquileres con boleta asociada.`,
                        showConfirmButton: true,
                    });
                    return;  // Detener el flujo si ya tiene boletas asociadas
                } else if (espacios === 'No se encontraron espacios activos para este DNI.') {
                    Swal.fire({
                        icon: 'info',
                        title: 'Sin espacios activos',
                        text: `El cliente con DNI ${dni} no tiene espacios alquilados.`,
                        showConfirmButton: true,
                    });
                }
            } else {
                setEspaciosActivos(espacios);
                setClienteValido(true); // Mostrar el select de espacios
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error inesperado',
                text: 'Hubo un problema al buscar los espacios activos. Intenta nuevamente más tarde.',
                showConfirmButton: true,
            });
        }
    };

    const handleCrearBoleta = async () => {
        if (!espacioSeleccionado) {
            Swal.fire({
                icon: 'warning',
                title: 'Campo vacío',
                text: 'Por favor, selecciona un espacio.',
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        try {
            // Crear la boleta en el backend
            const boleta = await BoletasBD.agregarBoleta(dni, espacioSeleccionado);
            setBoletaEncontrada(boleta); // Mostrar la boleta creada
            Swal.fire({
                icon: 'success',
                title: 'Boleta creada',
                text: 'La boleta ha sido creada con éxito.',
                showConfirmButton: false,
                timer: 3000
            });
            setShowModal(false);
            setDni('');
            setEspaciosActivos([]);
            setEspacioSeleccionado('');
            setClienteValido(false);
        } catch (error) {
            console.error('Error al crear la boleta:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al crear boleta',
                text: 'Hubo un error al crear la boleta. Intenta de nuevo.',
                showConfirmButton: false,
                timer: 3000
            });
        }
    };

    return (
        <div className="servicios-page">
            <h2 className='title-servicios'>Buscar y/o crear boleta:</h2>

            <div className="formulario-busqueda">
                <label className='codigo-boleta'>Código de boleta:</label>
                <input
                    type="text"
                    placeholder="ejemplo: BLT-12345678901"
                    value={codigoBoleta}
                    onChange={(e) => setCodigoBoleta(e.target.value)}
                />
                <div className='btn-busqueda'>
                    <button className="btn btn-info boton-buscar" onClick={handleBuscarBoleta}>Buscar</button>
                    <button className='btn btn-secondary boton-limpiar' onClick={handleLimpiarBusqueda}>Limpiar</button>
                </div>

            </div>

            <button className="btn btn-success btn-crear-boleta" onClick={() => setShowModal(true)}>
                Crear Boleta
            </button>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>CREAR BOLETA</h3>
                        <form>
                            {/* Primer paso: Solo el DNI */}
                            {!clienteValido && (
                                <div className="form-group">
                                    <label>DNI:</label>
                                    <input
                                        type="text"
                                        placeholder="Ingresa el DNI"
                                        value={dni}
                                        onChange={(e) => setDni(e.target.value)}
                                    />
                                    <div className='modal-buttons'>
                                        <button type="button" className="btn btn-success btn-crear-boleta" onClick={handleBuscarEspacios}>
                                            Continuar
                                        </button>
                                        <button type="button" onClick={handleCerrarModal} className="btn btn-secondary btn-crear-boleta">
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Segundo paso: Mostrar los espacios si el DNI es válido */}
                            {clienteValido && (
                                <div className="form-group">
                                    <label>Espacio Alquilado:</label>
                                    <select className='select-espacios' onChange={(e) => setEspacioSeleccionado(e.target.value)}>
                                        <option value="">Seleccionar</option>
                                        {espaciosActivos.map((espacio) => (
                                            <option key={espacio.codigoEspacio} value={espacio.codigoEspacio}>
                                                {espacio.codigoEspacio}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Botones de crear boleta */}
                            {clienteValido && (
                                <div className="modal-buttons">
                                    <button type="button" className="btn btn-success btn-crear-boleta" onClick={handleCrearBoleta}>
                                        Crear Boleta
                                    </button>
                                    <button type="button" onClick={handleCerrarModal} className="btn btn-secondary btn-crear-boleta">
                                        Cancelar
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            )}

            {/* Si se ha encontrado una boleta, mostrar la información */}
            {boletaEncontrada && <Info_Boleta boleta={boletaEncontrada} />}

        </div>
    );
}

export default Boleta;
