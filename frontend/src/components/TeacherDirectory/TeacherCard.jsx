// TeacherCard.jsx
import { Box, Card, Typography, Avatar, Button, Chip } from "@mui/material";
import { Link } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { motion } from "framer-motion";

export default function TeacherCard({
  t = {},
  showMoreBio = false,
  toggleBio = () => {},
  showMoreSubjects = false,
  toggleSubjects = () => {}
}) {
  const subjects = Array.isArray(t.subjects) ? t.subjects : [];
  const bioWords = typeof t.bio === "string" ? t.bio.split(" ") : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      style={{ flex: 1, display: "flex", flexDirection: "column" }}
    >
      <Card
        sx={{
          borderRadius: "22px",
          minHeight: 420,
          display: "flex",
          flexDirection: "column",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
          position: "relative",
          overflow: "hidden",
          minWidth: 320,
          maxWidth: 320,    // enforce consistent card width
          width: "100%",    // allow flex to control
          "&:hover": { boxShadow: "0 8px 22px rgba(0,0,0,0.14)" }
        }}
      >
        {/* badge */}
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "#00a6ff",
            color: "white",
            px: 1.6,
            py: 0.5,
            borderRadius: "16px",
            fontSize: "0.75rem",
            fontWeight: 700,
            zIndex: 2
          }}
        >
          Featured
        </Box>

        {/* header */}
        <Box sx={{ display: "flex", gap: 2, p: 2, background: "rgba(0,80,200,0.12)", borderTopLeftRadius: "22px", borderTopRightRadius: "22px" }}>
          <Avatar src={t.thumbnail} sx={{ width: 70, height: 70, borderRadius: "14px" }} />
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 0.5, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {String(t.verified || "").toLowerCase() === "yes" && <CheckCircleIcon fontSize="small" color="success" />}
              {t.name || "Unknown"}
            </Typography>

            <Typography sx={{ fontSize: "0.85rem", color: "#004aad", fontWeight: 700 }}>
              {t.qualification || ""}
            </Typography>

            {t.experience ? (
              <Typography sx={{ fontSize: "0.8rem", color: "#555" }}>{t.experience} years experience</Typography>
            ) : null}

            <Typography sx={{ fontSize: "0.75rem", color: "green" }}>{t.city || ""}</Typography>
          </Box>
        </Box>

        {/* middle */}
        <Box sx={{ p: 2, flexGrow: 1 }}>
          <Typography sx={{ fontWeight: 700, mb: 0.5 }}>Subjects:</Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {(showMoreSubjects ? subjects : subjects.slice(0, 2)).map((sub, i) => (
              <Chip key={i} label={sub} size="small" sx={{ background: "#e8f7ff", color: "#004aad", fontWeight: 600 }} />
            ))}
          </Box>

          {subjects.length > 2 && (
            <Button size="small" onClick={toggleSubjects} sx={{ mt: 0.5, textTransform: "none", fontSize: "0.75rem" }}>
              {showMoreSubjects ? "See less" : "See more"}
            </Button>
          )}

          <Typography sx={{ fontWeight: 700, mt: 2 }}>Bio:</Typography>

          <Typography sx={{
            fontSize: "0.85rem",
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: showMoreBio ? "none" : 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            wordBreak: "break-word"
          }}>
            {showMoreBio ? (t.bio || "") : bioWords.slice(0, 40).join(" ")}
          </Typography>

          {bioWords.length > 40 && (
            <Button size="small" onClick={toggleBio} sx={{ mt: 0.5, textTransform: "none", fontSize: "0.75rem" }}>
              {showMoreBio ? "See less" : "See more"}
            </Button>
          )}
        </Box>

        {/* price/footer */}
        <Box sx={{ background: "rgba(0,200,100,0.15)", textAlign: "center", py: 1, fontWeight: 700, color: "#1a7f37" }}>
          {t.price || "1500/hr"}
        </Box>

        {/* actions */}
        <Box sx={{ display: "flex", gap: 1, p: 2 }}>
          <Button component={Link} to={`/teacher/${t.id}`} variant="contained" sx={{ flex: 1, background: "#004aad" }}>
            View Profile
          </Button>
          <Button component={Link} to={`/hire/${t.id}`} variant="contained" sx={{ flex: 1, background: "#29b554" }}>
            Hire Me
          </Button>
        </Box>
      </Card>
    </motion.div>
  );
}
