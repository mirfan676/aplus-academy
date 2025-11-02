import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TutorForm from "./components/TutorForm";
import TeacherDirectory from "./pages/TeacherDirectory";
import AboutUs from "./pages/AboutUs";
import "./App.css";
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
} from "@mui/material";
import theme from "./theme";

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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {/* Navbar */}
        <AppBar position="sticky" color="inherit" elevation={1}>
          <Toolbar>
            <Typography
              variant="h6"
              color="primary"
              sx={{ flexGrow: 1, fontWeight: "bold" }}
              component={Link}
              to="/"
              style={{ textDecoration: "none" }}
            >
              A Plus Home Tutors
            </Typography>

            <Button color="primary" component={Link} to="/">
              Home
            </Button>
            <Button color="primary" component={Link} to="/register">
              Register
            </Button>
            <Button color="primary" component={Link} to="/teachers">
              Tutors
            </Button>
            <Button color="primary" component={Link} to="/about">
              About Us
            </Button>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/register"
            element={
              <Container sx={{ py: 6 }}>
                <Card sx={{ maxWidth: 700, mx: "auto", boxShadow: 3 }}>
                  <CardContent>
                    <Typography
                      variant="h5"
                      textAlign="center"
                      color="primary"
                      gutterBottom
                    >
                      Tutor Registration Form
                    </Typography>
                    <TutorForm />
                  </CardContent>
                </Card>
              </Container>
            }
          />
          <Route path="/teachers" element={<TeacherDirectory />} />
          <Route path="/about" element={<AboutUs />} />
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
      </Router>
    </ThemeProvider>
  );
}

export default App;
