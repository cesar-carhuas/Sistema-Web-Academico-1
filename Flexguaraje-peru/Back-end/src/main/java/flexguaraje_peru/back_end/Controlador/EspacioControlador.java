package flexguaraje_peru.back_end.Controlador;

import flexguaraje_peru.back_end.Modelo.Espacio;
import flexguaraje_peru.back_end.Negocio.EspacioNegocio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/espacios")
public class EspacioControlador {

    @Autowired
    private EspacioNegocio espacioNegocio;

    @GetMapping("/listar_espacio")
    public List<Espacio> listarEspacios() {
        return espacioNegocio.ListarEspacio();
    }
}
