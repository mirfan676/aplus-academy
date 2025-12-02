import { Box, Card, Typography, Button } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { motion } from "framer-motion";

export default function JobCard({ job }) {
  const {
    Title,
    title,
    Grade,
    grade,
    School,
    school,
    Students,
    students,
    Subjects,
    subjects,
    Timing,
    timing,
    Fee,
    fee,
    Location,
    location,
    City,
    city,
    Gender,
    gender,
    Contact,
    contact,
    Status,
    status,
    WhatsappMessage,
    whatsapp_message
  } = job;

  const finalTitle = Title || title || "Home Tutor Required";
  const finalSubjects = Subjects || subjects || "";
  const finalStatus = (Status || status || "").toLowerCase();

  const number = (Contact || contact || "").replace(/\D/g, "");
  const message = encodeURIComponent(WhatsappMessage || whatsapp_message || finalTitle);
  const whatsappURL = `https://wa.me/${number}?text=${message}`;

  const isClosed = finalStatus === "closed";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      style={{ width: "100%" }}
    >
      {/* Hover Gradient Wrapper */}
      <Box
        sx={{
          p: 0.6,
          borderRadius: "20px",
          transition: "all 0.3s ease",
          background: "transparent",
          "&:hover": {
            background: "linear-gradient(45deg, #1976d2, #00e676)"
          }
        }}
      >
        <Card
          sx={{
            borderRadius: "20px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
            position: "relative",
            opacity: isClosed ? 0.55 : 1,
            minHeight: 260
          }}
        >
          {/* HEADER */}
          <Box
            sx={{
              p: 2,
              background: "rgba(0,80,200,0.12)",
              borderTopLeftRadius: "20px",
              borderTopRightRadius: "20px",
              position: "relative",
              minHeight: 70
            }}
          >
            {/* Right badges */}
            <Box
              sx={{
                position: "absolute",
                bottom: 6,
                right: 6,
                display: "flex",
                gap: 1,
                zIndex: 2
              }}
            >
              {/* Status Badge */}
              <Box
                sx={{
                  px: 0.9,
                  py: 0.4,
                  fontSize: "0.70rem",
                  fontWeight: 700,
                  borderRadius: "10px",
                  background: isClosed ? "#d32f2f" : "#2e7d32",
                  color: "white",
                  textTransform: "uppercase"
                }}
              >
                {isClosed ? "Closed" : "Active"}
              </Box>

              {/* Logo Badge */}
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

            <Typography sx={{ fontSize: "1.1rem", fontWeight: 700 }}>
              {finalTitle}
            </Typography>
          </Box>

          {/* MAIN CONTENT */}
          <Box sx={{ p: 2, flexGrow: 1 }}>
            <Typography><b>Grade:</b> {Grade || grade}</Typography>
            <Typography><b>School:</b> {School || school}</Typography>
            <Typography><b>Students:</b> {Students || students}</Typography>
            <Typography><b>Subjects:</b> {finalSubjects}</Typography>
            <Typography><b>Timing:</b> {Timing || timing}</Typography>
            <Typography><b>Fee:</b> {Fee || fee}</Typography>
            <Typography><b>Location:</b> {Location || location}</Typography>
            <Typography><b>City:</b> {City || city}</Typography>
            <Typography><b>Gender:</b> {Gender || gender}</Typography>
            <Typography><b>Contact:</b> {Contact || contact}</Typography>
          </Box>

          {/* ACTION BUTTON */}
          <Box sx={{ p: 2 }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<WhatsAppIcon />}
              href={whatsappURL}
              target="_blank"
              disabled={isClosed}
              sx={{
                py: 1.2,
                background: isClosed ? "#b71c1c" : "#1faa00",
                fontWeight: 700,
                fontSize: "0.90rem"
              }}
            >
              {isClosed ? "Position Closed" : "Apply on WhatsApp"}
            </Button>
          </Box>
        </Card>
      </Box>
    </motion.div>
  );
}
