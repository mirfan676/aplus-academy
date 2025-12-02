// TeacherCard.jsx
import { Box, Card, Typography, Avatar, Button, Chip } from "@mui/material";
import { Link } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { motion } from "framer-motion";

// Experience Badge Function
const getExperienceBadge = (exp) => {
  const e = Number(exp) || 0;

  if (e >= 0 && e <= 2) return { label: "Beginner", color: "#42a5f5" };
  if (e >= 3 && e <= 5) return { label: "Experienced", color: "#66bb6a" };
  if (e >= 6 && e <= 10) return { label: "Expert", color: "#ffa726" };
  if (e >= 11) return { label: "Senior", color: "#ab47bc" };

  return { label: "Beginner", color: "#42a5f5" };
};

export default function TeacherCard({
  t = {},
  showMoreBio = false,
  toggleBio = () => {},
  showMoreSubjects = false,
  toggleSubjects = () => {}
}) {
  const subjects = Array.isArray(t.subjects) ? t.subjects : [];
  const bioWords = typeof t.bio === "string" ? t.bio.split(" ") : [];
  const experienceBadge = getExperienceBadge(t.experience);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column"
      }}
    >

      {/* 🔥 Gradient Hover Border Wrapper */}
      <Box
        sx={{
          p: 0.5,
          borderRadius: "5px",
          transition: "all 0.3s ease",
          background: "transparent",
          "&:hover": {
            background:
              "linear-gradient(45deg, #1976d2, #00e676)",
            
          }
        }}
      >

        {/* REAL CARD INSIDE */}
        <Card
          sx={{
            borderRadius: "20px",
            minHeight: 420,
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
            minWidth: 320,
            maxWidth: 320,
            width: "100%",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
            transition: "all 0.25s ease"
          }}
        >

          {/* HEADER */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              px: 2,
              py:2,
              pb:4,
              background: "rgba(0,80,200,0.12)",
              borderTopLeftRadius: "20px",
              borderTopRightRadius: "20px",
              position: "relative"
            }}
          >
            {/* BADGES CONTAINER */}
            <Box
              sx={{
                position: "absolute",
                bottom: 6,
                right: 6, // or "right: 6" if you want them on the right
                display: "flex",
                gap: 1, // space between badges
                zIndex: 2
              }}
            >
              {/* EXPERIENCE BADGE */}
              <Box
                sx={{
                  px: 0.75,
                  py: 0.35,
                  fontSize: "0.70rem",
                  fontWeight: 700,
                  borderRadius: "10px",
                  background: experienceBadge.color,
                  color: "white",
                }}
              >
                {experienceBadge.label}
              </Box>

              {/* LOGO BADGE */}
              <Box
                sx={{
                  px: 1,
                  py: 0.3,
                  borderRadius: "10px",
                }}
              >
                <img
                  src="https://www.aplusacademy.pk/logo-nav.svg"
                  alt="Aplus"
                  style={{ height: 22 }}
                />
              </Box>
            </Box>

            <Avatar
              src={t.thumbnail}
              sx={{ width: 80, height: 80, borderRadius: "14px" }}
            />

            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  maxWidth: 180,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }}
              >
                {String(t.verified || "").toLowerCase() === "yes" && (
                  <CheckCircleIcon fontSize="small" color="success" />
                )}
                {t.name || "Unknown"}
              </Typography>

              <Typography
                sx={{ fontSize: "0.85rem", color: "#004aad", fontWeight: 700 }}
              >
                {t.qualification || ""}
              </Typography>

              {t.experience ? (
                <Typography sx={{ fontSize: "0.8rem", color: "#555" }}>
                  {t.experience} years experience
                </Typography>
              ) : null}

              <Typography sx={{ fontSize: "0.75rem", color: "green" }}>
                {t.city || "Online"}
              </Typography>
            </Box>
          </Box>

          {/* MIDDLE */}
          <Box sx={{ p: 2, flexGrow: 1 }}>
            <Typography sx={{ fontWeight: 700, mb: 0.5 }}>
              Subjects:
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {(showMoreSubjects ? subjects : subjects.slice(0, 2)).map(
                (sub, i) => (
                  <Chip
                    key={i}
                    label={sub}
                    size="small"
                    sx={{
                      background: "#e8f7ff",
                      color: "#004aad",
                      fontWeight: 600
                    }}
                  />
                )
              )}
            </Box>

            {subjects.length > 2 && (
              <Button
                size="small"
                onClick={toggleSubjects}
                sx={{
                  mt: 0.5,
                  textTransform: "none",
                  fontSize: "0.75rem"
                }}
              >
                {showMoreSubjects ? "See less" : "See more"}
              </Button>
            )}

            {/* BIO */}
            <Typography sx={{ fontWeight: 700, mt: 2 }}>
              Bio:
            </Typography>

            <Typography
              sx={{
                fontSize: "0.85rem",
                lineHeight: 1.5,
                display: "-webkit-box",
                WebkitLineClamp: showMoreBio ? "none" : 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                wordBreak: "break-word"
              }}
            >
              {showMoreBio
                ? t.bio || ""
                : bioWords.slice(0, 40).join(" ")}
            </Typography>

            {bioWords.length > 40 && (
              <Button
                size="small"
                onClick={toggleBio}
                sx={{
                  mt: 0.5,
                  textTransform: "none",
                  fontSize: "0.75rem"
                }}
              >
                {showMoreBio ? "See less" : "See more"}
              </Button>
            )}
          </Box>

          {/* ACTION BUTTONS */}
          <Box sx={{ display: "flex", gap: 1, p: 2 }}>
            <Button
              component={Link}
              to={`/teacher/${t.id}`}
              variant="contained"
              sx={{ flex: 1, background: "#004aad" }}
            >
              View Profile
            </Button>

            <Button
              component={Link}
              to={`/hire/${t.id}`}
              variant="contained"
              sx={{ flex: 1, background: "#29b554" }}
            >
              Hire Me
            </Button>
          </Box>
        </Card>
      </Box>
    </motion.div>
  );
}
