package flexguaraje_peru.back_end.Negocio;

import flexguaraje_peru.back_end.Modelo.Cuenta;
import flexguaraje_peru.back_end.Modelo.Usuario;
import flexguaraje_peru.back_end.Repositorio.CuentaRepositorio;
import flexguaraje_peru.back_end.Repositorio.UsuarioRepositorio;
import flexguaraje_peru.back_end.seguridad.GeneradorPassSeguro;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CuentaNegocio {

    @Autowired
    private UsuarioRepositorio usuarioRepositorio;

    @Autowired
    private CuentaRepositorio cuentaRepositorio;

    // Método para listar todas las cuentas
    public List<Cuenta> listarCuentas() {
        return cuentaRepositorio.findTop20ByOrderByIdCuentaDesc();
    }

    public Cuenta buscarCuentaPorDni(String dni) throws Exception {
        // Buscar cuenta asociada al DNI
        return cuentaRepositorio.findByUsuarioDni(dni)
                .orElseThrow(() -> new Exception("No se encontró una cuenta asociada al DNI: " + dni));
    }

    public Cuenta guardarcuenta(Cuenta cuenta){
        return cuentaRepositorio.save(cuenta);
    }

    public Cuenta crearCuenta(String dni) throws Exception {
        // Buscar usuario por DNI y verificar su estado
        Usuario usuario = usuarioRepositorio.findByDni(dni)
                .orElseThrow(() -> new Exception("Usuario con DNI " + dni + " no encontrado."));

        if (usuario.getEstado() == Usuario.estadoUsuario.Desactivado) {
            throw new Exception("El usuario con DNI " + dni + " está desactivado. No se puede crear una cuenta.");
        }

        // Verificar si ya existe una cuenta asociada al DNI
        if (cuentaRepositorio.existsByUsuarioDni(dni)) {
            throw new Exception("El DNI " + dni + " ya tiene una cuenta registrada. No se puede crear una cuenta adicional.");
        }

        // Generar correo automático
        String emailGenerado = (usuario.getApellidoPaterno() + "_" + usuario.getDni() + "@flexguaraje_peru.com").toUpperCase();

        // Generar contraseña automática
        String passwordGenerada = GeneradorPassSeguro.generarContrasenaSegura();

        // Crear cuenta
        Cuenta cuenta = new Cuenta();
        cuenta.setUsuario(usuario);
        cuenta.setEmail(emailGenerado);
        cuenta.setPassword(passwordGenerada);
        cuenta.setEstado(Cuenta.estadoCuenta.Activo);

        return cuentaRepositorio.save(cuenta);
    }

    public Cuenta actualizarEstadoCuentaPorDni(String dni) throws Exception {
        // Buscar usuario por DNI
        Usuario usuario = usuarioRepositorio.findByDni(dni)
                .orElseThrow(() -> new Exception("Usuario con DNI " + dni + " no encontrado."));

        // Buscar cuenta asociada al usuario
        Optional<Cuenta> cuentaOptional = cuentaRepositorio.findByUsuario(usuario);
        if (cuentaOptional.isEmpty()) {
            throw new Exception("No se encontró una cuenta asociada al usuario con DNI " + dni + ".");
        }

        Cuenta cuenta = cuentaOptional.get();

        // Alternar el estado de la cuenta
        if (cuenta.getEstado() == Cuenta.estadoCuenta.Activo) {
            cuenta.setEstado(Cuenta.estadoCuenta.Desactivado);
        } else {
            cuenta.setEstado(Cuenta.estadoCuenta.Activo);
        }

        // Guardar y devolver la cuenta actualizada
        return cuentaRepositorio.save(cuenta);
    }

    public Cuenta actualizarContrasenaPorDni(String dni, String nuevaContrasena) throws Exception {
        // Buscar usuario por DNI
        Usuario usuario = usuarioRepositorio.findByDni(dni)
                .orElseThrow(() -> new Exception("Usuario con DNI " + dni + " no encontrado."));

        // Buscar cuenta asociada al usuario
        Cuenta cuenta = cuentaRepositorio.findByUsuario(usuario)
                .orElseThrow(() -> new Exception("No se encontró una cuenta asociada al usuario con DNI " + dni + "."));

        // Obtener el correo de la cuenta
        String correo = cuenta.getEmail();

        // Generar una nueva contraseña segura (esto es opcional, puedes modificar cómo generas la nueva contraseña)
        cuenta.setPassword(nuevaContrasena); // Aquí usas la nueva contraseña generada o proporcionada

        // Guardar la cuenta actualizada
        return cuentaRepositorio.save(cuenta);
    }
}
