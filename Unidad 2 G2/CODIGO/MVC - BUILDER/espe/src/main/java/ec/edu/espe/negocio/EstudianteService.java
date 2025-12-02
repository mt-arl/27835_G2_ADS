package ec.edu.espe.negocio;

import ec.edu.espe.datos.builder.EstudianteBuilder; // Importamos el Builder
import ec.edu.espe.datos.model.Estudiante;
import ec.edu.espe.datos.repository.EstudianteRepository;
import java.util.List;

public class EstudianteService {
    private EstudianteRepository repository;

    public EstudianteService() {
        this.repository = EstudianteRepository.getInstance();
    }

    public void guardar(String id, String nombre, String edadStr) throws Exception {
        System.out.println("--- INICIANDO BUILDER ---");

        // USO DEL BUILDER: Construcción paso a paso
        Estudiante nuevoEstudiante = new EstudianteBuilder()
                .withId(id)
                .withNombres(nombre)
                .withEdadStr(edadStr)
                .build(); // ¡Aquí nace el objeto!

        // Validación de duplicados (Responsabilidad del Service/Repo)
        if (repository.buscarPorId(id) != null) {
            throw new Exception("Error: Cédula repetida");
        }

        repository.crear(nuevoEstudiante);
    }

    // Simulamos una carga masiva desde un archivo "virtual"
    public void cargarDesdeTexto(String lineaArchivo) throws Exception {
        // USO DEL BUILDER: Reconstrucción inteligente
        Estudiante recuperado = new EstudianteBuilder()
                .fromCSV(lineaArchivo)
                .build();
        repository.crear(recuperado);
    }

    // ... Resto de métodos (editar, eliminar, listar) ...
    public void editar(String id, String nombre, String edadStr) throws Exception {
        if (repository.buscarPorId(id) == null) throw new Exception("No existe");

        // También usamos Builder para editar, asegurando consistencia
        Estudiante editado = new EstudianteBuilder()
                .withId(id)
                .withNombres(nombre)
                .withEdadStr(edadStr)
                .build();
        repository.actualizar(editado);
    }

    public void eliminar(String id) throws Exception { repository.eliminar(id); }
    public Estudiante buscar(String id) { return repository.buscarPorId(id); }
    public List<Estudiante> listar() { return repository.listar(); }
}