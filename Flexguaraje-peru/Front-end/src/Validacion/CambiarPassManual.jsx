import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ValidacionBD from './BASE DE DATOS/ValidacionBD';
import Swal from 'sweetalert2';
import { Eye, EyeOff } from 'lucide-react';
import "./CambiarPassManual.css"

const CambiarPassManual = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        oldPassword: '',
        newPassword: '',
        repeatPassword: '',
    });
    const [passwordVisibility, setPasswordVisibility] = useState({
        oldPassword: false,
        newPassword: false,
        repeatPassword: false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const togglePasswordVisibility = (field) => {
        setPasswordVisibility((prevState) => ({
            ...prevState,
            [field]: !prevState[field],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación de campos vacíos
        if (!formData.email.trim() && !formData.oldPassword.trim() && !formData.newPassword.trim() && !formData.repeatPassword.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Campos Vacíos',
                text: 'Por favor, completa todos los campos.',
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        const errores = [];
        const passwordPattern = /^(?=(?:.*[A-Z]){3})(?=(?:.*\d){3})(?=(?:.*[!@#$%^&*(),.?":{}|<>]){2})(?=.*[a-z]).{10,}$/;
        const emailPattern = /^[A-Za-zÁÉÍÓÚáéíóú]+_\d{8}@flexguaraje_peru\.com$/i;

        // Validaciones individuales
        if (!formData.email.trim()) {
            errores.push("El campo de correo no puede estar vacío.");
        } else if (formData.email.trim() && !emailPattern.test(formData.email.trim())) {
            errores.push("El correo debe seguir el formato: apellidoPaterno_dni@flexguaraje_peru.com.");
        }

        if (!formData.oldPassword.trim()) {
            errores.push("El campo de contraseña actual no puede estar vacío.");
        }

        if (!formData.newPassword.trim()) {
            errores.push("El campo de nueva contraseña no puede estar vacío.");
        } else if (!passwordPattern.test(formData.newPassword)) {
            errores.push("La nueva contraseña debe tener al menos 10 caracteres, incluir 3 mayúsculas, 3 números, 2 caracteres especiales y el resto en minúsculas.");
        } else if (formData.newPassword === formData.oldPassword) {
            errores.push("La nueva contraseña debe ser completamente diferente de la actual.");
        }

        if (!formData.repeatPassword.trim()) {
            errores.push("El campo de repetir contraseña no puede estar vacío.");
        } else if (formData.newPassword !== formData.repeatPassword) {
            errores.push("el campo de repetir contraseña no coinciden con la nueva contraseña.");
        }

        // Mostrar los errores si existen
        if (errores.length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Errores de Validación',
                html: `${errores.map(error => `<p>${error}</p>`).join('')}`,
                showConfirmButton: true,
            });
            return;
        }

        try {
            const result = await ValidacionBD.cambiarContraseña(
                formData.email.trim(),
                formData.oldPassword.trim(),
                formData.newPassword.trim(),
                formData.repeatPassword.trim()
            );

            // Verificar si el backend respondió con un mensaje de éxito
            if (result.includes("Contraseña actualizada con éxito")) {
                Swal.fire({
                    icon: 'success',
                    title: 'Contraseña Actualizada',
                    text: result,
                    showConfirmButton: false,
                    timer: 3000
                });

                // Redirigir al login después de cambiar la contraseña
                navigate("/");
            } else {
                // Si la respuesta no indica éxito, mostrar error
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: result,
                    showConfirmButton: false,
                    timer: 3000
                });
            }

        } catch (error) {
            const errorMessage = typeof error === "string" ? error : "Error inesperado";

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage,
            });
        }
    };

    return (
        <div className='general-PassManual'>
            <form onSubmit={handleSubmit} className='PassManual-container'>
                <h2 className='form-title-Manual'>CAMBIAR CONTRASEÑA</h2>
                <div className='input-group'>
                    <input
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Correo electrónico"
                        className='animated-input-PassManual'
                    />
                </div>
                <div className='input-group contraseña-visible'>
                    <input
                        type={passwordVisibility.oldPassword ? 'text' : 'password'}
                        name="oldPassword"
                        value={formData.oldPassword}
                        onChange={handleChange}
                        placeholder="Contraseña Actual"
                        className='animated-input-PassManual'
                    />
                    <span onClick={() => togglePasswordVisibility('oldPassword')}>
                        {passwordVisibility.oldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </span>
                </div>
                <div className='input-group contraseña-visible'>
                    <input
                        type={passwordVisibility.newPassword ? 'text' : 'password'}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="Nueva Contraseña"
                        className='animated-input-PassManual'
                    />
                    <span onClick={() => togglePasswordVisibility('newPassword')}>
                        {passwordVisibility.newPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </span>
                </div>
                <div className='input-group contraseña-visible'>
                    <input
                        type={passwordVisibility.repeatPassword ? 'text' : 'password'}
                        name="repeatPassword"
                        value={formData.repeatPassword}
                        onChange={handleChange}
                        placeholder="Repetir Nueva Contraseña"
                        className='animated-input-PassManual'
                    />
                    <span onClick={() => togglePasswordVisibility('repeatPassword')}>
                        {passwordVisibility.repeatPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </span>
                </div>
                <button type="submit" className='animated-button-PassManual'>Actualizar Contraseña</button>
                <p onClick={() => navigate("/")} className='toggle-text'>¿Volver a Iniciar Sesión?</p>
            </form>
        </div>
    );
};

export default CambiarPassManual;
