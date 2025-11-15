import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const faqList = [
  { q: "Do you offer trial classes?", a: "Yes, we provide a 2 days free trial." },
  { q: "Are tutors verified?", a: "All tutors are manually verified before onboarding." },
  { q: "What are your fees?", a: "Fees depend on class, subject, and tutor experience." },
];

const FAQSection = () => {
  return (
    <Box sx={{ py: 5, px: 2 }}>
      <Typography
        variant="h5"
        fontWeight={700}
        sx={{ mb: 3, textAlign: "center", color: "#004aad" }}
      >
        Frequently Asked Questions
      </Typography>

      {faqList.map((item, i) => (
        <Accordion key={i}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>{item.q}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{item.a}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default FAQSection;
