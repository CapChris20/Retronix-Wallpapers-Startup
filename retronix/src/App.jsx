import React, { Suspense, lazy } from 'react';
// Import routing components from react-router-dom
import { Routes, Route } from 'react-router-dom';
// Import the Navbar component
import Navbar from "./components/Navbar";
// Import the Footer component
import Footer from './components/Footer';

// Replace static imports with React.lazy
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Wallpapers = lazy(() => import("./pages/Wallpapers"));
const Account = lazy(() => import("./pages/Account"));
const Success = lazy(() => import("./pages/Success"));
const Terms = lazy(() => import("./pages/Terms"));
const Instructions = lazy(() => import("./pages/Instructions"));
const Privacy = lazy(() => import("./pages/Privacy"));
const ForgetPassword = lazy(() => import("./pages/ForgetPassword"));
const AuthAction = lazy(() => import("./pages/AuthAction"));

// Add a minimal LoadingSpinner component
function LoadingSpinner() {
  return <div style={{textAlign: 'center', padding: '2rem'}} aria-label="Loading">Loading...</div>;
}

function App() {
  return (
    <div className="app-content">
      <Navbar />
      <main>
        <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/wallpapers" element={<Wallpapers />} />
          <Route path="/login" element={<Account />} />
          <Route path="/success" element={<Success />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/auth-action" element={<AuthAction />} />
        </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;