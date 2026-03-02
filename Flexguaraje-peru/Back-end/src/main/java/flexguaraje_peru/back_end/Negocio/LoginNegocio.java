package flexguaraje_peru.back_end.Negocio;

import flexguaraje_peru.back_end.Modelo.Cuenta;
import flexguaraje_peru.back_end.Repositorio.LoginRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LoginNegocio {

    @Autowired
    private LoginRepositorio loginRepositorio;

    public Cuenta autenticarUsuario(String email, String password) {
        // Buscar la cuenta por email, ignorando el case
        Cuenta cuenta = loginRepositorio.findByEmail(email.toUpperCase())
                .orElseThrow(() -> new IllegalArgumentException("Correo y/o contraseña incorrecto"));

        // Verificar que la cuenta esté activa
        if (cuenta.getEstado() != Cuenta.estadoCuenta.Activo) {
            String dni = cuenta.getUsuario().getDni();
            throw new IllegalArgumentException("La cuenta se encuentra desactivada.");
        }

        // Comparar la contraseña proporcionada con la almacenada en texto plano
        if (!password.equals(cuenta.getPassword())) {
            throw new IllegalArgumentException("Correo y/o contraseña incorrecto");
        }

        return cuenta;
    }

    // Método para cambiar la contraseña
    public void cambiarPassword(String email, String passwordActual, String nuevaPassword, String repetirNuevaPassword) {
        // Validar que la nueva contraseña cumpla con los requisitos de seguridad
        String regex = "^(?=(?:.*[A-Z]){3})(?=(?:.*\\d){3})(?=(?:.*[!@#$%^&*(),.?\":{}|<>]){2})(?=.*[a-z]).{10,}$";
        if (!nuevaPassword.matches(regex)) {
            throw new IllegalArgumentException("La nueva contraseña debe tener mínimo 10 caracteres, incluir 3 mayúsculas, 3 números, 2 caracteres especiales y el resto en minúsculas.");
        }

        // Verificar que las nuevas contraseñas coinciden
        if (!nuevaPassword.equals(repetirNuevaPassword)) {
            throw new IllegalArgumentException("Las nuevas contraseñas no coinciden");
        }

        // Buscar la cuenta por email, ignorando el case
        Cuenta cuenta = loginRepositorio.findByEmail(email.toUpperCase())
                .orElseThrow(() -> new IllegalArgumentException("Correo y/o contraseña incorrecta"));

        if (!passwordActual.equals(cuenta.getPassword())) {
            throw new IllegalArgumentException("Correo y/o contraseña incorrecta");
        }

        // Verificar que la cuenta esté activa
        if (cuenta.getEstado() != Cuenta.estadoCuenta.Activo) {
            throw new IllegalArgumentException("La cuenta se encuentra desactivada");
        }

        // Verificar que la nueva contraseña sea completamente diferente
        if (nuevaPassword.equals(passwordActual)) {
            throw new IllegalArgumentException("La nueva contraseña debe ser completamente diferente de la actual");
        }

        // Actualizar la contraseña directamente
        cuenta.setPassword(nuevaPassword);

        // Guardar la cuenta con la nueva contraseña
        loginRepositorio.save(cuenta);
    }
}
