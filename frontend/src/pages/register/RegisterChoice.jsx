import {
  Box,
  Button,
  Chip,
  Container,
  Alert,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import GoogleIcon from "@mui/icons-material/Google";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useSEO from "../../hooks/useSEO";
import { useAuth } from "../../contexts/useAuth";

const options = [
  {
    title: "Register As Teacher",
    subtitle: "Apply for home tuition and online teaching opportunities.",
    icon: SchoolIcon,
    to: "/register/teacher",
    color: "#198754",
    points: ["Subjects and qualifications", "Location and profile photo", "Tutor verification review"],
  },
  {
    title: "Register As Parent",
    subtitle: "Create a parent profile and request tutors for your child.",
    icon: FamilyRestroomIcon,
    to: "/register/parent",
    color: "#004aad",
    points: ["Child class and subjects", "Home or online preference", "Area and contact details"],
  },
  {
    title: "Register As Student",
    subtitle: "Create your own student profile for classes, exams, and skills.",
    icon: MenuBookIcon,
    to: "/register/student",
    color: "#7c3aed",
    points: ["Study goal and level", "Preferred tutor mode", "Learning support profile"],
  },
];

const RegisterChoice = () => {
  const navigate = useNavigate();
  const { hasFirebaseConfig, signInWithGoogle, user } = useAuth();
  useSEO({
    title: "Register with A Plus Academy | Teacher, Parent or Student",
    description:
      "Choose whether to register as a teacher, parent, or student with A Plus Academy for tutoring, tutor requests, and profile management.",
    canonical: "https://www.aplusacademy.pk/register",
  });

  return (
    <Box sx={{ bgcolor: "#eef5ff", py: { xs: 5, md: 8 } }}>
      <Container maxWidth="lg">
        <Stack spacing={2} alignItems="center" textAlign="center" sx={{ mb: 5 }}>
          <Chip label="A Plus Academy Registration" color="primary" sx={{ color: "#fff", fontWeight: 800 }} />
          <Typography component="h1" variant="h3" fontWeight={900} color="#004aad">
            How would you like to register?
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 760, lineHeight: 1.8 }}>
            Choose the profile type that matches you. Teachers can apply for tutoring work, parents can request tutors
            for children, and students can create their own learning profile.
          </Typography>
        </Stack>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 3 }}>
          {options.map((option) => {
            const Icon = option.icon;
            const isTeacher = option.to === "/register/teacher";
            return (
              <Paper
                key={option.title}
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: "1px solid #dce8f1",
                  minHeight: 360,
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 18px 36px rgba(16,32,25,0.14)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 58,
                    height: 58,
                    borderRadius: 2,
                    bgcolor: option.color,
                    color: "#fff",
                    display: "grid",
                    placeItems: "center",
                    mb: 2,
                  }}
                >
                  <Icon fontSize="large" />
                </Box>
                <Typography component="h2" variant="h5" fontWeight={900} color="#102019">
                  {option.title}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1, lineHeight: 1.7 }}>
                  {option.subtitle}
                </Typography>
                <Stack spacing={1} sx={{ my: 3 }}>
                  {option.points.map((point) => (
                    <Typography key={point} sx={{ color: "#334155" }}>
                      {point}
                    </Typography>
                  ))}
                </Stack>
                {isTeacher && (
                  <Stack spacing={1} sx={{ mb: 2 }}>
                    {!user && (
                      <Alert severity="info" sx={{ borderRadius: 1 }}>
                        Sign in with Google first to save your teacher profile and photo.
                      </Alert>
                    )}
                    <Button
                      startIcon={<GoogleIcon />}
                      variant="outlined"
                      disabled={!hasFirebaseConfig}
                      onClick={async () => {
                        await signInWithGoogle();
                        navigate("/register/teacher");
                      }}
                      sx={{
                        justifyContent: "flex-start",
                        borderRadius: 1,
                        textTransform: "none",
                        fontWeight: 800,
                      }}
                    >
                      Continue with Google
                    </Button>
                  </Stack>
                )}
                <Button
                  component={RouterLink}
                  to={option.to}
                  endIcon={<ArrowForwardIcon />}
                  variant="contained"
                  sx={{
                    mt: "auto",
                    bgcolor: option.color,
                    py: 1.2,
                    textTransform: "none",
                    fontWeight: 800,
                    "&:hover": { bgcolor: option.color },
                  }}
                >
                  Continue
                </Button>
              </Paper>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
};

export default RegisterChoice;
