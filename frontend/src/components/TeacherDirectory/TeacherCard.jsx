import { Box, Card, Typography, Avatar, Button } from "@mui/material";
import { Link } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { motion } from "framer-motion";

export default function TeacherCard({ t, showMoreBio, toggleBio, showMoreSubjects, toggleSubjects }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      style={{ flex: 1 }}
    >
      <Card sx={{ borderRadius: "22px", display: "flex", flexDirection: "column", minHeight: 400 }}>
        
        {/* Badge */}
        <Box sx={{ position: "absolute", top: 10, right: 10, px: 2, py: 0.5, background: "#00a6ff", borderRadius: "16px", color: "white" }}>
          Featured
        </Box>

        {/* Header */}
        <Box sx={{ display: "flex", p: 2, background: "rgba(0,80,200,0.25)", gap: 2, borderTopLeftRadius: 22, borderTopRightRadius: 22 }}>
          <Avatar src={t.thumbnail} sx={{ width: 70, height: 70, borderRadius: "14px" }} />
          <Box>
            <Typography sx={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 0.5 }}>
              {t.verified === "yes" && <CheckCircleIcon fontSize="small" color="success" />}
              {t.name}
            </Typography>
            <Typography sx={{ fontSize: "0.85rem", color: "#004aad", fontWeight: 700 }}>{t.qualification}</Typography>
            <Typography sx={{ fontSize: "0.8rem", color: "gold" }}>★★★★★</Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "green" }}>{t.city}</Typography>
          </Box>
        </Box>

        {/* Middle */}
        <Box sx={{ p: 2, flexGrow: 1 }}>
          
          <Typography sx={{ fontWeight: 700 }}>Subjects:</Typography>
          {(showMoreSubjects ? t.subjects : t.subjects.slice(0, 2)).map((sub, i) => (
            <Typography key={i}>{sub}</Typography>
          ))}
          {t.subjects.length > 2 && (
            <Button onClick={toggleSubjects} size="small" sx={{ textTransform: "none" }}>
              {showMoreSubjects ? "See less" : "See more"}
            </Button>
          )}

          <Typography sx={{ fontWeight: 700, mt: 2 }}>Bio:</Typography>
          <Typography sx={{
            display: "-webkit-box",
            WebkitLineClamp: showMoreBio ? "none" : 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}>
            {showMoreBio ? t.bio : t.bio.split(" ").slice(0, 40).join(" ")}
          </Typography>

          {t.bio.split(" ").length > 40 && (
            <Button onClick={toggleBio} size="small" sx={{ textTransform: "none" }}>
              {showMoreBio ? "See less" : "See more"}
            </Button>
          )}

        </Box>

        {/* Footer */}
        <Box sx={{ background: "rgba(0,200,100,0.25)", textAlign: "center", py: 1, fontWeight: 700 }}>
          1500/hr
        </Box>

        <Box sx={{ display: "flex", gap: 1, p: 2 }}>
          <Button component={Link} to={`/teacher/${t.id}`} variant="contained" sx={{ flex: 1 }}>
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
