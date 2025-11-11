import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import TutorForm from "./components/TutorForm";
import TeacherDirectory from "./components/TeacherDirectory";
import AboutUs from "./pages/AboutUs";
import TeacherProfile from "./components/TeacherProfile";
import HireForm from "./components/HireForm";
import "./App.css";
import CookieConsent from "./components/CookieConsent";
import {
  ThemeProvider,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import theme from "./theme";

/* ✅ Google Analytics Page View Tracking Hook */
function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      window.gtag("config", "G-P104YESY15", {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);
}

/* ✅ Home Component */
function Home() {
  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          textAlign: "center",
          py: 8,
        }}
      >
        <Container>
          <Typography variant="h4" fontWeight="bold">
            Welcome to A Plus Home Tutors
          </Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Pakistan’s trusted platform for home and online tuition — connecting
            students with expert tutors for O/A Levels, Matric, and Junior
            classes.
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              sx={{
                bgcolor: "white",
                color: "primary.main",
                fontWeight: "bold",
                mx: 1,
              }}
            >
              Register as Tutor
            </Button>
            <Button
              component={Link}
              to="/teachers"
              variant="outlined"
              sx={{ color: "white", borderColor: "white", mx: 1 }}
            >
              View Tutors
            </Button>
          </Box>
        </Container>
      </Box>

      {/* About Section */}
      <Container sx={{ py: 8 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="https://img.freepik.com/free-vector/online-education-concept-illustration_114360-5322.jpg"
              alt="Tutoring"
              sx={{
                width: "100%",
                borderRadius: 2,
                boxShadow: 3,
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h5" color="primary" gutterBottom>
              About A Plus Home Tutors
            </Typography>
            <Typography color="text.secondary" paragraph>
              At A Plus Home Tutors, we make learning{" "}
              <strong>accessible, personalized, and effective</strong>. Our
              qualified tutors help students excel in their studies right from
              the comfort of their home or online.
            </Typography>

            <Box component="ul" sx={{ color: "text.secondary", pl: 2 }}>
              <li>✅ Experienced and verified tutors</li>
              <li>✅ Online and home tuition available</li>
              <li>✅ Coverage across all major cities in Pakistan</li>
            </Box>

            <Button
              component={Link}
              to="/teachers"
              variant="contained"
              sx={{ mt: 2 }}
            >
              Meet Our Tutors
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

/* ✅ Main App */
function App() {
  const isMobile = useMediaQuery("(max-width:900px)");
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Register", path: "/register" },
    { label: "Tutors", path: "/teachers" },
    { label: "About Us", path: "/about" },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <PageTracker />

        {/* Navbar */}
        <AppBar position="sticky" color="inherit" elevation={2}>
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
                sx={{ height: 48 }}
              />
            </Box>

            {/* Desktop Menu */}
            {!isMobile && (
              <Box sx={{ display: "flex", gap: 2 }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.path}
                    component={Link}
                    to={item.path}
                    color="primary"
                    sx={{
                      textTransform: "none",
                      fontWeight: "500",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                color="primary"
                edge="end"
                onClick={() => setDrawerOpen(true)}
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
        >
          <Box sx={{ width: 240, mt: 2 }}>
            <List>
              {menuItems.map((item) => (
                <ListItem
                  button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  onClick={() => setDrawerOpen(false)}
                >
                  <ListItemText
                    primary={item.label}
                    sx={{ textAlign: "right" }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/register"
            element={
              <Container sx={{ py: 6 }}>
                <Card sx={{ maxWidth: 700, mx: "auto", boxShadow: 3 }}>
                  <CardContent>
                    <TutorForm />
                  </CardContent>
                </Card>
              </Container>
            }
          />
          <Route path="/teachers" element={<TeacherDirectory />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/teacher/:id" element={<TeacherProfile />} />
          <Route path="/hire/:id" element={<HireForm />} />
        </Routes>

        {/* Footer */}
        <Box
          sx={{
            bgcolor: "primary.main",
            color: "white",
            textAlign: "center",
            py: 3,
            mt: "auto",
          }}
        >
          <Typography variant="body2">
            © 2025 A Plus Home Tutors — All Rights Reserved
          </Typography>
          <Typography variant="caption">
            Empowering education, one student at a time.
          </Typography>
        </Box>
        <CookieConsent />
      </Router>
    </ThemeProvider>
  );
}

/* ✅ PageTracker component (wrapper for GA4 hook) */
function PageTracker() {
  usePageTracking();
  return null;
}

export default App;
