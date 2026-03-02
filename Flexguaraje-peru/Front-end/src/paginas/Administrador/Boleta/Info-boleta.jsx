import React, { useState, useEffect } from 'react';
import './Info-boleta.css';
import BoletasBD from './BASE DE DATOS/BoletasBD';
import { jsPDF } from "jspdf";
import "jspdf-autotable"; // Asegúrate de importar esta librería
import Swal from 'sweetalert2'; // Importa SweetAlert2


const Info_Boleta = ({ boleta }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        DNI: '',
        codigoBoleta: '',
        metodoPago: '',
        costo: '',
        fechaPago: '',
        espacioAdquirido: ''
    });
    const [boletas, setBoletas] = useState([]);

    // Cargar boletas al iniciar la página
    useEffect(() => {
        BoletasBD.getAllBoletas()
            .then((response) => {
                setBoletas(response.data);
            })

    }, []);

    // Función para generar el PDF
    const handleGenerateTablePDF = (boleta) => {
        const doc = new jsPDF();

        // Título del PDF
        doc.setFontSize(18);
        doc.text("Flexguaraje Peru - Boleta de pago", 14, 20);

        // Contenido de la boleta
        const tableData = [
            ["Código de Boleta", boleta.codigoBoleta],
            ["DNI del Cliente", boleta.alquileres?.cliente?.dni],
            ["Nombre Completo", `${boleta.alquileres?.cliente?.nombre} ${boleta.alquileres?.cliente?.apellidoPaterno} ${boleta.alquileres?.cliente?.apellidoMaterno}`],
            ["Espacio Alquilado", boleta.alquileres?.espacio?.codigoEspacio],
            ["Fecha de Emisión", boleta.fechaEmision],
            ["Método de Pago", boleta.metodoPago],
            ["Monto Base", `S/ ${Number(boleta.montobase).toFixed(2)}`],
            ["IGV (18%)", `S/ ${Number(boleta.montoIGV).toFixed(2)}`],
            ["Monto Total", `S/ ${Number(boleta.montoPagar).toFixed(2)}`],
        ];

        // Usando autotable para agregar la tabla
        doc.autoTable({
            head: [["Detalle", "Información"]],
            body: tableData,
            startY: 30, // Establece el inicio de la tabla
        });

        // Guardar el PDF
        doc.save(`${boleta.codigoBoleta}.pdf`);

        Swal.fire({
            icon: 'success',
            title: 'PDF Generado',
            text: `El PDF de la boleta ${boleta.codigoBoleta} se ha generado correctamente.`,
            timer: 3000,
            showConfirmButton: false, // Oculta el botón de confirmación
        });
    };

    return (
        <div className="info-boleta">
            <h3 className='title-infoboleta'>Información de la boleta</h3>
            <div className="table-responsive">
                <table className="table table-primary table-hover table-bordered border-primary text-center boletas-table">
                    <thead>
                        <tr>
                            <th>Código de Boleta</th>
                            <th>DNI</th>
                            <th>Nombre Completo</th>
                            <th>Espacio Adquirido</th>
                            <th>Fecha de Emisión</th>
                            <th>Método de Pago</th>
                            <th>Monto Base</th>
                            <th>IGV</th>
                            <th>Monto Total</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody className='text-center'>
                        <tr>
                            <td>{boleta.codigoBoleta}</td>
                            <td>{boleta.alquileres?.cliente?.dni}</td>
                            <td>{`${boleta.alquileres?.cliente?.nombre} ${boleta.alquileres?.cliente?.apellidoPaterno} ${boleta.alquileres?.cliente?.apellidoMaterno}`}</td>
                            <td>{boleta.alquileres?.espacio?.codigoEspacio}</td>
                            <td>{boleta.fechaEmision}</td>
                            <td>{boleta.metodoPago}</td>
                            <td>S/ {Number(boleta.montobase).toFixed(2)}</td>
                            <td>S/ {Number(boleta.montoIGV).toFixed(2)}</td>
                            <td>S/ {Number(boleta.montoPagar).toFixed(2)}</td>
                            <td className="actions">
                                <button className="btn btn-success" onClick={() => handleGenerateTablePDF(boleta)}>Generar PDF</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Info_Boleta;
