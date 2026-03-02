package flexguaraje_peru.back_end.Negocio;

import flexguaraje_peru.back_end.Modelo.Espacio;
import flexguaraje_peru.back_end.Repositorio.EspacioRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EspacioNegocio {

    @Autowired
    private EspacioRepositorio espacioRepositorio;

    public List<Espacio> ListarEspacio() {
        return espacioRepositorio.findAll();
    }
}
