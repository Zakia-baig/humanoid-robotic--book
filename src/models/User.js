/**
 * User Model
 * Represents a user of the Humanoid Robotics Book platform
 */
class User {
  constructor(id, email, name, createdAt = new Date(), updatedAt = new Date(), isAuthenticated = false) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isAuthenticated = isAuthenticated;

    // Profile information collected during signup
    this.profile = {
      roboticsExperience: null, // 'beginner', 'intermediate', 'advanced', 'expert'
      learningGoals: null,
      technicalBackground: null,
      interests: [],
    };
  }

  /**
   * Creates a user with profile information
   * @param {string} id - Unique identifier
   * @param {string} email - User's email address
   * @param {string} name - User's full name
   * @param {Object} profile - Profile information collected during signup
   * @returns {User}
   */
  static createWithProfile(id, email, name, profile) {
    const user = new User(id, email, name);
    user.updateProfile(profile);
    return user;
  }

  /**
   * Updates the user's profile information
   * @param {Object} profile - Profile information
   */
  updateProfile(profile) {
    this.profile = {
      ...this.profile,
      ...profile
    };
    this.updatedAt = new Date();
  }

  /**
   * Sets the user's authentication status
   * @param {boolean} authenticated - Authentication status
   */
  setAuthenticationStatus(authenticated) {
    this.isAuthenticated = authenticated;
    this.updatedAt = new Date();
  }

  /**
   * Adds an interest to the user's profile
   * @param {string} interest - Interest to add
   */
  addInterest(interest) {
    if (!this.profile.interests.includes(interest)) {
      this.profile.interests.push(interest);
      this.updatedAt = new Date();
    }
  }

  /**
   * Removes an interest from the user's profile
   * @param {string} interest - Interest to remove
   */
  removeInterest(interest) {
    this.profile.interests = this.profile.interests.filter(i => i !== interest);
    this.updatedAt = new Date();
  }

  /**
   * Checks if the user has a specific interest
   * @param {string} interest - Interest to check
   * @returns {boolean}
   */
  hasInterest(interest) {
    return this.profile.interests.includes(interest);
  }

  /**
   * Gets the user's experience level
   * @returns {string|null}
   */
  getExperienceLevel() {
    return this.profile.roboticsExperience;
  }

  /**
   * Gets the user's learning goals
   * @returns {string|null}
   */
  getLearningGoals() {
    return this.profile.learningGoals;
  }

  /**
   * Gets the user's technical background
   * @returns {string|null}
   */
  getTechnicalBackground() {
    return this.profile.technicalBackground;
  }

  /**
   * Gets the user's interests
   * @returns {Array<string>}
   */
  getInterests() {
    return [...this.profile.interests]; // Return a copy to prevent external modification
  }

  /**
   * Gets the user data in a serializable format
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      isAuthenticated: this.isAuthenticated,
      profile: { ...this.profile }
    };
  }
}

module.exports = User;