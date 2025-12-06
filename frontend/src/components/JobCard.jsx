// JobCard.jsx (Optimized, Same UI)
import { Box, Card, Typography, Button, Chip } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { motion } from "framer-motion";
import { useMemo } from "react";

export default function JobCard({ job }) {
  const final = useMemo(() => ({
    title: job.Title || job.title || "Home Tutor Required",
    grade: job.Grade || job.grade || job.Class || "",
    school: job.School || job.school || "",
    students: job.Students || job.students || "",
    subjects: job.Subjects || job.subjects || job.Subject || "",
    timing: job.Timing || job.timing || job.Time || "",
    fee: Number(job.Fee || job.fee || job.Fees || 0),
    location: job.Location || job.location || "",
    city: job.City || job.city || "",
    gender: job.Gender || job.gender || "",
    contact: job.Contact || job.contact || job.Phone || "",
    status: (job.Status || job.status || "").toLowerCase(),
    whatsapp_message:
      job.WhatsappMessage ||
      job.whatsapp_message ||
      `Hi, I want to apply for ${job.Title || job.title || "this job"}.`,
  }), [job]);

  const isClosed = final.status === "closed" || final.status === "inactive";

  // safe phone extract
  const phone = useMemo(
    () => (final.contact || "").replace(/\D/g, ""),
    [final.contact]
  );

  const waUrl = useMemo(() => {
    if (!phone) return null;
    return `https://wa.me/${phone}?text=${encodeURIComponent(final.whatsapp_message)}`;
  }, [phone, final.whatsapp_message]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.40 }}
      style={{ width: "100%" }}
    >
      <Box
        sx={{
          p: 0.75,
          borderRadius: "18px",
          transition: "all .2s ease",
          "&:hover": { transform: "translateY(-2px)" }
        }}
      >
        <Card
          sx={{
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 8px 30px rgba(5,30,80,0.06)"
          }}
        >
          {/* TOP BAR */}
          <Box
            sx={{
              background: "linear-gradient(90deg,#004aad,#1976d2)",
              color: "white",
              px: 3,
              py: 2
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {final.title}
            </Typography>

            <Box sx={{ display: "flex", gap: 1, mt: 1, alignItems: "center" }}>
              <Chip
                label={final.grade || "Grade N/A"}
                size="small"
                sx={{
                  background: "rgba(255,255,255,0.12)",
                  color: "#fff",
                  fontWeight: 700
                }}
              />

              <Chip
                label={final.city || final.location || "Location N/A"}
                size="small"
                sx={{
                  background: "rgba(255,255,255,0.12)",
                  color: "#fff",
                  fontWeight: 700
                }}
              />

              <Chip
                label={final.gender || "Any"}
                size="small"
                sx={{
                  background: "rgba(255,255,255,0.12)",
                  color: "#fff",
                  fontWeight: 700
                }}
              />

              <Box sx={{ flex: 1 }} />

              <Box sx={{ display: "flex", gap: 1 }}>
                <Box
                  sx={{
                    px: 1.1,
                    py: 0.5,
                    bgcolor: isClosed ? "#b71c1c" : "#1faa00",
                    borderRadius: "8px",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "0.85rem"
                  }}
                >
                  {isClosed ? "Closed" : "Active"}
                </Box>
              </Box>
            </Box>
          </Box>

          {/* BODY */}
          <Box sx={{ p: 3 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 160px",
                gap: 2
              }}
            >
              {/* LEFT SIDE */}
              <Box>
                {final.school && (
                  <Typography sx={{ mb: 1 }}>
                    <b>School:</b> {final.school}
                  </Typography>
                )}

                <Typography sx={{ mb: 1 }}>
                  <b>Students:</b> {final.students || "—"}
                </Typography>

                <Typography sx={{ mb: 2 }}>
                  <b>Subjects:</b> {final.subjects || "All"}
                </Typography>

                <Typography
                  sx={{
                    mb: 1,
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                    color: "#555"
                  }}
                >
                  <CalendarTodayIcon fontSize="small" />
                  {final.timing || "Timing not specified"}
                </Typography>

                <Typography
                  sx={{
                    mb: 1,
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                    color: "#555"
                  }}
                >
                  <LocationOnIcon fontSize="small" />
                  {final.location || final.city || "Location not specified"}
                </Typography>
              </Box>

              {/* RIGHT SIDE */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  alignItems: "flex-end"
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <MonetizationOnIcon />
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      {final.fee ? final.fee.toLocaleString() : "Negotiable"}
                    </Typography>
                  </Box>
                  <Typography sx={{ color: "#777", fontSize: "0.85rem" }}>
                    Fee
                  </Typography>
                </Box>

                <Box sx={{ mt: 2, width: "100%" }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<WhatsAppIcon />}
                    href={waUrl || undefined}
                    target="_blank"
                    disabled={isClosed || !waUrl}
                    sx={{
                      background: isClosed ? "#b71c1c" : "#25D366",
                      color: "#fff",
                      fontWeight: 800
                    }}
                  >
                    {isClosed ? "Position Closed" : "Apply on WhatsApp"}
                  </Button>

                  <Typography
                    sx={{
                      mt: 1,
                      color: "#666",
                      fontSize: "0.85rem",
                      textAlign: "center"
                    }}
                  >
                    {final.contact ? `Contact: ${final.contact}` : "Contact not listed"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Card>
      </Box>
    </motion.div>
  );
}
