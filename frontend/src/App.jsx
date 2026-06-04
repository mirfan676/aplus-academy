import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider, CssBaseline, Container, Card, CardContent } from "@mui/material";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import TutorForm from "./components/TutorForm";
import TeacherDirectory from "./components/TeacherDirectory/TeacherDirectory.jsx";
import AboutUs from "./pages/AboutUs";
import TeacherProfile from "./components/TeacherProfile";
import HireForm from "./components/HireForm";
import CookieConsent from "./components/CookieConsent";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import RouteRedirect from "./components/RouteRedirect";
import LandingPage from "./pages/landing/LandingPage";
import { allLandingPages } from "./pages/landing/landingPages";
import BlogList from "./pages/blog/BlogList";
import BlogPost from "./pages/blog/BlogPost";
import LearningTools from "./pages/learning-tools/LearningTools";
import LearnEnglishVocabulary from "./pages/learning-tools/LearnEnglishVocabulary";
import ImproveEnglishGrammar from "./pages/learning-tools/ImproveEnglishGrammar";
import TextToStudyQuestions from "./pages/learning-tools/TextToStudyQuestions";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminRoute from "./pages/admin/AdminRoute";
import { AuthProvider } from "./contexts/AuthContext";
import theme from "./theme";
import Header from "./components/Header";
import Footer from "./components/Footer";

function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      window.gtag("config", "G-P104YESY15", {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);
}

function PageTracker() {
  usePageTracking();
  return null;
}

function AppShell() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      <PageTracker />
      {!isAdminPage && <CookieConsent />}
      {!isAdminPage && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/register"
          element={
            <Container sx={{ py: 6 }}>
              <Card sx={{ maxWidth: 700, mx: "auto", boxShadow: 3 }}>
                <CardContent>
                  <TutorForm />
                </CardContent>
              </Card>
            </Container>
          }
        />
        <Route path="/teachers" element={<TeacherDirectory />} />
        <Route path="/tutors" element={<RouteRedirect to="/teachers" />} />
        <Route path="/tutors/o-levels" element={<RouteRedirect to="/o-a-level" />} />
        <Route path="/contact" element={<RouteRedirect to="/about" />} />
        <Route path="/become-a-tutor" element={<RouteRedirect to="/register" />} />
        <Route path="/study-abroad" element={<LandingPage page={allLandingPages.studyAbroad} />} />
        <Route path="/referral-program" element={<LandingPage page={allLandingPages.referralProgram} />} />
        <Route path="/career-opportunities" element={<LandingPage page={allLandingPages.careerOpportunities} />} />
        <Route path="/languages" element={<LandingPage page={allLandingPages.languages} />} />
        <Route path="/buy-courses" element={<LandingPage page={allLandingPages.buyCourses} />} />
        <Route path="/k-12" element={<LandingPage page={allLandingPages.k12} />} />
        <Route path="/o-a-level" element={<LandingPage page={allLandingPages.oALevel} />} />
        <Route path="/bachelors-masters" element={<LandingPage page={allLandingPages.bachelorsMasters} />} />
        <Route path="/competitive-exams" element={<LandingPage page={allLandingPages.competitiveExams} />} />
        <Route path="/it-technology" element={<LandingPage page={allLandingPages.itTechnology} />} />
        <Route path="/programming" element={<LandingPage page={allLandingPages.programming} />} />
        <Route path="/quran-tajweed" element={<LandingPage page={allLandingPages.quranTajweed} />} />
        <Route path="/english-language" element={<LandingPage page={allLandingPages.englishLanguage} />} />
        <Route path="/ielts" element={<LandingPage page={allLandingPages.ielts} />} />
        <Route path="/graphics-multimedia" element={<LandingPage page={allLandingPages.graphicsMultimedia} />} />
        <Route path="/online-tutors-pakistan" element={<LandingPage page={allLandingPages.onlineTutorsPakistan} />} />
        <Route path="/home-tutors-lahore" element={<LandingPage page={allLandingPages.homeTutorsLahore} />} />
        <Route path="/female-home-tutor-lahore" element={<LandingPage page={allLandingPages.femaleHomeTutorLahore} />} />
        <Route path="/home-tuition-lahore" element={<LandingPage page={allLandingPages.homeTuitionLahore} />} />
        <Route path="/o-level-tutors-lahore" element={<LandingPage page={allLandingPages.oLevelTutorsLahore} />} />
        <Route path="/a-level-tutors-pakistan" element={<LandingPage page={allLandingPages.aLevelTutorsPakistan} />} />
        <Route path="/quran-tutor-with-tajweed" element={<LandingPage page={allLandingPages.quranTutorWithTajweed} />} />
        <Route path="/ielts-tutor-pakistan" element={<LandingPage page={allLandingPages.ieltsTutorPakistan} />} />
        <Route path="/english-tutor-lahore" element={<LandingPage page={allLandingPages.englishTutorLahore} />} />
        <Route path="/verified-tutors-pakistan" element={<LandingPage page={allLandingPages.verifiedTutorsPakistan} />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/teacher/:id" element={<TeacherProfile />} />
        <Route path="/hire/:id" element={<HireForm />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/learning-tools" element={<LearningTools />} />
        <Route path="/learning-tools/learn-english-vocabulary" element={<LearnEnglishVocabulary />} />
        <Route path="/learning-tools/improve-english-grammar" element={<ImproveEnglishGrammar />} />
        <Route path="/learning-tools/text-to-mcqs-short-questions" element={<TextToStudyQuestions />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!isAdminPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <AppShell />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
