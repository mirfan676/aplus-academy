import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

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

// Duplicate list for infinite scroll effect
const infiniteList = [...features, ...features];

const WhyChooseUs = () => {
  const scrollRef = useRef(null);

  // Auto-scroll effect
  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;

    let scrollAmount = 0;

    const autoScroll = () => {
      if (!slider) return;

      scrollAmount += 1; // speed
      slider.scrollLeft = scrollAmount;

      // Reset scroll to create infinite loop
      if (scrollAmount >= slider.scrollWidth / 2) {
        scrollAmount = 0;
        slider.scrollLeft = 0;
      }
    };

    const interval = setInterval(autoScroll, 20); // smooth slow scroll
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        py: 8,
        px: { xs: 2, md: 6 },
        position: "relative",
        background: "#e8f2ff",
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
          fontSize: {
            xs: "1.6rem",
            sm: "1.9rem",
            md: "2.1rem",
          },
        }}
      >
        Why Choose APlus Home Tutors?
      </Typography>

      {/* FADE SHADOW — LEFT */}
      <Box
        sx={{
          position: "absolute",
          top: 120,
          left: 0,
          width: 60,
          height: 180,
          background:
            "linear-gradient(to right, rgba(232,242,255,1), rgba(232,242,255,0))",
          zIndex: 5,
          display: { xs: "block", md: "none" },
        }}
      />

      {/* FADE SHADOW — RIGHT */}
      <Box
        sx={{
          position: "absolute",
          top: 120,
          right: 0,
          width: 60,
          height: 180,
          background:
            "linear-gradient(to left, rgba(232,242,255,1), rgba(232,242,255,0))",
          zIndex: 5,
          display: { xs: "block", md: "none" },
        }}
      />

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
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Box
              sx={{
                position: "relative",
                p: 4,
                borderRadius: "22px",
                minHeight: 240,
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
                  width: 378,
                  height: 189,
                  mb: 2,
                  borderRadius: 5,
                  filter: "drop-shadow(0px 4px 14px rgba(0,0,0,0.2))",
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

      {/* MOBILE AUTO-SCROLL SLIDER */}
      <Box
        ref={scrollRef}
        sx={{
          display: { xs: "flex", md: "none" },
          overflowX: "scroll",
          scrollBehavior: "smooth",
          gap: 3,
          px: 1,
          py: 2,
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {infiniteList.map((f, i) => (
          <Box
            key={i}
            sx={{
              minWidth: "260px",
              p: 4,
              borderRadius: "20px",
              flexShrink: 0,
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
                width: 55,
                height: 55,
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
  );
};

export default WhyChooseUs;
