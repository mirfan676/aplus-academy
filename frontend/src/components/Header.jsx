import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  useMediaQuery,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";

const Header = () => {
  const isMobile = useMediaQuery("(max-width:900px)");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Register", path: "/register" },
    { label: "Tutors", path: "/teachers" },
    { label: "About Us", path: "/about" },
  ];

  const activeColor = "secondary.main"; // same color for both desktop and mobile

  return (
    <>
      {/* Header */}
      <AppBar position="sticky" color="inherit" elevation={2}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Logo */}
          <Box
            component={Link}
            to="/"
            sx={{ display: "flex", alignItems: "center", textDecoration: "none" }}
          >
            <Box component="img" src="/logo.svg" alt="A Plus Home Tutors" sx={{ height: 48 }} />
          </Box>

          {/* Desktop Menu */}
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 2 }}>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    component={Link}
                    to={item.path}
                    color="primary"
                    sx={{
                      textTransform: "none",
                      fontWeight: 500,
                      position: "relative",
                      "&:hover": { textDecoration: "none" },
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        bottom: 0,
                        width: isActive ? "100%" : "0%",
                        height: "2px",
                        bgcolor: activeColor,
                        transition: "width 0.3s ease",
                      },
                      "&:hover::after": { width: "100%" },
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton color="primary" edge="end" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 260, bgcolor: "background.paper", p: 2 } }}
      >
        <List>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem
                key={item.path}
                component={Link}
                to={item.path}
                onClick={() => setDrawerOpen(false)}
                sx={{
                  mb: 1,
                  borderRadius: 2,
                  bgcolor: isActive ? activeColor : "action.hover",
                  color: isActive ? "white" : "text.primary",
                  fontWeight: isActive ? 600 : 500,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: isActive ? "secondary.dark" : "action.selected",
                  },
                }}
              >
                <ListItemText primary={item.label} sx={{ textAlign: "center" }} />
              </ListItem>
            );
          })}
        </List>

        <Divider sx={{ my: 2 }} />

        {/* Contact Now Section */}
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Contact Now
          </Typography>

          <Button
            startIcon={<WhatsAppIcon />}
            href="https://wa.me/923066762289"
            target="_blank"
            variant="outlined"
            fullWidth
            sx={{ mb: 1, textTransform: "none" }}
          >
            +92-3066762289
          </Button>

          <Button
            startIcon={<EmailIcon />}
            href="mailto:aplushometutorspk@gmail.com"
            variant="outlined"
            fullWidth
            sx={{ textTransform: "none" }}
          >
            aplushometutorspk@gmail.com
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
