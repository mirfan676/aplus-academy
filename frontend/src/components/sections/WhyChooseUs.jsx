import { Box, Typography } from "@mui/material";
import { useRef } from "react";
import { motion } from "framer-motion";

// FEATURES
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
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

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

      {/* DESKTOP GRID */}
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
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
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

                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  padding: "2px",
                  borderRadius: "22px",
                  background:
                    "linear-gradient(120deg,#00a6ff,#00ff8f,#00a6ff)",
                  backgroundSize: "200% 200%",
                  animation: "gradientMove 4s linear infinite",
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0)",
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
                  aspectRatio: "16/9",
                  borderRadius: "12px",
                  objectFit: "cover",
                  mb: 2,
                }}
              />

              <Typography variant="h6" fontWeight={700} sx={{ color: "#004aad" }}>
                {f.title}
              </Typography>

              <Typography sx={{ mt: 1, color: "#333", fontSize: "0.95rem" }}>
                {f.desc}
              </Typography>
            </Box>
          </motion.div>
        ))}
      </Box>

      {/* MOBILE SLIDER */}
      <Box
        sx={{
          position: "relative",
          display: { xs: "block", md: "none" },
        }}
      >
        {/* LEFT ARROW */}
        <Box
          onClick={scrollLeft}
          sx={{
            position: "absolute",
            top: "45%",
            left: -5,
            zIndex: 20,
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.3)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <Typography fontSize={"1.8rem"} color="#004aad">
            ←
          </Typography>
        </Box>

        {/* RIGHT ARROW */}
        <Box
          onClick={scrollRight}
          sx={{
            position: "absolute",
            top: "45%",
            right: -5,
            zIndex: 20,
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.3)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <Typography fontSize={"1.8rem"} color="#004aad">
            →
          </Typography>
        </Box>

        {/* MOBILE SCROLL WRAPPER */}
        <Box
          ref={scrollRef}
          sx={{
            overflowX: "scroll",
            display: "flex",
            gap: 3,
            px: 1,
            py: 2,
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {features.map((f, i) => (
            <Box
              key={i}
              sx={{
                position: "relative",
                minWidth: "78%", // shows next card shadow
                p: 3,
                borderRadius: "20px",
                background: "rgba(255,255,255,0.25)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
              }}
            >
              {/* MOBILE IMAGE FIX */}
              <Box
                component="img"
                src={f.icon}
                alt={f.title}
                sx={{
                  width: "100%",
                  aspectRatio: "16/9",
                  borderRadius: "12px",
                  objectFit: "cover",
                  mb: 2,
                }}
              />

              <Typography variant="h6" fontWeight={700} sx={{ color: "#004aad" }}>
                {f.title}
              </Typography>

              <Typography sx={{ mt: 1, color: "#333", fontSize: "0.9rem" }}>
                {f.desc}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default WhyChooseUs;
