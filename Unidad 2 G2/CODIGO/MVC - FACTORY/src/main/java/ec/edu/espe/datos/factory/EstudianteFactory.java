package ec.edu.espe.datos.factory;

import ec.edu.espe.datos.model.Estudiante;

/**
 * Factory Pattern - Simple Factory
 * Centraliza la creación y validación de objetos Estudiante
 * 
 * IMPORTANTE: Siempre valida cédulas ecuatorianas con el algoritmo oficial del INEC
 * El modo test está disponible SOLO para pruebas unitarias y usa ThreadLocal para aislamiento
 */
public class EstudianteFactory {
    
    // Modo test usando ThreadLocal para que solo afecte al thread actual
    // Esto evita que el modo test afecte otros threads o la aplicación principal
    private static final ThreadLocal<Boolean> modoTest = ThreadLocal.withInitial(() -> false);
    
    /**
     * Activa modo test SOLO para el thread actual
     * ⚠️ SOLO USAR EN TESTS UNITARIOS
     */
    public static void activarModoTest() {
        modoTest.set(true);
    }
    
    /**
     * Desactiva modo test para el thread actual
     */
    public static void desactivarModoTest() {
        modoTest.set(false);
    }
    
    /**
     * Verifica si el modo test está activo en el thread actual
     */
    public static boolean estaModoTestActivo() {
        return modoTest.get();
    }
    
    /**
     * Crea un estudiante validando todos los datos de entrada
     * @param id Cédula del estudiante
     * @param nombres Nombres completos
     * @param edadStr Edad en formato String
     * @return Estudiante validado y creado
     * @throws Exception Si hay errores de validación
     */
    public static Estudiante crearEstudiante(String id, String nombres, String edadStr) throws Exception {
        // 1. Validaciones básicas de nulidad y vacío
        if (id == null || id.trim().isEmpty()) {
            throw new Exception("La cédula no puede estar vacía.");
        }
        if (nombres == null || nombres.trim().isEmpty()) {
            throw new Exception("Los nombres no pueden estar vacíos.");
        }
        if (edadStr == null || edadStr.trim().isEmpty()) {
            throw new Exception("La edad no puede estar vacía.");
        }

        // 2. Validar formato de cédula ecuatoriana usando algoritmo oficial INEC
        // En modo test, se omite la validación SOLO para el thread actual
        if (!modoTest.get() && !validarCedulaEcuatoriana(id.trim())) {
            throw new Exception("La cédula ingresada es incorrecta.");
        }

        // 3. Validar y parsear edad
        int edad;
        try {
            edad = Integer.parseInt(edadStr.trim());
        } catch (NumberFormatException e) {
            throw new Exception("La edad debe ser un número válido.");
        }

        if (edad <= 0) {
            throw new Exception("La edad debe ser mayor a 0.");
        }
        
        if (edad > 150) {
            throw new Exception("La edad no puede ser mayor a 150.");
        }

        // 4. Crear y retornar el estudiante validado
        return new Estudiante(id.trim(), nombres.trim(), edad);
    }

    /**
     * Crea un estudiante desde una línea de archivo (deserialización)
     * Formato esperado: cedula,nombres,edad
     * @param linea Línea del archivo en formato CSV
     * @return Estudiante creado desde el archivo
     * @throws Exception Si el formato es inválido
     */
    public static Estudiante crearDesdeArchivo(String linea) throws Exception {
        if (linea == null || linea.trim().isEmpty()) {
            throw new Exception("Línea de archivo vacía.");
        }

        String[] partes = linea.split(",");
        if (partes.length != 3) {
            throw new Exception("Formato de archivo inválido. Esperado: cedula,nombres,edad");
        }

        try {
            String id = partes[0].trim();
            String nombres = partes[1].trim();
            int edad = Integer.parseInt(partes[2].trim());

            // Crear directamente sin validación exhaustiva (datos ya validados al guardar)
            return new Estudiante(id, nombres, edad);
        } catch (NumberFormatException e) {
            throw new Exception("Error al parsear edad desde archivo: " + linea);
        }
    }

    /**
     * Crea un estudiante para actualización (sin validar cédula duplicada)
     * @param id Cédula existente
     * @param nombres Nuevos nombres
     * @param edadStr Nueva edad
     * @return Estudiante actualizado
     * @throws Exception Si hay errores de validación
     */
    public static Estudiante crearParaActualizacion(String id, String nombres, String edadStr) throws Exception {
        // Validaciones básicas sin validar duplicidad de cédula
        if (nombres == null || nombres.trim().isEmpty()) {
            throw new Exception("Los nombres no pueden estar vacíos.");
        }

        int edad;
        try {
            edad = Integer.parseInt(edadStr.trim());
        } catch (NumberFormatException e) {
            throw new Exception("La edad debe ser un número válido.");
        }

        if (edad <= 0 || edad > 150) {
            throw new Exception("La edad debe estar entre 1 y 150.");
        }

        return new Estudiante(id.trim(), nombres.trim(), edad);
    }

    /**
     * Valida una cédula ecuatoriana mediante el algoritmo oficial
     * @param cedula Cédula a validar (10 dígitos)
     * @return true si es válida, false en caso contrario
     */
    private static boolean validarCedulaEcuatoriana(String cedula) {
        if (cedula == null || cedula.length() != 10) {
            return false;
        }

        try {
            // Validar que sean solo dígitos
            if (!cedula.matches("\\d{10}")) {
                return false;
            }

            // Validar código de provincia (01-24)
            int provincia = Integer.parseInt(cedula.substring(0, 2));
            if (provincia < 1 || provincia > 24) {
                return false;
            }

            // Validar tercer dígito (solo personas naturales: 0-5)
            int tercerDigito = Integer.parseInt(cedula.substring(2, 3));
            if (tercerDigito >= 6) {
                return false;
            }

            // Algoritmo de validación del dígito verificador
            int[] coeficientes = {2, 1, 2, 1, 2, 1, 2, 1, 2};
            int suma = 0;

            for (int i = 0; i < 9; i++) {
                int digito = Integer.parseInt(String.valueOf(cedula.charAt(i)));
                int producto = digito * coeficientes[i];
                suma += (producto > 9) ? producto - 9 : producto;
            }

            int digitoVerificador = Integer.parseInt(String.valueOf(cedula.charAt(9)));
            int decenaSuperior = (suma % 10 == 0) ? suma : ((suma / 10) + 1) * 10;
            int digitoCalculado = decenaSuperior - suma;

            return digitoCalculado == digitoVerificador;

        } catch (NumberFormatException e) {
            return false;
        }
    }
}
