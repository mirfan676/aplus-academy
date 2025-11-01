import React from "react";
import TutorForm from "./components/TutorForm";
import "./App.css";

function App() {
  return (
    <div>
      <header className="text-center py-4 bg-light shadow-sm">
        <h2 className="text-success">A Plus Home Tutors</h2>
        <p>Trusted platform for home and online tuition across Pakistan</p>
      </header>

      <TutorForm />

      <footer className="text-center py-3 bg-light mt-4">
        <small>© {new Date().getFullYear()} A Plus Home Tutors</small>
      </footer>
    </div>
  );
}

export default App;
