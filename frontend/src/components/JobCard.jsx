import { Card, Box, Typography, Button } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const JobCard = ({ job }) => {
  const {
    title,
    grade,
    school,
    students,
    subjects,
    timing,
    fee,
    location,
    city,
    gender,
    contact,
    status,
    whatsapp_message
  } = job;

  const whatsappURL = `https://wa.me/${contact.replace(/\D/g, "")}?text=${encodeURIComponent(whatsapp_message)}`;

  return (
    <Card
      sx={{
        p: 2,
        borderRadius: 3,
        border: status === "closed" ? "2px solid red" : "2px solid #4caf50",
        opacity: status === "closed" ? 0.5 : 1,
        position: "relative"
      }}
    >
      <Typography variant="h6">{title}</Typography>

      <Typography>Grade: {grade}</Typography>
      <Typography>School: {school}</Typography>
      <Typography>Students: {students}</Typography>
      <Typography>Subjects: {subjects}</Typography>
      <Typography>Timing: {timing}</Typography>
      <Typography>Fee: {fee}</Typography>
      <Typography>Location: {location}</Typography>
      <Typography>City: {city}</Typography>
      <Typography>Gender: {gender}</Typography>
      <Typography>Contact: {contact}</Typography>

      <Button
        variant="contained"
        color="success"
        startIcon={<WhatsAppIcon />}
        disabled={status === "closed"}
        href={whatsappURL}
        target="_blank"
        sx={{ mt: 2 }}
      >
        {status === "closed" ? "Closed" : "Apply on WhatsApp"}
      </Button>
    </Card>
  );
};

export default JobCard;
