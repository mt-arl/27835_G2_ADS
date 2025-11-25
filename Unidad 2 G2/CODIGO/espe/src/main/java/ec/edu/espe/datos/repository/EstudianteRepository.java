package ec.edu.espe.datos.repository;

import ec.edu.espe.datos.model.Estudiante;
import java.io.*;
import java.util.ArrayList;
import java.util.List;

public class EstudianteRepository {
    // 1. Instancia estática única
    private static EstudianteRepository instance;
    private List<Estudiante> estudiantes;
    private final String FILE_NAME = "estudiantes.txt";

    // 2. Constructor privado
    private EstudianteRepository() {
        this.estudiantes = new ArrayList<>();
        cargarDesdeArchivo();
    }

    // 3. Método de acceso global (Singleton)
    public static EstudianteRepository getInstance() {
        if (instance == null) {
            instance = new EstudianteRepository();
        }
        return instance;
    }

    // --- MÉTODOS CRUD ---
    public void crear(Estudiante estudiante) {
        estudiantes.add(estudiante);
        guardarEnArchivo();
    }

    public List<Estudiante> listar() {
        return estudiantes;
    }

    public Estudiante buscarPorId(String id) {
        return estudiantes.stream()
                .filter(e -> e.getId().equals(id))
                .findFirst().orElse(null);
    }

    public void actualizar(Estudiante estActualizado) {
        for (int i = 0; i < estudiantes.size(); i++) {
            if (estudiantes.get(i).getId().equals(estActualizado.getId())) {
                estudiantes.set(i, estActualizado);
                break;
            }
        }
        guardarEnArchivo();
    }

    public void eliminar(String id) {
        estudiantes.removeIf(e -> e.getId().equals(id));
        guardarEnArchivo();
    }

    // --- PERSISTENCIA TXT ---
    private void guardarEnArchivo() {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(FILE_NAME))) {
            for (Estudiante est : estudiantes) {
                writer.write(est.getId() + "," + est.getNombres() + "," + est.getEdad());
                writer.newLine();
            }
        } catch (IOException e) { e.printStackTrace(); }
    }

    private void cargarDesdeArchivo() {
        File file = new File(FILE_NAME);
        if (!file.exists()) return;
        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split(",");
                if (parts.length == 3) {
                    estudiantes.add(new Estudiante(parts[0], parts[1], Integer.parseInt(parts[2])));
                }
            }
        } catch (IOException e) { e.printStackTrace(); }
    }
}