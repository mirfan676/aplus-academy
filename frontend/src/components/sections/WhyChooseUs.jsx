import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

// ============ FEATURES ============
const features = [
  {
    icon: "/icons/experienced.jpg",
    title: "Top Experienced Tutors",
    desc: "Subject experts with years of teaching experience.",
  },
  {
    icon: "/icons/trusted.jpg",
    title: "Highly Trusted by Parents",
    desc: "Hundreds of parents rely on APlus for home tutoring.",
  },
  {
    icon: "/icons/success.jpg",
    title: "1000+ Successful Students",
    desc: "Proven results and improved academic performance.",
  },
];

const WhyChooseUs = () => {
  return (
    <Box
      sx={{
        py: 8,
        px: { xs: 2, md: 6 },
        background: "#e8f2ff",
        position: "relative",
      }}
    >
      {/* TITLE */}
      <Typography
        variant="h4"
        fontWeight={700}
        sx={{
          mb: 6,
          textAlign: "center",
          color: "#004aad",
          fontSize: { xs: "1.6rem", sm: "1.9rem", md: "2.1rem" },
        }}
      >
        Why Choose APlus Home Tutors?
      </Typography>

      {/* ================= DESKTOP GRID ================= */}
      <Box
        sx={{
          display: { xs: "none", md: "grid" },
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 4,
        }}
      >
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Box
              sx={{
                position: "relative",
                p: 4,
                borderRadius: "22px",
                minHeight: 260,
                background: "rgba(255,255,255,0.25)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 12px 28px rgba(0,0,0,0.15)",
                overflow: "hidden",

                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  padding: "2px",
                  borderRadius: "22px",
                  background:
                    "linear-gradient(120deg, #00a6ff, #00ff8f, #00a6ff)",
                  backgroundSize: "200% 200%",
                  animation: "gradientMove 4s linear infinite",
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                },

                "@keyframes gradientMove": {
                  "0%": { backgroundPosition: "0% 50%" },
                  "50%": { backgroundPosition: "100% 50%" },
                  "100%": { backgroundPosition: "0% 50%" },
                },
              }}
            >
              <Box
                component="img"
                src={f.icon}
                alt={f.title}
                sx={{
                  width: "100%",
                  height: 180,
                  objectFit: "cover",
                  borderRadius: 3,
                  mb: 2,
                }}
              />

              <Typography
                variant="h6"
                fontWeight={700}
                sx={{ color: "#004aad" }}
              >
                {f.title}
              </Typography>

              <Typography sx={{ mt: 1, color: "#333", fontSize: "0.95rem" }}>
                {f.desc}
              </Typography>
            </Box>
          </motion.div>
        ))}
      </Box>

      {/* ================= MOBILE CLEAN SCROLLER ================= */}
      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          overflowX: "auto",
          gap: 3,
          scrollBehavior: "smooth",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
          pb: 2,
        }}
      >
        {features.map((f, i) => (
          <Box
            key={i}
            sx={{
              minWidth: "85vw",
              borderRadius: "22px",
              position: "relative",
              background: "rgba(255,255,255,0.25)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 12px 28px rgba(0,0,0,0.15)",
              p: 3,
              overflow: "hidden",

              "&::before": {
                content: '""',
                position: "absolute",
                inset: 0,
                padding: "2px",
                borderRadius: "22px",
                background:
                  "linear-gradient(120deg, #00a6ff, #00ff8f, #00a6ff)",
                backgroundSize: "200% 200%",
                animation: "gradientMove 4s linear infinite",
                WebkitMask:
                  "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
              },
            }}
          >
            <Box
              component="img"
              src={f.icon}
              alt={f.title}
              sx={{
                width: "100%",
                height: 200,
                objectFit: "cover",
                borderRadius: 3,
                mb: 2,
              }}
            />

            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ color: "#004aad" }}
            >
              {f.title}
            </Typography>

            <Typography sx={{ mt: 1, color: "#333", fontSize: "0.9rem" }}>
              {f.desc}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* RIGHT FADE — SHOW THAT SLIDER CONTINUES */}
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          position: "absolute",
          right: 0,
          top: "30%",
          width: 50,
          height: "40%",
          pointerEvents: "none",
          background:
            "linear-gradient(to left, rgba(232,242,255,1), rgba(232,242,255,0))",
        }}
      />
    </Box>
  );
};

export default WhyChooseUs;
