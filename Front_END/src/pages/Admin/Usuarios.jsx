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
  MenuItem,
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
import UploadFileIcon from "@mui/icons-material/UploadFile";
import axios from "axios";
import { green, grey } from "@mui/material/colors";

const roles = [
  { value: "admin", label: "Administrador" },
  { value: "comprador", label: "Compras" },
  { value: "vendedor", label: "Vendedor" },
  { value: "almacen", label: "Almacén" },
  { value: "gerente", label: "Gerente" },
];

const estados = [
  { value: "activo", label: "Activo" },
  { value: "inactivo", label: "Inactivo" },
];

const formInicial = {
  id_usuario: null,
  documento: "",
  nombre: "",
  usuario: "",
  password: "",
  correo: "",
  rol: "",
  estado: "activo",
  imagen: null,
};

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(formInicial);
  const [editMode, setEditMode] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = async () => {
    try {
      const res = await axios.get("http://localhost:3000/usuarios");
      setUsuarios(res.data);
    } catch (err) {
      console.error("Error al obtener usuarios", err);
      setError("Error al obtener la lista de usuarios.");
    }
  };

  const handleOpenCreate = () => {
    setForm(formInicial);
    setEditMode(false);
    setOpen(true);
    resetMensajes();
  };

  const handleOpenEdit = (usuario) => {
    setForm({
      ...usuario,
      password: "",
      imagen: null,
    });
    setEditMode(true);
    setOpen(true);
    resetMensajes();
  };

  const resetMensajes = () => {
    setError("");
    setMensaje("");
  };

  const handleClose = () => {
    setOpen(false);
    resetMensajes();
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imagen") {
      setForm((prev) => ({ ...prev, imagen: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    const { documento, nombre, usuario, password, correo, rol, estado, imagen } = form;

    if (!documento || !nombre || !usuario || (!editMode && !password) || !correo || !rol || !estado) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    const formData = new FormData();
    formData.append("documento", documento);
    formData.append("nombre", nombre);
    formData.append("usuario", usuario);
    if (!editMode) formData.append("password", password);
    formData.append("correo", correo);
    formData.append("rol", rol);
    formData.append("estado", estado);
    if (imagen) formData.append("imagen", imagen);

    try {
      if (editMode) {
        await axios.put(`http://localhost:3000/usuarios/${form.id_usuario}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMensaje("Usuario actualizado correctamente.");
      } else {
        await axios.post("http://localhost:3000/usuarios", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMensaje("Usuario creado correctamente.");
      }

      obtenerUsuarios();
      setOpen(false);
      setSnackbarOpen(true);
    } catch (err) {
      console.error(err);
      setError("Error al guardar el usuario.");
    }
  };

  const usuariosFiltrados = usuarios.filter((u) =>
    u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.usuario.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.documento.includes(busqueda)
  );

  return (
    <Container sx={{ mt: 4 }}>
      <Grid container justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold" color={green[800]}>
          Gestión de Usuarios
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={handleOpenCreate}
          sx={{ backgroundColor: green[700], borderRadius: 2 }}
        >
          Nuevo Usuario
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
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Nombre</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Usuario</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Correo</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Rol</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Estado</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuariosFiltrados.map((u, i) => (
              <TableRow key={u.id_usuario} sx={{ backgroundColor: i % 2 === 0 ? grey[50] : "white" }}>
                <TableCell align="start">{u.nombre}</TableCell>
                <TableCell align="center">{u.usuario}</TableCell>
                <TableCell align="center">{u.correo}</TableCell>
                <TableCell align="center">{u.rol}</TableCell>
                <TableCell align="center" sx={{ color: u.estado === "activo" ? green[600] : "error.main", fontWeight: 500 }}>
                  {u.estado}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Editar">
                    <IconButton color="success" onClick={() => handleOpenEdit(u)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>{editMode ? "Editar Usuario" : "Crear Usuario"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Documento" name="documento" value={form.documento} onChange={handleChange} fullWidth size="small" />
            <TextField label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} fullWidth size="small" />
            <TextField label="Usuario" name="usuario" value={form.usuario} onChange={handleChange} fullWidth size="small" />
            {!editMode && (
              <TextField label="Contraseña" name="password" type="password" value={form.password} onChange={handleChange} fullWidth size="small" />
            )}
            <TextField label="Correo" name="correo" value={form.correo} onChange={handleChange} fullWidth size="small" />
            <TextField select label="Rol" name="rol" value={form.rol} onChange={handleChange} fullWidth size="small">
              {roles.map((r) => (
                <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>
              ))}
            </TextField>
            <TextField select label="Estado" name="estado" value={form.estado} onChange={handleChange} fullWidth size="small">
              {estados.map((e) => (
                <MenuItem key={e.value} value={e.value}>{e.label}</MenuItem>
              ))}
            </TextField>
            <Button variant="outlined" component="label" startIcon={<UploadFileIcon />}>
              Subir Imagen
              <input type="file" name="imagen" hidden onChange={handleChange} accept="image/*" />
            </Button>
            {error && <Alert severity="error">{error}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ backgroundColor: green[700] }}>
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
