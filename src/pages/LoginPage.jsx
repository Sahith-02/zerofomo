import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import '../styles/AuthPages.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (error) {
      setError('Failed to log in. Please check your credentials.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  
  async function handleGoogleSignIn() {
    try {
      setError('');
      setLoading(true);
      await signInWithGoogle();
      navigate('/');
    } catch (error) {
      setError('Failed to sign in with Google.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <Header />
       <div className="hero-background">
          <img src="/assets/banner.png" alt="Student studying" className="hero-image_" />
       </div>
      <div className="auth-container">
        <div className="auth-form-container">
          {/* <div className="profile-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div> */}
          
          {error && <div className="auth-error">{error}</div>}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
            </div>
            
            <div className="form-group">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>
            
            <div className="forgot-password">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
            
            <button 
              type="submit" 
              className="auth-button" 
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            
            <div className="divider">
              <span>or</span>
            </div>
            
            <button 
              type="button"
              onClick={handleGoogleSignIn}
              className="google-auth-button"
              disabled={loading}
            >
              <img src="/google-icon.svg" alt="Google" className="google-icon" />
              Sign in with Google
            </button>
          </form>
          
          <div className="auth-footer">
            <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;