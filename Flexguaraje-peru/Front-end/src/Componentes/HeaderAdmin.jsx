import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function HeaderAdmin() {
    const navigate = useNavigate();
    const [nombreUsuario, setNombreUsuario] = useState(localStorage.getItem("nombreUsuario") || "");

    useEffect(() => {
        // Función que actualiza el nombre cuando cambia en localStorage
        const actualizarNombreUsuario = () => {
            setNombreUsuario(localStorage.getItem("nombreUsuario") || "Usuario Invitado");
        };

        // Escuchar cambios en localStorage
        window.addEventListener("storage", actualizarNombreUsuario);

        // Limpieza del event listener al desmontar el componente
        return () => {
            window.removeEventListener("storage", actualizarNombreUsuario);
        };
    }, []);

    const handleBackToHome = () => {
        localStorage.removeItem("nombreUsuario");
        localStorage.removeItem("rolUsuario"); // Asegurar que el rol también se borre
        setNombreUsuario("Usuario Invitado");
        navigate("/");
    };


    return (
        <>
            <header>
                <div className="header-contenido">
                    <div>
                        <h1>
                            <Link to="/bienvenido_a_flexguaraje_peru">Flexguaraje Perú</Link>
                        </h1>
                    </div>

                    <div className="login-datos">
                        <h3>{nombreUsuario || "Usuario Invitado"}</h3>
                        <button onClick={handleBackToHome}>Cerrar sesión</button>
                    </div>
                </div>
            </header>
        </>
    );
}

export default HeaderAdmin;