import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import StudentPage from './pages/StudentPage';
import { AuthProvider } from './context/AuthContext';
import ParentPage from './pages/ParentPage';
import Student_Home from './components/Student_Home';
// Import other pages

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
          {/* Add other routes */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;