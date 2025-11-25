package ec.edu.espe.negocio;

import ec.edu.espe.datos.model.Estudiante;
import ec.edu.espe.datos.repository.EstudianteRepository;
import java.util.List;

public class EstudianteService {
    private EstudianteRepository repository;

    public EstudianteService() {
        // USO DEL SINGLETON
        this.repository = EstudianteRepository.getInstance();
    }

    public void guardar(String id, String nombre, String edadStr) throws Exception {
        validar(id, nombre, edadStr);
        if (repository.buscarPorId(id) != null) throw new Exception("Cédula repetida");
        repository.crear(new Estudiante(id, nombre, Integer.parseInt(edadStr)));
    }

    public void editar(String id, String nombre, String edadStr) throws Exception {
        validar(id, nombre, edadStr);
        if (repository.buscarPorId(id) == null) throw new Exception("Estudiante no existe");
        repository.actualizar(new Estudiante(id, nombre, Integer.parseInt(edadStr)));
    }

    public void eliminar(String id) throws Exception {
        if (repository.buscarPorId(id) == null) throw new Exception("No existe");
        repository.eliminar(id);
    }

    public Estudiante buscar(String id) {
        return repository.buscarPorId(id);
    }

    public List<Estudiante> listar() {
        return repository.listar();
    }

    private void validar(String id, String nom, String edadStr) throws Exception {
        // 1. Validación de Campos Vacíos
        if (id == null || id.trim().isEmpty() ||
                nom == null || nom.trim().isEmpty() ||
                edadStr == null || edadStr.trim().isEmpty()) {
            throw new Exception("Todos los campos son obligatorios.");
        }

        // 2. Validación de Cédula (Solo 10 dígitos numéricos)
        // El regex \\d{10} exige exactamente 10 números del 0 al 9.
        if (!id.matches("\\d{10}")) {
            throw new Exception("La cédula debe tener exactamente 10 dígitos numéricos.");
        }

        // 3. Validación de Nombre (Solo letras y espacios)
        // Este regex permite letras mayúsculas, minúsculas, tildes, ñ y espacios.
        // Evita que metan números o símbolos raros en el nombre.
        if (!nom.matches("^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$")) {
            throw new Exception("El nombre solo debe contener letras y espacios.");
        }

        // Validación extra: longitud mínima del nombre
        if (nom.length() < 3) {
            throw new Exception("El nombre es demasiado corto.");
        }

        // 4. Validación de Edad (Que sea número y rango lógico)
        if (!edadStr.matches("\\d+")) {
            throw new Exception("La edad debe ser un número válido.");
        }

        int edad = Integer.parseInt(edadStr);
        // Rango lógico para un estudiante universitario (ej. 16 a 100 años)
        if (edad < 16 || edad > 100) {
            throw new Exception("La edad debe estar entre 16 y 100 años.");
        }
    }}