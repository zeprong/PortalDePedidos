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
  Box,
  Drawer,
  Divider,
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
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

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
          px: { xs: 1, sm: 2, md: 3 },
          py: { xs: 0.5, sm: 1 },
          borderBottom: `1px solid ${grey[200]}`,
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            minHeight: { xs: 56, sm: 64, md: 70 },
            px: { xs: 0, sm: 1, md: 2 },
          }}
        >
          {/* Título */}
          <Typography
            variant={isMobile ? "subtitle2" : isTablet ? "subtitle1" : "h6"}
            fontWeight="bold"
            sx={{
              color: blueGrey[800],
              letterSpacing: 0.5,
              fontSize: { xs: 15, sm: 18, md: 22 },
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: { xs: "60vw", sm: "70vw", md: "none" },
            }}
          >
            {getPanelTitle(user?.rol)}
          </Typography>

          {/* Usuario */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={isMobile ? 1 : 2}
            sx={{
              minWidth: 0,
              flexShrink: 0,
            }}
          >
            {/* Oculta el nombre y rol en pantallas muy pequeñas */}
            {!isMobile && (
              <Stack
                direction="column"
                alignItems="flex-end"
                spacing={0.3}
                sx={{
                  minWidth: 0,
                  maxWidth: { xs: 80, sm: 120, md: 180 },
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: 13, sm: 15 },
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {user?.nombre || "Invitado"}
                </Typography>
                {user?.rol && (
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: 12,
                      color: grey[600],
                      textTransform: "capitalize",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {user?.rol}
                  </Typography>
                )}
              </Stack>
            )}

            <Tooltip title="Ver perfil">
              <IconButton
                onClick={openSidebar}
                sx={{
                  p: 0,
                  ml: isMobile ? 0 : 1,
                  width: { xs: 38, sm: 44 },
                  height: { xs: 38, sm: 44 },
                }}
              >
                <Avatar
                  alt={user?.nombre || "Avatar"}
                  src={user?.avatar || "https://i.pravatar.cc/150"}
                  sx={{
                    width: { xs: 38, sm: 44 },
                    height: { xs: 38, sm: 44 },
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

      {/* Sidebar de perfil adaptado a dispositivos móviles */}
      <Drawer
        anchor={isMobile ? "bottom" : "right"}
        open={isSidebarOpen}
        onClose={closeSidebar}
        PaperProps={{
          sx: {
            width: { xs: "100vw", sm: 350, md: 400 },
            maxWidth: "100vw",
            borderTopLeftRadius: isMobile ? 16 : 0,
            borderTopRightRadius: isMobile ? 16 : 0,
            borderRadius: isMobile ? "16px 16px 0 0" : "0 0 0 0",
            minHeight: isMobile ? "40vh" : "auto",
          },
        }}
        transitionDuration={250}
      >
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            pt: { xs: 2, sm: 3 },
            minHeight: isMobile ? "40vh" : "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <UserProfileSidebar
            isOpen={isSidebarOpen}
            onClose={closeSidebar}
            user={user}
            loading={!user}
            mobile={isMobile}
          />
        </Box>
        <Divider />
        <Box sx={{ textAlign: "center", py: 1 }}>
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} Mi Empresa
          </Typography>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
