import { useEffect } from "react";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { motion } from "framer-motion";

const faqList = [
  {
    q: "How can I find a home tutor through A Plus Academy?",
    a: "You can browse tutor profiles, contact A Plus Academy on WhatsApp, or submit a tutor request with the student's class, subject, city, area, preferred timing, and learning goal. Our team uses those details to suggest a suitable home or online tutor for school subjects, O Level, A Level, Quran, IELTS, English, programming, and university-level support.",
  },
  {
    q: "Do you provide home tutors in Lahore?",
    a: "Yes, A Plus Academy helps families arrange home tutors in Lahore for primary classes, middle school, Matric, FSc, ICS, O Level, A Level, Quran with Tajweed, IELTS, English language, programming, IT skills, and university subjects. Tutor availability depends on the area, subject, class level, schedule, and whether the family prefers a male or female tutor.",
  },
  {
    q: "Can I request a female home tutor in Lahore?",
    a: "Yes, families can request a female home tutor in Lahore for younger students, girls, Quran reading, English practice, homework support, O Level subjects, A Level subjects, and exam preparation. Share your area, subject, class, preferred timing, and learning mode so availability can be checked properly.",
  },
  {
    q: "Do you offer online tutors across Pakistan?",
    a: "Yes, online tutoring is available for students across Pakistan. Online classes are useful when a student needs flexible timing, lives outside major tutor locations, wants a subject specialist, or prefers learning from home. Common online subjects include school maths, science, English, Quran, IELTS, computer science, programming, and university courses.",
  },
  {
    q: "Are A Plus Academy tutors verified?",
    a: "Tutor verification includes reviewing the tutor's academic background, teaching experience, subject strengths, communication style, and suitability for the requested class or subject. For home tuition, families should still discuss identity, timing, expectations, and trial-class feedback before continuing regular classes.",
  },
  {
    q: "Do you offer trial classes?",
    a: "Trial availability depends on the tutor, subject, location, and schedule. In many cases, families can evaluate the tutor through an initial class or short trial period before continuing. The purpose is to check teaching style, punctuality, subject command, student comfort, and whether the tutor can follow the required syllabus.",
  },
  {
    q: "What are the home tuition fees in Lahore or Pakistan?",
    a: "Fees depend on the student's class, subject, tutor qualification, teaching experience, number of classes per week, home or online mode, location, and exam level. O Level, A Level, IELTS, programming, Quran with Tajweed, and university subjects may have different fee ranges because they require different levels of specialization.",
  },
  {
    q: "Which subjects can I study with A Plus Academy tutors?",
    a: "Students can request tutors for K-12 subjects, Matric, FSc, ICS, ICom, O Level, A Level, bachelors and masters subjects, competitive exams, Quran with Tajweed, English language, IELTS, programming, IT and technology, graphics and multimedia, and study skills. Subject availability depends on city, timing, and tutor pool.",
  },
  {
    q: "Do you provide Quran tutors with Tajweed?",
    a: "Yes, Quran tutors can help children and adults with Nazra, Tajweed rules, makharij, fluency, revision routines, duas, and regular recitation practice. Families can request online Quran classes or home Quran tutoring where available.",
  },
  {
    q: "How do I choose the right tutor for my child?",
    a: "The right tutor should match the student's class, subject, learning pace, exam board, language comfort, and schedule. Parents should check how clearly the tutor explains concepts, whether homework is reviewed, how progress is reported, and whether the student feels comfortable asking questions.",
  },
  {
    q: "Can tutors help with O Level and A Level exam preparation?",
    a: "Yes, tutors can support Cambridge O Level and A Level students with syllabus coverage, topical practice, yearly past papers, marking-scheme understanding, concept clarity, revision planning, and weak-area correction in subjects such as Maths, Physics, Chemistry, Biology, English, Business, Economics, Accounting, and Computer Science.",
  },
  {
    q: "How quickly can I get a tutor?",
    a: "The matching time depends on the requested subject, city, area, class level, tutor availability, and preferred timing. Common subjects in major areas can often be matched faster, while specialized subjects or strict timing requirements may take more checking.",
  },
];

const FAQSection = () => {
  useEffect(() => {
    const id = "homepage-faq-structured-data";
    document.getElementById(id)?.remove();

    const script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqList.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    });

    document.head.appendChild(script);
    return () => script.remove();
  }, []);

  return (
    <Box sx={{ py: 8, px: { xs: 2, md: 6 }, backgroundColor: "#f0f4f8" }}>
      <Typography
        variant="h4"
        fontWeight={700}
        sx={{
          mb: 6,
          textAlign: "center",
          color: "#004aad",
          fontSize: { xs: "1.6rem", md: "2.2rem" },
        }}
      >
        Frequently Asked Questions
      </Typography>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: 0.15 }}
      >
        {faqList.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Accordion
              sx={{
                mb: 3,
                borderRadius: "8px",
                background: "#fff",
                border: "1px solid #dce8f1",
                boxShadow: "0 10px 24px rgba(16,32,25,0.08)",
                "&:before": { display: "none" },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "#198754" }} />}
                sx={{
                  px: { xs: 2.5, md: 4 },
                  py: { xs: 1.5, md: 2 },
                  "& .MuiTypography-root": { fontWeight: 600, color: "#004aad" },
                }}
              >
                <Typography sx={{ lineHeight: 1.4 }}>{item.q}</Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  px: { xs: 2.5, md: 4 },
                  pt: 0,
                  pb: 3,
                }}
              >
                <Typography sx={{ color: "#333", fontSize: "0.98rem", lineHeight: 1.8 }}>
                  {item.a}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </motion.div>
        ))}
      </motion.div>
    </Box>
  );
};

export default FAQSection;
