// JobCard.jsx
import { Card, Box, Typography, Chip, Stack } from "@mui/material";
import { motion } from "framer-motion";

export default function JobCard({ job }) {
  const jobFee = Number(job.Fee || job.fee || job.Fees || 0) || 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      style={{ width: "100%" }}
    >
      <Card
        sx={{
          p: { xs: 2, sm: 3 }, // padding responsive
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {/* Job Info */}
        <Box sx={{ mb: 1 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "#004aad" }}
            noWrap
          >
            {job.Title || job.title || "Untitled Job"}
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: "#333", mt: 0.5 }}
            noWrap
          >
            {job.Subject || job.Subjects || job.subject || "N/A"}
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: "#555", mt: 0.5 }}
          >
            {job.City || job.city || "Unknown City"} | Grade: {job.Grade || job.grade || job.Class || "N/A"}
          </Typography>
        </Box>

        {/* Fee & Badges */}
        <Box
          sx={{
            mt: 2,
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            alignItems: "center",
          }}
        >
          <Chip
            label={`Fee: ${jobFee.toLocaleString()}`}
            size="small"
            color="primary"
            variant="outlined"
          />
          {job.Gender && (
            <Chip
              label={`Gender: ${job.Gender}`}
              size="small"
              color="secondary"
              variant="outlined"
            />
          )}
        </Box>

        {/* Additional Info */}
        {job.Bio && (
          <Typography
            variant="body2"
            sx={{ mt: 1, color: "#666" }}
            noWrap
          >
            {job.Bio}
          </Typography>
        )}
      </Card>
    </motion.div>
  );
}
