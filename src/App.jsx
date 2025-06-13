import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import StudentPage from "./pages/StudentPage";
import ParentPage from "./pages/ParentPage";
import About from "./pages/About";
import IndividualServicesPage from "./pages/IndividualServicesPage";
import { AuthProvider } from "./context/AuthContext";
import Calendar from "./pages/Calendar";
import BookingDetails from "./pages/BookingDetails";
import Payment from "./pages/Payment";
import Testimonials from "./components/Testimonials";
import Founder from "./pages/Founder";
import Webinars from "./pages/Webinars";
import ContactUs from "./pages/ContactUs";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/student" element={<StudentPage />} />
          <Route path="/parent" element={<ParentPage />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/individual-services"
            element={<IndividualServicesPage />}
          />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/booking-details" element={<BookingDetails />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/success-stories" element={<Testimonials />} />
          <Route path="/founder" element={<Founder />} />
          <Route path="/webinar" element={<Webinars />} />
          <Route path="/contact" element={<ContactUs />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
