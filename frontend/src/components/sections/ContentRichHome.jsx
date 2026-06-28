import React from "react";
import {
  AutoAwesome,
  CastForEducation,
  ChevronRight,
  EmojiObjects,
  Groups,
  LaptopChromebook,
  MenuBook,
  Psychology,
  School,
  ShieldOutlined,
  StarOutline,
  Timeline,
  TipsAndUpdates,
  VerifiedUser,
  WorkspacePremium,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const heroStats = [
  ["Home & online", "Tutor options across Pakistan"],
  ["School to career", "Guidance from early years to study abroad"],
  ["Parents first", "Clear help for choosing and preparing the right tutor"],
];

const learningStages = [
  {
    title: "Early Years Classes",
    subtitle: "Play-based learning, phonics, number sense, and confidence building for nursery, prep, and kindergarten.",
    href: "/teachers?class=Early%20Years",
    accent: "#ec4899",
  },
  {
    title: "Primary Classes KG to 5th",
    subtitle: "Reading fluency, maths basics, handwriting, Urdu, Islamiat, and habit-building support.",
    href: "/teachers?class=Primary",
    accent: "#0f766e",
  },
  {
    title: "Elementary Classes 6th to 8th",
    subtitle: "Middle school planning for science, maths, English, exams, and steady study routines.",
    href: "/teachers?class=Middle",
    accent: "#4338ca",
  },
  {
    title: "Matric Classes",
    subtitle: "Board-focused tutoring for Physics, Chemistry, Biology, Computer Science, English, and Maths.",
    href: "/teachers?class=Matric",
    accent: "#be123c",
  },
  {
    title: "O Level Subjects",
    subtitle: "Cambridge-aligned support for subject selection, exam strategy, and concept-based preparation.",
    href: "/o-a-level",
    accent: "#b45309",
  },
  {
    title: "A Level Subjects",
    subtitle: "Advanced preparation for subject combinations, top-grade strategy, and university readiness.",
    href: "/o-a-level",
    accent: "#2563eb",
  },
];

const tutorSelectionSteps = [
  "Define the class level, board, and weak subjects before you shortlist a tutor.",
  "Choose between home, online, female tutor, or subject specialist based on the child’s learning style.",
  "Ask for a trial, teaching plan, and progress method before confirming monthly classes.",
  "Track performance through homework quality, concept clarity, confidence, and exam readiness.",
];

const supportTopics = [
  {
    title: "Syllabus guidance",
    copy: "Break the school or board syllabus into monthly targets so parents know what should be covered before exams.",
    icon: <MenuBook fontSize="small" />,
  },
  {
    title: "Exam preparation",
    copy: "Use chapter revision maps, past paper planning, and timed practice instead of last-minute cramming.",
    icon: <School fontSize="small" />,
  },
  {
    title: "Online class setup",
    copy: "Choose a quiet device-ready space, clear timetable, and short feedback loop after every class.",
    icon: <LaptopChromebook fontSize="small" />,
  },
  {
    title: "Modern learning habits",
    copy: "Blend tutor support with AI tools, active recall, and small daily revision blocks to retain concepts longer.",
    icon: <AutoAwesome fontSize="small" />,
  },
];

const roadmapBlocks = [
  {
    title: "Career Roadmap",
    copy: "Guide students after matric, FSC, ICS, ICom, BS, BBA, BCom, and graduation with clear academic and career paths.",
    href: "/career-roadmap",
    action: "Explore roadmaps",
  },
  {
    title: "How you can work alongside AI in future",
    copy: "Students should learn prompting, research checking, writing support, digital communication, and decision-making with AI tools.",
    href: "/career-roadmap#ai-enabled-careers",
    action: "View AI-focused paths",
  },
  {
    title: "Free PTE practice",
    copy: "Use text-scored PTE writing and summary tasks, then move into premium feedback where speaking and strategy support is needed.",
    href: "/pte",
    action: "Open PTE practice",
  },
];

const futureGuidance = [
  "Communication, writing, and reasoning will stay valuable across every career even as automation grows.",
  "Maths, computing, business analysis, healthcare, and language skills will combine more often in future jobs.",
  "Children who learn discipline, curiosity, and digital tools early will adapt faster than those who only memorize content.",
];

const teacherGuidance = [
  {
    title: "How teachers can help in the modern era",
    copy: "The tutor should not only teach the chapter, but also build understanding, problem-solving, digital learning habits, and confidence.",
  },
  {
    title: "How teachers can modernize learning",
    copy: "Use short practice cycles, visual explanations, structured notes, AI-assisted revision, and regular parent updates.",
  },
  {
    title: "Guidance on online classes",
    copy: "Strong online tutors keep cameras, whiteboards, assignments, and follow-up checks organized so classes remain productive.",
  },
];

const trustedQualities = [
  "Verified identity and academic background",
  "Strong command of the subject and exam pattern",
  "Clear communication with student and parents",
  "Consistency, punctuality, and progress tracking",
  "Ability to adapt lessons to weak areas and pace",
  "Safe, respectful, and professional conduct",
];

const futureSubjects = [
  { title: "AI and digital literacy", copy: "Will move from optional advantage to core academic survival skill." },
  { title: "Spoken and written English", copy: "Will matter more for higher education, global jobs, and international tests." },
  { title: "STEM and applied maths", copy: "Will remain central because technology, engineering, finance, and analytics rely on them." },
  { title: "Islamic and ethical guidance", copy: "Will remain important as families look for values-based education in a fast-changing world." },
];

const examGuidance = [
  "Build revision calendars 6 to 8 weeks before board or school exams.",
  "Use past papers, topic-wise weak area lists, and timed writing practice.",
  "Do not keep the tutor limited to homework; use them for strategy, feedback, and exam temperament.",
];

const cardStyles = {
  borderRadius: 1,
  border: "1px solid #d7e3dd",
  bgcolor: "#fff",
  boxShadow: "0 16px 40px rgba(15, 23, 42, 0.06)",
};

const SectionTitle = ({ eyebrow, title, body, align = "left" }) => (
  <Box sx={{ maxWidth: 760, mx: align === "center" ? "auto" : 0, textAlign: align }}>
    {eyebrow ? (
      <Typography sx={{ color: "#0f766e", fontWeight: 900, mb: 1, textTransform: "uppercase", fontSize: 13 }}>
        {eyebrow}
      </Typography>
    ) : null}
    <Typography
      component="h2"
      sx={{
        fontSize: { xs: "1.7rem", md: "2.35rem" },
        fontWeight: 950,
        lineHeight: 1.1,
        color: "#102019",
      }}
    >
      {title}
    </Typography>
    {body ? (
      <Typography sx={{ mt: 1.4, color: "#475569", lineHeight: 1.75, fontSize: { xs: "0.98rem", md: "1.02rem" } }}>
        {body}
      </Typography>
    ) : null}
  </Box>
);

export default function ContentRichHome() {
  return (
    <Box sx={{ bgcolor: "#f7fbf8" }}>
      <Box
        component="section"
        sx={{
          bgcolor: "#f7fbf8",
          background:
            "radial-gradient(circle at top right, rgba(37,99,235,0.08), transparent 22%), radial-gradient(circle at left center, rgba(15,118,110,0.10), transparent 24%)",
        }}
      >
        <Container sx={{ py: { xs: 4, md: 6 } }}>
          <Grid container spacing={3.5} alignItems="center">
            <Grid item xs={12} md={7}>
              <Stack spacing={2.2} sx={{ maxWidth: 720 }}>
                <Chip
                  icon={<WorkspacePremium />}
                  label="Guidance-led tutoring platform"
                  sx={{
                    alignSelf: "flex-start",
                    borderRadius: 1,
                    bgcolor: "#e6f6ef",
                    color: "#0f766e",
                    fontWeight: 900,
                    "& .MuiChip-icon": { color: "#0f766e" },
                  }}
                />
                <Typography
                  component="h1"
                  sx={{
                    fontSize: { xs: "2.1rem", md: "3.45rem" },
                    fontWeight: 950,
                    lineHeight: 1.02,
                    color: "#102019",
                  }}
                >
                  Find the right tutor, the right roadmap, and the right learning support for your child
                </Typography>
                <Typography sx={{ color: "#475569", lineHeight: 1.8, fontSize: { xs: "1rem", md: "1.06rem" } }}>
                  A Plus Academy helps parents choose trusted tutors, prepare children for exams, plan future
                  careers, and use modern learning methods with clarity instead of confusion.
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
                  <Button
                    component={RouterLink}
                    to="/teachers"
                    variant="contained"
                    endIcon={<ChevronRight />}
                    sx={{
                      borderRadius: 1,
                      textTransform: "none",
                      fontWeight: 950,
                      px: 2.4,
                      py: 1.2,
                      bgcolor: "#102019",
                      "&:hover": { bgcolor: "#1f3a30" },
                    }}
                  >
                    Find tutors
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/career-roadmap"
                    variant="outlined"
                    sx={{
                      borderRadius: 1,
                      textTransform: "none",
                      fontWeight: 950,
                      px: 2.4,
                      py: 1.2,
                      color: "#102019",
                      borderColor: "#102019",
                    }}
                  >
                    View career roadmap
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/pte"
                    variant="text"
                    sx={{
                      borderRadius: 1,
                      textTransform: "none",
                      fontWeight: 950,
                      px: 1.2,
                      color: "#0f766e",
                    }}
                  >
                    Free PTE practice
                  </Button>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  ...cardStyles,
                  p: 2,
                  height: "100%",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(239,248,244,0.96) 100%)",
                }}
              >
                <Box
                  component="img"
                  src="/assets/hero-main-430.webp"
                  alt="A Plus Academy students and tutors"
                  sx={{
                    width: "100%",
                    aspectRatio: "16/11",
                    objectFit: "cover",
                    borderRadius: 1,
                    mb: 2,
                  }}
                />
                <Grid container spacing={1.2}>
                  {heroStats.map(([value, label]) => (
                    <Grid item xs={12} sm={4} md={12} key={label}>
                      <Paper elevation={0} sx={{ p: 1.5, ...cardStyles, boxShadow: "none", bgcolor: "#f8fbfa" }}>
                        <Typography fontWeight={950} sx={{ color: "#102019", mb: 0.3 }}>
                          {value}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#51606e", lineHeight: 1.55 }}>
                          {label}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container sx={{ py: { xs: 4.5, md: 6 } }}>
        <Stack spacing={{ xs: 4.5, md: 6 }}>
          <Box component="section">
            <SectionTitle
              eyebrow="Learning Stages"
              title="Guidance for every school stage"
              body="Start from the child’s class level, then match the tutor, syllabus, learning pace, and exam target instead of searching blindly."
            />
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              {learningStages.map((stage) => (
                <Grid item xs={12} md={6} lg={4} key={stage.title}>
                  <Paper elevation={0} sx={{ ...cardStyles, p: 2.25, height: "100%" }}>
                    <Stack spacing={1.2} sx={{ height: "100%" }}>
                      <Chip
                        label={stage.title}
                        sx={{
                          alignSelf: "flex-start",
                          borderRadius: 1,
                          bgcolor: `${stage.accent}16`,
                          color: stage.accent,
                          fontWeight: 900,
                        }}
                      />
                      <Typography sx={{ color: "#475569", lineHeight: 1.75, flexGrow: 1 }}>{stage.subtitle}</Typography>
                      <Button
                        component={RouterLink}
                        to={stage.href}
                        endIcon={<ChevronRight />}
                        sx={{ alignSelf: "flex-start", px: 0, textTransform: "none", fontWeight: 900, color: "#102019" }}
                      >
                        Explore support
                      </Button>
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Grid container spacing={2.5}>
            <Grid item xs={12} lg={7}>
              <Paper elevation={0} sx={{ ...cardStyles, p: { xs: 2.2, md: 3 } }}>
                <SectionTitle
                  eyebrow="Parent Guide"
                  title="How to find the best tutor for your child"
                  body="The right tutor is not only about subject knowledge. It is about matching teaching style, board, weak areas, schedule, and the child’s confidence level."
                />
                <Stack spacing={1.3} sx={{ mt: 2.2 }}>
                  {tutorSelectionSteps.map((step, index) => (
                    <Stack key={step} direction="row" spacing={1.3} alignItems="flex-start">
                      <Box
                        sx={{
                          minWidth: 34,
                          height: 34,
                          borderRadius: 1,
                          bgcolor: "#102019",
                          color: "#fff",
                          display: "grid",
                          placeItems: "center",
                          fontWeight: 900,
                        }}
                      >
                        {index + 1}
                      </Box>
                      <Typography sx={{ color: "#475569", lineHeight: 1.75 }}>{step}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Paper>
            </Grid>
            <Grid item xs={12} lg={5}>
              <Paper elevation={0} sx={{ ...cardStyles, p: { xs: 2.2, md: 3 }, height: "100%" }}>
                <SectionTitle
                  eyebrow="Child Preparation"
                  title="How to build a brighter future for your child"
                  body="Good tutoring works best when the home, the tutor, and the student all follow the same plan."
                />
                <Stack spacing={1.2} sx={{ mt: 2.2 }}>
                  {futureGuidance.map((item) => (
                    <Stack key={item} direction="row" spacing={1.2} alignItems="flex-start">
                      <EmojiObjects sx={{ color: "#b45309", mt: "2px" }} />
                      <Typography sx={{ color: "#475569", lineHeight: 1.75 }}>{item}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          <Box component="section">
            <SectionTitle
              eyebrow="Academic Planning"
              title="Syllabus support, exam strategy, and practical learning setup"
              body="Parents usually need help with structure more than motivation. These are the areas that make tutoring effective month after month."
            />
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              {supportTopics.map((topic) => (
                <Grid item xs={12} sm={6} key={topic.title}>
                  <Paper elevation={0} sx={{ ...cardStyles, p: 2.2, height: "100%" }}>
                    <Stack spacing={1.2}>
                      <Box
                        sx={{
                          width: 42,
                          height: 42,
                          borderRadius: 1,
                          bgcolor: "#e8f5ef",
                          color: "#0f766e",
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        {topic.icon}
                      </Box>
                      <Typography fontWeight={950}>{topic.title}</Typography>
                      <Typography sx={{ color: "#475569", lineHeight: 1.75 }}>{topic.copy}</Typography>
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box component="section">
            <SectionTitle
              eyebrow="Roadmaps"
              title="Career roadmap and future-ready learning"
              body="Students and parents need both academic direction and practical skills for the next five to ten years."
            />
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              {roadmapBlocks.map((block, index) => (
                <Grid item xs={12} md={4} key={block.title}>
                  <Paper
                    elevation={0}
                    sx={{
                      ...cardStyles,
                      p: 2.4,
                      height: "100%",
                      bgcolor: index === 1 ? "#102019" : "#fff",
                      color: index === 1 ? "#fff" : "#102019",
                    }}
                  >
                    <Stack spacing={1.2} sx={{ height: "100%" }}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 1,
                          bgcolor: index === 1 ? "rgba(255,255,255,0.12)" : "#eef6f2",
                          color: index === 1 ? "#fbbf24" : "#0f766e",
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        {index === 0 ? <Timeline /> : index === 1 ? <Psychology /> : <CastForEducation />}
                      </Box>
                      <Typography fontWeight={950} sx={{ fontSize: "1.2rem" }}>
                        {block.title}
                      </Typography>
                      <Typography sx={{ color: index === 1 ? "rgba(255,255,255,0.78)" : "#475569", lineHeight: 1.75, flexGrow: 1 }}>
                        {block.copy}
                      </Typography>
                      <Button
                        component={RouterLink}
                        to={block.href}
                        endIcon={<ChevronRight />}
                        sx={{
                          alignSelf: "flex-start",
                          px: 0,
                          textTransform: "none",
                          fontWeight: 900,
                          color: index === 1 ? "#fff" : "#102019",
                        }}
                      >
                        {block.action}
                      </Button>
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Grid container spacing={2.5}>
            <Grid item xs={12} lg={7}>
              <Paper elevation={0} sx={{ ...cardStyles, p: { xs: 2.2, md: 3 }, height: "100%" }}>
                <SectionTitle
                  eyebrow="Teacher Guidance"
                  title="How teachers can support students in a modern learning environment"
                  body="A strong tutor today must combine subject teaching with communication, technology, progress tracking, and exam intelligence."
                />
                <Stack spacing={1.5} sx={{ mt: 2.2 }}>
                  {teacherGuidance.map((item) => (
                    <Box key={item.title} sx={{ p: 1.7, borderRadius: 1, bgcolor: "#f8fbfa", border: "1px solid #e3ece8" }}>
                      <Typography fontWeight={900} sx={{ mb: 0.6 }}>
                        {item.title}
                      </Typography>
                      <Typography sx={{ color: "#475569", lineHeight: 1.75 }}>{item.copy}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Grid>
            <Grid item xs={12} lg={5}>
              <Paper elevation={0} sx={{ ...cardStyles, p: { xs: 2.2, md: 3 }, height: "100%" }}>
                <SectionTitle
                  eyebrow="Trust"
                  title="Qualities of trusted qualified teachers"
                  body="Families usually stay with tutors who are dependable, measurable, and easy to work with."
                />
                <Stack spacing={1.15} sx={{ mt: 2.2 }}>
                  {trustedQualities.map((quality) => (
                    <Stack key={quality} direction="row" spacing={1.2} alignItems="flex-start">
                      <VerifiedUser sx={{ color: "#0f766e", mt: "2px" }} />
                      <Typography sx={{ color: "#475569", lineHeight: 1.7 }}>{quality}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          <Box component="section">
            <SectionTitle
              eyebrow="What Changes Next"
              title="Future predictions on subjects and learning demand"
              body="These areas are likely to shape what students, parents, and tutors focus on over the next few years."
            />
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              {futureSubjects.map((item) => (
                <Grid item xs={12} sm={6} key={item.title}>
                  <Paper elevation={0} sx={{ ...cardStyles, p: 2.2, height: "100%" }}>
                    <Stack spacing={1.1}>
                      <TipsAndUpdates sx={{ color: "#2563eb" }} />
                      <Typography fontWeight={950}>{item.title}</Typography>
                      <Typography sx={{ color: "#475569", lineHeight: 1.75 }}>{item.copy}</Typography>
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Paper elevation={0} component="section" sx={{ ...cardStyles, p: { xs: 2.2, md: 3 } }}>
            <Grid container spacing={2.2} alignItems="center">
              <Grid item xs={12} md={8}>
                <SectionTitle
                  eyebrow="Exams"
                  title="Guidance on exams"
                  body="Exam preparation improves when tutoring becomes structured and time-bound instead of reactive."
                />
                <Stack spacing={1.1} sx={{ mt: 2 }}>
                  {examGuidance.map((item) => (
                    <Stack key={item} direction="row" spacing={1.2} alignItems="flex-start">
                      <StarOutline sx={{ color: "#b45309", mt: "2px" }} />
                      <Typography sx={{ color: "#475569", lineHeight: 1.75 }}>{item}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack spacing={1.2}>
                  <Button component={RouterLink} to="/teachers" variant="contained" sx={{ borderRadius: 1, textTransform: "none", fontWeight: 950, bgcolor: "#102019", "&:hover": { bgcolor: "#1f3a30" } }}>
                    Find a tutor now
                  </Button>
                  <Button component={RouterLink} to="/register" variant="outlined" sx={{ borderRadius: 1, textTransform: "none", fontWeight: 950 }}>
                    Register as student or teacher
                  </Button>
                  <Button component={RouterLink} to="/jobs" variant="text" sx={{ borderRadius: 1, textTransform: "none", fontWeight: 950, color: "#0f766e" }}>
                    Explore jobs
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              ...cardStyles,
              p: { xs: 2.4, md: 3.2 },
              bgcolor: "#102019",
              color: "#fff",
            }}
          >
            <Grid container spacing={2.2} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography component="h2" sx={{ fontSize: { xs: "1.6rem", md: "2.2rem" }, fontWeight: 950, lineHeight: 1.12 }}>
                  Friendly support for parents, students, teachers, and future planning
                </Typography>
                <Typography sx={{ mt: 1.3, color: "rgba(255,255,255,0.76)", lineHeight: 1.8 }}>
                  Use A Plus Academy to find tutors, compare learning directions, practise PTE tasks, and stay updated with education-focused guidance and news.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap justifyContent={{ xs: "flex-start", md: "flex-end" }}>
                  {[
                    { label: "Find tutors", to: "/teachers", icon: <Groups fontSize="small" /> },
                    { label: "Trusted guidance", to: "/about", icon: <ShieldOutlined fontSize="small" /> },
                    { label: "Career roadmap", to: "/career-roadmap", icon: <Timeline fontSize="small" /> },
                  ].map((item) => (
                    <Button
                      key={item.label}
                      component={RouterLink}
                      to={item.to}
                      startIcon={item.icon}
                      sx={{
                        borderRadius: 1,
                        textTransform: "none",
                        fontWeight: 900,
                        bgcolor: "rgba(255,255,255,0.10)",
                        color: "#fff",
                        border: "1px solid rgba(255,255,255,0.14)",
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
