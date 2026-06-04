import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import SaveIcon from "@mui/icons-material/Save";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/useAuth";
import useSEO from "../../hooks/useSEO";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  city: "",
  area: "",
  classLevel: "",
  subjects: "",
  preferredMode: "Home tuition",
  preferredTutorGender: "Any",
  notes: "",
};

const roleCopy = {
  parent: {
    title: "Parent Registration",
    heading: "Create a parent profile",
    description:
      "Register as a parent to request tutors, manage your contact details, and keep your child learning preferences in one place.",
    collection: "parentProfiles",
  },
  student: {
    title: "Student Registration",
    heading: "Create a student profile",
    description:
      "Register as a student to save your study goals, preferred subjects, tutor mode, and learning requirements.",
    collection: "studentProfiles",
  },
};

const FamilyStudentRegistration = ({ role }) => {
  const copy = roleCopy[role];
  const navigate = useNavigate();
  const { hasFirebaseConfig, signInWithGoogle, user } = useAuth();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useSEO({
    title: `${copy.title} | A Plus Academy`,
    description: copy.description,
    canonical: `https://www.aplusacademy.pk/register/${role}`,
  });

  const steps = useMemo(
    () => [
      {
        label: "Basic details",
        fields: ["name", "email", "phone"],
      },
      {
        label: "Learning need",
        fields: ["classLevel", "subjects"],
      },
      {
        label: "Location and preference",
        fields: ["city", "area"],
      },
    ],
    [],
  );

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const useGoogleProfile = async () => {
    setMessage("");
    try {
      const result = await signInWithGoogle();
      update("name", result.user.displayName || "");
      update("email", result.user.email || "");
    } catch (err) {
      console.error(err);
      setMessage("Google sign-in could not be completed. Check Firebase auth settings.");
    }
  };

  const fetchLocation = () => {
    setMessage("");
    navigator.geolocation?.getCurrentPosition(
      (position) => {
        update("lat", position.coords.latitude);
        update("lng", position.coords.longitude);
        setMessage("Location saved. You can still type your city and area for accuracy.");
      },
      () => setMessage("Location permission was not granted. You can enter city and area manually."),
    );
  };

  const saveProfile = async () => {
    setSaving(true);
    setMessage("");

    try {
      if (!db || !user) {
        setMessage("Please sign in with Google first so your profile can be saved.");
        setSaving(false);
        return;
      }

      await setDoc(
        doc(db, copy.collection, user.uid),
        {
          ...form,
          role,
          uid: user.uid,
          email: form.email || user.email || "",
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
        },
        { merge: true },
      );

      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          name: form.name || user.displayName || "",
          email: form.email || user.email || "",
          role,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      navigate("/account");
    } catch (err) {
      console.error(err);
      setMessage("Profile could not be saved. Check Firestore setup and security rules.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ bgcolor: "#eef5ff", py: { xs: 5, md: 8 } }}>
      <Container maxWidth="md">
        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 2, border: "1px solid #dce8f1" }}>
          <Stack spacing={1.5} sx={{ mb: 3 }}>
            <Chip label={copy.title} color="primary" sx={{ color: "#fff", fontWeight: 800, alignSelf: "flex-start" }} />
            <Typography component="h1" variant="h4" fontWeight={900} color="#004aad">
              {copy.heading}
            </Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
              {copy.description}
            </Typography>
          </Stack>

          {!hasFirebaseConfig && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              Firebase config is not active yet. You can preview the form, but profile saving needs Vercel env variables.
            </Alert>
          )}

          {message && <Alert severity={message.includes("saved") ? "success" : "info"} sx={{ mb: 3 }}>{message}</Alert>}

          <LinearProgress variant="determinate" value={((step + 1) / steps.length) * 100} sx={{ mb: 3, height: 8, borderRadius: 99 }} />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mb: 3 }}>
            {steps.map((item, index) => (
              <Chip
                key={item.label}
                label={`${index + 1}. ${item.label}`}
                color={index === step ? "primary" : "default"}
                sx={{ color: index === step ? "#fff" : "inherit", fontWeight: 800 }}
              />
            ))}
          </Stack>

          {step === 0 && (
            <Stack spacing={2}>
              <Button
                startIcon={<GoogleIcon />}
                variant="outlined"
                disabled={!hasFirebaseConfig}
                onClick={useGoogleProfile}
                sx={{ alignSelf: "flex-start", textTransform: "none", fontWeight: 800 }}
              >
                Sign up with Google
              </Button>
              <TextField label="Full name" value={form.name} onChange={(e) => update("name", e.target.value)} fullWidth />
              <TextField label="Email" value={form.email} onChange={(e) => update("email", e.target.value)} fullWidth />
              <TextField label="Phone / WhatsApp" value={form.phone} onChange={(e) => update("phone", e.target.value)} fullWidth />
            </Stack>
          )}

          {step === 1 && (
            <Stack spacing={2}>
              <TextField label="Class / level" value={form.classLevel} onChange={(e) => update("classLevel", e.target.value)} fullWidth placeholder="Example: Class 8, O Level, IELTS, BS Computer Science" />
              <TextField label="Subjects needed" value={form.subjects} onChange={(e) => update("subjects", e.target.value)} fullWidth placeholder="Example: Maths, English, Physics" />
              <TextField label="Learning goal" value={form.notes} onChange={(e) => update("notes", e.target.value)} multiline rows={4} fullWidth placeholder="Tell us about weak areas, exam date, preferred timings, or any special requirement." />
            </Stack>
          )}

          {step === 2 && (
            <Stack spacing={2}>
              <Button startIcon={<MyLocationIcon />} variant="outlined" onClick={fetchLocation} sx={{ alignSelf: "flex-start", textTransform: "none", fontWeight: 800 }}>
                Fetch my location
              </Button>
              <TextField label="City" value={form.city} onChange={(e) => update("city", e.target.value)} fullWidth />
              <TextField label="Area / address hint" value={form.area} onChange={(e) => update("area", e.target.value)} fullWidth />
              <Typography fontWeight={800}>Preferred class mode</Typography>
              <ToggleButtonGroup exclusive value={form.preferredMode} onChange={(e, value) => value && update("preferredMode", value)}>
                <ToggleButton value="Home tuition">Home tuition</ToggleButton>
                <ToggleButton value="Online">Online</ToggleButton>
                <ToggleButton value="Either">Either</ToggleButton>
              </ToggleButtonGroup>
              <Typography fontWeight={800}>Preferred tutor</Typography>
              <ToggleButtonGroup exclusive value={form.preferredTutorGender} onChange={(e, value) => value && update("preferredTutorGender", value)}>
                <ToggleButton value="Any">Any</ToggleButton>
                <ToggleButton value="Female">Female</ToggleButton>
                <ToggleButton value="Male">Male</ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          )}

          <Stack direction="row" justifyContent="space-between" sx={{ mt: 4 }}>
            <Button disabled={step === 0} onClick={() => setStep((prev) => prev - 1)}>
              Back
            </Button>
            {step < steps.length - 1 ? (
              <Button variant="contained" onClick={() => setStep((prev) => prev + 1)}>
                Continue
              </Button>
            ) : (
              <Button startIcon={<SaveIcon />} variant="contained" onClick={saveProfile} disabled={saving}>
                {saving ? "Saving..." : "Save profile"}
              </Button>
            )}
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default FamilyStudentRegistration;
