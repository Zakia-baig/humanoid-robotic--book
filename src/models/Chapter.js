/**
 * Chapter Model
 * Represents a chapter in the Humanoid Robotics Book
 */
class Chapter {
  constructor(id, title, slug, content, topicArea, difficultyLevel, estimatedReadingTime, language = 'en', author = 'Zakia Baig') {
    this.id = id;
    this.title = title;
    this.slug = slug;
    this.content = content;
    this.topicArea = topicArea;
    this.difficultyLevel = difficultyLevel; // 'basic', 'intermediate', 'advanced'
    this.estimatedReadingTime = estimatedReadingTime; // in minutes
    this.language = language; // 'en' or 'ur'
    this.author = author;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * Creates a chapter with content in multiple languages
   * @param {string} id - Unique identifier
   * @param {string} title - Chapter title
   * @param {string} slug - URL-friendly identifier
   * @param {Object} content - Content in different languages {en: '...', ur: '...'}
   * @param {string} topicArea - Main topic of the chapter
   * @param {string} difficultyLevel - Difficulty level
   * @param {number} estimatedReadingTime - Estimated reading time in minutes
   * @param {string} author - Author name
   * @returns {Chapter}
   */
  static createMultilingualChapter(id, title, slug, content, topicArea, difficultyLevel, estimatedReadingTime, author = 'Zakia Baig') {
    return new Chapter(
      id,
      title,
      slug,
      content.en, // Default to English content
      topicArea,
      difficultyLevel,
      estimatedReadingTime,
      'en', // Default to English
      author
    );
  }

  /**
   * Updates the chapter content
   * @param {string} newContent - New content for the chapter
   */
  updateContent(newContent) {
    this.content = newContent;
    this.updatedAt = new Date();
  }

  /**
   * Changes the language of the chapter
   * @param {string} language - New language ('en' or 'ur')
   * @param {string} translatedContent - Content in the new language
   */
  changeLanguage(language, translatedContent) {
    if (['en', 'ur'].includes(language)) {
      this.language = language;
      this.content = translatedContent;
      this.updatedAt = new Date();
    } else {
      throw new Error('Invalid language. Only "en" and "ur" are supported.');
    }
  }

  /**
   * Gets the chapter data in a serializable format
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      slug: this.slug,
      content: this.content,
      topicArea: this.topicArea,
      difficultyLevel: this.difficultyLevel,
      estimatedReadingTime: this.estimatedReadingTime,
      language: this.language,
      author: this.author,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}

module.exports = Chapter;