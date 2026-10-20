import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Box, Button, Checkbox, Chip, CircularProgress, Container, FormControlLabel, LinearProgress, Paper, Radio, Stack, TextField, Typography } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { Navigate, useSearchParams } from "react-router-dom";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/useAuth";

const DURATION = 45 * 60;
const PASS_MARK = 70;
const INACTIVITY_WARNING_SECONDS = 45;
const INACTIVITY_SUBMIT_SECONDS = 60;
const TEST_ID = "ai-cyber-security-foundations-v1";
const pakistanDateKey = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Karachi", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
const attemptDocumentId = (studentId) => `${studentId}_${TEST_ID}_${pakistanDateKey()}`;

const questionBank = [
  ["Authorization","Which security principle ensures that only approved people can view information?",["Confidentiality","Integrity","Availability","Accounting"],0],
  ["Authorization","A password plus a phone prompt performs which function?",["Identification","Authentication","Authorization","Accounting"],1],
  ["Authorization","What does authorization decide?",["Who the user claims to be","Whether identity proof is valid","What actions the user may perform","How long a backup remains available"],2],
  ["Authorization","A log that records access supports which function?",["Accounting","Identification","Availability","Encryption"],0],
  ["Authorization","A student may read a folder but cannot change files. Which access decision is this?",["Allow all","Limit","Revoke","Transfer"],1],
  ["Authorization","Effective access to a Windows network share follows:",["Only NTFS permissions","Only sharing permissions","The more restrictive combination of NTFS and sharing permissions","The permission selected most recently"],2],
  ["Authorization","Which result correctly verifies read-only access?",["Reading works, but creating or changing a file fails","Creating works, but reading fails","The student receives Full Control","The folder must contain personal files"],0],
  ["Access Models","In discretionary access control, who normally chooses who receives access?",["The resource owner","A central labeling authority","The firewall","The auditor"],0],
  ["Access Models","Which model uses security labels and user clearances?",["DAC","MAC","RBAC","Rule-based"],1],
  ["Access Models","Teachers edit lessons while students view and submit work. Which model best fits?",["MAC","RBAC","DAC","Risk transfer"],1],
  ["Access Models","A firewall permits traffic only on an approved port. Which model is demonstrated?",["Rule-based","MAC","DAC","Physical control"],0],
  ["Access Models","Access depends on role, trusted device and approved time. Which model is this?",["RBAC only","ABAC","DAC","MAC"],1],
  ["Access Models","Why can an administrator have Full Control without a direct user entry?",["The browser grants access","Group membership supplies the permission","Availability overrides permissions","The file owner cannot limit access"],1],
  ["Access Models","Which principle grants only the minimum required access?",["Defense in depth","Least privilege","Risk acceptance","Non-repudiation"],1],
  ["Risk & Headers","Which item is a vulnerability?",["A student laptop","Laptop theft","No screen lock","Exposed student files"],2],
  ["Risk & Headers","What is inherent risk?",["Risk remaining after controls","Risk before safeguards are considered","Risk transferred to insurance","Risk with no impact"],1],
  ["Risk & Headers","What is residual risk?",["Risk remaining after safeguards are applied","The highest possible risk","A risk with no owner","A physical risk"],0],
  ["Risk & Headers","Stopping a risky activity is which treatment?",["Mitigate","Avoid","Transfer","Accept"],1],
  ["Risk & Headers","Which header restricts where scripts and other content may load from?",["Content-Security-Policy","Cache-Control","Server","ETag"],0],
  ["Risk & Headers","Which protection primarily reduces clickjacking risk?",["CSP frame-ancestors","Content-Type","Referrer-Policy only","Cache-Control max-age"],0],
  ["Risk & Headers","What does X-Content-Type-Options: nosniff tell the browser?",["Encrypt the response","Avoid guessing a different resource type","Block every JavaScript file","Hide the server address"],1],
  ["Controls","MFA, encryption and a firewall belong to which category?",["Technical","Administrative","Physical","Transfer"],0],
  ["Controls","Security awareness training is mainly which category?",["Physical","Administrative","Corrective only","Cryptographic"],1],
  ["Controls","An alert for repeated failed sign-ins performs which function?",["Preventive","Detective","Corrective","Avoidance"],1],
  ["Controls","Resetting credentials and terminating active sessions performs which function?",["Corrective","Detective","Identification","Risk transfer"],0],
  ["Controls","Why does defense in depth reduce risk?",["It guarantees every attack fails","Multiple layers limit the impact when one control fails","It removes the need for monitoring","It grants broader permissions"],1],
  ["Controls","Which data is authorized for the password-auditing lab?",["Real Gmail credentials","Leaked password lists","Instructor-created dummy passwords and local sample hashes","The academy login page"],2],
  ["Controls","Why should real systems avoid fast general-purpose hashes for password storage?",["They prevent login","They allow guesses to be tested too quickly","They cannot store letters","They always reveal the original password"],1],
].map(([topic, question, options, answer], id) => ({ id, topic, question, options, answer }));

const shuffle = (items) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const createAttempt = () => shuffle(questionBank).map((question) => {
  const options = shuffle(question.options.map((text, index) => ({ text, correct: index === question.answer })));
  return { ...question, options: options.map((item) => item.text), answer: options.findIndex((item) => item.correct) };
});

export default function TestCenter() {
  const { user, loading: authLoading } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [comingSoon, setComingSoon] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [studentIdLoading, setStudentIdLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [index, setIndex] = useState(0);
  const [remaining, setRemaining] = useState(DURATION);
  const [incidents, setIncidents] = useState(0);
  const [incidentDetails, setIncidentDetails] = useState({});
  const [attemptedToday, setAttemptedToday] = useState(false);
  const [attemptLoading, setAttemptLoading] = useState(false);
  const [inactivityWarning, setInactivityWarning] = useState(false);
  const [started, setStarted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const submitted = useRef(false);
  const lastActivity = useRef(Date.now());
  const pointerOutside = useRef(false);

  useEffect(() => {
    if (user?.displayName && !studentName) setStudentName(user.displayName);
  }, [user, studentName]);

  useEffect(() => {
    const loadStudentId = async () => {
      if (!db || !user?.email) {
        setStudentId("");
        return;
      }
      setStudentIdLoading(true);
      setError("");
      try {
        const email = user.email.trim().toLowerCase();
        const snapshot = await getDoc(doc(db, "studentEmailIds", email));
        setStudentId(snapshot.exists() ? String(snapshot.data().studentId || "") : "");
      } catch (loadError) {
        console.error(loadError);
        setStudentId("");
        setError("The assigned Student ID could not be checked.");
      } finally {
        setStudentIdLoading(false);
      }
    };
    loadStudentId();
  }, [user?.email]);

  useEffect(() => {
    const checkDailyAttempt = async () => {
      if (!db || !studentId) return;
      setAttemptLoading(true);
      try {
        const snapshot = await getDoc(doc(db, "testResults", attemptDocumentId(studentId)));
        setAttemptedToday(snapshot.exists());
      } catch (checkError) {
        console.error("Daily attempt could not be checked:", checkError);
        setError("The daily attempt limit could not be checked. Please try again.");
      } finally {
        setAttemptLoading(false);
      }
    };
    checkDailyAttempt();
  }, [studentId]);

  const recordIncident = (type) => {
    if (!started || submitted.current) return;
    setIncidents((value) => value + 1);
    setIncidentDetails((details) => ({ ...details, [type]: (details[type] || 0) + 1 }));
  };

  useEffect(() => {
    if (!started || result) return undefined;
    const visibility = () => document.hidden && recordIncident("tabHidden");
    const fullscreen = () => !document.fullscreenElement && recordIncident("fullscreenExit");
    const blur = () => recordIncident("windowBlur");
    const mouseLeave = () => {
      if (!pointerOutside.current) {
        pointerOutside.current = true;
        recordIncident("pointerLeftPage");
      }
    };
    const mouseEnter = () => { pointerOutside.current = false; lastActivity.current = Date.now(); };
    const activity = () => { lastActivity.current = Date.now(); setInactivityWarning(false); };
    const restricted = (event) => {
      const key = event.key.toLowerCase();
      if (pointerOutside.current) recordIncident("keyboardWhilePointerOutside");
      if (((event.ctrlKey || event.metaKey) && ["c","x","p","s","u","a"].includes(key)) || event.key === "PrintScreen" || event.key === "F12") {
        event.preventDefault();
        recordIncident("restrictedShortcut");
      }
      activity();
    };
    const prevent = (event) => event.preventDefault();
    document.addEventListener("visibilitychange", visibility);
    document.addEventListener("fullscreenchange", fullscreen);
    document.addEventListener("keydown", restricted);
    document.addEventListener("mousemove", activity);
    document.addEventListener("pointerdown", activity);
    document.addEventListener("touchstart", activity);
    document.documentElement.addEventListener("mouseleave", mouseLeave);
    document.documentElement.addEventListener("mouseenter", mouseEnter);
    window.addEventListener("blur", blur);
    document.addEventListener("copy", prevent);
    document.addEventListener("cut", prevent);
    document.addEventListener("contextmenu", prevent);
    return () => {
      document.removeEventListener("visibilitychange", visibility);
      document.removeEventListener("fullscreenchange", fullscreen);
      document.removeEventListener("keydown", restricted);
      document.removeEventListener("mousemove", activity);
      document.removeEventListener("pointerdown", activity);
      document.removeEventListener("touchstart", activity);
      document.documentElement.removeEventListener("mouseleave", mouseLeave);
      document.documentElement.removeEventListener("mouseenter", mouseEnter);
      window.removeEventListener("blur", blur);
      document.removeEventListener("copy", prevent);
      document.removeEventListener("cut", prevent);
      document.removeEventListener("contextmenu", prevent);
    };
  }, [started, result]);

  useEffect(() => {
    if (!started || result) return undefined;
    const timer = window.setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [started, result]);

  useEffect(() => {
    if (started && remaining === 0 && !submitted.current) submitTest(true, "timeExpired");
  }, [remaining, started]);

  const startTest = async () => {
    if (!user) return setError("Sign in with Google before starting the assessment.");
    if (!studentId.trim()) return setError("No Student ID is assigned to this email. Ask an academy administrator to assign one before starting the test.");
    if (attemptedToday) return setError("This Student ID has already completed its test attempt today. The next attempt will be available tomorrow.");
    if (!studentName.trim() || !agreed) return setError("Enter the student name and accept the assessment rules.");
    setError("");
    const attempt = createAttempt();
    setQuestions(attempt);
    setAnswers(Array(attempt.length).fill(null));
    setStarted(true);
    lastActivity.current = Date.now();
    try { await document.documentElement.requestFullscreen?.(); } catch { /* Fullscreen may require browser support. */ }
  };

  const submitTest = async (automatic = false, automaticReason = "") => {
    if (submitted.current || !questions.length) return;
    const unanswered = answers.filter((answer) => answer === null).length;
    if (!automatic && unanswered && !window.confirm(`${unanswered} question(s) are unanswered. Submit anyway?`)) return;
    if (!automatic && !window.confirm("Submit this test now? This cannot be undone.")) return;
    submitted.current = true;
    setSaving(true);
    setError("");
    const correct = questions.reduce((total, question, questionIndex) => total + (answers[questionIndex] === question.answer ? 1 : 0), 0);
    const percentage = Math.round((correct / questions.length) * 100);
    const inactivityIncident = automaticReason === "inactivity" ? 1 : 0;
    const finalIncidentDetails = inactivityIncident
      ? { ...incidentDetails, inactivityAutoSubmit: (incidentDetails.inactivityAutoSubmit || 0) + 1 }
      : incidentDetails;
    const topicScores = [...new Set(questions.map((question) => question.topic))].reduce((summary, topic) => {
      const topicQuestions = questions.map((question, questionIndex) => ({ question, questionIndex })).filter(({ question }) => question.topic === topic);
      summary[topic] = { correct: topicQuestions.filter(({ question, questionIndex }) => answers[questionIndex] === question.answer).length, total: topicQuestions.length };
      return summary;
    }, {});
    const payload = {
      testId: TEST_ID,
      testTitle: "AI Cyber Security Foundations Assessment",
      userId: user.uid,
      userEmail: user.email || "",
      studentName: studentName.trim(),
      studentId: studentId.trim(),
      correct,
      total: questions.length,
      percentage,
      passed: percentage >= PASS_MARK,
      passMark: PASS_MARK,
      incidents: incidents + inactivityIncident,
      incidentDetails: finalIncidentDetails,
      automaticSubmission: automatic,
      automaticSubmissionReason: automaticReason,
      attemptDate: pakistanDateKey(),
      unanswered,
      durationSeconds: DURATION - remaining,
      topicScores,
      submittedAt: serverTimestamp(),
    };
    try {
      if (!db) throw new Error("The assessment database is not configured.");
      const resultRef = doc(db, "testResults", attemptDocumentId(studentId));
      await setDoc(resultRef, payload);
      setResult({ ...payload, id: resultRef.id });
      setAttemptedToday(true);
      try { await document.exitFullscreen?.(); } catch { /* no-op */ }
    } catch (saveError) {
      console.error(saveError);
      submitted.current = false;
      setError("The result could not be saved. Keep this page open and ask the administrator to check the connection.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (!started || result || submitted.current) return undefined;
    const inactivityTimer = window.setInterval(() => {
      const inactiveSeconds = Math.floor((Date.now() - lastActivity.current) / 1000);
      if (inactiveSeconds >= INACTIVITY_SUBMIT_SECONDS && !submitted.current) {
        submitTest(true, "inactivity");
      } else if (inactiveSeconds >= INACTIVITY_WARNING_SECONDS) {
        setInactivityWarning(true);
      }
    }, 1000);
    return () => window.clearInterval(inactivityTimer);
  }, [started, result, questions, answers, incidents, incidentDetails]);

  const answered = answers.filter((answer) => answer !== null).length;
  const timer = `${String(Math.floor(remaining / 60)).padStart(2,"0")}:${String(remaining % 60).padStart(2,"0")}`;
  const current = questions[index];
  const topicSummary = useMemo(() => result ? Object.entries(result.topicScores) : [], [result]);

  if (authLoading) return <Box sx={{ minHeight: "70vh", display: "grid", placeItems: "center" }}><CircularProgress /></Box>;
  if (!user) return <Navigate to="/student/login?returnTo=%2FTestCenter" replace />;

  if (searchParams.get("test") !== "cyber-security-with-ai") {
    const tests = [
      { title: "Python Development", description: "Python programming, problem-solving and application development.", available: false, color: "#306998" },
      { title: "Front End Development", description: "HTML, CSS, JavaScript and modern responsive web interfaces.", available: false, color: "#e44d26" },
      { title: "Cyber Security With AI", description: "Authorization, risk, security controls, web security and ethical password auditing.", available: true, color: "#087f8c" },
      { title: "Digital Marketing With AI", description: "Digital campaigns, content, analytics and responsible AI-assisted marketing.", available: false, color: "#7b2cbf" },
    ];
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#f7f4ed", py: 5 }}>
        <Container maxWidth="lg">
          <Paper sx={{ p: { xs: 3, md: 6 }, bgcolor: "#13233f", color: "white", borderTop: "8px solid #f39c4a", borderRadius: 3 }}>
            <Typography fontWeight={900} color="#f39c4a">A PLUS ACADEMY</Typography>
            <Typography component="h1" variant="h2" fontWeight={900} sx={{ mt: 1 }}>Test Center</Typography>
            <Typography sx={{ mt: 2, color: "#dce6ef", fontSize: 19 }}>Choose your course assessment. Signed in as {user.email}</Typography>
          </Paper>
          {comingSoon && <Alert severity="info" sx={{ mt: 3, py: 1.5 }} onClose={() => setComingSoon("")}><b>{comingSoon}</b> is coming soon. A better and more complete assessment version is being prepared.</Alert>}
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 3, mt: 3 }}>
            {tests.map((test) => (
              <Paper key={test.title} sx={{ p: 3.5, borderRadius: 3, borderTop: `7px solid ${test.color}`, display: "flex", flexDirection: "column", minHeight: 245 }}>
                <Chip label={test.available ? "AVAILABLE NOW" : "COMING SOON"} color={test.available ? "success" : "default"} sx={{ alignSelf: "flex-start", fontWeight: 900 }} />
                <Typography variant="h4" fontWeight={900} sx={{ mt: 2 }}>{test.title}</Typography>
                <Typography color="text.secondary" sx={{ mt: 1.5, mb: 3, lineHeight: 1.7 }}>{test.description}</Typography>
                <Button variant={test.available ? "contained" : "outlined"} sx={{ mt: "auto", alignSelf: "flex-start", fontWeight: 900, bgcolor: test.available ? test.color : undefined }} onClick={() => test.available ? setSearchParams({ test: "cyber-security-with-ai" }) : setComingSoon(test.title)}>{test.available ? "Open assessment" : "View availability"}</Button>
              </Paper>
            ))}
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f7f4ed", py: 5, userSelect: started ? "none" : "auto" }}>
      {started && !result && <Box sx={{ pointerEvents: "none", position: "fixed", inset: 0, zIndex: 30, display: "grid", placeItems: "center", transform: "rotate(-24deg)", color: "rgba(19,35,63,.06)", fontSize: { xs: 22, md: 42 }, fontWeight: 900, letterSpacing: ".1em" }}>{studentName} · {studentId}</Box>}
      <Container maxWidth="lg">
        {!started && !result && <>
          <Button onClick={() => setSearchParams({})} sx={{ mb: 2, fontWeight: 800 }}>← Back to all tests</Button>
          <Paper sx={{ p: { xs: 3, md: 6 }, bgcolor: "#13233f", color: "white", borderTop: "8px solid #f39c4a", borderRadius: 3 }}>
            <Typography fontWeight={900} color="#f39c4a">DATA & CYBER SECURITY WITH AI</Typography>
            <Typography component="h1" variant="h2" fontWeight={900} sx={{ mt: 1 }}>Course Assessment</Typography>
            <Typography sx={{ mt: 2, color: "#dce6ef", maxWidth: 820, fontSize: 19 }}>Authorization, access-control models, cybersecurity risk, response headers, security controls and ethical password auditing</Typography>
          </Paper>
          <Paper sx={{ mt: 3, p: { xs: 3, md: 4 }, borderRadius: 3 }}>
            {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}
            <Alert severity="success">Signed in as {user.email}</Alert>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mt: 3 }}>
              <TextField fullWidth label="Student full name" value={studentName} onChange={(event) => setStudentName(event.target.value)} inputProps={{ maxLength: 60 }} />
              <TextField fullWidth label="Assigned Student ID" value={studentIdLoading ? "Checking..." : studentId || "Not assigned"} InputProps={{ readOnly: true }} helperText="Only an academy administrator can assign or change this ID." />
            </Stack>
            {!studentIdLoading && !studentId && <Alert severity="warning" sx={{ mt: 2 }} action={<Button color="inherit" startIcon={<WhatsAppIcon />} href="https://wa.me/923066762289?text=Hello%20A%20Plus%20Academy%2C%20I%20need%20a%20Student%20ID%20for%20the%20Cyber%20Security%20Test%20or%20I%20want%20to%20register%20for%20the%20course." target="_blank" rel="noopener noreferrer">WhatsApp</Button>}>No Test ID is assigned to {user.email}. Contact the administrator at <b>+92 306 6762289</b> for Test ID generation or course registration.</Alert>}
            {!attemptLoading && attemptedToday && <Alert severity="info" sx={{ mt: 2 }}>Today’s assessment attempt has already been used. One attempt is available per Student ID each day.</Alert>}
            <Alert severity="info" sx={{ mt: 3 }}>28 randomized questions · 45 minutes · 70% pass mark · automatic result submission</Alert>
            <Typography variant="h5" fontWeight={900} sx={{ mt: 3 }}>Assessment rules</Typography>
            <Box component="ol" sx={{ lineHeight: 1.8 }}><li>Use only this assessment page.</li><li>Copying, printing, right-click and common capture shortcuts are blocked.</li><li>Assessment activity and page focus are monitored for test integrity.</li><li>Complete the assessment independently in a quiet and distraction-free environment.</li><li>The assessment submits automatically when time expires or after one minute without activity.</li><li>Each Student ID may complete one attempt per day.</li></Box>
            <FormControlLabel control={<Checkbox checked={agreed} onChange={(event) => setAgreed(event.target.checked)} />} label="I understand the rules and will complete the test independently." />
            <Box><Button variant="contained" size="large" disabled={!studentId || studentIdLoading || attemptLoading || attemptedToday} onClick={startTest} sx={{ mt: 2, fontWeight: 900, bgcolor: "#087f8c" }}>Start test in fullscreen</Button></Box>
          </Paper>
        </>}

        {started && !result && current && <>
          <Paper sx={{ mb: 2, px: 3, py: 2, bgcolor: "#13233f", color: "white", borderRadius: 2, position: "sticky", top: 8, zIndex: 20 }}><Stack direction="row" justifyContent="space-between"><Typography fontWeight={900}>AI Cyber Security Assessment</Typography><Typography fontFamily="monospace" fontSize={24} fontWeight={900} color={remaining <= 300 ? "#ffb266" : "white"}>{timer}</Typography></Stack></Paper>
          {inactivityWarning && <Alert severity="warning" sx={{ mb: 2 }}>No activity detected. Move the mouse or press a permitted key now. The test will submit automatically after one minute without activity.</Alert>}
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 260px" }, gap: 3 }}>
            <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
              <Stack direction="row" justifyContent="space-between"><Typography color="text.secondary" fontWeight={800}>Question {index + 1} of {questions.length}</Typography><Chip label={current.topic} /></Stack>
              <Typography variant="h5" fontWeight={800} sx={{ my: 3 }}>{current.question}</Typography>
              <Stack spacing={1.5}>{current.options.map((option, optionIndex) => <Paper key={option} component="label" variant="outlined" sx={{ p: 1.5, cursor: "pointer", borderWidth: 2, borderColor: answers[index] === optionIndex ? "#087f8c" : "divider", bgcolor: answers[index] === optionIndex ? "#eef9fa" : "white" }}><Radio checked={answers[index] === optionIndex} onChange={() => setAnswers((values) => values.map((value, answerIndex) => answerIndex === index ? optionIndex : value))} />{String.fromCharCode(65 + optionIndex)}. {option}</Paper>)}</Stack>
              <Stack direction="row" justifyContent="space-between" sx={{ mt: 4 }}><Button disabled={index === 0} onClick={() => setIndex((value) => value - 1)}>Previous</Button>{index < questions.length - 1 ? <Button variant="contained" onClick={() => setIndex((value) => value + 1)}>Next</Button> : <Button color="error" variant="contained" disabled={saving} onClick={() => submitTest(false)}>{saving ? "Saving..." : "Submit test"}</Button>}</Stack>
            </Paper>
            <Paper sx={{ p: 3, borderRadius: 3, alignSelf: "start" }}><Typography variant="h6" fontWeight={900}>Progress</Typography><LinearProgress variant="determinate" value={(answered / questions.length) * 100} sx={{ my: 2 }} /><Typography>Answered: <b>{answered} / {questions.length}</b></Typography></Paper>
          </Box>
        </>}

        {result && <Paper sx={{ p: { xs: 3, md: 6 }, borderRadius: 3, textAlign: "center" }}><Typography color="#087f8c" fontWeight={900}>RESULT SAVED</Typography><Typography variant="h3" fontWeight={900} sx={{ mt: 2 }}>{studentName}</Typography><Typography variant="h1" fontWeight={900} color="#087f8c" sx={{ my: 2 }}>{result.correct} / {result.total}</Typography><Typography variant="h4" fontWeight={900} color={result.passed ? "success.main" : "error.main"}>{result.passed ? "PASS" : "NOT YET PASSED"} · {result.percentage}%</Typography><Typography sx={{ mt: 2 }}>Result ID: {result.id}</Typography><Box sx={{ maxWidth: 620, mx: "auto", mt: 4, textAlign: "left" }}>{topicSummary.map(([topic, score]) => <Stack key={topic} direction="row" justifyContent="space-between" sx={{ borderTop: "1px solid #ddd", py: 1.5 }}><Typography fontWeight={700}>{topic}</Typography><Typography>{score.correct} / {score.total}</Typography></Stack>)}</Box></Paper>}
      </Container>
    </Box>
  );
}
