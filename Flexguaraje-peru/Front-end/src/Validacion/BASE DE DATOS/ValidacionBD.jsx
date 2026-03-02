import axios from "axios";

// URLs de la API REST
const LOGIN_BD_API_REST_URL = "http://127.0.0.1:8080/validacion/login";
const CAMBIO_PASS_BD_API_REST_URL = "http://127.0.0.1:8080/validacion/cambiar_pass";

class ValidacionBD {
    async login(email, password) {
        const authHeader = "Basic " + btoa(`${email}:${password}`);
        const config = {
            headers: {
                Authorization: authHeader,
            },
        };

        try {
            const response = await axios.post(LOGIN_BD_API_REST_URL, {}, config);
            return response.data; // El backend devuelve el mensaje de bienvenida
        } catch (error) {
            throw (error.response?.data?.message || "Error del servidor para iniciar sesión");
        }
    }

    async cambiarContraseña(email, passwordActual, nuevaPassword, repetirNuevaPassword) {
        try {
            const response = await axios.put(CAMBIO_PASS_BD_API_REST_URL, {
                email,
                passwordActual,
                nuevaPassword,
                repetirNuevaPassword
            });
            return response.data;
        } catch (error) {
            throw (error.response?.data || "Error al cambiar la contraseña");
        }
    }
}

export default new ValidacionBD();
