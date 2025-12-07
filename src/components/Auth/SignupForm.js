import React, { useState } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

/**
 * Signup Form Component
 * Collects user information including background questions during signup
 */
function SignupForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    roboticsExperience: '',
    learningGoals: '',
    technicalBackground: '',
    interests: []
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData(prev => {
        const currentInterests = [...prev.interests];
        if (checked) {
          if (!currentInterests.includes(value)) {
            currentInterests.push(value);
          }
        } else {
          return {
            ...prev,
            interests: currentInterests.filter(interest => interest !== value)
          };
        }
        return { ...prev, interests: currentInterests };
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.roboticsExperience) newErrors.roboticsExperience = 'Please select your experience level';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        await onSubmit(formData);
      } catch (error) {
        setErrors({ submit: error.message || 'An error occurred during signup' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const interestOptions = [
    { value: 'humanoid-robotics', label: 'Humanoid Robotics' },
    { value: 'physical-ai', label: 'Physical AI' },
    { value: 'ros2', label: 'ROS2' },
    { value: 'gazebo', label: 'Gazebo' },
    { value: 'isaac', label: 'Isaac Robotics' },
    { value: 'vla-models', label: 'Vision Language Action Models' },
    { value: 'control-systems', label: 'Control Systems' },
    { value: 'perception', label: 'Perception Systems' },
    { value: 'manipulation', label: 'Manipulation and Grasping' },
    { value: 'human-robot-interaction', label: 'Human-Robot Interaction' }
  ];

  return (
    <div className={clsx(styles.signupForm, 'auth-form')}>
      <h2 className={styles.formTitle}>Create Account</h2>
      <p className={styles.formSubtitle}>Join our robotics community and get personalized content</p>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Basic Information */}
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={clsx(styles.input, errors.name && styles.inputError)}
            placeholder="Enter your full name"
          />
          {errors.name && <span className={styles.errorText}>{errors.name}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={clsx(styles.input, errors.email && styles.inputError)}
            placeholder="Enter your email"
          />
          {errors.email && <span className={styles.errorText}>{errors.email}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={clsx(styles.input, errors.password && styles.inputError)}
            placeholder="Create a password"
          />
          {errors.password && <span className={styles.errorText}>{errors.password}</span>}
        </div>

        {/* Background Questions */}
        <div className={styles.sectionDivider}>
          <h3 className={styles.sectionTitle}>Background Information</h3>
          <p className={styles.sectionSubtitle}>Help us personalize your experience</p>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="roboticsExperience" className={styles.label}>
            What is your experience level in robotics?
          </label>
          <select
            id="roboticsExperience"
            name="roboticsExperience"
            value={formData.roboticsExperience}
            onChange={handleChange}
            className={clsx(styles.select, errors.roboticsExperience && styles.inputError)}
          >
            <option value="">Select your experience level</option>
            <option value="beginner">Beginner (Just starting)</option>
            <option value="intermediate">Intermediate (Some experience)</option>
            <option value="advanced">Advanced (Significant experience)</option>
            <option value="expert">Expert (Professional/researcher)</option>
          </select>
          {errors.roboticsExperience && <span className={styles.errorText}>{errors.roboticsExperience}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="learningGoals" className={styles.label}>
            What are your learning goals? (Optional)
          </label>
          <textarea
            id="learningGoals"
            name="learningGoals"
            value={formData.learningGoals}
            onChange={handleChange}
            className={clsx(styles.textarea, styles.input)}
            placeholder="Tell us what you hope to learn from this book..."
            rows={3}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="technicalBackground" className={styles.label}>
            What is your technical background? (Optional)
          </label>
          <textarea
            id="technicalBackground"
            name="technicalBackground"
            value={formData.technicalBackground}
            onChange={handleChange}
            className={clsx(styles.textarea, styles.input)}
            placeholder="Programming languages, degrees, professional background, etc...."
            rows={3}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            What topics interest you most? (Select all that apply)
          </label>
          <div className={styles.checkboxGrid}>
            {interestOptions.map((option) => (
              <label key={option.value} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="interests"
                  value={option.value}
                  checked={formData.interests.includes(option.value)}
                  onChange={handleChange}
                  className={styles.checkbox}
                />
                <span className={styles.checkboxText}>{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {errors.submit && <div className={styles.errorBanner}>{errors.submit}</div>}

        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={onCancel}
            className={clsx('button', 'button--secondary', styles.cancelButton)}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={clsx('button', 'button--primary', styles.submitButton)}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignupForm;