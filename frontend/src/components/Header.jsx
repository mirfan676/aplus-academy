import React, { useState, useEffect } from "react";
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
  Divider,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";

const Header = () => {
  const isMobile = useMediaQuery("(max-width:900px)");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Register", path: "/register" },
    { label: "Tutors", path: "/teachers" },
    { label: "About Us", path: "/about" },
  ];

  // Sticky shadow animation on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Gradient border + glass effect for active links
  const activeStyles = {
    border: "2px solid",
    borderImage: "linear-gradient(45deg, #1976d2, #00e676) 1", // blue → green gradient
    backdropFilter: "blur(12px)",
    background: "rgba(255, 255, 255, 0.12)",
    borderRadius: "10px",
    transform: "scale(1.05)",
    transition: "all 0.25s ease",
  };

  return (
    <>
      {/* Header */}
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{
          backdropFilter: "blur(14px)",
          background: "rgba(255,255,255,0.55)", // glass-morphism
          transition: "all 0.3s ease",
          boxShadow: scrolled
            ? "0 6px 20px rgba(0,0,0,0.12)"
            : "0 0 0 rgba(0,0,0,0)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Logo */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            <Box
              component="img"
              src="/logo.svg"
              alt="A Plus Home Tutors"
              sx={{
                height: 48,
                transition: "transform 0.3s ease",
                "&:hover": { transform: "scale(1.08)" },
              }}
            />
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
                      fontWeight: 600,
                      fontSize: "16px",
                      px: 1.8,
                      py: 0.7,
                      borderRadius: "10px",
                      position: "relative",
                      transition: "all 0.3s ease",
                      ...(isActive && activeStyles),

                      "&:hover": {
                        transform: "translateY(-2px) scale(1.06)",
                        background: "rgba(255,255,255,0.2)",
                        backdropFilter: "blur(10px)",
                      },

                      "&::after": {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        bottom: "-3px",
                        width: isActive ? "100%" : "0%",
                        height: "2px",
                        background:
                          "linear-gradient(90deg, #1976d2, #00e676)", // gradient underline
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
            <IconButton
              color="primary"
              edge="end"
              onClick={() => setDrawerOpen(true)}
              sx={{
                transition: "0.3s",
                "&:hover": { transform: "scale(1.15)" },
              }}
            >
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
        PaperProps={{
          sx: {
            width: 260,
            bgcolor: "rgba(255,255,255,0.75)",
            backdropFilter: "blur(15px)",
            p: 2,
          },
        }}
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
                  py: 1.3,
                  borderRadius: 1,
                  textAlign: "center",
                  fontWeight: 600,
                  background: isActive
                    ? "rgba(25,118,210,0.9)"
                    : "rgba(255,255,255,0.25)",
                  color: isActive ? "#2f3ad3" : "black",
                  transition: "all 0.25s ease",
                  ...(isActive && activeStyles),

                  "&:hover": {
                    background: "rgba(255,255,255,0.35)",
                    transform: "scale(1.03)",
                  },
                }}
              >
                <ListItemText primary={item.label} />
              </ListItem>
            );
          })}
        </List>

        <Divider sx={{ my: 2 }} />

        {/* Contact Section */}
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
            sx={{
              mb: 1,
              textTransform: "none",
              backdropFilter: "blur(10px)",
            }}
          >
            +92-3066762289
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
