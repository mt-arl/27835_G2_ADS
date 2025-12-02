package ec.edu.espe.controller;

import ec.edu.espe.datos.model.Estudiante;
import ec.edu.espe.negocio.EstudianteService;
import ec.edu.espe.vista.EstudianteUI;
import javax.swing.*;
import java.awt.event.*;

public class EstudianteController implements ActionListener {
    private EstudianteUI view;
    private EstudianteService service;

    public EstudianteController(EstudianteUI view, EstudianteService service) {
        this.view = view;
        this.service = service;
        asignarEventos();
        refrescarTabla();
        this.view.setVisible(true);
    }

    private void asignarEventos() {
        view.btnGuardar.addActionListener(this);
        view.btnEditar.addActionListener(this);
        view.btnEliminar.addActionListener(this);
        view.btnBuscar.addActionListener(this);
        view.btnLimpiar.addActionListener(this);

        view.tblEstudiantes.addMouseListener(new MouseAdapter() {
            public void mouseClicked(MouseEvent e) {
                llenarCampos();
            }
        });
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        try {
            if (e.getSource() == view.btnGuardar) {
                service.guardar(view.txtId.getText(), view.txtNombres.getText(), view.txtEdad.getText());
                limpiar();
            } else if (e.getSource() == view.btnEditar) {
                service.editar(view.txtId.getText(), view.txtNombres.getText(), view.txtEdad.getText());
                limpiar();
            } else if (e.getSource() == view.btnEliminar) {
                service.eliminar(view.txtId.getText());
                limpiar();
            } else if (e.getSource() == view.btnBuscar) {
                Estudiante est = service.buscar(view.txtId.getText());
                if (est != null) {
                    view.txtNombres.setText(est.getNombres());
                    view.txtEdad.setText(String.valueOf(est.getEdad()));
                } else {
                    JOptionPane.showMessageDialog(view, "No encontrado");
                }
                return;
            } else if (e.getSource() == view.btnLimpiar) {
                limpiar();
                // ELIMINAMOS EL 'return;' PARA QUE BAJE A REFRESCAR TABLA
                // O llamamos explícitamente:
                refrescarTabla();
                return;
            }

            refrescarTabla(); // Se ejecuta para Guardar, Editar, Eliminar
            JOptionPane.showMessageDialog(view, "Acción realizada con éxito");

        } catch (Exception ex) {
            JOptionPane.showMessageDialog(view, "Error: " + ex.getMessage());
        }
    }

    private void refrescarTabla() {
        view.tableModel.setRowCount(0);
        for (Estudiante est : service.listar()) {
            view.tableModel.addRow(new Object[]{est.getId(), est.getNombres(), est.getEdad()});
        }
    }

    private void llenarCampos() {
        int row = view.tblEstudiantes.getSelectedRow();
        if (row >= 0) {
            view.txtId.setText(view.tableModel.getValueAt(row, 0).toString());
            view.txtNombres.setText(view.tableModel.getValueAt(row, 1).toString());
            view.txtEdad.setText(view.tableModel.getValueAt(row, 2).toString());
            view.txtId.setEditable(false);
        }
    }

    private void limpiar() {
        view.txtId.setText(""); view.txtNombres.setText(""); view.txtEdad.setText("");
        view.txtId.setEditable(true);
        view.tblEstudiantes.clearSelection();
    }
}