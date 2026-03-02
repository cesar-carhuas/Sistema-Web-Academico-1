import React, { useState } from "react";
import { Link } from "react-router-dom";

function ListaAdmin() {
    const [isExpanded, setIsExpanded] = useState(false); // Controla si el menú está expandido o contraído

    const toggleMenu = () => {
        setIsExpanded(!isExpanded); // Cambia el estado de expansión del menú
    };

    const handleItemClick = () => {
        setIsExpanded(false);
    };

    return (
        <>
            <div className={`overlay ${isExpanded ? "active" : ""}`} />
            <div className={`vertical-menu ${isExpanded ? "expanded" : "collapsed"}`}>
                {/* Imagen que actúa como botón para expandir/colapsar el menú */}
                <div className="logo-container" onClick={toggleMenu}>
                    <img
                        src="https://img.icons8.com/?size=100&id=7KAwJfCSQ1MV&format=png&color=000000"
                        alt="Logo"
                        className="logo-img"
                    />
                </div>

                {/* Contenedor principal del menú */}
                <div className={`accordion ${isExpanded ? "" : "disabled"}`} id="menuAccordion">
                    {/* Sección Propietario */}
                    <div>
                        <h2 className="accordion-header" id="headingPropietario">
                            <button
                                className={`accordion-button ${isExpanded ? "" : "collapsed"}`}
                                type="button"
                                disabled={!isExpanded} // Bloquea selección cuando está colapsado
                                data-bs-toggle="collapse"
                                data-bs-target="#collapsePropietario"
                                aria-expanded={isExpanded}
                                aria-controls="collapsePropietario"
                            >
                                <span className="short-label text-center">P</span>
                                {isExpanded && <span className="full-label">Propietario</span>}
                            </button>
                        </h2>
                        {isExpanded && (
                            <div
                                id="collapsePropietario"
                                className="accordion-collapse collapse"
                                aria-labelledby="headingPropietario"
                                data-bs-parent="#menuAccordion"
                            >
                                <div className="accordion-body">
                                    <ul className="menu-items">
                                        <li className="menu-item" onClick={handleItemClick}>
                                            <Link to="/cuenta">Cuenta</Link>
                                        </li>
                                        <li className="menu-item" onClick={handleItemClick}>
                                            <Link to="/usuario">Usuario</Link>
                                        </li>
                                        <li className="menu-item" onClick={handleItemClick}>
                                            <Link to="/permisos">Permisos</Link>
                                        </li>
                                        <li className="menu-item" onClick={handleItemClick}>
                                            <Link to="/roles">Roles</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sección Administrador */}
                    <div className="">
                        <h2 className="accordion-header" id="headingAdministrador">
                            <button
                                className={`accordion-button ${isExpanded ? "" : "collapsed"}`}
                                type="button"
                                disabled={!isExpanded} // Bloquea selección cuando está colapsado
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseAdministrador"
                                aria-expanded={isExpanded}
                                aria-controls="collapseAdministrador"
                            >
                                <span className="short-label text-center">A</span>
                                {isExpanded && <span className="full-label">Administrador</span>}
                            </button>
                        </h2>
                        {isExpanded && (
                            <div
                                id="collapseAdministrador"
                                className="accordion-collapse collapse"
                                aria-labelledby="headingAdministrador"
                                data-bs-parent="#menuAccordion"
                            >
                                <div className="accordion-body">
                                    <ul className="menu-items">
                                        <li className="menu-item" onClick={handleItemClick}>
                                            <Link to="/clientes">Clientes</Link>
                                        </li>
                                        <li className="menu-item" onClick={handleItemClick}>
                                            <Link to="/espacios">Espacios</Link>
                                        </li>
                                        <li className="menu-item" onClick={handleItemClick}>
                                            <Link to="/Boleta">Boleta</Link>
                                        </li>
                                        <li className="menu-item" onClick={handleItemClick}>
                                            <Link to="/reportes">Reportes</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ListaAdmin;
