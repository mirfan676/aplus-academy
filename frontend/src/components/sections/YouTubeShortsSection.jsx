import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import YouTubeIcon from "@mui/icons-material/YouTube";
import CloseIcon from "@mui/icons-material/Close";

const channelUrl = "https://www.youtube.com/@aplushometutors";

const videos = [
  { id: "QFFsIR_cEgk", label: "Featured" },
  { id: "aERn7AmGfEA", label: "Parents" },
  { id: "lqfyME8ugE8", label: "Learning" },
  { id: "3gjWUAAnkbQ", label: "Visual" },
  { id: "aQoRnH-8YEg", label: "Quick Tip" },
  { id: "ZwO4YL4YYHw", label: "Study" },
  { id: "O-dgGz4rWu4", label: "Latest" },
];

const thumbnailUrl = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
const embedUrl = (id) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1&modestbranding=1&controls=1`;

export default function YouTubeShortsSection() {
  const railRef = useRef(null);
  const [activeVideo, setActiveVideo] = useState(null);

  const move = (direction) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * 320, behavior: "smooth" });
  };

  return (
    <>
      <Box sx={{ py: 8, px: { xs: 2, md: 6 }, backgroundColor: "#f7fbff" }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "flex-end" }}
            >
              <Box sx={{ maxWidth: 760 }}>
                <Chip
                  icon={<YouTubeIcon />}
                  label="A Plus Home Tutors on YouTube"
                  sx={{ mb: 1.4, borderRadius: 1, fontWeight: 900, bgcolor: "#fff" }}
                />
                <Typography
                  variant="h4"
                  fontWeight={800}
                  sx={{ color: "#004aad", fontSize: { xs: "1.55rem", md: "2.05rem" } }}
                >
                  Watch our latest videos
                </Typography>
                <Typography sx={{ mt: 1.1, color: "#445", lineHeight: 1.8 }}>
                  Explore quick learning clips, family-focused guidance, and visual teaching moments from A Plus Home Tutors.
                </Typography>
              </Box>

              <Stack direction="row" spacing={1.2}>
                <Button
                  component="a"
                  href={channelUrl}
                  target="_blank"
                  rel="noreferrer"
                  variant="contained"
                  startIcon={<YouTubeIcon />}
                  sx={{ textTransform: "none", fontWeight: 900, borderRadius: 1, bgcolor: "#ff0000", "&:hover": { bgcolor: "#d90000" } }}
                >
                  Visit YouTube
                </Button>
                <IconButton onClick={() => move(-1)} sx={{ border: "1px solid #cfe2ee", background: "#fff" }}>
                  <ChevronLeftIcon />
                </IconButton>
                <IconButton onClick={() => move(1)} sx={{ border: "1px solid #cfe2ee", background: "#fff" }}>
                  <ChevronRightIcon />
                </IconButton>
              </Stack>
            </Stack>

            <Box
              ref={railRef}
              sx={{
                display: "flex",
                gap: 2,
                overflowX: "auto",
                scrollSnapType: "x mandatory",
                pb: 1,
                scrollbarWidth: "thin",
                "& > *": { scrollSnapAlign: "start" },
              }}
            >
              {videos.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    minWidth: { xs: "82%", sm: 290, md: 300 },
                    maxWidth: 300,
                    borderRadius: "18px",
                    background: "#fff",
                    border: "1px solid #dce8f1",
                    boxShadow: "0 12px 24px rgba(16,32,25,0.08)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                  }}
                >
                  <Box
                    onClick={activeVideo === item.id ? undefined : () => setActiveVideo(item.id)}
                    sx={{
                      position: "relative",
                      aspectRatio: "9 / 16",
                      background: "#0f172a",
                      overflow: "hidden",
                      cursor: activeVideo === item.id ? "default" : "pointer",
                    }}
                  >
                    {activeVideo === item.id ? (
                      <>
                        <IconButton
                          onClick={() => setActiveVideo(null)}
                          sx={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            zIndex: 2,
                            color: "#fff",
                            bgcolor: "rgba(0,0,0,0.45)",
                            "&:hover": { bgcolor: "rgba(0,0,0,0.62)" },
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                        <Box
                          component="iframe"
                          title="A Plus Home Tutors video"
                          src={embedUrl(item.id)}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          sx={{
                            width: "100%",
                            height: "100%",
                            border: 0,
                            display: "block",
                            bgcolor: "#000",
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <Box
                          component="img"
                          src={thumbnailUrl(item.id)}
                          alt="A Plus Home Tutors video"
                          sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            inset: 0,
                            background: "linear-gradient(180deg, rgba(0,0,0,0.04), rgba(0,0,0,0.52))",
                            p: 2,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                        >
                          <Chip
                            label={item.label}
                            size="small"
                            sx={{
                              alignSelf: "flex-start",
                              borderRadius: 1,
                              bgcolor: "rgba(255,255,255,0.9)",
                              fontWeight: 800,
                            }}
                          />
                          <Box
                            sx={{
                              alignSelf: "center",
                              width: 74,
                              height: 74,
                              borderRadius: "50%",
                              bgcolor: "rgba(255,255,255,0.2)",
                              backdropFilter: "blur(10px)",
                              border: "1px solid rgba(255,255,255,0.35)",
                              display: "grid",
                              placeItems: "center",
                            }}
                          >
                            <PlayCircleFilledWhiteIcon sx={{ fontSize: 42, color: "#fff" }} />
                          </Box>
                          <Typography sx={{ color: "rgba(255,255,255,0.9)", fontWeight: 800, fontSize: 13 }}>
                            Tap to watch
                          </Typography>
                        </Box>
                      </>
                    )}
                  </Box>

                  <Box sx={{ p: 1.4 }}>
                    <Typography sx={{ color: "#102019", fontWeight: 800, fontSize: 14 }}>
                      A Plus Home Tutors
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Stack>
        </Container>
      </Box>
    </>
  );
}
