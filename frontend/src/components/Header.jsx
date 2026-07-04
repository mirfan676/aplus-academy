import React, { useState, useEffect, useRef } from "react";
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
  Grid,
  Chip,
  Stack,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import TranslateIcon from "@mui/icons-material/Translate";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LanguageIcon from "@mui/icons-material/Language";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import AccountTreeIcon from "@mui/icons-material/AccountTree";

const Header = () => {
  const isMobile = useMediaQuery("(max-width:900px)");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [careerAnchor, setCareerAnchor] = useState(null);
  const [coursesAnchor, setCoursesAnchor] = useState(null);
  const [desktopHoverMenu, setDesktopHoverMenu] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const closeTimerRef = useRef(null);
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
    { label: "Courses", path: "/courses/languages", dropdown: "courses" },
    { label: "Career Roadmap", path: "/career-roadmap", dropdown: "career" },
    { label: "Account", path: "/account" },
    { label: "About Us", path: "/about" },
  ];

  const coursesMenuItems = [
    { label: "Language Courses", path: "/courses/languages" },
    { label: "English Language", path: "/courses/languages/english" },
    { label: "German Language", path: "/courses/languages/german" },
    { label: "Chinese Language", path: "/courses/languages/chinese" },
    { label: "Korean Language", path: "/courses/languages/korean" },
    { label: "Japanese Language", path: "/courses/languages/japanese" },
    { label: "Arabic Language", path: "/courses/languages/arabic" },
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

  const coursesMegaSections = [
    {
      heading: "Language Courses",
      icon: <LanguageIcon fontSize="small" />,
      items: [
        { label: "All Language Courses", path: "/courses/languages", note: "English, German, Chinese, Korean, Japanese, and Arabic" },
        { label: "English Language", path: "/courses/languages/english", note: "Spoken English, grammar, writing, and PTE support" },
        { label: "German Language", path: "/courses/languages/german", note: "CEFR A1 to B2 and Goethe-style preparation" },
      ],
    },
    {
      heading: "Popular Paths",
      icon: <MenuBookIcon fontSize="small" />,
      items: [
        { label: "Chinese Language", path: "/courses/languages/chinese", note: "Pinyin, tones, characters, and HSK direction" },
        { label: "Korean Language", path: "/courses/languages/korean", note: "Hangul, conversation, grammar, and TOPIK path" },
        { label: "Japanese Language", path: "/courses/languages/japanese", note: "Kana, vocabulary, grammar, and JLPT route" },
        { label: "Arabic Language", path: "/courses/languages/arabic", note: "Alphabet, reading, writing, and MSA support" },
      ],
    },
    {
      heading: "English + PTE",
      icon: <SchoolIcon fontSize="small" />,
      items: [
        { label: "Free PTE Practice", path: "/pte", note: "Text-based practice tasks and guided scoring" },
        { label: "Career Roadmap", path: "/career-roadmap", note: "Use English learning with study-abroad and future plans" },
      ],
    },
  ];

  const careerMegaSections = [
    {
      heading: "Start Here",
      icon: <AccountTreeIcon fontSize="small" />,
      items: [
        { label: "All Career Roadmaps", path: "/career-roadmap", note: "Browse all pathways in one place" },
        { label: "After Matric", path: "/career-roadmap#after-matric", note: "Academic and skill options after matric" },
        { label: "After Graduation", path: "/career-roadmap#after-graduation", note: "Work, higher study, and future direction" },
      ],
    },
    {
      heading: "Study Abroad",
      icon: <FlightTakeoffIcon fontSize="small" />,
      items: [
        { label: "Study Abroad & PTE", path: "/career-roadmap#study-abroad-pte", note: "Language tests and overseas study routes" },
        { label: "Healthcare Abroad", path: "/career-roadmap#healthcare-abroad", note: "Medical and healthcare-linked pathways" },
        { label: "IT & Engineering Abroad", path: "/career-roadmap#it-engineering-abroad", note: "Technical degrees, work, and migration paths" },
      ],
    },
    {
      heading: "Related Support",
      icon: <WorkOutlineIcon fontSize="small" />,
      items: [
        { label: "PTE Practice", path: "/pte", note: "English test preparation for study and migration goals" },
        { label: "Find Tutors", path: "/teachers", note: "Get subject or language help from tutors" },
      ],
    },
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

  const getDropdownMeta = (dropdownKey) => {
    if (dropdownKey === "career") {
      return {
        anchor: careerAnchor,
        setAnchor: setCareerAnchor,
        items: careerMenuItems,
        ariaLabel: "Career Roadmap menu",
      };
    }

    return {
      anchor: coursesAnchor,
      setAnchor: setCoursesAnchor,
      items: coursesMenuItems,
      ariaLabel: "Courses menu",
    };
  };

  const getMegaSections = (dropdownKey) =>
    dropdownKey === "career" ? careerMegaSections : coursesMegaSections;

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const openHoverMenu = (menuKey, anchorEl) => {
    clearCloseTimer();
    if (menuKey === "career") {
      setCareerAnchor(anchorEl);
    } else {
      setCoursesAnchor(anchorEl);
    }
    setDesktopHoverMenu(menuKey);
  };

  const scheduleHoverClose = () => {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      setDesktopHoverMenu(null);
    }, 140);
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
          backdropFilter: "none",
          background: "#ffffff",
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
                  const dropdownMeta = getDropdownMeta(item.dropdown);
                  return (
                    <Box
                      key={item.path}
                      onMouseEnter={(event) => openHoverMenu(item.dropdown, event.currentTarget)}
                      onMouseLeave={scheduleHoverClose}
                    >
                      <Button
                        onMouseEnter={(event) => openHoverMenu(item.dropdown, event.currentTarget)}
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
                        anchorEl={dropdownMeta.anchor}
                        open={desktopHoverMenu === item.dropdown}
                        onClose={() => setDesktopHoverMenu(null)}
                        MenuListProps={{ "aria-label": dropdownMeta.ariaLabel }}
                        PaperProps={{
                          sx: {
                            mt: 1,
                            minWidth: 760,
                            borderRadius: 1,
                            border: "1px solid #dcebe2",
                            boxShadow: "0 18px 42px rgba(16,32,25,0.14)",
                            overflow: "visible",
                          },
                          onMouseEnter: clearCloseTimer,
                          onMouseLeave: scheduleHoverClose,
                        }}
                      >
                        <Box sx={{ p: 2.4, background: "#fff" }}>
                          <Grid container spacing={2.2}>
                            {getMegaSections(item.dropdown).map((section) => (
                              <Grid item xs={4} key={section.heading}>
                                <Box
                                  sx={{
                                    height: "100%",
                                    p: 2,
                                    borderRadius: 1,
                                    border: "1px solid #e3edf5",
                                    bgcolor: section.heading === "English + PTE" ? "#f0fdf4" : "#fbfdff",
                                  }}
                                >
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.4 }}>
                                    <Box sx={{ color: item.dropdown === "career" ? "#0f766e" : "#004aad" }}>{section.icon}</Box>
                                    <Typography fontWeight={900} sx={{ color: "#102019" }}>
                                      {section.heading}
                                    </Typography>
                                  </Box>

                                  <Stack spacing={1.1}>
                                    {section.items.map((entry) => (
                                      <Box
                                        key={entry.path}
                                        component={Link}
                                        to={entry.path}
                                        onClick={() => setDesktopHoverMenu(null)}
                                        sx={{
                                          p: 1.2,
                                          borderRadius: 1,
                                          textDecoration: "none",
                                          color: "#102019",
                                          border: "1px solid transparent",
                                          "&:hover": {
                                            bgcolor: "#fff",
                                            borderColor: "#dce8f1",
                                          },
                                        }}
                                      >
                                        <Typography fontWeight={800} sx={{ color: entry.label.includes("PTE") ? "#0f766e" : "#102019", mb: 0.2 }}>
                                          {entry.label}
                                        </Typography>
                                        <Typography sx={{ color: "#556", fontSize: 13, lineHeight: 1.55 }}>
                                          {entry.note}
                                        </Typography>
                                      </Box>
                                    ))}
                                  </Stack>
                                </Box>
                              </Grid>
                            ))}
                          </Grid>
                          {item.dropdown === "courses" ? (
                            <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #e3edf5", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
                              <Box>
                                <Typography fontWeight={900} sx={{ color: "#102019" }}>
                                  Monthly language support from home
                                </Typography>
                                <Typography sx={{ color: "#556", fontSize: 14 }}>
                                  English + PTE packages start from Rs. 15,000 per month.
                                </Typography>
                              </Box>
                              <Chip label="Hover menu" sx={{ borderRadius: 1, fontWeight: 800, bgcolor: "#f8fafc" }} />
                            </Box>
                          ) : null}
                        </Box>
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
                  getDropdownMeta(item.dropdown).items.map((dropdownItem) => (
                    <ListItem
                      key={dropdownItem.path}
                      component={Link}
                      to={dropdownItem.path}
                      onClick={() => setDrawerOpen(false)}
                      sx={{
                        mb: 0.7,
                        ml: 1.5,
                        width: "calc(100% - 12px)",
                        py: 0.9,
                        borderRadius: 1,
                        bgcolor:
                          item.dropdown === "career" && dropdownItem.label.includes("PTE")
                            ? "rgba(20,184,166,0.14)"
                            : "rgba(255,255,255,0.38)",
                        color:
                          item.dropdown === "career" && dropdownItem.label.includes("PTE")
                            ? "#0f766e"
                            : "#102019",
                      }}
                    >
                      <ListItemText primary={dropdownItem.label} primaryTypographyProps={{ fontWeight: 800, fontSize: 14 }} />
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
