import React, { useRef } from "react";
import { Box, Button, Container, Grid, IconButton, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SchoolIcon from "@mui/icons-material/School";
import StarIcon from "@mui/icons-material/Star";
import TimelineIcon from "@mui/icons-material/Timeline";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import HeroSection from "./HeroSection";
import AdvantagesSection from "./AdvantagesSection";
import StepsSection from "./StepsSection";
import WhyChooseUs from "./WhyChooseUs";
import AreasWeCover from "./AreasWeCover";
import LanguageCoursesShowcase from "./LanguageCoursesShowcase";
import YouTubeShortsSection from "./YouTubeShortsSection";
import FAQSection from "./FAQSection";
import FooterCTA from "./FooterCTA";
import LatestNewsSection from "../blog/LatestNewsSection";

const guidanceCards = [
  {
    icon: <SchoolIcon sx={{ fontSize: 34 }} />,
    title: "Class-wise guidance for every stage",
    body:
      "Support students from early years, primary, middle, matric, O Level, and A Level with clearer syllabus planning, concept-building, and exam preparation.",
    href: "/teachers",
  },
  {
    icon: <TimelineIcon sx={{ fontSize: 34 }} />,
    title: "Career roadmaps after matric to graduation",
    body:
      "Guide students after matric, FSC, ICS, ICom, BS, BBA, BCom, and graduation with practical academic and career pathways that fit Pakistani families.",
    href: "/career-roadmap",
  },
  {
    icon: <AutoAwesomeIcon sx={{ fontSize: 34 }} />,
    title: "Improve English and PTE practice",
    body:
      "Use guided English improvement, academic writing practice, and free PTE tasks so students can build stronger language confidence with practical preparation.",
    href: "/pte",
  },
];

const textColumns = [
  {
    title: "How to find the best tutor for your child",
    lines: [
      "Start with the class level, subject weaknesses, school board, and preferred timing.",
      "Choose between home tuition, online classes, female tutor preference, or subject specialist support.",
      "Use the first classes to check concept clarity, punctuality, confidence building, and progress tracking.",
    ],
    href: "/teachers",
  },
  {
    title: "Career guidance and trusted teacher selection",
    lines: [
      "Compare academic direction with the type of teacher a student actually needs at each stage.",
      "Look for subject command, professional conduct, and regular communication with parents or learners.",
      "Choose teachers who can combine concept clarity with revision planning, digital tools, and focused feedback.",
    ],
    href: "/career-roadmap",
  },
  {
    title: "Improving English and exam readiness",
    lines: [
      "Break English improvement into vocabulary, grammar, writing structure, and regular timed practice.",
      "Use guided online sessions, short writing tasks, and speaking routines to improve confidence steadily.",
      "For PTE and related exam preparation, practise with structured scoring instead of only passive reading.",
    ],
    href: "/pte",
  },
];

const learningBands = [
  {
    title: "Guidance for school stages",
    text:
      "Parents often need different support at different stages. Early years and primary classes need reading habits, handwriting confidence, numeracy basics, and routine. Middle classes need concept-building, better homework structure, and subject confidence. Matric, O Level, and A Level students need syllabus planning, past paper strategy, revision control, and exam temperament.",
  },
  {
    title: "Career roadmap support",
    text:
      "Students after matric, FSC, ICS, ICom, BSc, BCom, BBA, BS, and graduation often ask what comes next. A good roadmap should compare degree choices, skill-based paths, scholarships, language tests, digital careers, and options where international study or migration planning may require PTE preparation.",
  },
  {
    title: "How teachers can modernize learning",
    text:
      "Teachers now need more than lecture delivery. They need structured feedback, digital research habits, revision systems, real-world examples, and confidence with AI-assisted study methods. Strong tutors can help students work better with technology instead of becoming passive users of it.",
  },
  {
    title: "How parents can prepare children better",
    text:
      "A brighter future is built through consistent study habits, healthy routines, controlled screen time, exam awareness, better communication, and subject-specific support before problems become large. Good tutoring works best when it strengthens discipline, not just short-term marks.",
  },
];

const parentReviews = [
  {
    name: "Parent in Lahore",
    role: "O Level family support",
    quote:
      "We needed a tutor who could actually explain concepts, not just finish homework. The matching process felt much clearer than random social media searching.",
  },
  {
    name: "Student in Karachi",
    role: "Online tuition support",
    quote:
      "The useful part was not only finding a tutor. We also got clearer direction about boards, timing, and weak-topic planning before starting classes.",
  },
  {
    name: "Mother in Islamabad",
    role: "Matric exam planning",
    quote:
      "The academic guidance sections helped us understand what to expect from a tutor, how to prepare for exams, and how to measure progress after trial classes.",
  },
  {
    name: "Parent in Rawalpindi",
    role: "Primary classes",
    quote:
      "For younger children, routine and communication matter as much as subject knowledge. That is the kind of support I wanted before choosing regular classes.",
  },
];

const tutorReviews = [
  {
    title: "Support that goes beyond one trial class",
    body:
      "Families usually want steady communication, clear subject support, and a tutor who can continue improving student confidence after the first few classes.",
  },
  {
    title: "Academic guidance for real family decisions",
    body:
      "Parents often compare subjects, exam boards, schedules, and tutor quality before making a choice. Good guidance helps them decide with more clarity.",
  },
  {
    title: "Stronger direction for students",
    body:
      "Students benefit most when tutoring is connected with revision planning, exam preparation, English improvement, and future academic goals.",
  },
  {
    title: "Better preparation for exams and future goals",
    body:
      "The right academic support can help children prepare for school exams, board classes, university pathways, and language-based opportunities ahead.",
  },
];

const glassCardSx = {
  position: "relative",
  borderRadius: "22px",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    padding: "2px",
    borderRadius: "22px",
    background: "linear-gradient(120deg, #00a6ff, #00ff8f, #00a6ff)",
    backgroundSize: "200% 200%",
    animation: "gradientMove 4s linear infinite",
    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    WebkitMaskComposite: "xor",
    maskComposite: "exclude",
    zIndex: 1,
  },
  "@keyframes gradientMove": {
    "0%": { backgroundPosition: "0% 50%" },
    "50%": { backgroundPosition: "100% 50%" },
    "100%": { backgroundPosition: "0% 50%" },
  },
};

function SliderSection({ title, body, items, renderCard }) {
  const railRef = useRef(null);

  const move = (direction) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * 320, behavior: "smooth" });
  };

  return (
    <Box sx={{ py: 8, px: { xs: 2, md: 6 }, backgroundColor: "#f8fbfd" }}>
      <Container maxWidth="lg">
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "flex-end" }} sx={{ mb: 4 }}>
          <Box sx={{ maxWidth: 820 }}>
            <Typography
              variant="h4"
              fontWeight={700}
              sx={{ color: "#004aad", mb: 1.2, fontSize: { xs: "1.55rem", md: "2.1rem" } }}
            >
              {title}
            </Typography>
            <Typography sx={{ color: "#445", lineHeight: 1.8 }}>{body}</Typography>
          </Box>
          <Stack direction="row" spacing={1}>
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
            gap: 2.2,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            pb: 1,
            scrollbarWidth: "thin",
            "& > *": { scrollSnapAlign: "start" },
          }}
        >
          {items.map(renderCard)}
        </Box>
      </Container>
    </Box>
  );
}

export default function RestoredHomeExperience() {
  return (
    <>
      <HeroSection />
      <AdvantagesSection />
      <StepsSection />
      <WhyChooseUs />
      <LanguageCoursesShowcase />
      <YouTubeShortsSection />
      <AreasWeCover />

      <Box sx={{ py: 8, px: { xs: 2, md: 6 }, backgroundColor: "#f0f4f8" }}>
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{
            mb: 2,
            textAlign: "center",
            color: "#004aad",
            fontSize: { xs: "1.6rem", md: "2.2rem" },
          }}
        >
          Better guidance, not just more tutoring
        </Typography>
        <Typography
          sx={{
            maxWidth: 860,
            mx: "auto",
            mb: 6,
            textAlign: "center",
            color: "#445",
            lineHeight: 1.8,
            fontSize: { xs: "0.96rem", md: "1.02rem" },
          }}
        >
          A Plus Academy helps parents, students, and teachers with tutoring choices, syllabus direction, exam strategy,
          future planning, and practical academic support across Pakistan.
        </Typography>

        <Grid container spacing={4}>
          {guidanceCards.map((card) => (
            <Grid item xs={12} md={4} key={card.title} sx={{ display: "flex" }}>
              <Box sx={{ ...glassCardSx, width: "100%" }}>
                <Box
                  sx={{
                    position: "relative",
                    zIndex: 2,
                    p: 4,
                    borderRadius: "20px",
                    minHeight: 300,
                    background: "rgba(255,255,255,0.28)",
                    backdropFilter: "blur(14px)",
                    boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                  }}
                >
                  <Box>
                    <Box sx={{ color: "#29b554", mb: 1.5 }}>{card.icon}</Box>
                    <Typography
                      component={RouterLink}
                      to={card.href}
                      variant="h6"
                      fontWeight={700}
                      sx={{
                        display: "inline-block",
                        color: "#004aad",
                        mb: 1.2,
                        textDecoration: "none",
                        "&:hover": { color: "#29b554" },
                      }}
                    >
                      {card.title}
                    </Typography>
                    <Typography sx={{ color: "#333", lineHeight: 1.8 }}>{card.body}</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <SliderSection
        title="Parent testimonials"
        body="Families often look for a tutor who can explain clearly, stay consistent, and support the student's real academic needs. These experiences reflect the kind of help parents usually want before they confirm classes."
        items={parentReviews}
        renderCard={(item) => (
          <Box
            key={item.name}
            sx={{
              minWidth: { xs: "82%", sm: 340, md: 360 },
              maxWidth: 380,
              p: 3,
              borderRadius: "18px",
              background: "#fff",
              border: "1px solid #dce8f1",
              boxShadow: "0 10px 24px rgba(16,32,25,0.08)",
              minHeight: 240,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Stack direction="row" spacing={0.3} sx={{ color: "#29b554", mb: 1 }}>
              {[0, 1, 2, 3, 4].map((index) => <StarIcon key={index} fontSize="small" />)}
            </Stack>
            <Typography sx={{ color: "#333", lineHeight: 1.85, flexGrow: 1 }}>
              "{item.quote}"
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography fontWeight={800} sx={{ color: "#004aad" }}>{item.name}</Typography>
              <Typography variant="body2" sx={{ color: "#556" }}>{item.role}</Typography>
            </Box>
          </Box>
        )}
      />

      <Box sx={{ py: 8, backgroundColor: "#fafafa" }}>
        <Container>
          <Stack spacing={5}>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h4"
                fontWeight={700}
                sx={{ color: "#004aad", fontSize: { xs: "1.6rem", md: "2.2rem" }, mb: 1.5 }}
              >
                Modern learning support for families and teachers
              </Typography>
              <Typography sx={{ maxWidth: 840, mx: "auto", color: "#445", lineHeight: 1.8 }}>
                Explore clearer support on tutor selection, online learning, exam preparation, and future-ready
                study habits for students at different academic stages.
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {textColumns.map((column) => (
                <Grid item xs={12} md={4} key={column.title} sx={{ display: "flex" }}>
                  <Box
                    sx={{
                      height: "100%",
                      width: "100%",
                      p: 3.5,
                      borderRadius: "18px",
                      border: "1px solid #dce8f1",
                      background: "#fff",
                      boxShadow: "0 10px 24px rgba(16,32,25,0.08)",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 2 }}>
                      <MenuBookIcon sx={{ color: "#29b554" }} />
                      <Typography
                        component={RouterLink}
                        to={column.href}
                        variant="h6"
                        fontWeight={700}
                        sx={{
                          color: "#004aad",
                          textDecoration: "none",
                          "&:hover": { color: "#29b554" },
                        }}
                      >
                        {column.title}
                      </Typography>
                    </Stack>
                    <Stack component="ul" spacing={1.2} sx={{ pl: 2.2, my: 0, flexGrow: 1 }}>
                      {column.lines.map((line) => (
                        <Typography component="li" key={line} sx={{ color: "#333", lineHeight: 1.8 }}>
                          {line}
                        </Typography>
                      ))}
                    </Stack>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Box
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: "20px",
                background: "linear-gradient(135deg, rgba(0,74,173,0.95), rgba(41,181,84,0.92))",
                color: "#fff",
              }}
            >
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", md: "center" }}
              >
                <Box sx={{ maxWidth: 780 }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <VerifiedUserIcon />
                    <Typography fontWeight={700}>Friendly support with stronger content</Typography>
                  </Stack>
                  <Typography sx={{ lineHeight: 1.8, color: "rgba(255,255,255,0.92)" }}>
                    Parents can learn how to prepare children for exams, students can explore career roadmaps and PTE practice,
                    and teachers can understand how to modernize their teaching in a fast-changing learning environment.
                  </Typography>
                </Box>
                <Button
                  component={RouterLink}
                  to="/pte"
                  variant="contained"
                  sx={{
                    px: 4,
                    py: 1.4,
                    borderRadius: "10px",
                    textTransform: "none",
                    fontWeight: 700,
                    color: "#004aad",
                    background: "#fff",
                    "&:hover": { background: "#f5f5f7" },
                  }}
                >
                  Open PTE Practice
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>

      <SliderSection
        title="Why structured academic support matters"
        body="Good tutoring is not only about finding someone available. It is about choosing support that improves concepts, study habits, confidence, and long-term academic direction."
        items={tutorReviews}
        renderCard={(item) => (
          <Box
            key={item.title}
            sx={{
              minWidth: { xs: "82%", sm: 330, md: 350 },
              maxWidth: 360,
              p: 3,
              borderRadius: "18px",
              background: "#fff",
              border: "1px solid #dce8f1",
              boxShadow: "0 10px 24px rgba(16,32,25,0.08)",
              minHeight: 220,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" fontWeight={800} sx={{ color: "#004aad", mb: 1.2 }}>
              {item.title}
            </Typography>
            <Typography sx={{ color: "#333", lineHeight: 1.85, flexGrow: 1 }}>{item.body}</Typography>
          </Box>
        )}
      />

      <Box sx={{ py: 8, px: { xs: 2, md: 6 }, backgroundColor: "#f5f8fc" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ color: "#004aad", textAlign: "center", mb: 1.5, fontSize: { xs: "1.55rem", md: "2.1rem" } }}
          >
            Guidance for students, parents, and teachers
          </Typography>
          <Typography
            sx={{
              maxWidth: 940,
              mx: "auto",
              textAlign: "center",
              color: "#445",
              lineHeight: 1.8,
              mb: 5,
            }}
          >
            Explore practical guidance on classes, syllabus planning, exams, online learning, career direction, and
            future-ready study habits across different academic stages.
          </Typography>

          <Grid container spacing={3}>
            {learningBands.map((band) => (
              <Grid item xs={12} md={6} key={band.title} sx={{ display: "flex" }}>
                <Box
                  sx={{
                    height: "100%",
                    width: "100%",
                    p: 3.5,
                    borderRadius: "18px",
                    background: "#fff",
                    border: "1px solid #dce8f1",
                    boxShadow: "0 10px 24px rgba(16,32,25,0.08)",
                  }}
                >
                  <Typography variant="h6" fontWeight={700} sx={{ color: "#004aad", mb: 1.2 }}>
                    {band.title}
                  </Typography>
                  <Typography sx={{ color: "#333", lineHeight: 1.9 }}>
                    {band.text}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <FAQSection />
      <LatestNewsSection />
      <FooterCTA />
    </>
  );
}
