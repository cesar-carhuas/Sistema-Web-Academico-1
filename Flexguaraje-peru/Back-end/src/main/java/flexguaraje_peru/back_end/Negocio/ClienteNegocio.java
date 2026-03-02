package flexguaraje_peru.back_end.Negocio;

import flexguaraje_peru.back_end.Modelo.Cliente;
import flexguaraje_peru.back_end.Repositorio.ClienteRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ClienteNegocio {

    @Autowired
    private ClienteRepositorio clienteRepositorio;

    public boolean existeClientePorDni(String dni) {
        return clienteRepositorio.existsByDni(dni);
    }

    public List<Cliente> ListarClientes() {
        return clienteRepositorio.findAll();
    }

    public Cliente buscarPorDni(String dni) {
        Cliente cliente = clienteRepositorio.findByDni(dni);
        if (cliente == null) {
            throw new IllegalArgumentException("No se encontró un cliente con el DNI: " + dni);
        }
        return cliente;
    }

    public List<Cliente> buscarPorNombreCompleto(String nombre, String apellidoPaterno, String apellidoMaterno) {
        return clienteRepositorio.findByNombreAndApellidoPaternoAndApellidoMaterno(nombre, apellidoPaterno, apellidoMaterno);
    }

    public Cliente crearCliente(Cliente cliente) {
        return clienteRepositorio.save(cliente);
    }

    public Cliente actualizarCliente(String dni, Cliente nuevosDatos) {
        Cliente clienteExistente = clienteRepositorio.findByDni(dni);
        if (clienteExistente == null) {
            throw new IllegalArgumentException("Cliente con DNI " + dni + " no existe.");
        }

        // Actualizar los datos del cliente
        clienteExistente.setNombre(nuevosDatos.getNombre());
        clienteExistente.setApellidoPaterno(nuevosDatos.getApellidoPaterno());
        clienteExistente.setApellidoMaterno(nuevosDatos.getApellidoMaterno());
        clienteExistente.setTelefono(nuevosDatos.getTelefono());
        clienteExistente.setEmail(nuevosDatos.getEmail());
        clienteExistente.setDireccion(nuevosDatos.getDireccion());
        clienteExistente.setNotaAdicional(nuevosDatos.getNotaAdicional());

        // Guardar los cambios en la base de datos
        return clienteRepositorio.save(clienteExistente);
    }

    public Cliente buscarClientePorDni(String dni) {
        Cliente cliente = clienteRepositorio.findByDni(dni);
        if (cliente == null) {
            throw new IllegalArgumentException("No se encontró un cliente con el DNI: " + dni);
        }
        return cliente;
    }
}