import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SchoolIcon from "@mui/icons-material/School";
import ArticleIcon from "@mui/icons-material/Article";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import LogoutIcon from "@mui/icons-material/Logout";
import RateReviewIcon from "@mui/icons-material/RateReview";
import CloudSyncIcon from "@mui/icons-material/CloudSync";
import { Link as RouterLink } from "react-router-dom";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "../../firebase";
import { fetchTeachersForAdmin } from "../../services/appData";
import { useAuth } from "../../contexts/useAuth";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const statCards = [
  { key: "tutors", label: "Verified tutors", icon: SchoolIcon, color: "#198754" },
  { key: "users", label: "Google users", icon: PeopleAltIcon, color: "#004aad" },
  { key: "blogs", label: "Blog posts", icon: ArticleIcon, color: "#7c3aed" },
  { key: "locations", label: "Tracked locations", icon: TravelExploreIcon, color: "#ea580c" },
];

const normalizeTutor = (tutor, index) => ({
  id: Number.isInteger(Number(tutor.id)) ? Number(tutor.id) : index,
  name: tutor.Name || tutor.name || "Tutor",
  city: tutor.City || tutor.city || "Pakistan",
  subject: tutor.Subject || tutor.subject || tutor.MajorSubjects || "Teaching",
  lat: Number(tutor.Latitude || tutor.lat) || null,
  lng: Number(tutor.Longitude || tutor.lng) || null,
});

const AdminDashboard = () => {
  const { logout, user } = useAuth();
  const [tutors, setTutors] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [counts, setCounts] = useState({ users: 0, tutorSubmissions: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const [tutorRecords, blogRes] = await Promise.all([
          fetchTeachersForAdmin(),
          fetch("/blogs/index.json", { cache: "no-store" }).then((res) => (res.ok ? res.json() : [])),
        ]);

        setTutors((tutorRecords || []).map(normalizeTutor));
        setBlogs(Array.isArray(blogRes) ? blogRes : []);

        if (db) {
          const [usersCount, tutorSubmissionsCount] = await Promise.all([
            getCountFromServer(collection(db, "users")),
            getCountFromServer(collection(db, "tutorSubmissions")).catch(() => null),
          ]);
          setCounts({
            users: usersCount.data().count,
            tutorSubmissions: tutorSubmissionsCount?.data().count || 0,
          });
        }
      } catch (err) {
        console.error(err);
        setError("Dashboard data could not be loaded. Check Firebase config and backend availability.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const mappedTutors = useMemo(() => tutors.filter((tutor) => tutor.lat && tutor.lng), [tutors]);
  const cityCounts = useMemo(() => {
    const map = new Map();
    tutors.forEach((tutor) => map.set(tutor.city, (map.get(tutor.city) || 0) + 1));
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [tutors]);

  const values = {
    tutors: tutors.length,
    users: counts.users,
    blogs: blogs.length,
    locations: cityCounts.length,
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#eef5ff" }}>
      <Box
        sx={{
          bgcolor: "#102019",
          color: "#fff",
          py: 2,
          borderBottom: "4px solid #198754",
        }}
      >
        <Container maxWidth="xl">
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2}>
            <Box>
              <Typography component="h1" variant="h4" fontWeight={900}>
                A Plus Academy Dashboard
              </Typography>
              <Typography sx={{ opacity: 0.75 }}>Tutors, users, blog activity, and location insights</Typography>
            </Box>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar src={user?.photoURL || undefined}>{user?.displayName?.[0] || "A"}</Avatar>
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Typography fontWeight={800}>{user?.displayName || "Admin"}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.72 }}>{user?.email}</Typography>
              </Box>
              <Button onClick={logout} startIcon={<LogoutIcon />} variant="outlined" sx={{ color: "#fff", borderColor: "#6ea884" }}>
                Logout
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {error && <Alert severity="warning" sx={{ mb: 3 }}>{error}</Alert>}

        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="flex-end" spacing={1.5} sx={{ mb: 2 }}>
          <Button component={RouterLink} to="/admin/firestore" variant="outlined" startIcon={<CloudSyncIcon />} sx={{ fontWeight: 900 }}>
            Firestore data
          </Button>
          <Button component={RouterLink} to="/admin/pte-essays" variant="contained" startIcon={<RateReviewIcon />} sx={{ fontWeight: 900 }}>
            Manage PTE essays
          </Button>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
            gap: 2.5,
            mb: 3,
          }}
        >
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Paper key={card.key} elevation={0} sx={{ p: 2.5, borderRadius: 2, border: "1px solid #dce8f1" }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: card.color, color: "#fff", display: "grid", placeItems: "center" }}>
                    <Icon />
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight={900}>{loading ? <CircularProgress size={22} /> : values[card.key]}</Typography>
                    <Typography color="text.secondary">{card.label}</Typography>
                  </Box>
                </Stack>
              </Paper>
            );
          })}
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1.4fr 0.8fr" }, gap: 3 }}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, border: "1px solid #dce8f1" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Box>
                <Typography variant="h5" fontWeight={900}>Pakistan tutor map</Typography>
                <Typography color="text.secondary">Based on verified tutor coordinates stored in Firestore.</Typography>
              </Box>
              <Chip label={`${mappedTutors.length} mapped`} color="primary" sx={{ color: "#fff", fontWeight: 800 }} />
            </Stack>
            <Box sx={{ height: { xs: 360, md: 520 }, overflow: "hidden", borderRadius: 2 }}>
              <MapContainer center={[30.3753, 69.3451]} zoom={5} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {mappedTutors.map((tutor) => (
                  <Marker key={tutor.id} position={[tutor.lat, tutor.lng]}>
                    <Popup>
                      <strong>{tutor.name}</strong>
                      <br />
                      {tutor.city}
                      <br />
                      {tutor.subject}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </Box>
          </Paper>

          <Stack spacing={3}>
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, border: "1px solid #dce8f1" }}>
              <Typography variant="h5" fontWeight={900}>Top tutor locations</Typography>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={1.4}>
                {cityCounts.map(([city, count]) => (
                  <Stack key={city} direction="row" justifyContent="space-between">
                    <Typography>{city || "Unknown"}</Typography>
                    <Chip label={count} size="small" color="primary" sx={{ color: "#fff", fontWeight: 800 }} />
                  </Stack>
                ))}
              </Stack>
            </Paper>

            <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, border: "1px solid #dce8f1" }}>
              <Typography variant="h5" fontWeight={900}>Google Analytics</Typography>
              <Typography color="text.secondary" sx={{ mt: 1.2, lineHeight: 1.7 }}>
                Location-based viewer reports need the Google Analytics Data API connected through the backend. Once you provide the GA4
                property ID and service account access, this panel will show visitors by city, country, and page.
              </Typography>
            </Paper>

            <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, border: "1px solid #dce8f1" }}>
              <Typography variant="h5" fontWeight={900}>Latest blog posts</Typography>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={1.5}>
                {blogs.slice(0, 5).map((post) => (
                  <Box key={post.slug}>
                    <Typography fontWeight={800}>{post.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{post.category} · {post.readTime}</Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
