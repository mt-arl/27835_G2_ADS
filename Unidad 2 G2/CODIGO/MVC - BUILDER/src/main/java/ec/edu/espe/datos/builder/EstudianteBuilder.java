package ec.edu.espe.datos.builder;

import ec.edu.espe.datos.model.Estudiante;


public class EstudianteBuilder {
    private static boolean modoTest = false;

    public static void activarModoTest() { modoTest = true; }
    public static void desactivarModoTest() { modoTest = false; }

    public static Builder builder() { return new Builder(); }

    public static Estudiante crearEstudiante(String id, String nombres, String edadStr) throws Exception {
        // Uso rápido cuando se tiene toda la información en strings.
        return builder().withId(id).withNombres(nombres).withEdadStr(edadStr).build();
    }

    public static Estudiante crearParaActualizacion(String id, String nombres, String edadStr) throws Exception {
        return builder().withId(id).withNombres(nombres).withEdadStr(edadStr).buildForUpdate();
    }

    public static Estudiante crearDesdeArchivo(String linea) throws Exception {
        if (linea == null || linea.trim().isEmpty()) {
            throw new Exception("Línea de archivo vacía.");
        }

        String[] partes = linea.split(",");
        if (partes.length != 3) {
            throw new Exception("Formato de archivo inválido. Esperado: cedula,nombres,edad");
        }

        String id = partes[0].trim();
        String nombres = partes[1].trim();
        int edad;
        try { edad = Integer.parseInt(partes[2].trim()); }
        catch (NumberFormatException e) { throw new Exception("Error al parsear edad desde archivo: " + linea); }

        // Se usa cuando leemos una línea CSV del archivo: "id,nombres,edad"
        return builder().withId(id).withNombres(nombres).withEdad(edad).build();
    }

    private static boolean validarCedulaEcuatoriana(String cedula) {
        if (cedula == null || cedula.length() != 10) return false;
        try {
            if (!cedula.matches("\\d{10}")) return false;
            int provincia = Integer.parseInt(cedula.substring(0, 2));
            if (provincia < 1 || provincia > 24) return false;
            int tercerDigito = Integer.parseInt(cedula.substring(2, 3));
            if (tercerDigito >= 6) return false;
            int[] coeficientes = {2,1,2,1,2,1,2,1,2};
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

    public static class Builder {
        private String id;
        private String nombres;
        private int edad;

        // Métodos fluentes para configurar cada campo antes de construir
        public Builder withId(String id) { this.id = id; return this; }
        public Builder withNombres(String nombres) { this.nombres = nombres; return this; }
        public Builder withEdad(int edad) { this.edad = edad; return this; }
        public Builder withEdadStr(String edadStr) throws Exception {
            if (edadStr == null || edadStr.trim().isEmpty()) throw new Exception("La edad no puede estar vacía.");
            try { this.edad = Integer.parseInt(edadStr.trim()); }
            catch (NumberFormatException e) { throw new Exception("La edad debe ser un número válido."); }
            return this;
        }


        public Estudiante build() throws Exception {
            // Validaciones
            if (id == null || id.trim().isEmpty()) throw new Exception("La cédula no puede estar vacía.");
            if (nombres == null || nombres.trim().isEmpty()) throw new Exception("Los nombres no pueden estar vacíos.");
            // En modo normal validamos la cédula ecuatoriana; en modo test se omite.
            if (!modoTest && !validarCedulaEcuatoriana(id.trim())) throw new Exception("La cédula ingresada es incorrecta.");
            if (edad <= 0) throw new Exception("La edad debe ser mayor a 0.");
            if (edad > 150) throw new Exception("La edad no puede ser mayor a 150.");
            return new Estudiante(id.trim(), nombres.trim(), edad);
        }

        // Para actualizaciones aceptamos que la cédula ya exista, solo validamos nombres/edad
       
        public Estudiante buildForUpdate() throws Exception {
            if (nombres == null || nombres.trim().isEmpty()) throw new Exception("Los nombres no pueden estar vacíos.");
            if (edad <= 0 || edad > 150) throw new Exception("La edad debe estar entre 1 y 150.");
            return new Estudiante(id.trim(), nombres.trim(), edad);
        }
    }
}
