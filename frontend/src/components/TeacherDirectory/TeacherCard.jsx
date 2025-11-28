import { Box, Card, Typography, Avatar, Button, Chip } from "@mui/material";
import { Link } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { motion } from "framer-motion";

export default function TeacherCard({
  t,
  showMoreBio,
  toggleBio,
  showMoreSubjects,
  toggleSubjects
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      style={{ flex: 1 }}
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
          transition: "0.3s",
          "&:hover": { boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }
        }}
      >
        {/* Featured Badge */}
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

        {/* Header */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            p: 2,
            background: "rgba(0,74,173,0.15)",
            borderTopLeftRadius: "22px",
            borderTopRightRadius: "22px"
          }}
        >
          <Avatar
            src={t.thumbnail}
            sx={{ width: 70, height: 70, borderRadius: "14px" }}
          />

          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 0.5
              }}
            >
              {t.verified === "yes" && (
                <CheckCircleIcon fontSize="small" color="success" />
              )}
              {t.name}
            </Typography>

            <Typography sx={{ fontSize: "0.85rem", color: "#004aad", fontWeight: 700 }}>
              {t.qualification}
            </Typography>

            {t.experience && (
              <Typography sx={{ fontSize: "0.8rem", color: "#555" }}>
                {t.experience} years experience
              </Typography>
            )}

            <Typography sx={{ fontSize: "0.75rem", color: "green" }}>
              {t.city}
            </Typography>
          </Box>
        </Box>

        {/* Middle */}
        <Box sx={{ p: 2, flexGrow: 1 }}>
          <Typography sx={{ fontWeight: 700, mb: 0.5 }}>Subjects:</Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {(showMoreSubjects ? t.subjects : t.subjects.slice(0, 3)).map((sub, i) => (
              <Chip
                key={i}
                label={sub}
                size="small"
                sx={{
                  background: "#e3f2ff",
                  color: "#004aad",
                  fontWeight: 600
                }}
              />
            ))}
          </Box>

          {t.subjects.length > 3 && (
            <Button size="small" onClick={toggleSubjects} sx={{ textTransform: "none", mt: 0.5 }}>
              {showMoreSubjects ? "See less" : "See more"}
            </Button>
          )}

          {/* Bio */}
          <Typography sx={{ fontWeight: 700, mt: 2 }}>Bio:</Typography>

          <Typography
            sx={{
              fontSize: "0.85rem",
              display: "-webkit-box",
              WebkitLineClamp: showMoreBio ? "none" : 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden"
            }}
          >
            {showMoreBio ? t.bio : t.bio.split(" ").slice(0, 40).join(" ")}
          </Typography>

          {t.bio.split(" ").length > 40 && (
            <Button size="small" onClick={toggleBio} sx={{ textTransform: "none" }}>
              {showMoreBio ? "See less" : "See more"}
            </Button>
          )}
        </Box>

        {/* Price Section */}
        <Box
          sx={{
            background: "rgba(0,200,100,0.15)",
            textAlign: "center",
            py: 1,
            fontWeight: 700,
            color: "#1a7f37"
          }}
        >
          {t.price ? t.price : "2000/hr"}
        </Box>

        {/* Buttons */}
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
            sx={{ flex: 1, background: "#1fa83c" }}
          >
            Hire Me
          </Button>
        </Box>
      </Card>
    </motion.div>
  );
}
