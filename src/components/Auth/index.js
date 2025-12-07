import React, { useState } from 'react';
import clsx from 'clsx';
import SignupForm from './SignupForm';
import styles from './styles.module.css';

/**
 * Authentication Component
 * Provides signup and signin functionality with background questions
 */
function Auth({ onAuthSuccess, mode = 'signup' }) {
  const [currentMode, setCurrentMode] = useState(mode);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSignup = async (userData) => {
    // In a real implementation, this would call an authentication API
    console.log('Signing up with:', userData);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock success
    setIsAuthenticated(true);
    if (onAuthSuccess) {
      onAuthSuccess({ ...userData, isAuthenticated: true });
    }
  };

  const handleSignin = async (credentials) => {
    // In a real implementation, this would call an authentication API
    console.log('Signing in with:', credentials);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock success
    setIsAuthenticated(true);
    if (onAuthSuccess) {
      onAuthSuccess({ ...credentials, isAuthenticated: true });
    }
  };

  const handleCancel = () => {
    // Reset form or close modal
    setCurrentMode('signin');
  };

  const switchMode = (newMode) => {
    setCurrentMode(newMode);
  };

  if (isAuthenticated) {
    return (
      <div className={clsx(styles.authContainer, styles.authenticated)}>
        <div className={styles.authMessage}>
          <h3>Welcome back!</h3>
          <p>You are now signed in and can access personalized content.</p>
          <button
            className={clsx('button', 'button--secondary')}
            onClick={() => setIsAuthenticated(false)}
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx(styles.authContainer, 'auth-container')}>
      <div className={styles.modeToggle}>
        <button
          className={clsx(
            styles.modeButton,
            currentMode === 'signin' && styles.activeMode
          )}
          onClick={() => switchMode('signin')}
        >
          Sign In
        </button>
        <button
          className={clsx(
            styles.modeButton,
            currentMode === 'signup' && styles.activeMode
          )}
          onClick={() => switchMode('signup')}
        >
          Sign Up
        </button>
      </div>

      {currentMode === 'signup' && (
        <SignupForm onSubmit={handleSignup} onCancel={handleCancel} />
      )}

      {currentMode === 'signin' && (
        <div className={styles.signinForm}>
          <h2 className={styles.formTitle}>Welcome Back</h2>
          <p className={styles.formSubtitle}>Sign in to access personalized content</p>

          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            handleSignin(Object.fromEntries(formData));
          }} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="signin-email" className={styles.label}>
                Email Address
              </label>
              <input
                type="email"
                id="signin-email"
                name="email"
                required
                className={styles.input}
                placeholder="Enter your email"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="signin-password" className={styles.label}>
                Password
              </label>
              <input
                type="password"
                id="signin-password"
                name="password"
                required
                className={styles.input}
                placeholder="Enter your password"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="remember"
                  className={styles.checkbox}
                />
                <span>Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              className={clsx('button', 'button--primary', styles.submitButton)}
            >
              Sign In
            </button>
          </form>

          <div className={styles.formFooter}>
            <a href="#" className={styles.link}>Forgot password?</a>
            <span> | </span>
            <button
              type="button"
              onClick={() => switchMode('signup')}
              className={clsx('button', 'button--link', styles.linkButton)}
            >
              Create an account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Auth;