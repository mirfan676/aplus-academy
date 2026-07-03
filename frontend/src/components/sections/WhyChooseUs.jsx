import { Box, Typography, Grid, Chip } from "@mui/material";
import { motion } from "framer-motion";

const features = [
  {
    image: "/icons/experienced.jpg",
    fit: "cover",
    badge: "Academic support",
    title: "Experienced tutors for real academic needs",
    desc:
      "Students need clear concept teaching, steady revision, and subject guidance that actually matches their class level, board, and exam pressure.",
  },
  {
    image: "/icons/trusted.jpg",
    fit: "cover",
    badge: "Parent confidence",
    title: "Trusted support for parents and families",
    desc:
      "Parents look for punctual classes, reliable communication, and safe tutor matching. The process should feel organized, not uncertain.",
  },
  {
    image: "/icons/success.jpg",
    fit: "cover",
    badge: "Long-term growth",
    title: "Support beyond one subject or one exam",
    desc:
      "Many families need help across school years, entry tests, language learning, and future planning. Strong tutoring should support that wider journey.",
  },
  {
    image: "/icons/verified.svg",
    fit: "contain",
    badge: "Modern learning",
    title: "Modern learning guidance for this era",
    desc:
      "Students now benefit from better planning, digital study habits, and practical learning systems alongside tutor hiring and subject selection.",
  },
];

const WhyChooseUs = () => {
  return (
    <Box
      sx={{
        py: 8,
        px: { xs: 2, md: 6 },
        background: "#e8f2ff",
      }}
    >
      <Typography
        variant="h4"
        fontWeight={700}
        sx={{
          mb: 1.5,
          textAlign: "center",
          color: "#004aad",
          fontSize: { xs: "1.6rem", sm: "1.9rem", md: "2.1rem" },
        }}
      >
        Why Families Choose A Plus Academy
      </Typography>

      <Typography
        sx={{
          maxWidth: 920,
          mx: "auto",
          mb: 5,
          textAlign: "center",
          color: "#445",
          lineHeight: 1.8,
          fontSize: { xs: "0.95rem", md: "1rem" },
        }}
      >
        A tutoring platform should help with tutor discovery, class-level guidance, exam preparation, and future study
        direction. The aim is to make academic decisions easier for parents and more effective for students.
      </Typography>

      <Grid container spacing={3}>
        {features.map((feature) => (
          <Grid item xs={12} sm={6} md={3} key={feature.title} sx={{ display: "flex" }}>
            <motion.div
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              style={{ width: "100%", height: "100%" }}
            >
              <Box
                sx={{
                  borderRadius: "18px",
                  overflow: "hidden",
                  bgcolor: "#fff",
                  border: "1px solid #dce8f1",
                  boxShadow: "0 12px 24px rgba(16,32,25,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    minHeight: 220,
                    background:
                      "linear-gradient(180deg, rgba(244,249,255,1) 0%, rgba(233,244,255,1) 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 2,
                  }}
                >
                  <Chip
                    label={feature.badge}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 16,
                      left: 16,
                      borderRadius: 1,
                      bgcolor: "rgba(255,255,255,0.92)",
                      color: "#0f172a",
                      fontWeight: 800,
                    }}
                  />
                  <Box
                    component="img"
                    src={feature.image}
                    alt={feature.title}
                    sx={{
                      width: "100%",
                      height: 180,
                      objectFit: feature.fit,
                      objectPosition: "center",
                      display: "block",
                      borderRadius: feature.fit === "cover" ? "16px" : 0,
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    p: 3,
                    borderRadius: "18px",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                  }}
                >
                  <Typography variant="h6" fontWeight={800} sx={{ color: "#102019", lineHeight: 1.35 }}>
                    {feature.title}
                  </Typography>

                  <Typography sx={{ mt: 1.2, color: "#475569", fontSize: "0.95rem", lineHeight: 1.85 }}>
                    {feature.desc}
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default WhyChooseUs;
