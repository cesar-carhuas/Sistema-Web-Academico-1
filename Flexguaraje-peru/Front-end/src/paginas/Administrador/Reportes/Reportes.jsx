import React, { useState, useEffect } from 'react';
import ReportesBD from './BASE DE DATOS/ReportsBD'; // Ajusta la ruta según la ubicación real
import Swal from 'sweetalert2';
import './Reportes.css';

function Reportes() {
  const [reportes, setReportes] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [filtroPrioridad, setFiltroPrioridad] = useState('Todos');
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  const [codigoBuscar, setCodigoBuscar] = useState('');
  const [modalActualizarAbierto, setModalActualizarAbierto] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalRespuestaAbierto, setModalRespuestaAbierto] = useState(false);
  const [respuesta, setRespuesta] = useState('');
  const [nuevoReporte, setNuevoReporte] = useState({
    descripcionReporte: '',
    encargadoResolver: '',
    prioridad: 'Seleccione',
    estado: 'Pendiente',
    subestado: 'Seleccione',
    fechaReporte: new Date().toLocaleDateString(),
    fechaRespuestaReporte: '',
    respuestaReporte: ''
  });
  const [mostrarFormularioCOMPLETO, setMostrarFormularioCOMPLETO] = useState(false);
  const [reportesFiltrados, setReportesFiltrados] = useState([]);

  // Función de ayuda para mostrar valor o fantasmitas (en caso de campo vacío)
  const mostrarValor = (valor) => {
    return valor && valor !== "" ? valor : '👻👻👻';
  };

  useEffect(() => {
    ReportesBD.getAllReportes()
      .then(response => {
        console.log("Reportes obtenidos:", response.data);
        setReportes(response.data);

      })
      .catch(error => {
        console.error("Error al obtener los reportes:", error);
        Swal.fire('Error', 'No se pudieron obtener los reportes.', 'error');
      });
  }, []);

  useEffect(() => {
    // Cuando cambien estado, prioridad o la lista de reportes,
    // solo filtras localmente, ignorando codigoBuscar
    const nuevosFiltrados = reportes.filter((reporte) => {
      const estadoCoincide = filtroEstado === 'Todos' || reporte.estado === filtroEstado;
      const prioridadCoincide = filtroPrioridad === 'Todos' || reporte.prioridad === filtroPrioridad;
      return estadoCoincide && prioridadCoincide;
    });
    setReportesFiltrados(nuevosFiltrados);
  }, [filtroEstado, filtroPrioridad, reportes]);


  const filtrarReportes = (codigo) => {
    return reportes.filter((reporte) => {
      const estadoCoincide = filtroEstado === 'Todos' || reporte.estado === filtroEstado;
      const prioridadCoincide = filtroPrioridad === 'Todos' || reporte.prioridad === filtroPrioridad;
      const codigoCoincide = reporte.codigoReporte?.toLowerCase().includes(codigo.toLowerCase());
      return estadoCoincide && prioridadCoincide && codigoCoincide;
    });
  };

  const manejarCreacionReporte = (e) => {
    e.preventDefault();

    // Validación: Verificar si todos los campos están vacíos
    if (
      !nuevoReporte.descripcionReporte.trim() &&
      !nuevoReporte.encargadoResolver.trim() &&
      (!nuevoReporte.prioridad || nuevoReporte.prioridad === "Seleccione")
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

    // Array para acumular errores de validación específica
    const errores = [];

    // Validación de descripción
    if (!nuevoReporte.descripcionReporte.trim()) {
      errores.push("La descripción no puede estar vacía.");
    }

    // Validación de encargado
    if (!nuevoReporte.encargadoResolver.trim()) {
      errores.push("El encargado a resolver no puede estar vacío.");
    } else if (!/^\d{8}$/.test(nuevoReporte.encargadoResolver.trim())) {
      errores.push("El encargado a resolver debe contener exactamente 8 caracteres numéricos.");
    }

    // Validación de prioridad
    if (!nuevoReporte.prioridad || nuevoReporte.prioridad === "Seleccione") {
      errores.push("Debes seleccionar una prioridad.");
    }

    // Si hay errores específicos, mostrarlos
    if (errores.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el formulario',
        html: errores.join("<br/>")
      });
      return;
    }

    // Si la validación es correcta, continuar con la creación del reporte
    ReportesBD.crearReporte(
      nuevoReporte.encargadoResolver,
      nuevoReporte.descripcionReporte,
      nuevoReporte.prioridad
    )
      .then(response => {
        const reporteCreado = response.data;
        setReportes(prevReportes => [...prevReportes, reporteCreado]);
        setNuevoReporte({
          descripcionReporte: '',
          encargadoResolver: '',
          prioridad: '',
          estado: '',
          subestado: '',
          fechaReporte: new Date().toLocaleDateString(),
          fechaRespuestaReporte: '',
          respuestaReporte: ''
        });
        setModalAbierto(false);
        Swal.fire({
          icon: 'success',
          title: '¡Reporte creado!',
          text: 'El reporte se creó exitosamente.',
          showConfirmButton: false,
          timer: 3000
        });
      })
      .catch(error => {
        console.error("Error al crear reporte:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error al crear el reporte',
          text: error.response?.data
        });
      });
  };

  const buscarReporte = () => {
    // Validación: campo vacío
    if (!codigoBuscar.trim()) {
      Swal.fire({
        title: '¡Campo vacío!',
        text: 'Por favor, ingresa un código de Reporte.',
        icon: 'warning',
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }

    // Realiza la petición al backend
    ReportesBD.buscarReporte(codigoBuscar)
      .then(response => {
        setReportesFiltrados([response.data]);
      })
      .catch(error => {
        console.error("Error al buscar reporte:", error);
        // Si el backend envía el mensaje "Reporte no encontrado con el código: " + codigoReporte, se muestra
        Swal.fire({
          title: 'Error',
          text: error.response?.data || ("Reporte no encontrado con el código: " + codigoBuscar),
          icon: 'error'
        });
      });
  };

  // Función para actualizar reporte
  const manejarActualizacion = (e) => {
    e.preventDefault();

    // Verificar si todos los campos están vacíos
    if (
      !nuevoReporte.descripcionReporte.trim() &&
      !nuevoReporte.encargadoResolver.trim() &&
      (!nuevoReporte.prioridad || nuevoReporte.prioridad === "Seleccione") &&
      (!nuevoReporte.estado || nuevoReporte.estado === "Seleccione")
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

    // 2. Validamos campos individuales
    const errores = [];

    // Validación de descripción
    if (!nuevoReporte.descripcionReporte.trim()) {
      errores.push("La descripción no puede estar vacía.");
    }

    // Validación de encargado (solo números y 8 caracteres)
    if (!nuevoReporte.encargadoResolver.trim()) {
      errores.push("El encargado a resolver no puede estar vacío.");
    } else if (!/^\d{8}$/.test(nuevoReporte.encargadoResolver.trim())) {
      errores.push("El encargado a resolver debe contener exactamente 8 caracteres numéricos.");
    }

    // Validación de prioridad
    if (!nuevoReporte.prioridad || nuevoReporte.prioridad === "Seleccione") {
      errores.push("Debes seleccionar una prioridad.");
    }

    // Validación de estado
    if (!nuevoReporte.estado || nuevoReporte.estado === "Seleccione") {
      errores.push("Debes seleccionar un estado.");
    }

    // Si existen errores, se muestran y se detiene el proceso
    if (errores.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el formulario',
        html: errores.join("<br/>") // Cada mensaje en una línea distinta
      });
      return;
    }

    // 2.1. Verificar si se han realizado cambios
    const noHayCambios =
      nuevoReporte.descripcionReporte === reporteSeleccionado.descripcionReporte &&
      nuevoReporte.encargadoResolver === reporteSeleccionado.encargadoResolver &&
      nuevoReporte.prioridad === reporteSeleccionado.prioridad &&
      nuevoReporte.estado === reporteSeleccionado.estado;

    if (noHayCambios) {
      Swal.fire({
        icon: 'warning',
        title: 'No se han realizado cambios',
        text: 'No has realizado ninguna actualización en los datos.',
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }

    // 3. Si todo está correcto y hay cambios, crear el objeto con los datos a actualizar
    const reporteAActualizar = {
      codigoReporte: reporteSeleccionado.codigoReporte,
      descripcionReporte: nuevoReporte.descripcionReporte,
      encargadoResolver: nuevoReporte.encargadoResolver,
      prioridad: nuevoReporte.prioridad,
      estado: nuevoReporte.estado
    };

    // Llamar al servicio para actualizar el reporte
    ReportesBD.actualizarReporte(reporteAActualizar)
      .then(response => {
        // Actualizar la lista de reportes en el estado
        const reportesActualizados = reportes.map((reporte) =>
          reporte.idReportes === reporteSeleccionado.idReportes ? response.data : reporte
        );
        setReportes(reportesActualizados);

        // Cerrar el modal
        setModalActualizarAbierto(false);
        Swal.fire({
          icon: 'success',
          title: '¡Reporte Actualizado!',
          text: 'El reporte se actualizó exitosamente.',
          showConfirmButton: false,
          timer: 3000
        });
      })
      .catch(error => {
        console.error("Error al actualizar el reporte:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar el reporte',
          text: error.response?.data,
        });
      });
  };

  const cerrarModalActualizar = () => setModalActualizarAbierto(false);
  const cerrarModal = () => setModalAbierto(false);
  const cerrarModalRespuesta = () => {
    setModalRespuestaAbierto(false);
    setRespuesta('');
  };

  // Función para abrir modal de responder
  const responderReporte = (reporte) => {
    // Verificar si el estado es "Cancelado" o "Cerrado"
    if (reporte.estado === "Cancelado" || reporte.estado === "Cerrado") {
      Swal.fire({
        icon: 'warning',
        title: 'No se puede responder',
        text: 'Solo se pueden responder reportes con estado "Pendiente".',
        showConfirmButton: false,
        timer: 3000 // ⏳ Se cierra automáticamente en 3 segundos
      });
      return;
    }

    // Si el estado es "Pendiente", abrir el formulario de respuesta
    setReporteSeleccionado(reporte);
    setModalRespuestaAbierto(true);
  };


  // Función para enviar la respuesta al backend
  const manejarRespuesta = (e) => {
    e.preventDefault();

    // Concatenamos los valores de los campos para evaluar si están vacíos
    // Verificar si ambos campos están vacíos
    if (!respuesta.trim() && (!nuevoReporte.subestado || nuevoReporte.subestado === "Seleccione")) {
      Swal.fire({
        icon: 'error',
        title: 'Formulario Vacío',
        text: 'El formulario no puede estar vacío, por favor ingrese datos.',
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }

    // Validar si la respuesta está vacía pero hay subestado seleccionado
    if (!respuesta.trim() && nuevoReporte.subestado !== "Seleccione") {
      Swal.fire({
        icon: 'error',
        title: 'Campo incompleto',
        text: 'Debe ingresar una respuesta antes de enviar.',
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }

    // Validar si el subestado no está seleccionado pero la respuesta sí
    if (respuesta.trim() && (!nuevoReporte.subestado || nuevoReporte.subestado === "Seleccione")) {
      Swal.fire({
        icon: 'error',
        title: 'Campo incompleto',
        text: 'Debe seleccionar un subestado antes de enviar.',
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }

    // Si la validación es correcta, proceder con la respuesta
    const reporteRespuesta = {
      codigoReporte: reporteSeleccionado.codigoReporte,
      respuesta: respuesta,
      subestado: nuevoReporte.subestado
    };

    ReportesBD.responderReporte(reporteRespuesta)
      .then(response => {
        const reportesActualizados = reportes.map((reporte) =>
          reporte.idReportes === reporteSeleccionado.idReportes ? response.data : reporte
        );
        setReportes(reportesActualizados);
        setReporteSeleccionado(response.data);
        Swal.fire({
          icon: 'success',
          title: '¡Reporte Respondido!',
          text: 'La respuesta se envió exitosamente.',
          showConfirmButton: false,
          timer: 3000
        }); cerrarModalRespuesta();
      })
      .catch(error => {
        console.error("Error al responder el reporte:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error al responder el reporte',
          text: error.response?.data || "Error desconocido, por favor intenta de nuevo.",
          showConfirmButton: false,
          timer: 4000
        });
      });
  };

  const manejarCancelacionReporte = () => {
    setNuevoReporte({
      descripcionReporte: '',
      encargadoResolver: '',
      prioridad: '',
      estado: '',
      subestado: '',
      fechaReporte: new Date().toLocaleDateString(),
      fechaRespuestaReporte: '',
      respuestaReporte: ''
    });
    cerrarModal();
  };

  const mostrarDetallesReporte = (reporte) => {
    setReporteSeleccionado(reporte);
    setMostrarFormularioCOMPLETO(true);
  };

  return (
    <div className="reportes-page">
      <h1 className="titulo-reporte">Gestión de Reportes</h1>

      <div className="acciones-usuario">
        <div className='acciones-btn-usuario'>
          <button className="btn btn-success" onClick={() => {
            setNuevoReporte({
              descripcionReporte: '',
              encargadoResolver: '',
              prioridad: 'Seleccione',
              estado: 'Pendiente',
              subestado: 'Seleccione',
              fechaReporte: new Date().toLocaleDateString(),
              fechaRespuestaReporte: '',
              respuestaReporte: ''
            });
            setModalAbierto(true);
          }}>
            Crear Reporte
          </button>


          {/* Modal para creación de reporte */}
          {modalAbierto && (
            <div className="modal">
              <div className="modal-content">
                <h2>CREAR REPORTE</h2>
                <form onSubmit={manejarCreacionReporte} noValidate>
                  <label>Descripción:</label>
                  <textarea className='p-2 w-100 text-center'
                    value={nuevoReporte.descripcionReporte}
                    onChange={(e) =>
                      setNuevoReporte({ ...nuevoReporte, descripcionReporte: e.target.value })
                    }
                  />
                  <label>Encargado Resolver:</label>
                  <input
                    type="text"
                    value={nuevoReporte.encargadoResolver}
                    onChange={(e) =>
                      setNuevoReporte({ ...nuevoReporte, encargadoResolver: e.target.value })
                    }
                  />
                  <label>Prioridad:</label>
                  <select className='text-center'
                    value={nuevoReporte.prioridad}
                    onChange={(e) => setNuevoReporte({ ...nuevoReporte, prioridad: e.target.value })}
                  >
                    <option value="">Sin seleccionar</option>
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                  </select>
                  <div className="modal-buttons">
                    <button className="btn btn-success" type="submit">
                      Crear
                    </button>
                    <button className="btn btn-secondary" type="button" onClick={manejarCancelacionReporte}>
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        <div className="buscar-container">
          <input
            type="text"
            placeholder="Código del reporte"
            value={codigoBuscar}
            onChange={(e) => setCodigoBuscar(e.target.value)}
          />
          <div className='btn-accion-buscarN'>
            <button className="btn btn-info" onClick={buscarReporte}>
              Buscar
            </button>
            <button className='btn btn-secondary btn-normalidad' onClick={() => {
              setCodigoBuscar('');
              ReportesBD.getAllReportes()
                .then(response => {
                  setReportes(response.data);
                  setReportesFiltrados(response.data);
                })
                .catch(error => {
                  console.error("Error al listar reportes:", error);
                  Swal.fire('Error', 'No se pudieron obtener los reportes.', 'error'); // Muestra un mensaje de error
                });
            }}>
              Normalidad
            </button>
          </div>
        </div>
      </div>
      <table className="table table-primary table-hover table-bordered border-primary text-center tabla-usuario">
        <thead>
          <tr>
            <th>Código Reporte</th>
            <th>Fecha Reporte</th>
            <th>Encargado a Resolver</th>
            <th>
              Prioridad
              <select className='filtro-option' value={filtroPrioridad} onChange={(e) => setFiltroPrioridad(e.target.value)}>
                <option value="Todos">Todos</option>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </th>
            <th>
              Estado
              <select className='filtro-option' value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                <option value="Todos">Todos</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Cancelado">Cancelado</option>
                <option value="Cerrado">Cerrado</option>
              </select>
            </th>
            <th>Subestado</th>
            <th>Fecha Respuesta</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reportes.length === 0 ? (
            <tr>
              <td colSpan="8">No hay Reportes registradas.</td>
            </tr>
          ) : reportesFiltrados.length > 0 ? (
            reportesFiltrados.map((reporte) => ( // Cambiado de reportesFiltrados() a reportesFiltrados
              <tr key={reporte.idReportes}>
                <td>
                  <button className='btn-codigo' onClick={() => mostrarDetallesReporte(reporte)}>
                    {mostrarValor(reporte.codigoReporte)}
                  </button>
                  {/* Modal Información Completa del Reporte */}
                  {mostrarFormularioCOMPLETO && reporteSeleccionado && (
                    <div className="modal-overlay">
                      <div className="modal-content-completo">
                        <div className='titulo-completo-modal'>
                          <h3 className="text-center">INFORMACIÓN COMPLETA DEL REPORTE</h3>
                        </div>
                        <div className="formulario-campos-completo">
                          <div>
                            <div className="campos-datos">
                              <label>Código Reporte:</label>
                              <input type="text" value={mostrarValor(reporteSeleccionado.codigoReporte)} disabled />
                            </div>
                            <div className="campos-datos">
                              <label>Prioridad:</label>
                              <input type="text" value={mostrarValor(reporteSeleccionado.prioridad)} disabled />
                            </div>
                            <div className="campos-datos">
                              <label>Encargado Resolver:</label>
                              <input type="text" value={mostrarValor(reporteSeleccionado.encargadoResolver)} disabled />
                            </div>
                          </div>
                          <div>
                            <div className="campos-datos">
                              <label>Fecha Reporte:</label>
                              <input type="text" value={mostrarValor(reporteSeleccionado.fechaReporte)} disabled />
                            </div>
                            <div className="campos-datos">
                              <label>Descripción:</label>
                              <textarea className='p-2 w-100 text-center' type="text" value={mostrarValor(reporteSeleccionado.descripcionReporte)} disabled />
                            </div>
                          </div>
                          <div>
                            <div className="campos-datos">
                              <label>Fecha Respuesta:</label>
                              <input type="text" value={mostrarValor(reporteSeleccionado.fechaRespuestaReporte)} disabled />
                            </div>
                            <div className="campos-datos">
                              <label>Respuesta:</label>
                              <textarea className='p-2 w-100 text-center' type="text" value={mostrarValor(reporteSeleccionado.respuestaReporte)} disabled />
                            </div>
                          </div>
                          <div>
                            <div className="campos-datos">
                              <label>Estado:</label>
                              <input type="text" value={mostrarValor(reporteSeleccionado.estado)} disabled />
                            </div>
                            <div className="campos-datos">
                              <label>Subestado:</label>
                              <input type="text" value={mostrarValor(reporteSeleccionado.subestado)} disabled />
                            </div>
                          </div>
                        </div>
                        <div className="formulario-botones-completo">
                          <button className="btn btn-secondary" onClick={() => setMostrarFormularioCOMPLETO(false)}>
                            Volver
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </td>
                <td>{mostrarValor(reporte.fechaReporte)}</td>
                <td>{mostrarValor(reporte.encargadoResolver)}</td>
                <td>{mostrarValor(reporte.prioridad)}</td>
                <td className="fw-bold">{mostrarValor(reporte.estado)}</td>
                <td>{mostrarValor(reporte.subestado)}</td>
                <td>{mostrarValor(reporte.fechaRespuestaReporte)}</td>
                <td className='tabla-acciones-permisos'>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      // Verificar si el estado es "Cancelado" o "Cerrado"
                      if (reporte.estado === "Cancelado" || reporte.estado === "Cerrado") {
                        Swal.fire({
                          icon: 'warning',
                          title: 'No se puede actualizar',
                          text: 'Solo se pueden actualizar reportes con estado "Pendiente".',
                          showConfirmButton: false,
                          timer: 3000 // ⏳ Se cierra automáticamente en 3 segundos
                        });
                        return;
                      }

                      // Si el estado es "Pendiente", abrir el formulario de actualización
                      setReporteSeleccionado(reporte);
                      setNuevoReporte({
                        descripcionReporte: reporte.descripcionReporte,
                        encargadoResolver: reporte.encargadoResolver,
                        prioridad: reporte.prioridad,
                        estado: reporte.estado,
                        subestado: reporte.subestado,
                        fechaReporte: reporte.fechaReporte,
                        fechaRespuestaReporte: reporte.fechaRespuestaReporte,
                        respuestaReporte: reporte.respuestaReporte
                      });
                      setModalActualizarAbierto(true);
                    }}
                  >Actualizar
                  </button>
                  {/* Modal Actualizar Reporte */}
                  {modalActualizarAbierto && (
                    <div className="modal-overlay">
                      <div className="modal-content">
                        <h2>ACTUALIZAR REPORTE</h2>
                        <form onSubmit={manejarActualizacion}>
                          <label>Descripción del Reporte:</label>
                          <textarea className='p-2 w-100 text-center'
                            value={nuevoReporte.descripcionReporte}
                            onChange={(e) =>
                              setNuevoReporte({ ...nuevoReporte, descripcionReporte: e.target.value })
                            }
                          />
                          <label>Encargado a Resolver:</label>
                          <input
                            type="text"
                            value={nuevoReporte.encargadoResolver}
                            onChange={(e) =>
                              setNuevoReporte({ ...nuevoReporte, encargadoResolver: e.target.value })
                            }
                          />
                          <label>Prioridad:</label>
                          <select className='text-center'
                            value={nuevoReporte.prioridad}
                            onChange={(e) => setNuevoReporte({ ...nuevoReporte, prioridad: e.target.value })}
                          >
                            <option value="">Sin seleccionar</option>
                            <option value="Alta">Alta</option>
                            <option value="Media">Media</option>
                            <option value="Baja">Baja</option>
                          </select>
                          <label>Estado:</label>
                          <select className='text-center'
                            value={nuevoReporte.estado}
                            onChange={(e) => setNuevoReporte({ ...nuevoReporte, estado: e.target.value })}

                          >
                            <option value="">Sin seleccionar</option>
                            <option value="Pendiente">Pendiente</option>
                            <option value="Cancelado">Cancelado</option>
                          </select>
                          <div className="modal-buttons">
                            <button type="submit" className="btn btn-primary">
                              Actualizar
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={cerrarModalActualizar}>
                              Cancelar
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                  <button className="btn btn-success" onClick={() => responderReporte(reporte)}>
                    Responder
                  </button>
                  {/* Modal Responder Reporte */}
                  {modalRespuestaAbierto && (
                    <div className="modal-overlay">
                      <div className="modal-content">
                        <h2>RESPONDER REPORTE</h2>
                        <form onSubmit={manejarRespuesta}>
                          <label>Respuesta:</label>
                          <textarea className='p-2 w-100 text-center'
                            value={respuesta}
                            onChange={(e) => setRespuesta(e.target.value)}
                          />
                          <label>Subestado:</label>
                          <select className='text-center'
                            value={nuevoReporte.subestado}
                            onChange={(e) => setNuevoReporte({ ...nuevoReporte, subestado: e.target.value })}
                          >
                            <option value="">Sin seleccionar</option>
                            <option value="Acogido">Acogido</option>
                            <option value="No_acogido">No Acogido</option>
                          </select>
                          <div className="modal-buttons">
                            <button className="btn btn-success" type="submit">
                              Responder
                            </button>
                            <button className="btn btn-secondary" type="button" onClick={cerrarModalRespuesta}>
                              Cancelar
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))) : (
            <tr>
              <td colSpan="8">No se encontraron reportes del filtrado.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Reportes;