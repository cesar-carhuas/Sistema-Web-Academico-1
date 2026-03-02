package flexguaraje_peru.back_end.Negocio;

import flexguaraje_peru.back_end.Modelo.Alquileres;
import flexguaraje_peru.back_end.Modelo.Boleta;
import flexguaraje_peru.back_end.Modelo.Cliente;
import flexguaraje_peru.back_end.Modelo.Espacio;
import flexguaraje_peru.back_end.Repositorio.AlquileresRepositorio;
import flexguaraje_peru.back_end.Repositorio.BoletaRepositorio;
import flexguaraje_peru.back_end.Repositorio.ClienteRepositorio;
import flexguaraje_peru.back_end.Repositorio.EspacioRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class BoletaNegocio {

    @Autowired
    private BoletaRepositorio boletaRepositorio;

    @Autowired
    private ClienteRepositorio clienteRepositorio;

    @Autowired
    private EspacioRepositorio EspacioRepositorio;

    @Autowired
    private AlquileresRepositorio alquileresRepositorio;

    public boolean existeDni(String dni) {
        return clienteRepositorio.existsByDni(dni); // Supone que tienes un método existsByDni en ClienteRepositorio
    }
    // Método para validar DNI
    private void validarDni(String dni) {
        if (dni == null || dni.isEmpty()) {
            throw new RuntimeException("El DNI es obligatorio.");
        }
        if (!dni.matches("\\d{8}")) { // Verifica que el DNI contenga exactamente 8 dígitos
            throw new RuntimeException("El DNI debe ser numérico y contener 8 caracteres.");
        }
    }

    // Método para validar código de espacio
    private void validarCodigoEspacio(String codigoEspacio) {
        Optional<Espacio> espacio = EspacioRepositorio.findByCodigoEspacio(codigoEspacio);
        if (espacio.isEmpty()) {
            throw new RuntimeException("El código de espacio no existe.");
        }
    }

    public List<Boleta> listarBoleta() {
        return boletaRepositorio.findAll();
    }

    public Boleta buscarPorCodigoBoleta(String codigoBoleta) {
        Optional<Boleta> boleta = boletaRepositorio.findByCodigoBoleta(codigoBoleta);
        return boleta.orElseThrow(() -> new IllegalArgumentException("El código de boleta no existe."));
    }

    //funcion para que pueda funcionar el filtrado de ESPACIOS por DNI
    public List<Espacio> obtenerEspaciosActivosPorDni(String dni) {
        // Obtener alquileres activos con las condiciones necesarias
        List<Alquileres> alquileresActivos = alquileresRepositorio.findAlquileresActivosByClienteDni(dni);

        // Filtrar los alquileres que cumplen con las condiciones: estado No_Ignorar y espacio en estado Ocupado y subestado Activo
        List<Alquileres> alquileresFiltrados = alquileresActivos.stream()
                .filter(a -> a.getEstado() == Alquileres.estadoAlquiler.No_Ignorar)
                .filter(a -> a.getEspacio().getEstado() == Espacio.EstadoEspacio.Ocupado)
                .filter(a -> a.getEspacio().getSubestado() == Espacio.SubestadoEspacio.Activo)
                .filter(a -> !boletaRepositorio.existsByAlquileres(a)) // Verificar que no haya boleta asociada
                .collect(Collectors.toList());

        // Extraemos los espacios de los alquileres filtrados y los ordenamos por el código del espacio
        return alquileresFiltrados.stream()
                .map(Alquileres::getEspacio)
                .sorted(Comparator.comparing(Espacio::getCodigoEspacio)) // Ordenar por código de espacio
                .collect(Collectors.toList());
    }

    public boolean clienteTieneAlquileresConBoletaPorDni(String dni) {
        // Obtener todos los alquileres del cliente basados en su DNI
        List<Alquileres> alquileres = alquileresRepositorio.findByClienteDni(dni); // Consulta por DNI del cliente

        // Si no hay alquileres para el cliente, retornar false
        if (alquileres.isEmpty()) {
            return false; // Si no hay alquileres, entonces no tiene boletas asociadas
        }

        // Verificar si cada alquiler tiene una boleta asociada
        for (Alquileres alquiler : alquileres) {
            // Revisar si el alquiler tiene una boleta asociada utilizando el código del espacio
            Boleta boleta = boletaRepositorio.findByAlquileresClienteDniAndAlquileresEspacioCodigoEspacio(
                    alquiler.getCliente().getDni(), alquiler.getEspacio().getCodigoEspacio());

            if (boleta == null) {
                return false; // Si no tiene boleta asociada, retornamos false
            }
        }
        return true; // Si todos los alquileres tienen boletas, retornamos true
    }

    // generar codigo boleta automatico y random
    private String generarCodigoBoletaUnico() {
        String codigoBoleta = "";  // Inicializamos la variable con un valor predeterminado
        Random random = new Random();
        boolean codigoExistente = true;

        // Bucle para generar códigos hasta encontrar uno único
        while (codigoExistente) {
            // Generar un código aleatorio de 11 dígitos en el rango de 1 a 99999999999
            long codigoNumerico = 1L + (long) (random.nextDouble() * 99999999999L); // Mínimo 1, máximo 99999999999

            // Formatear el número generado como una cadena de 11 dígitos
            codigoBoleta = "BLT-" + String.format("%011d", codigoNumerico); // Ejemplo: BLT-00000000001

            // Verificar si el código ya existe en la base de datos
            codigoExistente = boletaRepositorio.existsByCodigoBoleta(codigoBoleta); // Método para verificar si el código ya existe
        }
        return codigoBoleta; // Retorna el código único
    }

    @Transactional
    public Boleta agregarBoleta(String dni, String codigoEspacio) {
        // Validar DNI
        validarDni(dni);

        // Buscar cliente por DNI
        Cliente cliente = clienteRepositorio.findByDni(dni);
        if (cliente == null) {
            throw new RuntimeException("Cliente no encontrado");
        }

        // Validar código de espacio
        validarCodigoEspacio(codigoEspacio);

        // Obtener alquileres activos del cliente
        List<Alquileres> alquileresActivos = alquileresRepositorio.findAlquileresActivosByClienteDni(dni);

        // Filtrar el alquiler correspondiente al código de espacio
        Alquileres alquilerSeleccionado = alquileresActivos.stream()
                .filter(a -> a.getEspacio().getCodigoEspacio().equals(codigoEspacio))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("El cliente no tiene alquileres activos con ese código de espacio"));

        // Verificar si ya existe una boleta para este alquiler
        if (boletaRepositorio.existsByAlquileres(alquilerSeleccionado)) {
            throw new RuntimeException("El alquiler ya tiene una boleta asociada");
        }

        // Generar un código de boleta aleatorio único
        String codigoBoleta = generarCodigoBoletaUnico();

        // Obtener el costo por día del espacio
        BigDecimal costoDia = alquilerSeleccionado.getEspacio().getCosto();

        // Obtener el valor de dias_alquiler (almacenado como String, ej. "3 DIAS")
        String diasAlquilerStr = alquilerSeleccionado.getDias_alquiler(); // "3 DIAS" o "1 DIA"
        int diasAlquiler;

        // Extraer el número de días desde el string (usando solo el número)
        try {
            diasAlquiler = Integer.parseInt(diasAlquilerStr.split(" ")[0]); // Se espera "3 DIAS", "1 DIA"
        } catch (NumberFormatException e) {
            throw new RuntimeException("Formato incorrecto en 'dias_alquiler': " + diasAlquilerStr);
        }

        // Calcular el monto sin IGV
        BigDecimal montoBase = costoDia.multiply(BigDecimal.valueOf(diasAlquiler));

        // Calcular el IGV (18% del monto base)
        BigDecimal igv = montoBase.multiply(BigDecimal.valueOf(0.18));

        // Calcular el monto total (monto base + IGV)
        BigDecimal montoTotal = montoBase.add(igv);

        // Crear la boleta
        Boleta boleta = new Boleta();
        boleta.setAlquileres(alquilerSeleccionado);
        boleta.setCodigoBoleta(codigoBoleta);
        boleta.setMetodoPago(Boleta.metodo_pago.Efectivo); // Se asigna 'Efectivo' por el momento
        boleta.setFechaEmision(LocalDate.now()); // Fecha de emisión actual
        boleta.setMontoPagar(montoTotal);
        boleta.setMontoIGV(igv); // Nuevo campo para almacenar el IGV
        boleta.setMontobase(montoBase); // Nuevo campo para almacenar el monto base

        // Guardar la boleta
        return boletaRepositorio.save(boleta);
    }
}