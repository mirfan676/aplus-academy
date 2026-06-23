import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import BiotechIcon from "@mui/icons-material/Biotech";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import ComputerIcon from "@mui/icons-material/Computer";
import ConstructionIcon from "@mui/icons-material/Construction";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import LanguageIcon from "@mui/icons-material/Language";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PsychologyIcon from "@mui/icons-material/Psychology";
import PublicIcon from "@mui/icons-material/Public";
import SchoolIcon from "@mui/icons-material/School";
import ScienceIcon from "@mui/icons-material/Science";
import WorkIcon from "@mui/icons-material/Work";

export const roadmapGroups = [
  {
    id: "study-abroad-pte",
    title: "Study Abroad & PTE",
    subtitle: "For students planning admission, visa files, scholarships, or migration pathways.",
    color: "#0f766e",
    accent: "#14b8a6",
    icon: PublicIcon,
    pte: true,
    cards: [
      {
        title: "PTE Practice",
        description: "Timed essay writing, AI scoring, response history, and writing guidance for students preparing for foreign study.",
        to: "/pte/write-essay",
        cta: "Open PTE practice",
        icon: LanguageIcon,
        pte: true,
      },
      {
        title: "Australia Study Roadmap",
        description: "Plan degrees, English testing, visa steps, scholarships, and post-study goals for Australia.",
        to: "/career-roadmap/study-abroad/australia",
        icon: FlightTakeoffIcon,
        pte: true,
      },
      {
        title: "UK, Canada and New Zealand",
        description: "Compare admission requirements, English test choices, financial planning, and application timing.",
        to: "/career-roadmap/study-abroad/english-test",
        icon: SchoolIcon,
        pte: true,
      },
    ],
  },
  {
    id: "after-graduation",
    title: "After Graduation",
    subtitle: "Routes after BA, BSc, BCom, BBA, BS, MA, MSc, and professional degrees.",
    color: "#4338ca",
    accent: "#818cf8",
    icon: WorkIcon,
    pte: true,
    cards: [
      {
        title: "MS / MPhil Abroad",
        description: "Choose a field, shortlist universities, prepare English testing, and build a scholarship-ready profile.",
        to: "/career-roadmap/after-graduation/ms-mphil-abroad",
        icon: SchoolIcon,
        pte: true,
      },
      {
        title: "Government Jobs and CSS",
        description: "Understand CSS, PMS, FPSC, PPSC, test preparation, and degree-based job routes.",
        to: "/career-roadmap/after-graduation/government-jobs",
        icon: AccountBalanceIcon,
      },
      {
        title: "IT Career Switch",
        description: "Move from any degree toward web development, data, AI, cybersecurity, and remote work.",
        to: "/career-roadmap/after-graduation/it-career-switch",
        icon: ComputerIcon,
        pte: true,
      },
    ],
  },
  {
    id: "healthcare-abroad",
    title: "Healthcare Abroad",
    subtitle: "For nursing, pharmacy, DPT, allied health, and medical students planning foreign careers.",
    color: "#be123c",
    accent: "#fb7185",
    icon: HealthAndSafetyIcon,
    pte: true,
    cards: [
      {
        title: "Nursing Abroad",
        description: "A practical pathway for English test preparation, documentation, licensing awareness, and career planning.",
        to: "/career-roadmap/healthcare-abroad/nursing",
        icon: LocalHospitalIcon,
        pte: true,
      },
      {
        title: "Pharm-D and Allied Health",
        description: "Explore study abroad, skill building, English readiness, and professional growth after health degrees.",
        to: "/career-roadmap/healthcare-abroad/pharmacy-allied-health",
        icon: BiotechIcon,
        pte: true,
      },
      {
        title: "Medical Study Abroad",
        description: "Check degree choices, entrance requirements, English testing, and long-term licensing planning.",
        to: "/career-roadmap/healthcare-abroad/medical-study",
        icon: ScienceIcon,
        pte: true,
      },
    ],
  },
  {
    id: "it-engineering-abroad",
    title: "IT & Engineering Abroad",
    subtitle: "For CS, software, AI, data science, and engineering students aiming for global degrees or work.",
    color: "#0369a1",
    accent: "#38bdf8",
    icon: ComputerIcon,
    pte: true,
    cards: [
      {
        title: "Computer Science Abroad",
        description: "Prepare for BS/MS admissions, portfolio building, English tests, and scholarship applications.",
        to: "/career-roadmap/it-engineering-abroad/computer-science",
        icon: ComputerIcon,
        pte: true,
      },
      {
        title: "Engineering Abroad",
        description: "Map university options, specialization choices, English testing, internships, and migration-aligned skills.",
        to: "/career-roadmap/it-engineering-abroad/engineering",
        icon: ConstructionIcon,
        pte: true,
      },
      {
        title: "AI and Data Science",
        description: "Choose strong degree routes, projects, English readiness, and international application planning.",
        to: "/career-roadmap/it-engineering-abroad/ai-data-science",
        icon: PsychologyIcon,
        pte: true,
      },
    ],
  },
  {
    id: "after-matric",
    title: "After Matric",
    subtitle: "First decision guide for Class 10 students choosing FSc, ICS, ICom, FA, DAE, or skills.",
    color: "#b45309",
    accent: "#f59e0b",
    icon: SchoolIcon,
    cards: [
      {
        title: "FSc Pre-Medical",
        description: "For MBBS, BDS, Nursing, Pharm-D, DPT, Biotechnology, Psychology, and Nutrition pathways.",
        to: "/career-roadmap/after-matric/fsc-pre-medical",
        icon: LocalHospitalIcon,
      },
      {
        title: "ICS and Computer Fields",
        description: "For BSCS, software engineering, AI, cybersecurity, web development, and freelancing.",
        to: "/career-roadmap/after-matric/ics-computer-fields",
        icon: ComputerIcon,
      },
      {
        title: "ICom and Business",
        description: "For BCom, BBA, accounting, finance, CA, ACCA, banking, and entrepreneurship.",
        to: "/career-roadmap/after-matric/icom-business",
        icon: BusinessCenterIcon,
      },
    ],
  },
  {
    id: "bs-degree-guides",
    title: "BS Degree Guides",
    subtitle: "Compare popular BS degrees with subjects, admission options, career scope, and study abroad links.",
    color: "#7c2d12",
    accent: "#fb923c",
    icon: Diversity3Icon,
    pte: true,
    cards: [
      {
        title: "BS Computer Science",
        description: "Understand subjects, universities, projects, internships, job roles, and MS abroad planning.",
        to: "/career-roadmap/bs-degree-guides/computer-science",
        icon: ComputerIcon,
        pte: true,
      },
      {
        title: "BBA and Business",
        description: "Plan management, marketing, finance, entrepreneurship, internships, and MBA abroad pathways.",
        to: "/career-roadmap/bs-degree-guides/bba-business",
        icon: BusinessCenterIcon,
        pte: true,
      },
      {
        title: "BS Psychology",
        description: "Explore clinical, educational, organizational, research, and foreign study options.",
        to: "/career-roadmap/bs-degree-guides/psychology",
        icon: PsychologyIcon,
        pte: true,
      },
    ],
  },
];

export const roadmapPages = {
  "study-abroad/australia": {
    title: "Australia Study Roadmap",
    group: "Study Abroad & PTE",
    color: "#0f766e",
    pte: true,
    intro:
      "A step-by-step roadmap for Pakistani students who want to study in Australia and prepare their English test, admission file, and student visa plan.",
    steps: [
      "Choose your target degree and intake before selecting universities.",
      "Check entry requirements, fee range, scholarships, and city options.",
      "Start PTE or IELTS preparation early, especially essay and speaking practice.",
      "Prepare academic documents, statement of purpose, financial evidence, and visa file.",
      "Keep a backup plan for alternate universities or another intake.",
    ],
    outcomes: ["University shortlist", "English test plan", "Application calendar", "Visa document checklist"],
  },
  "study-abroad/english-test": {
    title: "UK, Canada and New Zealand English Test Roadmap",
    group: "Study Abroad & PTE",
    color: "#0f766e",
    pte: true,
    intro:
      "Compare English testing and admission planning for students targeting UK, Canada, New Zealand, and other English-speaking study destinations.",
    steps: [
      "Confirm whether your selected university accepts PTE, IELTS, TOEFL, or Duolingo.",
      "Choose one test based on your target country, deadline, and current English level.",
      "Practise essay writing, speaking fluency, listening accuracy, and reading speed.",
      "Keep official score report deadlines aligned with admission and visa dates.",
      "Use scored practice results to decide when you are ready for the official exam.",
    ],
    outcomes: ["Right English test", "Score target", "Practice schedule", "Admission-ready timeline"],
  },
  "after-graduation/ms-mphil-abroad": {
    title: "MS / MPhil Abroad Roadmap",
    group: "After Graduation",
    color: "#4338ca",
    pte: true,
    intro:
      "A focused plan for graduates who want to continue their studies abroad through MS, MPhil, research degrees, or scholarship-based admission.",
    steps: [
      "Decide your specialization and research or coursework preference.",
      "Build a strong CV with projects, internships, publications, or teaching experience.",
      "Prepare English test practice and shortlist universities by funding options.",
      "Write a clear statement of purpose connected to your academic background.",
      "Track deadlines for scholarships, assistantships, and visa documentation.",
    ],
    outcomes: ["Degree shortlist", "Scholarship plan", "PTE writing practice", "Application documents"],
  },
  "after-graduation/government-jobs": {
    title: "Government Jobs and CSS Roadmap",
    group: "After Graduation",
    color: "#4338ca",
    intro:
      "A practical route for graduates considering CSS, PMS, FPSC, PPSC, teaching posts, banking tests, and other government career options.",
    steps: [
      "Choose your target exam category according to degree, age, and eligibility.",
      "Build English writing, Pakistan affairs, current affairs, and analytical skills.",
      "Prepare a yearly test calendar for CSS, PMS, FPSC, PPSC, and department jobs.",
      "Practise MCQs, essays, precis, interview confidence, and document readiness.",
      "Keep alternate job pathways active while preparing for competitive exams.",
    ],
    outcomes: ["Exam list", "Subject plan", "Monthly preparation routine", "Backup career options"],
  },
  "after-graduation/it-career-switch": {
    title: "IT Career Switch Roadmap",
    group: "After Graduation",
    color: "#4338ca",
    pte: true,
    intro:
      "A route for graduates from any background who want to enter web development, data, AI, cybersecurity, freelancing, or remote technology work.",
    steps: [
      "Choose one first track: frontend, backend, data analytics, AI, QA, or cybersecurity.",
      "Build a portfolio with small but complete projects before applying for jobs.",
      "Learn GitHub, professional communication, LinkedIn, and remote work basics.",
      "Prepare English writing and speaking if your target is international work or study.",
      "Apply for internships, junior roles, freelancing profiles, and global study options.",
    ],
    outcomes: ["Skill track", "Portfolio plan", "Remote work readiness", "PTE option for abroad"],
  },
  "healthcare-abroad/nursing": {
    title: "Nursing Abroad Roadmap",
    group: "Healthcare Abroad",
    color: "#be123c",
    pte: true,
    intro:
      "A planning guide for nursing students and nurses who want to prepare English testing, documentation, and international career readiness.",
    steps: [
      "Confirm your nursing qualification, experience, and target country requirements.",
      "Start English test practice early because writing and speaking usually need steady work.",
      "Prepare academic records, registration documents, experience letters, and identity documents.",
      "Research bridging, licensing, and registration steps for your selected country.",
      "Keep improving clinical vocabulary, interview confidence, and professional writing.",
    ],
    outcomes: ["Country shortlist", "English test plan", "Document checklist", "Career readiness"],
  },
  "healthcare-abroad/pharmacy-allied-health": {
    title: "Pharm-D and Allied Health Abroad Roadmap",
    group: "Healthcare Abroad",
    color: "#be123c",
    pte: true,
    intro:
      "For Pharm-D, DPT, lab technology, radiology, nutrition, and allied health students exploring foreign study or career pathways.",
    steps: [
      "Match your degree with postgraduate or licensing options in the target country.",
      "Prepare English test skills alongside subject-specific vocabulary.",
      "Collect transcripts, internship records, experience letters, and course outlines.",
      "Compare direct professional routes with MS, diploma, or conversion pathways.",
      "Build a realistic timeline for applications, exams, and financial planning.",
    ],
    outcomes: ["Pathway comparison", "PTE practice", "Document plan", "MS or licensing route"],
  },
  "healthcare-abroad/medical-study": {
    title: "Medical Study Abroad Roadmap",
    group: "Healthcare Abroad",
    color: "#be123c",
    pte: true,
    intro:
      "A roadmap for students considering medical, dental, biomedical, public health, or related study options abroad.",
    steps: [
      "Check recognition, university quality, fees, entry tests, and future licensing impact.",
      "Plan English testing according to university and visa requirements.",
      "Prepare academic documents and verify whether foundation or direct entry is possible.",
      "Compare medical study abroad with local MBBS, BDS, allied health, and BS routes.",
      "Avoid decisions based only on low fees without checking recognition and long-term outcomes.",
    ],
    outcomes: ["Safe university shortlist", "Recognition checks", "English test plan", "Backup options"],
  },
  "it-engineering-abroad/computer-science": {
    title: "Computer Science Abroad Roadmap",
    group: "IT & Engineering Abroad",
    color: "#0369a1",
    pte: true,
    intro:
      "For CS, software, AI, and data students who want international admissions, scholarships, internships, or skilled career options.",
    steps: [
      "Choose a specialization and build projects that prove your practical skill.",
      "Prepare a GitHub portfolio, CV, LinkedIn profile, and statement of purpose.",
      "Shortlist universities by tuition, scholarship options, ranking, and employability.",
      "Use PTE writing practice to strengthen academic English and application confidence.",
      "Apply early and keep improving coding, math, communication, and interview skills.",
    ],
    outcomes: ["Project portfolio", "University shortlist", "PTE practice", "Scholarship-ready profile"],
  },
  "it-engineering-abroad/engineering": {
    title: "Engineering Abroad Roadmap",
    group: "IT & Engineering Abroad",
    color: "#0369a1",
    pte: true,
    intro:
      "A roadmap for engineering students planning MS abroad, specialization choices, internship growth, and global career readiness.",
    steps: [
      "Choose your engineering specialization and connect it with future job markets.",
      "Build internships, final-year projects, research interests, and software skills.",
      "Prepare English testing, university documents, recommendation letters, and SOP.",
      "Compare countries by engineering demand, tuition, licensing, and post-study options.",
      "Keep a realistic funding and deadline plan before submitting applications.",
    ],
    outcomes: ["MS specialization", "Internship plan", "English test route", "Application calendar"],
  },
  "it-engineering-abroad/ai-data-science": {
    title: "AI and Data Science Abroad Roadmap",
    group: "IT & Engineering Abroad",
    color: "#0369a1",
    pte: true,
    intro:
      "A focused path for students interested in AI, machine learning, analytics, data science, and international study options.",
    steps: [
      "Strengthen Python, statistics, databases, and machine learning fundamentals.",
      "Create projects using real datasets and explain them clearly in your portfolio.",
      "Shortlist programs by curriculum quality, research labs, internships, and funding.",
      "Prepare PTE or another English test early to avoid delaying applications.",
      "Build a profile that connects academic background, projects, and career goals.",
    ],
    outcomes: ["AI portfolio", "Program shortlist", "PTE writing practice", "Scholarship profile"],
  },
  "after-matric/fsc-pre-medical": {
    title: "FSc Pre-Medical Roadmap After Matric",
    group: "After Matric",
    color: "#b45309",
    intro:
      "A first decision guide for students choosing biology after matric and planning MBBS, BDS, nursing, pharmacy, DPT, allied health, or science degrees.",
    steps: [
      "Choose Pre-Medical only if Biology, Chemistry, and long-term science study fit your interest.",
      "Understand that MBBS and BDS are not the only strong outcomes after Pre-Medical.",
      "Prepare MDCAT basics early while keeping marks strong in FSc.",
      "Compare Nursing, Pharm-D, DPT, Biotechnology, Nutrition, Psychology, and Allied Health.",
      "Keep a backup plan based on merit, budget, location, and career scope.",
    ],
    outcomes: ["Subject clarity", "Medical and allied options", "Entry test awareness", "Backup degree plan"],
  },
  "after-matric/ics-computer-fields": {
    title: "ICS and Computer Fields Roadmap After Matric",
    group: "After Matric",
    color: "#b45309",
    intro:
      "A roadmap for matric students considering ICS, computer science, software engineering, AI, data science, cybersecurity, and freelancing skills.",
    steps: [
      "Choose ICS if you enjoy computers, problem solving, mathematics, and practical projects.",
      "Start with programming basics, typing speed, English communication, and portfolio habits.",
      "Compare BSCS, Software Engineering, AI, Data Science, IT, and Cybersecurity.",
      "Build small projects before university so your interest becomes practical skill.",
      "Explore study abroad later if you plan international CS or technology degrees.",
    ],
    outcomes: ["ICS subject choice", "Skill plan", "BS degree comparison", "Future abroad option"],
  },
  "after-matric/icom-business": {
    title: "ICom and Business Roadmap After Matric",
    group: "After Matric",
    color: "#b45309",
    intro:
      "For students interested in commerce, accounting, business, banking, finance, entrepreneurship, CA, ACCA, BCom, or BBA.",
    steps: [
      "Choose ICom if you are interested in business, accounts, management, or finance.",
      "Build mathematics, English, presentation, and computer skills from the start.",
      "Compare BCom, BBA, BS Accounting and Finance, CA, ACCA, and banking careers.",
      "Start practical exposure through small business ideas, internships, or online skills.",
      "Consider PTE later if you plan BBA, MBA, or business study abroad.",
    ],
    outcomes: ["Commerce route", "Business degree options", "Finance skills", "Study abroad awareness"],
  },
  "bs-degree-guides/computer-science": {
    title: "BS Computer Science Roadmap",
    group: "BS Degree Guides",
    color: "#7c2d12",
    pte: true,
    intro:
      "A guide for students choosing BSCS, software engineering, AI, data science, and international study or job pathways.",
    steps: [
      "Check university curriculum, faculty, labs, internship culture, and project work.",
      "Learn programming, data structures, databases, web development, and problem solving.",
      "Build projects every semester instead of waiting until the final year.",
      "Prepare English and PTE practice if you plan MS abroad or global work.",
      "Apply for internships, hackathons, remote work, and scholarships early.",
    ],
    outcomes: ["Degree selection", "Project roadmap", "Internship strategy", "PTE for MS abroad"],
  },
  "bs-degree-guides/bba-business": {
    title: "BBA and Business Roadmap",
    group: "BS Degree Guides",
    color: "#7c2d12",
    pte: true,
    intro:
      "A roadmap for business students planning BBA, marketing, finance, entrepreneurship, MBA, and international study options.",
    steps: [
      "Choose a concentration: marketing, finance, HR, supply chain, analytics, or entrepreneurship.",
      "Build Excel, communication, presentation, research, and internship experience.",
      "Use projects and internships to connect classroom learning with real business work.",
      "Prepare English test practice if MBA or foreign business school is your goal.",
      "Create a professional profile on LinkedIn and document achievements clearly.",
    ],
    outcomes: ["Business concentration", "Internship plan", "Communication growth", "MBA abroad route"],
  },
  "bs-degree-guides/psychology": {
    title: "BS Psychology Roadmap",
    group: "BS Degree Guides",
    color: "#7c2d12",
    pte: true,
    intro:
      "A guide for students exploring psychology degrees, clinical routes, education, HR, research, counseling, and foreign study options.",
    steps: [
      "Understand the difference between BS Psychology, clinical psychology, counseling, and research.",
      "Build writing, observation, ethics, statistics, and research skills.",
      "Seek supervised internships or volunteering where appropriate and allowed.",
      "Compare local MS options with international study routes and English test requirements.",
      "Keep expectations realistic because professional licensing differs by country.",
    ],
    outcomes: ["Psychology route", "Research skills", "Internship awareness", "Foreign study planning"],
  },
};

export const getRoadmapPage = (slug) => roadmapPages[slug];
