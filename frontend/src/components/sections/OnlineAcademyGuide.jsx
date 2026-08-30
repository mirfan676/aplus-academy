import React from "react";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function OnlineAcademyGuide() {
  return (
    <Box component="section" sx={{ py: { xs: 6, md: 8 }, bgcolor: "#f4f8f6" }}>
      <Container maxWidth="lg">
        <Stack spacing={2.2} sx={{ maxWidth: 980 }}>
          <Typography component="h2" variant="h3" fontWeight={900} sx={{ color: "#102019" }}>
            Online academy in Pakistan for school support, languages, and future skills
          </Typography>
          <Typography component="p" sx={{ color: "#405a50", lineHeight: 1.9, m: 0 }}>
            An online academy in Pakistan should make learning easier to access without making it less personal. Families may be looking for a home tutor for a school subject, a teacher for O Level or A Level preparation, a Quran instructor, a language course, or support for an important test. A Plus Academy brings these options together so that a learner&apos;s current level, subject, city, schedule, and goal can guide the next step instead of forcing every student into the same course.
          </Typography>
          <Typography component="p" sx={{ color: "#405a50", lineHeight: 1.9, m: 0 }}>
            For younger students, steady help with homework, reading, maths foundations, science concepts, and school routines can build confidence before exam pressure begins. For secondary students, the focus may move toward board requirements, Cambridge subjects, past-paper practice, revision planning, and clearer written answers. University students and professionals may need English communication, PTE or IELTS practice, programming support, or a language pathway connected to work and study ambitions. The useful question is not simply which subject is difficult; it is what the learner needs to be able to do next.
          </Typography>
          <Typography component="p" sx={{ color: "#405a50", lineHeight: 1.9, m: 0 }}>
            Online classes work well when they are planned around real routines. A student needs an agreed timetable, a quiet place for lessons, access to the right books or digital material, and clear expectations about practice between sessions. Teachers can use regular check-ins to identify gaps in understanding, correct weak answers, and adjust the pace. Parents can support this process by sharing the syllabus, recent marks, upcoming tests, and the learner&apos;s available hours. Small details at the start often lead to better tutor matching and more useful classes later.
          </Typography>
          <Typography component="p" sx={{ color: "#405a50", lineHeight: 1.9, m: 0 }}>
            A Plus Academy serves learners across Pakistan through home and online tutoring options. The platform can help families explore qualified tutors, language courses, career direction, free learning tools, and education guidance in one place. A good academic plan does not promise instant results. It sets a sensible target, checks progress regularly, and gives the learner enough feedback to improve with confidence. This is equally important for a child building basic concepts and an adult preparing for a new opportunity.
          </Typography>
          <Typography component="p" sx={{ color: "#405a50", lineHeight: 1.9, m: 0 }}>
            Start by describing the learner&apos;s class level, subject or skill goal, preferred lesson mode, city, and timetable. From there, families can explore tutor profiles, request a suitable match, or choose a structured language and test-preparation route. The goal of an online academy is not to replace thoughtful teaching with a screen. It is to make thoughtful teaching more reachable, more organised, and easier to continue week after week.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ pt: 1 }}>
            <Button component={RouterLink} to="/teachers" variant="contained" sx={{ alignSelf: "flex-start", textTransform: "none", fontWeight: 900, borderRadius: 1 }}>
              Find a Tutor
            </Button>
            <Button component={RouterLink} to="/courses/languages" variant="outlined" sx={{ alignSelf: "flex-start", textTransform: "none", fontWeight: 900, borderRadius: 1 }}>
              Explore Language Courses
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
