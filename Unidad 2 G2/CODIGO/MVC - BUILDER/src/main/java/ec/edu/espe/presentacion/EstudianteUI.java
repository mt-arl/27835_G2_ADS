package ec.edu.espe.presentacion;

import ec.edu.espe.datos.model.Estudiante;
import ec.edu.espe.logica_negocio.EstudianteService;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.util.List;

public class EstudianteUI extends JFrame {
    private JTextField txtId, txtNombres, txtEdad;
    private JTable tblEstudiantes;
    private DefaultTableModel tableModel;
    private EstudianteService service;

    private JButton btnGuardar, btnEditar, btnEliminar, btnLimpiar, btnBuscar;

    public EstudianteUI() {
        service = EstudianteService.getInstance(); // Usar Singleton
        initComponents();
        agregarValidaciones(); // <--- AQUÍ AGREGAMOS LAS VALIDACIONES DE TECLADO
        actualizarTabla();
    }

    private void initComponents() {
        setTitle("Gestión Estudiantes (Validaciones Completas)");
        setSize(650, 550);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new BorderLayout());

        // --- PANEL DE FORMULARIO ---
        JPanel panelForm = new JPanel(new GridBagLayout());
        panelForm.setBorder(BorderFactory.createTitledBorder("Datos del Estudiante"));
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(5, 5, 5, 5);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        // Fila 0: Cédula
        gbc.gridx = 0; gbc.gridy = 0;
        panelForm.add(new JLabel("Cédula (Solo números):"), gbc);

        gbc.gridx = 1; gbc.gridy = 0; gbc.weightx = 1.0;
        txtId = new JTextField(10);
        panelForm.add(txtId, gbc);

        gbc.gridx = 2; gbc.gridy = 0; gbc.weightx = 0;
        btnBuscar = new JButton("Buscar");
        panelForm.add(btnBuscar, gbc);

        // Fila 1: Nombres
        gbc.gridx = 0; gbc.gridy = 1;
        panelForm.add(new JLabel("Nombres (Solo letras):"), gbc);

        gbc.gridx = 1; gbc.gridy = 1; gbc.gridwidth = 2;
        txtNombres = new JTextField();
        panelForm.add(txtNombres, gbc);

        // Fila 2: Edad
        gbc.gridx = 0; gbc.gridy = 2; gbc.gridwidth = 1;
        panelForm.add(new JLabel("Edad (Numérica):"), gbc);

        gbc.gridx = 1; gbc.gridy = 2; gbc.gridwidth = 2;
        txtEdad = new JTextField();
        panelForm.add(txtEdad, gbc);

        // Fila 3: Botones CRUD
        JPanel panelBotones = new JPanel(new FlowLayout());
        btnGuardar = new JButton("Guardar");
        btnEditar = new JButton("Editar");
        btnEliminar = new JButton("Eliminar");
        btnLimpiar = new JButton("Limpiar");

        panelBotones.add(btnGuardar);
        panelBotones.add(btnEditar);
        panelBotones.add(btnEliminar);
        panelBotones.add(btnLimpiar);

        gbc.gridx = 0; gbc.gridy = 3; gbc.gridwidth = 3;
        panelForm.add(panelBotones, gbc);

        add(panelForm, BorderLayout.NORTH);

        // --- TABLA ---
        String[] columnNames = {"Cédula", "Nombres", "Edad"};
        tableModel = new DefaultTableModel(columnNames, 0) {
            public boolean isCellEditable(int row, int column) { return false; }
        };
        tblEstudiantes = new JTable(tableModel);
        add(new JScrollPane(tblEstudiantes), BorderLayout.CENTER);

        // --- EVENTOS BOTONES ---
        tblEstudiantes.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                cargarDatosDeTabla();
            }
        });

        btnGuardar.addActionListener(e -> guardarEstudiante());
        btnEditar.addActionListener(e -> editarEstudiante());
        btnEliminar.addActionListener(e -> eliminarEstudiante());
        btnLimpiar.addActionListener(e -> limpiarCampos());
        btnBuscar.addActionListener(e -> buscarEstudiante());
    }

    // ---------------------------------------------------------
    // NUEVO MÉTODO: VALIDACIONES DE ENTRADA (KEY LISTENER)
    // ---------------------------------------------------------
    private void agregarValidaciones() {
        // 1. VALIDAR CÉDULA: Solo números y máximo 10 dígitos
        txtId.addKeyListener(new KeyAdapter() {
            @Override
            public void keyTyped(KeyEvent e) {
                char c = e.getKeyChar();
                // Si no es digito O si ya llegamos a 10 caracteres -> Bloquear
                if (!Character.isDigit(c) || txtId.getText().length() >= 10) {
                    e.consume(); // Ignora el evento (no escribe)
                }
            }
        });

        // 2. VALIDAR EDAD: Solo números y máximo 3 dígitos
        txtEdad.addKeyListener(new KeyAdapter() {
            @Override
            public void keyTyped(KeyEvent e) {
                char c = e.getKeyChar();
                if (!Character.isDigit(c) || txtEdad.getText().length() >= 3) {
                    e.consume();
                }
            }
        });

        // 3. VALIDAR NOMBRES: Solo letras y espacios
        txtNombres.addKeyListener(new KeyAdapter() {
            @Override
            public void keyTyped(KeyEvent e) {
                char c = e.getKeyChar();
                // Permitimos letras y el espacio en blanco (KeyEvent.VK_SPACE)
                if (!Character.isLetter(c) && c != KeyEvent.VK_SPACE) {
                    e.consume();
                }
            }
        });
    }

    // --- MÉTODOS LÓGICOS EXISTENTES ---

    private void buscarEstudiante() {
        try {
            String cedula = txtId.getText();
            Estudiante est = service.buscarPorCedula(cedula);
            if (est != null) {
                txtNombres.setText(est.getNombres());
                txtEdad.setText(String.valueOf(est.getEdad()));
                txtId.setEditable(false);
                JOptionPane.showMessageDialog(this, "Estudiante encontrado.");
            } else {
                JOptionPane.showMessageDialog(this, "No existe estudiante con esa cédula.");
                limpiarCampos();
                txtId.setText(cedula);
            }
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, "Error: " + ex.getMessage());
        }
    }

    private void guardarEstudiante() {
        try {
            service.guardarEstudiante(txtId.getText(), txtNombres.getText(), txtEdad.getText());
            actualizarTabla();
            limpiarCampos();
            JOptionPane.showMessageDialog(this, "Guardado en TXT correctamente.");
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, "Error: " + ex.getMessage(), "Error", JOptionPane.WARNING_MESSAGE);
        }
    }

    private void editarEstudiante() {
        try {
            service.editarEstudiante(txtId.getText(), txtNombres.getText(), txtEdad.getText());
            actualizarTabla();
            limpiarCampos();
            JOptionPane.showMessageDialog(this, "Editado y actualizado en TXT.");
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, "Error: " + ex.getMessage());
        }
    }

    private void eliminarEstudiante() {
        try {
            String id = txtId.getText();
            if (JOptionPane.showConfirmDialog(this, "¿Eliminar cédula " + id + "?", "Confirmar", JOptionPane.YES_NO_OPTION) == JOptionPane.YES_OPTION) {
                service.eliminarEstudiante(id);
                actualizarTabla();
                limpiarCampos();
            }
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, "Error: " + ex.getMessage());
        }
    }

    private void actualizarTabla() {
        tableModel.setRowCount(0);
        List<Estudiante> lista = service.obtenerEstudiantes();
        for (Estudiante est : lista) {
            tableModel.addRow(new Object[]{est.getId(), est.getNombres(), est.getEdad()});
        }
    }

    private void cargarDatosDeTabla() {
        int fila = tblEstudiantes.getSelectedRow();
        if (fila >= 0) {
            txtId.setText(tableModel.getValueAt(fila, 0).toString());
            txtNombres.setText(tableModel.getValueAt(fila, 1).toString());
            txtEdad.setText(tableModel.getValueAt(fila, 2).toString());
            txtId.setEditable(false);
        }
    }

    private void limpiarCampos() {
        txtId.setText("");
        txtNombres.setText("");
        txtEdad.setText("");
        txtId.setEditable(true);
        tblEstudiantes.clearSelection();
    }
}
