package ec.edu.espe.vista;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.ActionListener;

public class EstudianteUI extends JFrame {
    // Componentes públicos para acceso del Controlador
    public JTextField txtId, txtNombres, txtEdad;
    public JButton btnGuardar, btnEditar, btnEliminar, btnLimpiar, btnBuscar;
    public JTable tblEstudiantes;
    public DefaultTableModel tableModel;

    public EstudianteUI() {
        initComponents();
    }

    private void initComponents() {
        setTitle("Taller Singleton + NVC");
        setSize(600, 500);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new BorderLayout());

        JPanel pForm = new JPanel(new GridLayout(5, 2));
        pForm.add(new JLabel("Cédula:")); txtId = new JTextField(); pForm.add(txtId);
        pForm.add(new JLabel("Nombres:")); txtNombres = new JTextField(); pForm.add(txtNombres);
        pForm.add(new JLabel("Edad:")); txtEdad = new JTextField(); pForm.add(txtEdad);

        btnGuardar = new JButton("Guardar");
        btnEditar = new JButton("Editar");
        btnEliminar = new JButton("Eliminar");
        btnBuscar = new JButton("Buscar");
        btnLimpiar = new JButton("Limpiar");

        JPanel pBotones = new JPanel();
        pBotones.add(btnBuscar); pBotones.add(btnGuardar);
        pBotones.add(btnEditar); pBotones.add(btnEliminar); pBotones.add(btnLimpiar);

        add(pForm, BorderLayout.NORTH);
        add(pBotones, BorderLayout.SOUTH);

        tableModel = new DefaultTableModel(new Object[]{"ID", "Nombres", "Edad"}, 0);
        tblEstudiantes = new JTable(tableModel);
        add(new JScrollPane(tblEstudiantes), BorderLayout.CENTER);
    }
}