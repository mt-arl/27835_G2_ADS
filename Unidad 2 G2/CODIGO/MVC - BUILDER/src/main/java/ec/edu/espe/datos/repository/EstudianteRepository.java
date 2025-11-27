package ec.edu.espe.datos.repository;

import ec.edu.espe.datos.builder.EstudianteBuilder;
import ec.edu.espe.datos.model.Estudiante;
import java.io.*;
import java.util.ArrayList;
import java.util.List;

public class EstudianteRepository {
    // Singleton Pattern - Instancia única
    private static EstudianteRepository instance;
    
    private List<Estudiante> estudiantes;
    private final String FILE_NAME = "estudiantes.txt";

    // Constructor privado para Singleton
    private EstudianteRepository() {
        this.estudiantes = new ArrayList<>();
        cargarDesdeArchivo(); // Carga datos al iniciar
    }
    
    // Método getInstance() para obtener la única instancia
    public static synchronized EstudianteRepository getInstance() {
        if (instance == null) {
            instance = new EstudianteRepository();
        }
        return instance;
    }

    public void crear(Estudiante estudiante) {
        estudiantes.add(estudiante);
        guardarEnArchivo(); // Guarda cambios
    }

    public List<Estudiante> listar() {
        return estudiantes;
    }

    public Estudiante buscarPorId(String id) {
        for (Estudiante est : estudiantes) {
            if (est.getId().equals(id)) {
                return est;
            }
        }
        return null;
    }

    public void actualizar(Estudiante estudianteActualizado) {
        for (int i = 0; i < estudiantes.size(); i++) {
            if (estudiantes.get(i).getId().equals(estudianteActualizado.getId())) {
                estudiantes.set(i, estudianteActualizado);
                break;
            }
        }
        guardarEnArchivo(); // Actualiza el TXT
    }

    public void eliminar(String id) {
        estudiantes.removeIf(e -> e.getId().equals(id));
        guardarEnArchivo(); // Actualiza el TXT
    }

    // --- MÉTODOS PRIVADOS PARA MANEJO DE ARCHIVOS ---

    private void guardarEnArchivo() {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(FILE_NAME))) {
            for (Estudiante est : estudiantes) {
                // Formato CSV: id,nombre,edad
                writer.write(est.getId() + "," + est.getNombres() + "," + est.getEdad());
                writer.newLine();
            }
        } catch (IOException e) {
            System.err.println("Error al guardar en archivo: " + e.getMessage());
        }
    }

    private void cargarDesdeArchivo() {
        File file = new File(FILE_NAME);
        if (!file.exists()) return;

        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String linea;
            while ((linea = reader.readLine()) != null) {
                try {
                    // Usar Builder para crear estudiantes desde archivo
                    Estudiante est = EstudianteBuilder.crearDesdeArchivo(linea);
                    estudiantes.add(est);
                } catch (Exception e) {
                    System.err.println("Error al procesar línea: " + linea + " - " + e.getMessage());
                }
            }
        } catch (IOException e) {
            System.err.println("Error al leer archivo: " + e.getMessage());
        }
    }
}
