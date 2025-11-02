import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TutorForm from "./components/TutorForm";
import TeacherDirectory from "./pages/TeacherDirectory";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './App.css';

function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-success text-white text-center py-5">
        <div className="container">
          <h1 className="display-5 fw-bold">Welcome to A Plus Home Tutors</h1>
          <p className="lead mt-3">
            Pakistan’s trusted platform for home and online tuition — connecting students with expert tutors for O/A Levels, Matric, and Junior classes.
          </p>
          <div className="mt-4">
            <Link to="/register" className="btn btn-light btn-lg mx-2">
              Register as Tutor
            </Link>
            <Link to="/teachers" className="btn btn-outline-light btn-lg mx-2">
              View Tutors
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 col-md-6">
              <img
                src="https://img.freepik.com/free-vector/online-education-concept-illustration_114360-5322.jpg"
                alt="Tutoring"
                className="img-fluid rounded shadow w-100"
              />
            </div>
            <div className="col-12 col-md-6 mt-4 mt-md-0">
              <h2 className="text-success mb-3">About A Plus Home Tutors</h2>
              <p className="text-muted">
                At A Plus Home Tutors, we make learning <strong>accessible, personalized, and effective</strong>. Our qualified tutors help students excel in their studies right from the comfort of their home or online.
              </p>
              <ul className="text-muted">
                <li>✅ Experienced and verified tutors</li>
                <li>✅ Online and home tuition available</li>
                <li>✅ Coverage across all major cities in Pakistan</li>
              </ul>
              <Link to="/teachers" className="btn btn-success mt-3">
                Meet Our Tutors
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm sticky-top">
          <div className="container">
            <Link className="navbar-brand text-success fw-bold" to="/">
              A Plus Home Tutors
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/teachers">Tutors</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/register"
              element={
                <section id="register" className="py-5 bg-light">
                  <div className="container">
                    <div className="row justify-content-center">
                      <div className="col-12 col-lg-8">
                        <div className="card p-4 shadow rounded">
                          <h4 className="mb-3 text-center text-success">
                            Tutor Registration Form
                          </h4>
                          <TutorForm />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              }
            />
            <Route path="/teachers" element={<TeacherDirectory />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-success text-white text-center py-4 mt-auto">
          <div className="container">
            <p className="mb-0">© 2025 A Plus Home Tutors — All Rights Reserved</p>
            <small>Empowering education, one student at a time.</small>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
