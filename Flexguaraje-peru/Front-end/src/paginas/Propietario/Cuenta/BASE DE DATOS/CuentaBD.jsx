import axios from "axios";


const LISTAR_CUENTA_BD_API_URL = "http://127.0.0.1:8080/cuentas/listar_cuentas";
const BUSCAR_CUENTA_BD_API_URL = "http://127.0.0.1:8080/cuentas/buscar_cuenta";
const CREAR_CUENTA_BD_API_URL = "http://127.0.0.1:8080/cuentas/crear_cuenta";
const ACTUALIZAR_ESTADO_CUENTA_BD_API_URL = "http://127.0.0.1:8080/cuentas/actualizar_estado_cuenta";
const ACTUALIZAR_PASS_AUTO_BD_API_URL = "http://127.0.0.1:8080/cuentas/actualizar_pass_automatico";

class CuentaBD {
    listarCuentas() {
        return axios.get(LISTAR_CUENTA_BD_API_URL);
    }

    buscarCuenta(cuenta) {
        return axios.post(BUSCAR_CUENTA_BD_API_URL, cuenta);
    }

    crearCuenta = async (cuenta) => {
        return axios.post(CREAR_CUENTA_BD_API_URL, cuenta);
    }

    actualizarEstadoCuenta = async (dni) => {
        return axios.put(ACTUALIZAR_ESTADO_CUENTA_BD_API_URL, { dni });
    }

    actualizarPassAuto = async (dni, correo) => {
        return axios.put(ACTUALIZAR_PASS_AUTO_BD_API_URL, { dni, correo });
    }
}

export default new CuentaBD();
