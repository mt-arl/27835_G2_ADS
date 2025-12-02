package ec.edu.espe.datos.builder;

import ec.edu.espe.datos.model.Estudiante;

public class EstudianteBuilder {

    // Variables temporales para sostener los datos antes de construir
    private String id;
    private String nombres;
    private int edad;

    // Constructor vacío
    public EstudianteBuilder() {
    }

    // 1. PASO: Asignar ID
    public EstudianteBuilder withId(String id) {
        this.id = id;
        System.out.println("   🔨 [Builder] ID configurado: " + id);
        return this; // Retornamos el mismo builder para encadenar
    }

    // 2. PASO: Asignar Nombres (con transformación a Mayúsculas gratis)
    public EstudianteBuilder withNombres(String nombres) {
        if (nombres != null) {
            this.nombres = nombres.toUpperCase(); // Lógica de negocio visual
            System.out.println("   🔨 [Builder] Nombre procesado a mayúsculas: " + this.nombres);
        }
        return this;
    }

    // 3. PASO: Asignar Edad (con manejo de String seguro)
    public EstudianteBuilder withEdadStr(String edadStr) throws Exception {
        try {
            this.edad = Integer.parseInt(edadStr);
            System.out.println("   🔨 [Builder] Edad parseada correctamente: " + this.edad);
        } catch (NumberFormatException e) {
            throw new Exception("Error Builder: La edad no es un número válido.");
        }
        return this;
    }

    // Método especial para "Reconstruir" desde CSV (Archivo)
    public EstudianteBuilder fromCSV(String lineaCsv) throws Exception {
        System.out.println("   🔨 [Builder] Iniciando reconstrucción desde texto...");
        if (lineaCsv == null || !lineaCsv.contains(",")) {
            throw new Exception("Formato CSV inválido");
        }
        String[] partes = lineaCsv.split(",");
        // Reutilizamos nuestros propios pasos
        this.withId(partes[0].trim())
                .withNombres(partes[1].trim())
                .withEdadStr(partes[2].trim());
        return this;
    }

    // 4. PASO FINAL: Construir (Build)
    public Estudiante build() throws Exception {
        // Validaciones Finales antes de entregar el producto
        if (id == null || id.trim().isEmpty()) throw new Exception("Falta el ID");
        if (nombres == null || nombres.trim().isEmpty()) throw new Exception("Faltan los Nombres");
        if (edad <= 0) throw new Exception("La edad debe ser mayor a 0");

        System.out.println("✅ [Builder] Construcción finalizada con éxito.");
        return new Estudiante(id, nombres, edad);
    }
}