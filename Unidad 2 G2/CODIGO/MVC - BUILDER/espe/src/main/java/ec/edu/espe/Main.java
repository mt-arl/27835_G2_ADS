package ec.edu.espe;

import ec.edu.espe.controller.EstudianteController;
import ec.edu.espe.negocio.EstudianteService;
import ec.edu.espe.vista.EstudianteUI;

public class Main {
    public static void main(String[] args) {

        EstudianteUI view1 = new EstudianteUI();
        EstudianteService service1 = new EstudianteService();
        EstudianteController controller1 = new EstudianteController(view1, service1);
        view1.setVisible(true);
        view1.setTitle("Ventana A (Usuario 1)");


       /*EstudianteUI view2 = new EstudianteUI();
        EstudianteService service2 = new EstudianteService();
        EstudianteController controller2 = new EstudianteController(view2, service2);
        view2.setVisible(true);
        view2.setTitle("Ventana B (Usuario 2) - Verificación Singleton");

        view2.setLocation(view1.getX() + 420, view1.getY());*/
    }
}