import TutorForm from "./components/TutorForm";

function App() {
  return (
    <div>
      <header className="text-center py-4 bg-light shadow-sm">
        <h2 className="text-success">A Plus Home Tutors</h2>
        <p>Trusted platform for home and online tuition across Pakistan</p>
      </header>

      <section id="register" className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
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

      <footer className="text-center py-3 bg-light mt-4">
        <small>© 2025 A Plus Home Tutors</small>
      </footer>
    </div>
  );
}

export default App;
