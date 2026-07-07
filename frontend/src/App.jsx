import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigationType } from "react-router-dom";
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
import CareerRoadmap from "./pages/career-roadmap/CareerRoadmap";
import PtePracticeHome from "./pages/pte/PtePracticeHome";
import PteTaskPractice from "./pages/pte/PteTaskPractice";
import LearningTools from "./pages/learning-tools/LearningTools";
import LearnEnglishVocabulary from "./pages/learning-tools/LearnEnglishVocabulary";
import ImproveEnglishGrammar from "./pages/learning-tools/ImproveEnglishGrammar";
import TextToStudyQuestions from "./pages/learning-tools/TextToStudyQuestions";
import PteEssayPractice from "./pages/learning-tools/PteEssayPractice";
import RegisterChoice from "./pages/register/RegisterChoice";
import FamilyStudentRegistration from "./pages/register/FamilyStudentRegistration";
import LanguageCoursesHome from "./pages/courses/LanguageCoursesHome";
import LanguageCoursePage from "./pages/courses/LanguageCoursePage";
import AccountDashboard from "./pages/account/AccountDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminRoute from "./pages/admin/AdminRoute";
import PteEssayAdmin from "./pages/admin/PteEssayAdmin";
import FirestoreMigrationAdmin from "./pages/admin/FirestoreMigrationAdmin";
import ContentManager from "./pages/admin/ContentManager";
import BlogAdmin from "./pages/admin/BlogAdmin";
import { AuthProvider } from "./contexts/AuthContext";
import theme from "./theme";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SiteAiTutor from "./components/SiteAiTutor";
import SiteLoader from "./components/SiteLoader";

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

function ScrollManager() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const scrollPath = `${location.pathname}${location.search}${location.hash}`;

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    const savePosition = () => {
      sessionStorage.setItem(`scroll:${location.key}`, String(window.scrollY));
      sessionStorage.setItem(`scroll-path:${scrollPath}`, String(window.scrollY));
    };
    window.addEventListener("scroll", savePosition, { passive: true });
    return () => {
      savePosition();
      window.removeEventListener("scroll", savePosition);
    };
  }, [location.key, scrollPath]);

  useEffect(() => {
    if (navigationType === "POP") {
      const saved =
        sessionStorage.getItem(`scroll:${location.key}`) ||
        sessionStorage.getItem(`scroll-path:${scrollPath}`);
      window.requestAnimationFrame(() => window.scrollTo(0, saved ? Number(saved) : 0));
      return;
    }
    window.requestAnimationFrame(() => window.scrollTo(0, 0));
  }, [location.key, navigationType, scrollPath]);

  return null;
}

function AppShell() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      <PageTracker />
      <ScrollManager />
      {!isAdminPage && <CookieConsent />}
      {!isAdminPage && <Header />}
      {!isAdminPage && <SiteAiTutor />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterChoice />} />
        <Route
          path="/register/teacher"
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
        <Route path="/register/parent" element={<FamilyStudentRegistration role="parent" />} />
        <Route path="/register/student" element={<FamilyStudentRegistration role="student" />} />
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
        <Route path="/career-roadmap" element={<CareerRoadmap />} />
        <Route path="/career-roadmap/pte-practice" element={<RouteRedirect to="/pte" />} />
        <Route path="/career-roadmap/*" element={<CareerRoadmap />} />
        <Route path="/courses" element={<RouteRedirect to="/courses/languages" />} />
        <Route path="/courses/languages" element={<LanguageCoursesHome />} />
        <Route path="/courses/languages/:slug" element={<LanguageCoursePage />} />
        <Route path="/pte" element={<PtePracticeHome />} />
        <Route path="/pte/write-essay" element={<PteEssayPractice />} />
        <Route path="/pte/:slug" element={<PteTaskPractice />} />
        <Route path="/learning-tools" element={<LearningTools />} />
        <Route path="/learning-tools/learn-english-vocabulary" element={<LearnEnglishVocabulary />} />
        <Route path="/learning-tools/improve-english-grammar" element={<ImproveEnglishGrammar />} />
        <Route path="/learning-tools/text-to-mcqs-short-questions" element={<TextToStudyQuestions />} />
        <Route path="/learning-tools/pte-essay-practice" element={<RouteRedirect to="/pte/write-essay" />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/account" element={<AccountDashboard />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/manage"
          element={
            <AdminRoute>
              <ContentManager />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/blogs"
          element={
            <AdminRoute blogManager>
              <BlogAdmin />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/pte-essays"
          element={
            <AdminRoute>
              <PteEssayAdmin />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/firestore"
          element={
            <AdminRoute>
              <FirestoreMigrationAdmin />
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
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const finish = () => {
      window.setTimeout(() => {
        if (!cancelled) {
          setShowLoader(false);
        }
      }, 900);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
      window.setTimeout(finish, 1800);
    }

    return () => {
      cancelled = true;
      window.removeEventListener("load", finish);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {showLoader ? <SiteLoader /> : null}
      <Router>
        <AuthProvider>
          <AppShell />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
