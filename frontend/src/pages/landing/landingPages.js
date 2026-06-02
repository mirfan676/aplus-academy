const image = (id, path = `pexels-photo-${id}.jpeg`) =>
  `https://images.pexels.com/photos/${id}/${path}?auto=compress&cs=tinysrgb&w=1600`;

const commonCities =
  "Available in Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta, and online across Pakistan.";

const tutorCta = { label: "Find a Tutor", to: "/teachers" };
const registerCta = { label: "Become a Tutor", to: "/register" };
const whatsappCta = { label: "Talk on WhatsApp", href: "https://wa.me/923197659491" };

const page = ({
  slug,
  title,
  description,
  eyebrow,
  heading,
  intro,
  imageId,
  imagePath,
  imageAlt,
  primaryCta,
  secondaryCta = whatsappCta,
  highlights,
  sections,
  popularLinks,
  faqs,
}) => ({
  slug,
  title,
  description,
  eyebrow,
  heading,
  intro,
  image: image(imageId, imagePath),
  imageAlt,
  primaryCta,
  secondaryCta,
  highlights: [...highlights, commonCities],
  sections,
  popularLinks,
  faqs,
});

export const landingPages = {
  studyAbroad: page({
    slug: "study-abroad",
    title: "Study Abroad Support in Pakistan | IELTS, English & Academic Guidance",
    description:
      "Prepare for study abroad from Pakistan with IELTS, English language, academic writing, subject tutoring, and one-to-one learning support from A Plus Academy.",
    eyebrow: "Study Abroad",
    heading: "Study abroad preparation that starts with stronger learning at home",
    intro:
      "Build the English, IELTS, academic writing, and subject confidence needed for international admissions and better classroom performance.",
    imageId: 267885,
    imageAlt: "Students walking on a university campus",
    primaryCta: { label: "Get Study Abroad Help", to: "/teachers?subject=IELTS" },
    highlights: ["IELTS and English preparation", "Academic writing and interview practice", "Subject tutoring before departure"],
    sections: [
      {
        title: "Support for Pakistani students planning overseas education",
        body:
          "Students aiming for the UK, Canada, Australia, Europe, the UAE, or other destinations often need more than admission information. They need better English, clearer concepts, test readiness, and study habits that match international classrooms.",
      },
      {
        title: "What we can help with",
        body:
          "Tutors can support IELTS speaking and writing, spoken English, grammar, foundation mathematics, science, computing, business subjects, and assignment skills so students feel prepared before they travel.",
      },
    ],
    popularLinks: [
      { label: "IELTS tutors", to: "/ielts" },
      { label: "English language classes", to: "/english-language" },
      { label: "Bachelors and masters support", to: "/bachelors-masters" },
    ],
    faqs: [
      ["Do you provide visa services?", "We focus on learning support, IELTS preparation, English language, and academic readiness."],
      ["Can classes be online?", "Yes, students can study online from anywhere in Pakistan."],
    ],
  }),
  referralProgram: page({
    slug: "referral-program",
    title: "A Plus Academy Referral Program | Refer Students & Tutors in Pakistan",
    description:
      "Refer students or qualified tutors to A Plus Academy and help families across Pakistan find trusted home and online tuition.",
    eyebrow: "Referral Program",
    heading: "Refer a student or tutor and help another family learn with confidence",
    intro:
      "If you know a student who needs support or a teacher who can guide learners responsibly, connect them with A Plus Academy.",
    imageId: 3184292,
    imageAlt: "People discussing a referral program",
    primaryCta: { label: "Refer on WhatsApp", href: "https://wa.me/923197659491" },
    secondaryCta: tutorCta,
    highlights: ["Quick WhatsApp referral", "For students and teachers", "Home and online tuition"],
    sections: [
      {
        title: "A simple way to support better education",
        body:
          "Parents, students, school staff, and teachers can refer learners who need tutoring for school subjects, O and A Level, Quran, IELTS, programming, or professional skills.",
      },
      {
        title: "Who can be referred",
        body:
          "You can refer students looking for home tuition, online classes, exam preparation, English improvement, Quran with Tajweed, or tutors who want verified teaching opportunities.",
      },
    ],
    popularLinks: [
      { label: "Find a tutor", to: "/teachers" },
      { label: "Teacher registration", to: "/register" },
      { label: "Tutor jobs", to: "/jobs" },
    ],
    faqs: [
      ["How do I refer someone?", "Send the student's or tutor's basic details through WhatsApp and our team will guide the next step."],
      ["Is referral only for Lahore?", "No, referrals are accepted from major cities and online learners across Pakistan."],
    ],
  }),
  careerOpportunities: page({
    slug: "career-opportunities",
    title: "Tutor Jobs in Pakistan | Career Opportunities at A Plus Academy",
    description:
      "Explore home tutor jobs, online teaching opportunities, and education careers with A Plus Academy in Lahore, Karachi, Islamabad, and across Pakistan.",
    eyebrow: "Career Opportunities",
    heading: "Build your tutoring career with verified teaching opportunities",
    intro:
      "A Plus Academy connects committed teachers with students who need home tuition, online classes, and focused academic support.",
    imageId: 3184465,
    imageAlt: "Teacher mentoring students in a classroom",
    primaryCta: { label: "View Tutor Jobs", to: "/jobs" },
    secondaryCta: registerCta,
    highlights: ["Home tutor jobs", "Online teaching jobs", "Part-time and subject-based work"],
    sections: [
      {
        title: "Teaching opportunities for qualified tutors",
        body:
          "Teachers can apply for school subjects, O and A Level, Quran, IELTS, English, programming, IT skills, graphic design, and university-level subjects.",
      },
      {
        title: "Why tutors join A Plus Academy",
        body:
          "Our team helps match teachers with relevant student requests, location preferences, subject strengths, and online or home-tuition availability.",
      },
    ],
    popularLinks: [
      { label: "Latest jobs", to: "/jobs" },
      { label: "Register as tutor", to: "/register" },
      { label: "Programming teaching", to: "/programming" },
    ],
    faqs: [
      ["How can I apply?", "Register as a tutor and keep your subjects, city, and experience accurate."],
      ["Do you offer online teaching work?", "Yes, many students request online classes across Pakistan."],
    ],
  }),
  languages: page({
    slug: "languages",
    title: "Language Tutors in Pakistan | English, Urdu, Arabic & More",
    description:
      "Find language tutors in Pakistan for spoken English, Urdu, Arabic, Quran reading, IELTS speaking, grammar, writing, and conversation practice.",
    eyebrow: "Languages",
    heading: "Learn languages with one-to-one tutors who keep practice practical",
    intro:
      "Improve speaking, reading, writing, pronunciation, grammar, and confidence through home or online language classes.",
    imageId: 4145153,
    imageAlt: "Language learning books and study notes",
    primaryCta: { label: "Find Language Tutors", to: "/teachers?subject=English" },
    secondaryCta: { label: "IELTS Classes", to: "/ielts" },
    highlights: ["Spoken English", "Arabic and Quran reading", "Grammar and writing"],
    sections: [
      {
        title: "Language classes for school, work, and travel",
        body:
          "Students can learn spoken English, academic English, Urdu support, Arabic reading, Tajweed basics, IELTS communication, and business communication with focused practice.",
      },
      {
        title: "Personal learning plans",
        body:
          "Tutors can adjust lessons for beginners, school learners, professionals, interview preparation, study abroad goals, and exam-focused language improvement.",
      },
    ],
    popularLinks: [
      { label: "English language", to: "/english-language" },
      { label: "IELTS preparation", to: "/ielts" },
      { label: "Quran and Tajweed", to: "/quran-tajweed" },
    ],
    faqs: [
      ["Can adults take language classes?", "Yes, classes are available for students, professionals, and adults."],
      ["Are trial classes available?", "Contact the team on WhatsApp to discuss availability and tutor match."],
    ],
  }),
  buyCourses: page({
    slug: "buy-courses",
    title: "Buy Online Courses in Pakistan | One-to-One Tuition Packages",
    description:
      "Buy personalized online courses and tutoring packages in Pakistan for school subjects, O/A Level, IELTS, programming, Quran, and professional skills.",
    eyebrow: "Buy Courses",
    heading: "Choose personalized courses instead of one-size-fits-all lectures",
    intro:
      "A Plus Academy helps families arrange tutor-led courses for academic subjects, skills, language learning, and exam preparation.",
    imageId: 5905709,
    imageAlt: "Student attending an online course",
    primaryCta: { label: "Discuss Course Plan", href: "https://wa.me/923197659491" },
    secondaryCta: tutorCta,
    highlights: ["One-to-one online courses", "Custom duration and pace", "Academic and skills-based courses"],
    sections: [
      {
        title: "Course plans built around the learner",
        body:
          "Families can request short courses, monthly classes, exam revision plans, skill training, Quran learning, IELTS preparation, or school-subject support with a suitable tutor.",
      },
      {
        title: "Useful for busy students",
        body:
          "Online courses make it easier to continue learning during school routines, exam seasons, university schedules, and professional commitments.",
      },
    ],
    popularLinks: [
      { label: "Programming courses", to: "/programming" },
      { label: "IELTS course", to: "/ielts" },
      { label: "IT and technology", to: "/it-technology" },
    ],
    faqs: [
      ["Can I buy a fixed recorded course?", "A Plus Academy mainly arranges tutor-led learning plans rather than generic recorded lectures."],
      ["How do I choose a course?", "Tell us your subject, level, city, timing, and goal; our team will suggest the next step."],
    ],
  }),
};

export const classLandingPages = {
  k12: page({
    slug: "k-12",
    title: "K-12 Home Tutors in Pakistan | Grade 1 to 12 Tuition",
    description:
      "Find K-12 home and online tutors in Pakistan for primary, middle, matric, intermediate, science, maths, English, and board exam preparation.",
    eyebrow: "K-12 Tuition",
    heading: "K-12 tuition for stronger concepts from early grades to board exams",
    intro:
      "Get home or online tutors for primary classes, middle school, matric, FSc, ICS, ICom, and grade-wise academic support.",
    imageId: 5212345,
    imageAlt: "Child studying with a tutor",
    primaryCta: { label: "Find K-12 Tutors", to: "/teachers" },
    secondaryCta: registerCta,
    highlights: ["Grade 1 to 12", "Matric, FSc, ICS and ICom", "Homework and exam preparation"],
    sections: [
      {
        title: "Support for Pakistani school systems",
        body:
          "Tutors can help students following Punjab Board, Federal Board, Sindh Board, Cambridge foundation, private school syllabi, and school-specific assessment plans.",
      },
      {
        title: "Subjects covered",
        body:
          "Common requests include mathematics, English, Urdu, science, physics, chemistry, biology, computer science, Pakistan studies, Islamic studies, and homework support.",
      },
    ],
    popularLinks: [
      { label: "O and A Level", to: "/o-a-level" },
      { label: "English language", to: "/english-language" },
      { label: "Quran classes", to: "/quran-tajweed" },
    ],
    faqs: [
      ["Do you provide female home tutors?", "Tutor availability depends on city, subject, and timing; share your preference with the team."],
      ["Can siblings study together?", "Yes, families can discuss group or sibling learning needs on WhatsApp."],
    ],
  }),
  oALevel: page({
    slug: "o-a-level",
    title: "O Level and A Level Tutors in Pakistan | Cambridge Tuition",
    description:
      "Find O Level and A Level tutors in Pakistan for Cambridge Maths, Physics, Chemistry, Biology, English, Economics, Business, and Computer Science.",
    eyebrow: "O & A Level",
    heading: "Cambridge O Level and A Level tuition with subject-focused tutors",
    intro:
      "Prepare for Cambridge exams with tutors who understand syllabus coverage, past-paper practice, marking schemes, and concept clarity.",
    imageId: 256417,
    imagePath: "pexels-photo-256417.jpeg",
    imageAlt: "Students studying in a library",
    primaryCta: { label: "Find O/A Level Tutors", to: "/teachers?subject=O%20Level" },
    highlights: ["Cambridge syllabus support", "Past-paper practice", "Science, commerce and humanities"],
    sections: [
      {
        title: "Exam preparation that goes beyond memorising notes",
        body:
          "Students need command over concepts, question patterns, timing, and examiner expectations. One-to-one tutoring helps identify weak areas before the final exam pressure builds.",
      },
      {
        title: "Popular O and A Level subjects",
        body:
          "Mathematics, Add Maths, Physics, Chemistry, Biology, English, Urdu, Islamiyat, Pakistan Studies, Economics, Accounting, Business, Computer Science, Sociology, and Psychology.",
      },
    ],
    popularLinks: [
      { label: "Science tutors", to: "/teachers?subject=Physics" },
      { label: "English tutors", to: "/english-language" },
      { label: "Programming tutors", to: "/programming" },
    ],
    faqs: [
      ["Do tutors help with past papers?", "Yes, tutors can guide topical and yearly past-paper practice."],
      ["Is online O Level tuition available?", "Yes, online and home tuition options are available depending on subject and tutor availability."],
    ],
  }),
  bachelorsMasters: page({
    slug: "bachelors-masters",
    title: "Bachelors and Masters Tutors in Pakistan | University Subject Support",
    description:
      "Get bachelors and masters tutoring in Pakistan for business, computer science, maths, statistics, English, accounting, economics, and research support.",
    eyebrow: "Bachelors / Masters",
    heading: "University-level tutoring for assignments, concepts, and exam readiness",
    intro:
      "Find tutors for undergraduate and postgraduate subjects, including business, computing, maths, statistics, economics, English, and research guidance.",
    imageId: 159711,
    imagePath: "books-bookstore-book-reading-159711.jpeg",
    imageAlt: "University books on a study table",
    primaryCta: { label: "Find University Tutors", to: "/teachers" },
    highlights: ["Bachelors and masters support", "Assignments and exam prep", "Research and presentation skills"],
    sections: [
      {
        title: "Help for demanding university courses",
        body:
          "University learners often need support with difficult concepts, missed lectures, projects, quantitative courses, programming, accounting, economics, and academic writing.",
      },
      {
        title: "Flexible learning for students and professionals",
        body:
          "Online tutoring makes it easier for university students and working professionals to manage classes around semester deadlines and job schedules.",
      },
    ],
    popularLinks: [
      { label: "Programming", to: "/programming" },
      { label: "IT and technology", to: "/it-technology" },
      { label: "English writing", to: "/english-language" },
    ],
    faqs: [
      ["Do you help with assignments?", "Tutors can guide concepts, structure, research direction, and practice while keeping learning honest."],
      ["Can masters students find tutors?", "Yes, subject availability depends on the field and required level."],
    ],
  }),
  competitiveExams: page({
    slug: "competitive-exams",
    title: "Competitive Exam Preparation in Pakistan | MDCAT, ECAT, CSS, NTS",
    description:
      "Prepare for competitive exams in Pakistan including MDCAT, ECAT, CSS, PMS, NTS, entry tests, aptitude tests, English, maths, and general knowledge.",
    eyebrow: "Competitive Exams",
    heading: "Competitive exam preparation with focused practice and accountability",
    intro:
      "Get one-to-one support for entry tests, aptitude, English, maths, science, general knowledge, interview readiness, and revision planning.",
    imageId: 7092613,
    imageAlt: "Student preparing for an exam",
    primaryCta: { label: "Find Exam Tutors", to: "/teachers" },
    highlights: ["MDCAT, ECAT and entry tests", "CSS, PMS, NTS and aptitude", "Revision plans and practice"],
    sections: [
      {
        title: "Preparation that respects the exam pattern",
        body:
          "Good exam prep needs topic coverage, repeated practice, timing control, weak-area tracking, and confidence under pressure. Tutors can help students stay consistent.",
      },
      {
        title: "Subjects and skills covered",
        body:
          "Common areas include English, analytical reasoning, quantitative reasoning, biology, chemistry, physics, mathematics, current affairs, essay writing, and interview practice.",
      },
    ],
    popularLinks: [
      { label: "English language", to: "/english-language" },
      { label: "K-12 science", to: "/k-12" },
      { label: "IELTS", to: "/ielts" },
    ],
    faqs: [
      ["Which exams can tutors support?", "Availability depends on the requested exam, subject level, city, and timing."],
      ["Can I get a short revision plan?", "Yes, short-term revision support can be arranged when suitable tutors are available."],
    ],
  }),
  itTechnology: page({
    slug: "it-technology",
    title: "IT and Technology Courses in Pakistan | Computer Science Tutors",
    description:
      "Learn IT and technology in Pakistan with tutors for computer science, web development, AI basics, data analysis, networking, office skills, and digital tools.",
    eyebrow: "IT & Technology",
    heading: "Technology learning for school, university, and career growth",
    intro:
      "Build practical technology skills with tutors for computer science, digital tools, web development, data, networking, and software basics.",
    imageId: 1181354,
    imageAlt: "Technology workspace with laptop",
    primaryCta: { label: "Find IT Tutors", to: "/teachers?subject=Computer%20Science" },
    secondaryCta: { label: "Programming Classes", to: "/programming" },
    highlights: ["Computer science tutoring", "Digital skills and office tools", "Web, data and AI basics"],
    sections: [
      {
        title: "Practical computer learning",
        body:
          "Students can learn school computer science, university computing subjects, Microsoft Office, Google Workspace, web basics, data analysis, networking concepts, and digital productivity.",
      },
      {
        title: "For learners at different levels",
        body:
          "A beginner may need confidence with computer basics, while a university student may need help with logic, databases, algorithms, or project work.",
      },
    ],
    popularLinks: [
      { label: "Programming", to: "/programming" },
      { label: "Graphics and multimedia", to: "/graphics-multimedia" },
      { label: "Bachelors and masters", to: "/bachelors-masters" },
    ],
    faqs: [
      ["Can beginners join?", "Yes, technology classes can start from basic computer use."],
      ["Do tutors help with projects?", "Tutors can guide learning, planning, debugging, and presentation of project work."],
    ],
  }),
  programming: page({
    slug: "programming",
    title: "Programming Tutors in Pakistan | Python, JavaScript, C++ & Web Development",
    description:
      "Find programming tutors in Pakistan for Python, JavaScript, C++, Java, web development, data structures, algorithms, school CS, and university coding help.",
    eyebrow: "Programming",
    heading: "Learn programming with patient tutors and real practice",
    intro:
      "Move from confusion to working code with one-to-one support for Python, JavaScript, C++, Java, web development, logic, and university programming courses.",
    imageId: 1181675,
    imageAlt: "Programming code on a laptop screen",
    primaryCta: { label: "Find Programming Tutors", to: "/teachers?subject=Programming" },
    secondaryCta: { label: "IT Courses", to: "/it-technology" },
    highlights: ["Python, JavaScript, C++ and Java", "Web development", "Data structures and algorithms"],
    sections: [
      {
        title: "Coding support for beginners and advanced learners",
        body:
          "Tutors can help students understand syntax, logic building, debugging, loops, functions, object-oriented programming, databases, frontend basics, backend concepts, and coding assignments.",
      },
      {
        title: "Useful for school, university, and careers",
        body:
          "Programming classes can support Cambridge Computer Science, matric and intermediate CS, BSCS courses, bootcamp preparation, freelancing goals, and portfolio projects.",
      },
    ],
    popularLinks: [
      { label: "IT and technology", to: "/it-technology" },
      { label: "Graphics and multimedia", to: "/graphics-multimedia" },
      { label: "University support", to: "/bachelors-masters" },
    ],
    faqs: [
      ["Which language should I start with?", "Python is often beginner-friendly, but the right language depends on your course or goal."],
      ["Can tutors help with debugging?", "Yes, tutors can guide debugging and explain the reason behind errors."],
    ],
  }),
  quranTajweed: page({
    slug: "quran-tajweed",
    title: "Quran and Tajweed Classes in Pakistan | Online & Home Tutors",
    description:
      "Find Quran and Tajweed tutors in Pakistan for children and adults. Learn Quran reading, Nazra, Tajweed rules, duas, and Islamic studies online or at home.",
    eyebrow: "Qur'an & Tajweed",
    heading: "Quran and Tajweed classes with respectful one-to-one guidance",
    intro:
      "Learn Quran reading, Tajweed rules, pronunciation, duas, prayer guidance, and Islamic studies with online or home tutors.",
    imageId: 159711,
    imagePath: "books-bookstore-book-reading-159711.jpeg",
    imageAlt: "Books arranged for study",
    primaryCta: { label: "Find Quran Tutors", to: "/teachers?subject=Quran" },
    highlights: ["Nazra and Tajweed", "Children and adults", "Online and home classes"],
    sections: [
      {
        title: "Learning at a comfortable pace",
        body:
          "Quran classes can support beginners, children, adults, revision learners, and students who need pronunciation correction or a regular recitation routine.",
      },
      {
        title: "What classes can include",
        body:
          "Depending on tutor availability, students can study Quran reading, Tajweed basics, daily duas, namaz guidance, short surahs, Islamic studies, and habit-building for regular learning.",
      },
    ],
    popularLinks: [
      { label: "Language tutors", to: "/languages" },
      { label: "K-12 tuition", to: "/k-12" },
      { label: "Find tutors", to: "/teachers" },
    ],
    faqs: [
      ["Are classes available for children?", "Yes, many families request Quran classes for children."],
      ["Can adults learn Tajweed?", "Yes, adults can take beginner or correction-focused Tajweed classes."],
    ],
  }),
  englishLanguage: page({
    slug: "english-language",
    title: "English Language Tutors in Pakistan | Spoken English & Grammar",
    description:
      "Improve spoken English, grammar, writing, pronunciation, interview English, academic English, and IELTS speaking with language tutors in Pakistan.",
    eyebrow: "English Language",
    heading: "English language classes for confidence in study, work, and daily life",
    intro:
      "Get one-to-one English support for speaking, grammar, pronunciation, writing, reading, interviews, presentations, and academic communication.",
    imageId: 4145190,
    imageAlt: "English language learner taking notes",
    primaryCta: { label: "Find English Tutors", to: "/teachers?subject=English" },
    secondaryCta: { label: "IELTS Preparation", to: "/ielts" },
    highlights: ["Spoken English", "Grammar and writing", "Interview and presentation practice"],
    sections: [
      {
        title: "Practical English for Pakistani learners",
        body:
          "Students can improve school English, university writing, workplace communication, public speaking, pronunciation, grammar, vocabulary, and confidence in real conversations.",
      },
      {
        title: "Personalized practice matters",
        body:
          "A tutor can correct mistakes, explain patterns, assign speaking tasks, build vocabulary, and help learners practise consistently instead of only reading rules.",
      },
    ],
    popularLinks: [
      { label: "IELTS", to: "/ielts" },
      { label: "Languages", to: "/languages" },
      { label: "Study abroad", to: "/study-abroad" },
    ],
    faqs: [
      ["Can beginners learn spoken English?", "Yes, classes can start with basic sentence building and daily conversation."],
      ["Do you help with English writing?", "Yes, tutors can support grammar, essays, email writing, and academic writing."],
    ],
  }),
  ielts: page({
    slug: "ielts",
    title: "IELTS Preparation in Pakistan | Online & Home IELTS Tutors",
    description:
      "Prepare for IELTS in Pakistan with tutors for speaking, writing, reading, listening, band improvement, mock practice, and study abroad readiness.",
    eyebrow: "IELTS",
    heading: "IELTS preparation with focused feedback on every module",
    intro:
      "Improve IELTS speaking, writing, reading, and listening with tutor-led practice, band-focused feedback, and a realistic study plan.",
    imageId: 5940831,
    imageAlt: "Student preparing notes for IELTS",
    primaryCta: { label: "Find IELTS Tutors", to: "/teachers?subject=IELTS" },
    secondaryCta: { label: "Study Abroad Support", to: "/study-abroad" },
    highlights: ["Speaking and writing feedback", "Reading and listening practice", "Band improvement planning"],
    sections: [
      {
        title: "IELTS support for study, work, and migration goals",
        body:
          "Students preparing for international education or professional goals can work on grammar accuracy, fluency, task response, coherence, vocabulary, listening skills, and reading speed.",
      },
      {
        title: "Practice with correction",
        body:
          "IELTS improves faster when learners receive regular feedback on writing tasks, speaking responses, timing, common mistakes, and test strategy.",
      },
    ],
    popularLinks: [
      { label: "English language", to: "/english-language" },
      { label: "Study abroad", to: "/study-abroad" },
      { label: "Find tutors", to: "/teachers" },
    ],
    faqs: [
      ["Can I prepare online?", "Yes, IELTS preparation can be arranged online from anywhere in Pakistan."],
      ["Do tutors check writing?", "Tutors can review task 1 and task 2 writing and explain how to improve."],
    ],
  }),
  graphicsMultimedia: page({
    slug: "graphics-multimedia",
    title: "Graphics and Multimedia Courses in Pakistan | Design Tutors",
    description:
      "Learn graphic design and multimedia in Pakistan with tutors for Photoshop, Illustrator, Canva, video editing, UI basics, branding, and portfolio projects.",
    eyebrow: "Graphics & Multimedia",
    heading: "Design and multimedia learning for creative skills and portfolios",
    intro:
      "Learn graphic design, Canva, Photoshop, Illustrator, video editing, branding basics, UI design basics, and project-based creative skills.",
    imageId: 196645,
    imageAlt: "Graphic designer working on a laptop",
    primaryCta: { label: "Find Design Tutors", to: "/teachers?subject=Graphic%20Design" },
    secondaryCta: { label: "IT Courses", to: "/it-technology" },
    highlights: ["Photoshop, Illustrator and Canva", "Video editing basics", "Portfolio and project guidance"],
    sections: [
      {
        title: "Creative skills for students and freelancers",
        body:
          "Design classes can support school projects, university portfolios, freelancing preparation, social media design, business branding, presentations, and digital content creation.",
      },
      {
        title: "Project-based learning",
        body:
          "Students learn faster by creating posters, logos, social posts, presentations, thumbnails, reels, basic edits, and portfolio pieces with tutor feedback.",
      },
    ],
    popularLinks: [
      { label: "IT and technology", to: "/it-technology" },
      { label: "Programming", to: "/programming" },
      { label: "Buy courses", to: "/buy-courses" },
    ],
    faqs: [
      ["Can beginners learn graphic design?", "Yes, beginners can start with Canva, design basics, and simple projects."],
      ["Do tutors help with portfolio work?", "Tutors can guide portfolio structure, project ideas, and software practice."],
    ],
  }),
};

export const extraSeoPages = {
  onlineTutorsPakistan: page({
    slug: "online-tutors-pakistan",
    title: "Online Tutors in Pakistan | One-to-One Online Tuition",
    description:
      "Find online tutors in Pakistan for school, O/A Level, IELTS, Quran, programming, English, university subjects, and exam preparation.",
    eyebrow: "Online Tutors Pakistan",
    heading: "Online tutoring across Pakistan with flexible one-to-one learning",
    intro:
      "Study from home with online tutors for academic subjects, Quran, IELTS, languages, programming, university support, and skills courses.",
    imageId: 4145354,
    imageAlt: "Student joining an online class",
    primaryCta: tutorCta,
    highlights: ["Online classes nationwide", "Flexible timings", "Academic and skills tutoring"],
    sections: [
      {
        title: "A useful option for busy families",
        body:
          "Online tuition is helpful when commute time, tutor availability, weather, city distance, or schedule conflicts make home tuition difficult.",
      },
      {
        title: "Subjects available online",
        body:
          "Students can request online classes for school subjects, O and A Level, Quran, English, IELTS, programming, IT, university subjects, and creative skills.",
      },
    ],
    popularLinks: [
      { label: "K-12 tuition", to: "/k-12" },
      { label: "IELTS", to: "/ielts" },
      { label: "Programming", to: "/programming" },
    ],
    faqs: [
      ["Do online classes work for younger students?", "Yes, but younger learners may need parent support and a consistent routine."],
      ["Can I switch from online to home tuition?", "You can discuss options with the team depending on city and tutor availability."],
    ],
  }),
  homeTutorsLahore: page({
    slug: "home-tutors-lahore",
    title: "Home Tutors in Lahore | A Plus Academy Pakistan",
    description:
      "Find verified home tutors in Lahore for school subjects, O/A Level, Quran, IELTS, programming, English, and university tutoring.",
    eyebrow: "Home Tutors Lahore",
    heading: "Home and online tutors in Lahore for every important learning goal",
    intro:
      "Connect with tutors in Lahore for school support, board exams, Cambridge subjects, Quran, English, IELTS, programming, and university courses.",
    imageId: 8613089,
    imageAlt: "Tutor helping students in a classroom",
    primaryCta: { label: "Find Lahore Tutors", to: "/teachers?location=Lahore" },
    secondaryCta: registerCta,
    highlights: ["Home tuition in Lahore", "Online classes available", "School, exam and skills support"],
    sections: [
      {
        title: "Tutoring for Lahore families",
        body:
          "Students can request tutors for school subjects, matric, FSc, O Level, A Level, Quran, IELTS, English, programming, and professional skills.",
      },
      {
        title: "Tutor matching by subject and availability",
        body:
          "A strong match considers the student's class, subject, preferred timing, tutor experience, area, learning style, and online or home-tuition preference.",
      },
    ],
    popularLinks: [
      { label: "O and A Level", to: "/o-a-level" },
      { label: "K-12", to: "/k-12" },
      { label: "Tutor jobs", to: "/jobs" },
    ],
    faqs: [
      ["Do you cover all Lahore areas?", "Availability depends on area, subject, and tutor schedule."],
      ["Can Lahore students take online classes?", "Yes, online classes are available for Lahore students too."],
    ],
  }),
};

export const keywordSeoPages = {
  femaleHomeTutorLahore: page({
    slug: "female-home-tutor-lahore",
    title: "Female Home Tutor in Lahore | Verified Female Tutors",
    description:
      "Find a verified female home tutor in Lahore for school subjects, O/A Level, Quran, English, IELTS, and one-to-one home tuition.",
    eyebrow: "Female Home Tutor Lahore",
    heading: "Verified female home tutors in Lahore for safe one-to-one learning",
    intro:
      "A Plus Home Tutors helps families find female tutors in Lahore for school support, exam preparation, Quran learning, English, IELTS, and academic confidence at home.",
    imageId: 5212331,
    imageAlt: "Female teacher helping students in class",
    primaryCta: { label: "Find Female Tutors", to: "/teachers?location=Lahore" },
    highlights: ["Female tutors in Lahore", "Home and online options", "School, Quran, English and IELTS"],
    sections: [
      {
        title: "Female tutor matching for Lahore families",
        body:
          "Many families prefer a female home tutor for younger students, girls, Quran reading, English practice, and regular school support. Tutor availability depends on area, timing, subject, and class level.",
      },
      {
        title: "Subjects female tutors can support",
        body:
          "Common requests include Math, English, Science, Urdu, Islamiat, O Level, A Level, Quran with Tajweed, IELTS speaking, grammar, homework support, and exam revision.",
      },
    ],
    popularLinks: [
      { label: "Home tutors Lahore", to: "/home-tutors-lahore" },
      { label: "English tutor Lahore", to: "/english-tutor-lahore" },
      { label: "Quran tutor with Tajweed", to: "/quran-tutor-with-tajweed" },
    ],
    faqs: [
      ["Can I request a female tutor near my area?", "Yes, share your area, subject, class, and timing so availability can be checked."],
      ["Are online female tutors available?", "Yes, online female tutors can be arranged depending on the subject and schedule."],
    ],
  }),
  homeTuitionLahore: page({
    slug: "home-tuition-lahore",
    title: "Home Tuition in Lahore | One-to-One Tutors at Home",
    description:
      "Arrange home tuition in Lahore with verified tutors for school subjects, O/A Level, Matric, FSc, Quran, IELTS, English, and exam preparation.",
    eyebrow: "Home Tuition Lahore",
    heading: "Home tuition in Lahore for focused academic progress",
    intro:
      "Get one-to-one home tuition in Lahore for school children, O/A Level students, board exam preparation, Quran learning, English language, and university subjects.",
    imageId: 5212345,
    imageAlt: "Tutor helping a child study at home",
    primaryCta: { label: "Arrange Home Tuition", to: "/teachers?location=Lahore" },
    highlights: ["One-to-one home tuition", "Lahore area-based tutor matching", "Trial and tutor replacement support"],
    sections: [
      {
        title: "Home tuition built around the student's routine",
        body:
          "Home tuition is useful when students need regular attention, homework help, concept clarity, exam revision, or a safe learning routine without travelling to an academy.",
      },
      {
        title: "Classes and subjects covered",
        body:
          "Families can request tutors for primary classes, middle school, Matric, FSc, ICS, ICom, O Level, A Level, Quran, English, IELTS, programming, and university subjects.",
      },
    ],
    popularLinks: [
      { label: "Female home tutor Lahore", to: "/female-home-tutor-lahore" },
      { label: "O Level tutors Lahore", to: "/o-level-tutors-lahore" },
      { label: "Verified tutors Pakistan", to: "/verified-tutors-pakistan" },
    ],
    faqs: [
      ["How quickly can I get a home tutor in Lahore?", "Timing depends on subject, area, class, and tutor availability."],
      ["Can I choose home or online tuition?", "Yes, families can discuss both options based on convenience and tutor availability."],
    ],
  }),
  oLevelTutorsLahore: page({
    slug: "o-level-tutors-lahore",
    title: "O Level Tutors in Lahore | Cambridge Home & Online Tuition",
    description:
      "Find O Level tutors in Lahore for Cambridge Maths, Physics, Chemistry, Biology, English, Islamiyat, Pakistan Studies, Business, Economics, and Computer Science.",
    eyebrow: "O Level Tutors Lahore",
    heading: "O Level tutors in Lahore for Cambridge syllabus and past-paper practice",
    intro:
      "Connect with O Level tutors for concept clarity, topical revision, past papers, marking-scheme practice, and subject-specific Cambridge exam preparation.",
    imageId: 256417,
    imagePath: "pexels-photo-256417.jpeg",
    imageAlt: "Books in a library for O Level preparation",
    primaryCta: { label: "Find O Level Tutors", to: "/teachers?subject=O%20Level" },
    highlights: ["Cambridge O Level", "Topical and yearly past papers", "Science, commerce and humanities"],
    sections: [
      {
        title: "O Level preparation with exam-board awareness",
        body:
          "O Level students need more than chapter reading. Strong preparation includes syllabus mapping, paper formats, command words, timing practice, and correction against examiner expectations.",
      },
      {
        title: "Popular O Level subjects",
        body:
          "Tutors may support Mathematics, Add Maths, Physics, Chemistry, Biology, English, Urdu, Islamiyat, Pakistan Studies, Accounting, Economics, Business, and Computer Science.",
      },
    ],
    popularLinks: [
      { label: "A Level tutors Pakistan", to: "/a-level-tutors-pakistan" },
      { label: "English tutor Lahore", to: "/english-tutor-lahore" },
      { label: "Home tuition Lahore", to: "/home-tuition-lahore" },
    ],
    faqs: [
      ["Do O Level tutors help with past papers?", "Yes, tutors can guide topical and yearly past-paper practice."],
      ["Can I request home tuition in DHA Lahore?", "Share your area and subject so tutor availability can be checked."],
    ],
  }),
  aLevelTutorsPakistan: page({
    slug: "a-level-tutors-pakistan",
    title: "A Level Tutors in Pakistan | Cambridge Subject Specialists",
    description:
      "Find A Level tutors in Pakistan for Cambridge Maths, Physics, Chemistry, Biology, Accounting, Economics, Business, Psychology, Sociology, and Computer Science.",
    eyebrow: "A Level Tutors Pakistan",
    heading: "A Level tutors in Pakistan for advanced Cambridge subject support",
    intro:
      "Get A Level tutoring online or at home for difficult concepts, exam technique, past-paper practice, and subject-specific guidance.",
    imageId: 267885,
    imageAlt: "Students walking on a campus after class",
    primaryCta: { label: "Find A Level Tutors", to: "/teachers?subject=A%20Level" },
    highlights: ["Cambridge A Level", "Online tutors across Pakistan", "Advanced subject specialists"],
    sections: [
      {
        title: "Advanced tutoring for demanding subjects",
        body:
          "A Level subjects require deeper concepts, structured problem solving, and strong exam technique. One-to-one tutoring can help students prepare for school exams, mocks, and final papers.",
      },
      {
        title: "Subjects commonly requested",
        body:
          "Popular A Level tutor requests include Mathematics, Physics, Chemistry, Biology, Economics, Business, Accounting, Psychology, Sociology, English, and Computer Science.",
      },
    ],
    popularLinks: [
      { label: "O Level tutors Lahore", to: "/o-level-tutors-lahore" },
      { label: "Online tutors Pakistan", to: "/online-tutors-pakistan" },
      { label: "Bachelors / Masters", to: "/bachelors-masters" },
    ],
    faqs: [
      ["Are online A Level tutors available?", "Yes, online tutoring can be arranged across Pakistan depending on subject availability."],
      ["Can tutors support predicted-grade preparation?", "Tutors can support school tests, mocks, revision, and topic mastery."],
    ],
  }),
  quranTutorWithTajweed: page({
    slug: "quran-tutor-with-tajweed",
    title: "Quran Tutor with Tajweed | Online & Home Quran Classes",
    description:
      "Find a Quran tutor with Tajweed for children and adults. Learn Nazra, Tajweed rules, makharij, fluency, duas, and Quran reading online or at home.",
    eyebrow: "Quran Tutor with Tajweed",
    heading: "Quran tutors with Tajweed for clear recitation and steady learning",
    intro:
      "Arrange Quran classes for children or adults with support for Nazra, Tajweed rules, makharij, fluency, revision, duas, and regular recitation practice.",
    imageId: 8164397,
    imagePath: "pexels-photo-8164397.jpeg",
    imageAlt: "Quran placed on a wooden stand",
    primaryCta: { label: "Find Quran Tutors", to: "/teachers?subject=Quran" },
    highlights: ["Nazra and Tajweed", "Children and adults", "Online and home classes"],
    sections: [
      {
        title: "Tajweed-focused Quran learning",
        body:
          "A Tajweed tutor can help correct pronunciation, makharij, fluency, pauses, and recitation habits while keeping lessons respectful and consistent.",
      },
      {
        title: "Online and home Quran classes",
        body:
          "Families can request Quran classes at home where available, or online Quran tutoring for flexible schedules and regular follow-up.",
      },
    ],
    popularLinks: [
      { label: "Qur'an & Tajweed", to: "/quran-tajweed" },
      { label: "Female home tutor Lahore", to: "/female-home-tutor-lahore" },
      { label: "Online tutors Pakistan", to: "/online-tutors-pakistan" },
    ],
    faqs: [
      ["Can children start from beginner level?", "Yes, Quran classes can start from basic Arabic letters and Nazra."],
      ["Do you provide female Quran tutors?", "Female tutor availability depends on timing, location, and class mode."],
    ],
  }),
  ieltsTutorPakistan: page({
    slug: "ielts-tutor-pakistan",
    title: "IELTS Tutor in Pakistan | Speaking, Writing & Band Improvement",
    description:
      "Find an IELTS tutor in Pakistan for speaking, writing task 1 and 2, listening, reading, mock tests, feedback, and band-score improvement.",
    eyebrow: "IELTS Tutor Pakistan",
    heading: "IELTS tutors in Pakistan for speaking, writing, reading and listening",
    intro:
      "Prepare for IELTS with tutor-led feedback on speaking fluency, writing structure, vocabulary, grammar, listening practice, and reading strategy.",
    imageId: 5940831,
    imageAlt: "Student writing IELTS preparation notes",
    primaryCta: { label: "Find IELTS Tutors", to: "/teachers?subject=IELTS" },
    highlights: ["Speaking practice", "Writing task feedback", "Mock tests and band improvement"],
    sections: [
      {
        title: "IELTS preparation with correction",
        body:
          "IELTS learners improve faster when speaking and writing are corrected regularly. Tutors can help with task response, coherence, vocabulary, grammar, pronunciation, and timing.",
      },
      {
        title: "Useful for study abroad and migration goals",
        body:
          "Students can prepare for IELTS Academic or General Training with module-wise practice and a realistic plan based on current ability and target band.",
      },
    ],
    popularLinks: [
      { label: "IELTS preparation", to: "/ielts" },
      { label: "English language", to: "/english-language" },
      { label: "Study abroad", to: "/study-abroad" },
    ],
    faqs: [
      ["Can I study IELTS online?", "Yes, online IELTS tutoring is available for students across Pakistan."],
      ["Do tutors check IELTS writing?", "Tutors can review writing task 1 and task 2 and explain how to improve."],
    ],
  }),
  englishTutorLahore: page({
    slug: "english-tutor-lahore",
    title: "English Tutor in Lahore | Spoken English, Grammar & Writing",
    description:
      "Find an English tutor in Lahore for spoken English, grammar, school English, O Level English, writing, pronunciation, interviews, and IELTS basics.",
    eyebrow: "English Tutor Lahore",
    heading: "English tutors in Lahore for speaking, grammar and writing confidence",
    intro:
      "Improve spoken English, grammar, writing, pronunciation, school English, O Level English, interviews, and daily communication with one-to-one tutoring.",
    imageId: 4145190,
    imageAlt: "Student improving English through notes",
    primaryCta: { label: "Find English Tutors", to: "/teachers?subject=English" },
    highlights: ["Spoken English", "Grammar and writing", "School and O Level English"],
    sections: [
      {
        title: "English learning for school and daily communication",
        body:
          "An English tutor can help students improve sentence structure, grammar, vocabulary, reading, writing, pronunciation, speaking confidence, and exam preparation.",
      },
      {
        title: "Personal feedback makes the difference",
        body:
          "Students often know rules but struggle to use English naturally. One-to-one correction helps turn grammar, speaking, and writing practice into visible progress.",
      },
    ],
    popularLinks: [
      { label: "English Language", to: "/english-language" },
      { label: "IELTS tutor Pakistan", to: "/ielts-tutor-pakistan" },
      { label: "Female home tutor Lahore", to: "/female-home-tutor-lahore" },
    ],
    faqs: [
      ["Can beginners learn spoken English?", "Yes, classes can start from basic sentence building and everyday conversation."],
      ["Can I request an English tutor at home?", "Yes, share your area, class, timing, and learning goal to check availability."],
    ],
  }),
  verifiedTutorsPakistan: page({
    slug: "verified-tutors-pakistan",
    title: "Verified Tutors in Pakistan | Home & Online Tutor Matching",
    description:
      "Find verified tutors in Pakistan for home tuition and online classes. Get tutors for school subjects, O/A Level, Quran, IELTS, English, programming, and exams.",
    eyebrow: "Verified Tutors Pakistan",
    heading: "Verified tutors in Pakistan for safe home and online learning",
    intro:
      "A Plus Home Tutors helps families connect with tutors based on subject, class, city, timing, experience, and learning needs.",
    imageId: 8613089,
    imageAlt: "Teacher guiding students in a classroom",
    primaryCta: { label: "Find Verified Tutors", to: "/teachers" },
    highlights: ["Tutor screening", "Home and online classes", "Subject and city-based matching"],
    sections: [
      {
        title: "Why tutor verification matters",
        body:
          "Families need tutors who are suitable for the subject, class level, schedule, and learning style. Verification and matching help reduce uncertainty before classes begin.",
      },
      {
        title: "Tutors for academic and skills subjects",
        body:
          "Requests commonly include school subjects, O/A Level, Matric, FSc, Quran, IELTS, English, programming, IT, university subjects, and creative skills.",
      },
    ],
    popularLinks: [
      { label: "Home tuition Lahore", to: "/home-tuition-lahore" },
      { label: "Online tutors Pakistan", to: "/online-tutors-pakistan" },
      { label: "Find a tutor", to: "/teachers" },
    ],
    faqs: [
      ["Are all tutors available in every city?", "Availability depends on city, subject, timing, and tutor schedule."],
      ["Can I choose online instead of home tuition?", "Yes, many subjects can be taught online depending on learner needs."],
    ],
  }),
};

export const allLandingPages = {
  ...landingPages,
  ...classLandingPages,
  ...extraSeoPages,
  ...keywordSeoPages,
};
