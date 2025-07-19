import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Tooltip,
  Typography,
  Alert,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { green, grey } from "@mui/material/colors";

const API_URL = "http://localhost:3000/clientes";

const formInicial = {
  id: null,
  nombreApellidos: "",
  cliente: "",
  razonSocial: "",
  direccion: "",
  telefono: "",
  ciudad: "",
  correoElectronico: "",
  tipoNegocio: "",
};

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(formInicial);
  const [editMode, setEditMode] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    obtenerClientes();
  }, []);

  const obtenerClientes = async () => {
    try {
      const res = await axios.get(API_URL);
      setClientes(res.data);
    } catch (err) {
      console.error("Error al obtener clientes", err);
      setError("Error al obtener la lista de clientes.");
    }
  };

  const resetMensajes = () => {
    setError("");
    setMensaje("");
  };

  const handleOpenCreate = () => {
    setForm(formInicial);
    setEditMode(false);
    resetMensajes();
    setOpen(true);
  };

  const handleOpenEdit = (cliente) => {
    setForm({ ...cliente });
    setEditMode(true);
    resetMensajes();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetMensajes();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validarCampos = () => {
    for (let key in formInicial) {
      if (key !== "id" && !form[key]) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validarCampos()) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      if (editMode) {
        await axios.put(`${API_URL}/${form.id}`, form);
        setMensaje("Cliente actualizado correctamente.");
        obtenerClientes();
      } else {
        const res = await axios.post(API_URL, form);
        setMensaje("Cliente creado correctamente.");
        setClientes((prev) => [...prev, res.data]);
      }
      setOpen(false);
      setSnackbarOpen(true);
    } catch (err) {
      console.error(err);
      setError("Error al guardar el cliente.");
    }
  };

  const clientesFiltrados = clientes.filter((c) =>
    ["nombreApellidos", "cliente", "razonSocial"].some((campo) =>
      c[campo]?.toLowerCase().includes(busqueda.toLowerCase())
    )
  );

  return (
    <Container sx={{ mt: 4 }}>
      <Grid container justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold" color={green[900]}>
          Gestión de Clientes
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={handleOpenCreate}
          sx={{ backgroundColor: green[900], borderRadius: 2 }}
        >
          Nuevo Cliente
        </Button>
      </Grid>

      <TextField
        fullWidth
        variant="outlined"
        size="small"
        placeholder="Buscar"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1 }} />,
        }}
        sx={{ mb: 3, border: "1px solid lightgreen", borderRadius: 2 }}
      />

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: green[50] }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Nombre y Apellidos</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Cliente</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Razón Social</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Dirección</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Teléfono</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Ciudad</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Correo Electrónico</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Tipo de Negocio</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientesFiltrados.map((c, i) => (
              <TableRow
                key={c.id}
                sx={{ backgroundColor: i % 2 === 0 ? grey[50] : "white" }}
              >
                <TableCell>{c.nombreApellidos}</TableCell>
                <TableCell>{c.cliente}</TableCell>
                <TableCell>{c.razonSocial}</TableCell>
                <TableCell>{c.direccion}</TableCell>
                <TableCell>{c.telefono}</TableCell>
                <TableCell>{c.ciudad}</TableCell>
                <TableCell>{c.correoElectronico}</TableCell>
                <TableCell>{c.tipoNegocio}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Editar">
                    <IconButton color="success" onClick={() => handleOpenEdit(c)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ color: "green" }}>
          {editMode ? "Editar Cliente" : "Crear Cliente"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {[
              { label: "Nombre y Apellidos", name: "nombreApellidos" },
              { label: "Cliente", name: "cliente" },
              { label: "Razón Social", name: "razonSocial" },
              { label: "Dirección", name: "direccion" },
              { label: "Teléfono", name: "telefono" },
              { label: "Ciudad", name: "ciudad" },
              { label: "Correo Electrónico", name: "correoElectronico" },
              { label: "Tipo de Negocio", name: "tipoNegocio" },
            ].map(({ label, name }) => (
              <TextField
                key={name}
                label={label}
                name={name}
                value={form[name]}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            ))}
            {error && <Alert severity="error">{error}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ color: "green" }}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ backgroundColor: green[900] }}>
            {editMode ? "Actualizar" : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)} sx={{ width: "100%" }}>
          {mensaje}
        </Alert>
      </Snackbar>
    </Container>
  );
}

