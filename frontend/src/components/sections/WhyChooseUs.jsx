import { Box, Typography, Chip } from "@mui/material";
import { motion } from "framer-motion";

const features = [
  {
    image: "/icons/experienced.jpg",
    fit: "contain",
    badge: "Academic support",
    title: "Experienced tutors for real academic needs",
    desc:
      "Students need clear concept teaching, steady revision, and subject guidance that actually matches their class level, board, and exam pressure.",
  },
  {
    image: "/icons/trusted.jpg",
    fit: "contain",
    badge: "Parent confidence",
    title: "Trusted support for parents and families",
    desc:
      "Parents look for punctual classes, reliable communication, and safe tutor matching. The process should feel organized, not uncertain.",
  },
  {
    image: "/icons/success.jpg",
    fit: "contain",
    badge: "Long-term growth",
    title: "Support beyond one subject or one exam",
    desc:
      "Many families need help across school years, entry tests, language learning, and future planning. Strong tutoring should support that wider journey.",
  },
];

const WhyChooseUs = () => {
  return (
    <Box
      sx={{
        py: 8,
        px: { xs: 2, md: 6 },
        background: "#e7ebef",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", lg: "flex-end" },
          gap: 2.5,
          pb: { xs: 3, md: 4 },
          mb: 4,
          borderBottom: "1px solid rgba(16,32,25,0.1)",
        }}
      >
        <Box sx={{ maxWidth: 820 }}>
          <Typography sx={{ color: "#0f766e", fontWeight: 900, mb: 1 }}>
            Academic direction
          </Typography>
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{
              color: "#102019",
              fontSize: { xs: "1.7rem", md: "3rem" },
              lineHeight: 1.05,
            }}
          >
            Why families choose A Plus Academy
          </Typography>
        </Box>

        <Typography
          sx={{
            maxWidth: 530,
            color: "#475569",
            lineHeight: 1.8,
            fontSize: { xs: "0.95rem", md: "1rem" },
          }}
        >
          A tutoring platform should help with tutor discovery, class-level guidance, exam preparation, and future
          study direction. The aim is to make academic decisions easier for parents and more effective for students.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, minmax(0, 1fr))",
            xl: "repeat(3, minmax(0, 1fr))",
          },
          gap: 3,
          gridAutoRows: "1fr",
          alignItems: "stretch",
        }}
      >
        {features.map((feature) => (
          <Box key={feature.title} sx={{ display: "flex" }}>
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
                    minHeight: 240,
                    background:
                      "linear-gradient(180deg, rgba(244,249,255,1) 0%, rgba(233,244,255,1) 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 2.5,
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
                      height: 210,
                      objectFit: feature.fit,
                      objectPosition: "center",
                      display: "block",
                      borderRadius: "16px",
                      background: "#fff",
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
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default WhyChooseUs;
