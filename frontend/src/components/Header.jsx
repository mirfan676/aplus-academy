import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import TranslateIcon from "@mui/icons-material/Translate";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const Header = () => {
  const isMobile = useMediaQuery("(max-width:900px)");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [careerAnchor, setCareerAnchor] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [language, setLanguage] = useState(() =>
    typeof document !== "undefined" && document.cookie.includes("googtrans=/en/ur")
      ? "ur"
      : "en"
  );
  const location = useLocation();

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Register", path: "/register" },
    { label: "Tutors", path: "/teachers" },
    { label: "Jobs", path: "/jobs" },
    { label: "Blog", path: "/blog" },
    { label: "Career Roadmap", path: "/career-roadmap", dropdown: true },
    { label: "Account", path: "/account" },
    { label: "About Us", path: "/about" },
  ];

  const careerMenuItems = [
    { label: "All Career Roadmaps", path: "/career-roadmap" },
    { label: "Study Abroad & PTE", path: "/career-roadmap#study-abroad-pte" },
    { label: "After Graduation", path: "/career-roadmap#after-graduation" },
    { label: "Healthcare Abroad", path: "/career-roadmap#healthcare-abroad" },
    { label: "IT & Engineering Abroad", path: "/career-roadmap#it-engineering-abroad" },
    { label: "After Matric", path: "/career-roadmap#after-matric" },
    { label: "PTE Practice", path: "/pte" },
  ];

  // Sticky shadow animation on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const applyLanguageShell = (targetLanguage) => {
      const isUrdu = targetLanguage === "ur";
      document.documentElement.lang = isUrdu ? "ur" : "en";
      document.documentElement.dir = isUrdu ? "rtl" : "ltr";
      document.body.classList.toggle("urdu-site", isUrdu);
    };

    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return;
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,ur",
          autoDisplay: false,
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );
    };

    applyLanguageShell(language);

    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    } else if (window.googleTranslateElementInit) {
      window.googleTranslateElementInit();
    }
  }, [language]);

  const setTranslateCookie = (targetLanguage) => {
    const value = targetLanguage === "ur" ? "/en/ur" : "/en/en";
    const maxAge = targetLanguage === "ur" ? 60 * 60 * 24 * 30 : -1;
    document.cookie = `googtrans=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;

    if (window.location.hostname.endsWith("aplusacademy.pk")) {
      document.cookie = `googtrans=${value}; path=/; domain=.aplusacademy.pk; max-age=${maxAge}; SameSite=Lax`;
    }
  };

  const applyGoogleTranslation = (targetLanguage) => {
    setTranslateCookie(targetLanguage);
    setLanguage(targetLanguage);

    window.setTimeout(() => {
      window.location.reload();
    }, 150);
  };

  const toggleLanguage = () => {
    applyGoogleTranslation(language === "ur" ? "en" : "ur");
  };

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
      <Box id="google_translate_element" aria-hidden="true" />
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
              src="/logo-nav.svg"
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
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              {menuItems.map((item) => {
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== "/" && location.pathname.startsWith(`${item.path}/`));
                if (item.dropdown) {
                  return (
                    <Box key={item.path}>
                      <Button
                        onClick={(event) => setCareerAnchor(event.currentTarget)}
                        color="primary"
                        endIcon={<KeyboardArrowDownIcon />}
                        sx={{
                          textTransform: "none",
                          fontWeight: 700,
                          fontSize: "16px",
                          px: 1.8,
                          py: 0.7,
                          borderRadius: "0px",
                          position: "relative",
                          transition: "all 0.3s ease",
                          ...(isActive && activeStyles),
                          "&:hover": {
                            transform: "translateY(-2px) scale(1.04)",
                            background: "rgba(255,255,255,0.2)",
                            backdropFilter: "blur(10px)",
                            borderRadius: "0px",
                          },
                          "&::after": {
                            content: '""',
                            position: "absolute",
                            left: 0,
                            bottom: "-3px",
                            width: isActive ? "100%" : "0%",
                            height: "2px",
                            background: "linear-gradient(90deg, #0f766e, #f59e0b, #be123c)",
                            transition: "width 0.3s ease",
                          },
                          "&:hover::after": { width: "100%" },
                        }}
                      >
                        {item.label}
                      </Button>
                      <Menu
                        anchorEl={careerAnchor}
                        open={Boolean(careerAnchor)}
                        onClose={() => setCareerAnchor(null)}
                        MenuListProps={{ "aria-label": "Career Roadmap menu" }}
                        PaperProps={{
                          sx: {
                            mt: 1,
                            minWidth: 260,
                            borderRadius: 1,
                            border: "1px solid #dcebe2",
                            boxShadow: "0 18px 42px rgba(16,32,25,0.14)",
                          },
                        }}
                      >
                        {careerMenuItems.map((careerItem) => (
                          <MenuItem
                            key={careerItem.path}
                            component={Link}
                            to={careerItem.path}
                            onClick={() => setCareerAnchor(null)}
                            sx={{
                              fontWeight: 800,
                              py: 1.1,
                              color: careerItem.label.includes("PTE") ? "#0f766e" : "#102019",
                            }}
                          >
                            {careerItem.label}
                          </MenuItem>
                        ))}
                      </Menu>
                    </Box>
                  );
                }
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
                      borderRadius: "0px",
                      position: "relative",
                      transition: "all 0.3s ease",
                      ...(isActive && activeStyles),

                      "&:hover": {
                        transform: "translateY(-2px) scale(1.06)",
                        background: "rgba(255,255,255,0.2)",
                        backdropFilter: "blur(10px)",
                        borderRadius: "0px",
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
              <Button
                onClick={toggleLanguage}
                startIcon={<TranslateIcon />}
                variant="outlined"
                color="primary"
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: "20px",
                  px: 1.6,
                  whiteSpace: "nowrap",
                  borderColor: language === "ur" ? "#26b657" : "rgba(25,118,210,0.45)",
                  bgcolor: language === "ur" ? "rgba(38,182,87,0.1)" : "transparent",
                }}
              >
                {language === "ur" ? "English" : "اردو"}
              </Button>
            </Box>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton
                color="primary"
                onClick={toggleLanguage}
                aria-label={language === "ur" ? "Switch to English" : "Switch to Urdu"}
                sx={{
                  border: "1px solid rgba(25,118,210,0.25)",
                  bgcolor: language === "ur" ? "rgba(38,182,87,0.1)" : "transparent",
                }}
              >
                <TranslateIcon />
              </IconButton>
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
            </Box>
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
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/" && location.pathname.startsWith(`${item.path}/`));
            return (
              <React.Fragment key={item.path}>
                <ListItem
                  component={Link}
                  to={item.path}
                  onClick={() => !item.dropdown && setDrawerOpen(false)}
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
                {item.dropdown &&
                  careerMenuItems.map((careerItem) => (
                    <ListItem
                      key={careerItem.path}
                      component={Link}
                      to={careerItem.path}
                      onClick={() => setDrawerOpen(false)}
                      sx={{
                        mb: 0.7,
                        ml: 1.5,
                        width: "calc(100% - 12px)",
                        py: 0.9,
                        borderRadius: 1,
                        bgcolor: careerItem.label.includes("PTE") ? "rgba(20,184,166,0.14)" : "rgba(255,255,255,0.38)",
                        color: careerItem.label.includes("PTE") ? "#0f766e" : "#102019",
                      }}
                    >
                      <ListItemText primary={careerItem.label} primaryTypographyProps={{ fontWeight: 800, fontSize: 14 }} />
                    </ListItem>
                  ))}
              </React.Fragment>
            );
          })}
        </List>

        <Divider sx={{ my: 2 }} />

        <Button
          startIcon={<TranslateIcon />}
          onClick={() => {
            toggleLanguage();
            setDrawerOpen(false);
          }}
          variant="contained"
          fullWidth
          sx={{
            mb: 2,
            textTransform: "none",
            fontWeight: 700,
            bgcolor: "#26b657",
            "&:hover": { bgcolor: "#1f9a4a" },
          }}
        >
          {language === "ur" ? "Switch to English" : "اردو میں دیکھیں"}
        </Button>

        {/* Contact Section */}
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Contact Now
          </Typography>

          <Button
            startIcon={<WhatsAppIcon />}
            href="https://wa.me/923197659491"
            target="_blank"
            variant="outlined"
            fullWidth
            sx={{
              mb: 1,
              textTransform: "none",
              backdropFilter: "blur(10px)",
            }}
          >
            +92-3197659491
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
