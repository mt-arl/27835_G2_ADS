package ec.edu.espe.presentacion;

import javax.swing.SwingUtilities;

public class Main {
    public static void main(String[] args) {
        // Ejecutar la UI en el hilo de despacho de eventos de Swing
        SwingUtilities.invokeLater(() -> {
            new EstudianteUI().setVisible(true);
        });
    }
}