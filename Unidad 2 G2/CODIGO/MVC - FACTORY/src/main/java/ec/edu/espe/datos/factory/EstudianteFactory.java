package ec.edu.espe.datos.factory;

import ec.edu.espe.datos.model.Estudiante;

/**
 * Factory Pattern: Centraliza la creación y validación estricta de Estudiantes.
 * Incluye soporte Thread-Safe para Modo Test.
 */
public class EstudianteFactory {

    // ThreadLocal garantiza que activar el modo test en un hilo no afecte a otros.
    // Vital para las métricas de concurrencia del informe.
    private static final ThreadLocal<Boolean> modoTest = ThreadLocal.withInitial(() -> false);

    // --- MÉTODOS DE CONTROL DE TEST ---
    public static void activarModoTest() { modoTest.set(true); }
    public static void desactivarModoTest() { modoTest.set(false); }

    /**
     * Método principal de fabricación.
     * @param id Cédula (String)
     * @param nombres Nombres (String)
     * @param edadStr Edad (String)
     * @return Estudiante válido
     * @throws Exception con mensajes descriptivos para la UI
     */
    public static Estudiante crearEstudiante(String id, String nombres, String edadStr) throws Exception {
        // 1. Validaciones de Formato Básico (Fail-Fast)
        System.out.println("🏭 [FACTORY] Iniciando protocolo de creación para ID: " + id);
        if (id == null || id.trim().isEmpty()) throw new Exception("La cédula es obligatoria.");
        if (nombres == null || nombres.trim().isEmpty()) throw new Exception("El nombre es obligatorio.");

        // 2. Validación de Cédula Ecuatoriana (Algoritmo Módulo 10)
        // Se omite si estamos en modo test para facilitar pruebas rápidas
        if (!modoTest.get() && !validarCedulaEcuatoriana(id.trim())) {
            throw new Exception("Error: La cédula ingresada no es válida o no existe.");
        }

        // 3. Validación de Nombre (Regex: Solo letras y espacios)
        if (!nombres.matches("^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$")) {
            throw new Exception("Error: El nombre solo debe contener letras.");
        }

        // 4. Transformación y Validación de Edad
        int edad;
        try {
            edad = Integer.parseInt(edadStr.trim());
        } catch (NumberFormatException e) {
            throw new Exception("Error: La edad debe ser un número entero.");
        }

        if (edad < 16 || edad > 100) {
            throw new Exception("Error: La edad debe estar entre 16 y 100 años.");
        }

        // 5. Creación Final (Solo si todo pasó)
        System.out.println("✅ [FACTORY] Validaciones exitosas. Objeto creado.");
        return new Estudiante(id.trim(), nombres.trim(), edad);
    }

    /**
     * Método fábrica para actualizaciones (Validaciones relajadas si es necesario)
     */
    public static Estudiante crearParaActualizacion(String id, String nombres, String edadStr) throws Exception {
        // Reutilizamos la lógica o aplicamos reglas específicas para editar
        return crearEstudiante(id, nombres, edadStr);
    }

    // --- ALGORITMO DE VALIDACIÓN (Privado) ---
    private static boolean validarCedulaEcuatoriana(String cedula) {
        if (cedula == null || cedula.length() != 10 || !cedula.matches("\\d+")) return false;

        try {
            int provincia = Integer.parseInt(cedula.substring(0, 2));
            if (provincia < 1 || provincia > 24) return false;

            int tercerDigito = Integer.parseInt(cedula.substring(2, 3));
            if (tercerDigito >= 6) return false; // Solo personas naturales

            int[] coeficientes = {2, 1, 2, 1, 2, 1, 2, 1, 2};
            int suma = 0;
            for (int i = 0; i < 9; i++) {
                int valor = Character.getNumericValue(cedula.charAt(i)) * coeficientes[i];
                suma += (valor > 9) ? valor - 9 : valor;
            }

            int digitoVerificador = Character.getNumericValue(cedula.charAt(9));
            int calculo = (suma % 10 == 0) ? 0 : (10 - (suma % 10));

            return digitoVerificador == calculo;
        } catch (Exception e) {
            return false;
        }
    }
}