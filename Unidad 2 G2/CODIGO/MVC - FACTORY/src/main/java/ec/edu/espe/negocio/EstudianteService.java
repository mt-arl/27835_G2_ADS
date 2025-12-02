package ec.edu.espe.negocio;

import ec.edu.espe.datos.factory.EstudianteFactory; // Importante
import ec.edu.espe.datos.model.Estudiante;
import ec.edu.espe.datos.repository.EstudianteRepository;
import java.util.List;

public class EstudianteService {
    private EstudianteRepository repository;

    public EstudianteService() {
        // Singleton para la persistencia
        this.repository = EstudianteRepository.getInstance();
    }

    public void guardar(String id, String nombre, String edadStr) throws Exception {
        // PASO 1: Creación Delegada (FACTORY)
        // El Service ya no sabe validar cédulas, confía en la Factory.
        Estudiante nuevoEstudiante = EstudianteFactory.crearEstudiante(id, nombre, edadStr);

        // PASO 2: Lógica de Negocio (Persistencia)
        // Validamos duplicados en la "base de datos"
        if (repository.buscarPorId(id) != null) {
            throw new Exception("Error: Ya existe un estudiante con la cédula " + id);
        }

        repository.crear(nuevoEstudiante);
    }

    public void editar(String id, String nombre, String edadStr) throws Exception {
        if (repository.buscarPorId(id) == null) {
            throw new Exception("Error: No se puede editar, el estudiante no existe.");
        }

        // Usamos la Factory también para asegurar que los datos editados sean válidos
        Estudiante estActualizado = EstudianteFactory.crearParaActualizacion(id, nombre, edadStr);
        repository.actualizar(estActualizado);
    }

    public void eliminar(String id) throws Exception {
        if (repository.buscarPorId(id) == null) throw new Exception("Error: Estudiante no encontrado.");
        repository.eliminar(id);
    }

    public Estudiante buscar(String id) { return repository.buscarPorId(id); }
    public List<Estudiante> listar() { return repository.listar(); }
}