import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import TutorForm from "./components/TutorForm";
import TeacherDirectory from "./components/TeacherDirectory";
import AboutUs from "./pages/AboutUs";
import TeacherProfile from "./components/TeacherProfile";
import HireForm from "./components/HireForm";
import CookieConsent from "./components/CookieConsent";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";


import { ThemeProvider, CssBaseline, Container, Card, CardContent } from "@mui/material";
import theme from "./theme";

import Header from "./components/Header";
import Footer from "./components/Footer";

/* ✅ Google Analytics Page View Tracking Hook */
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
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

/* ✅ PageTracker component */
function PageTracker() {
  usePageTracking();
  return null;
}

/* ✅ Main App */
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CookieConsent />
      <Router>
        <PageTracker />

        {/* Header */}
        <Header />

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
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/teacher/:id" element={<TeacherProfile />} />
          <Route path="/hire/:id" element={<HireForm />} />
          <Route path="/jobs" element={<Jobs />} />
        </Routes>

        {/* Footer */}
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;
