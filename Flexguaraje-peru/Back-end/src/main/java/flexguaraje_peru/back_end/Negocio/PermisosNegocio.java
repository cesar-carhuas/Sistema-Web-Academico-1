package flexguaraje_peru.back_end.Negocio;

import flexguaraje_peru.back_end.Modelo.Permisos;
import flexguaraje_peru.back_end.Modelo.Roles;
import flexguaraje_peru.back_end.Repositorio.PermisoRepositorio;
import flexguaraje_peru.back_end.Repositorio.RolesRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PermisosNegocio {

    @Autowired
    private PermisoRepositorio permisosRepositorio;

    @Autowired
    private RolesRepositorio rolesRepositorio;

    public boolean existePermisoConNombre(String nombrePermiso) {
        return permisosRepositorio.findByNombrePermiso(nombrePermiso).isPresent();
    }

    public boolean existePermiso(Long idPermiso) {
        return permisosRepositorio.existsById(idPermiso);
    }

    public Permisos obtenerPermisoPorId(Long idPermiso) {
        return permisosRepositorio.findById(idPermiso).orElse(null); // Retorna null si no se encuentra
    }

    // Listar permisos
    public List<Permisos> listarPermisos() {
        return permisosRepositorio.findAll();
    }

    public List<Roles> obtenerRolesActivos() {
        return rolesRepositorio.findByEstado(Roles.estadoRoles.Activo);
    }


    public Permisos crearPermiso(String nombreRol, String nombrePermiso) {
        Roles rol = rolesRepositorio.findByNombreRol(nombreRol)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));

        // Validar si el nombre del permiso ya existe
        if (permisosRepositorio.findByNombrePermiso(nombrePermiso).isPresent()) {
            throw new RuntimeException("Ya existe un permiso con el nombre " + nombrePermiso);
        }

        Permisos permiso = new Permisos();
        permiso.setRoles(rol);
        permiso.setNombrePermiso(nombrePermiso);
        permiso.setEstado(Permisos.estadoPermisos.Activo);  // El estado se establece automáticamente en "Activo"

        return permisosRepositorio.save(permiso);
    }

    // Actualizar el nombre de un permiso
    public Permisos actualizarNombrePermiso(Long idPermiso, String nuevoNombre) {
        Optional<Permisos> permisoExistente = permisosRepositorio.findByIdPermiso(idPermiso);
        if (permisoExistente.isEmpty()) {
            throw new IllegalArgumentException("El permiso con el ID " + idPermiso + " no existe.");
        }
        Permisos permiso = permisoExistente.get();
        permiso.setNombrePermiso(nuevoNombre);
        return permisosRepositorio.save(permiso);
    }

    // Actualizar el estado de un permiso
    public Permisos actualizarEstadoPermiso(Long idPermiso) {
        Optional<Permisos> permisoExistente = permisosRepositorio.findByIdPermiso(idPermiso);
        if (permisoExistente.isEmpty()) {
            throw new IllegalArgumentException("El permiso con el ID " + idPermiso + " no existe.");
        }
        Permisos permiso = permisoExistente.get();
        permiso.setEstado(permiso.getEstado() == Permisos.estadoPermisos.Activo ?
                Permisos.estadoPermisos.Desactivado : Permisos.estadoPermisos.Activo);
        return permisosRepositorio.save(permiso);
    }

    // Método para eliminar el permiso
    public String eliminarPermiso(Long idPermiso) {
        if (!permisosRepositorio.existsById(idPermiso)) {
            return "El permiso con el ID " + idPermiso + " no existe.";
        }
        permisosRepositorio.deleteById(idPermiso); // Eliminar el permiso por ID
        return "Permiso con ID " + idPermiso + " eliminado exitosamente.";
    }
}
