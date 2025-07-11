import React, { useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  IconButton,

  Tooltip,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { AuthContext } from "../config/AuthContext";
import UserProfileSidebar from "./UserProfileModal";
import { blueGrey, grey, green } from "@mui/material/colors";

const getPanelTitle = (rol) => {
  switch (rol) {
    case "admin":
      return "Panel de Administración";
    case "vendedor":
      return "Panel Ejecutivos";
    case "almacen":
      return "Panel de Logística";
    case "compras":
      return "Panel de Compras";
    default:
      return "Panel de Gestión";
  }
};

const Header = () => {
  const { user } = useContext(AuthContext) || {};
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <>
      <AppBar
        position="static"
        elevation={3}
        sx={{
          backgroundColor: "#ffffff",
          color: "#000",
          px: 3,
          py: 1,
          borderBottom: `1px solid ${grey[200]}`,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", minHeight: 70 }}>
          {/* Título */}
          <Typography
            variant={isMobile ? "subtitle1" : "h6"}
            fontWeight="bold"
            sx={{ color: blueGrey[800], letterSpacing: 0.5 }}
          >
            {getPanelTitle(user?.rol)}
          </Typography>

          {/* Usuario */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <Stack direction="column" alignItems="flex-end" spacing={0.3}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, fontSize: 15 }}
              >
                {user?.nombre || "Invitado"}
              </Typography>
              {user?.rol && (
                <Typography
                  variant="caption"
                  sx={{ fontSize: 12, color: grey[600], textTransform: "capitalize" }}
                >
                  {user?.rol}
                </Typography>
              )}
            </Stack>

            <Tooltip title="Ver perfil">
              <IconButton onClick={openSidebar} sx={{ p: 0 }}>
                <Avatar
                  alt={user?.nombre || "Avatar"}
                  src={user?.avatar || "https://i.pravatar.cc/150"}
                  sx={{
                    width: 44,
                    height: 44,
                    border: `2px solid ${green[500]}`,
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    transition: "0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                  imgProps={{
                    onError: (e) => {
                      e.target.src = "https://i.pravatar.cc/150";
                    },
                  }}
                />
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Sidebar de perfil */}
      <UserProfileSidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        user={user}
        loading={!user}
      />
    </>
  );
};

export default Header;


