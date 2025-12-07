/**
 * Personalization Profile Model
 * Represents a user's personalization settings and preferences
 */
class PersonalizationProfile {
  constructor(userId, personalizationSettings = {}, contentRecommendations = [], learningPath = []) {
    this.id = `profile_${userId}`; // Create a unique ID based on user ID
    this.userId = userId;
    this.personalizationSettings = {
      difficultyPreference: 'intermediate', // 'basic', 'intermediate', 'advanced'
      topicPreferences: [], // Array of preferred topics
      contentFormatPreference: 'text', // 'text', 'visual', 'interactive'
      readingSpeed: 'normal', // 'slow', 'normal', 'fast'
      notificationPreferences: {
        contentUpdates: true,
        progressReminders: false,
        communityUpdates: false
      }
    };

    // Apply any provided settings
    if (Object.keys(personalizationSettings).length > 0) {
      this.personalizationSettings = {
        ...this.personalizationSettings,
        ...personalizationSettings
      };
    }

    this.contentRecommendations = contentRecommendations;
    this.learningPath = learningPath;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * Creates a personalization profile with default settings based on user profile
   * @param {string} userId - User ID
   * @param {Object} userProfile - User profile information (from User model)
   * @returns {PersonalizationProfile}
   */
  static createFromUserProfile(userId, userProfile) {
    const settings = {};

    // Set difficulty preference based on robotics experience
    if (userProfile.profile.roboticsExperience) {
      switch (userProfile.profile.roboticsExperience) {
        case 'beginner':
          settings.difficultyPreference = 'basic';
          break;
        case 'advanced':
        case 'expert':
          settings.difficultyPreference = 'advanced';
          break;
        default:
          settings.difficultyPreference = 'intermediate';
      }
    }

    // Set topic preferences based on user interests
    if (userProfile.profile.interests && userProfile.profile.interests.length > 0) {
      settings.topicPreferences = [...userProfile.profile.interests];
    }

    return new PersonalizationProfile(userId, settings);
  }

  /**
   * Updates personalization settings
   * @param {Object} newSettings - New settings to apply
   */
  updateSettings(newSettings) {
    this.personalizationSettings = {
      ...this.personalizationSettings,
      ...newSettings
    };
    this.updatedAt = new Date();
  }

  /**
   * Adds a content recommendation
   * @param {string} contentId - ID of the recommended content
   * @param {string} reason - Reason for the recommendation
   */
  addRecommendation(contentId, reason = '') {
    const recommendation = {
      contentId,
      reason,
      priority: 1, // Default priority
      addedAt: new Date()
    };

    this.contentRecommendations.push(recommendation);
    this.updatedAt = new Date();
  }

  /**
   * Removes a content recommendation
   * @param {string} contentId - ID of the content to remove
   */
  removeRecommendation(contentId) {
    this.contentRecommendations = this.contentRecommendations.filter(
      rec => rec.contentId !== contentId
    );
    this.updatedAt = new Date();
  }

  /**
   * Updates the learning path
   * @param {Array<string>} newPath - New learning path as array of content IDs
   */
  updateLearningPath(newPath) {
    this.learningPath = [...newPath];
    this.updatedAt = new Date();
  }

  /**
   * Adds a content item to the learning path
   * @param {string} contentId - Content ID to add
   * @param {number} position - Position in the path (defaults to end)
   */
  addToLearningPath(contentId, position = null) {
    if (position === null || position < 0 || position > this.learningPath.length) {
      this.learningPath.push(contentId);
    } else {
      this.learningPath.splice(position, 0, contentId);
    }
    this.updatedAt = new Date();
  }

  /**
   * Removes a content item from the learning path
   * @param {string} contentId - Content ID to remove
   */
  removeFromLearningPath(contentId) {
    this.learningPath = this.learningPath.filter(id => id !== contentId);
    this.updatedAt = new Date();
  }

  /**
   * Gets content recommendations based on difficulty and topic preferences
   * @param {Array} availableContent - Array of available content items
   * @returns {Array} Filtered and sorted recommendations
   */
  getFilteredRecommendations(availableContent) {
    return availableContent
      .filter(content =>
        // Filter by difficulty if preference is set
        (this.personalizationSettings.difficultyPreference === 'intermediate' ||
         content.difficultyLevel === this.personalizationSettings.difficultyPreference) &&
        // Filter by topic preferences if any are set
        (this.personalizationSettings.topicPreferences.length === 0 ||
         this.personalizationSettings.topicPreferences.some(pref =>
           content.topicArea && content.topicArea.toLowerCase().includes(pref.toLowerCase())
         ))
      )
      .sort((a, b) => {
        // Sort by user's topic preferences (preferred topics first)
        const aPrefIndex = this.personalizationSettings.topicPreferences.findIndex(pref =>
          a.topicArea && a.topicArea.toLowerCase().includes(pref.toLowerCase())
        );
        const bPrefIndex = this.personalizationSettings.topicPreferences.findIndex(pref =>
          b.topicArea && b.topicArea.toLowerCase().includes(pref.toLowerCase())
        );

        if (aPrefIndex !== -1 && bPrefIndex === -1) return -1;
        if (aPrefIndex === -1 && bPrefIndex !== -1) return 1;
        return aPrefIndex - bPrefIndex;
      });
  }

  /**
   * Gets the difficulty preference
   * @returns {string}
   */
  getDifficultyPreference() {
    return this.personalizationSettings.difficultyPreference;
  }

  /**
   * Gets the topic preferences
   * @returns {Array<string>}
   */
  getTopicPreferences() {
    return [...this.personalizationSettings.topicPreferences];
  }

  /**
   * Gets the content format preference
   * @returns {string}
   */
  getContentFormatPreference() {
    return this.personalizationSettings.contentFormatPreference;
  }

  /**
   * Gets the reading speed preference
   * @returns {string}
   */
  getReadingSpeedPreference() {
    return this.personalizationSettings.readingSpeed;
  }

  /**
   * Gets the notification preferences
   * @returns {Object}
   */
  getNotificationPreferences() {
    return { ...this.personalizationSettings.notificationPreferences };
  }

  /**
   * Gets the personalization profile data in a serializable format
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      personalizationSettings: { ...this.personalizationSettings },
      contentRecommendations: this.contentRecommendations.map(rec => ({
        ...rec,
        addedAt: rec.addedAt ? rec.addedAt.toISOString() : null
      })),
      learningPath: this.learningPath,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}

module.exports = PersonalizationProfile;