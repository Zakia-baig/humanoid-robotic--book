/**
 * Translation Model
 * Represents a translation of content between languages
 */
class Translation {
  constructor(id, sourceLanguage, targetLanguage, contentType, contentId, originalText, translatedText, translationAccuracy = null, reviewed = false, reviewedBy = null) {
    this.id = id;
    this.sourceLanguage = sourceLanguage; // e.g., 'en'
    this.targetLanguage = targetLanguage; // e.g., 'ur'
    this.contentType = contentType; // 'chapter', 'ui', 'metadata'
    this.contentId = contentId; // Reference to the content being translated
    this.originalText = originalText;
    this.translatedText = translatedText;
    this.translationAccuracy = translationAccuracy; // 0-100 scale
    this.reviewed = reviewed;
    this.reviewedBy = reviewedBy;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * Creates a translation with accuracy assessment
   * @param {string} id - Unique identifier
   * @param {string} sourceLanguage - Source language code
   * @param {string} targetLanguage - Target language code
   * @param {string} contentType - Type of content being translated
   * @param {string} contentId - Reference to content
   * @param {string} originalText - Original text in source language
   * @param {string} translatedText - Translated text
   * @param {number} accuracy - Accuracy rating (0-100)
   * @returns {Translation}
   */
  static createWithAccuracy(id, sourceLanguage, targetLanguage, contentType, contentId, originalText, translatedText, accuracy) {
    return new Translation(
      id,
      sourceLanguage,
      targetLanguage,
      contentType,
      contentId,
      originalText,
      translatedText,
      accuracy
    );
  }

  /**
   * Reviews and validates a translation
   * @param {string} reviewer - Name of the reviewer
   */
  review(reviewer) {
    this.reviewed = true;
    this.reviewedBy = reviewer;
    this.updatedAt = new Date();
  }

  /**
   * Updates the translated text
   * @param {string} newText - New translated text
   * @param {number} newAccuracy - Optional new accuracy rating
   */
  updateTranslation(newText, newAccuracy = null) {
    this.translatedText = newText;
    if (newAccuracy !== null) {
      this.translationAccuracy = newAccuracy;
    }
    this.updatedAt = new Date();
    this.reviewed = false; // Reset review status when content changes
    this.reviewedBy = null;
  }

  /**
   * Checks if the translation is for the specified language pair
   * @param {string} sourceLang - Source language code
   * @param {string} targetLang - Target language code
   * @returns {boolean}
   */
  isForLanguagePair(sourceLang, targetLang) {
    return this.sourceLanguage === sourceLang && this.targetLanguage === targetLang;
  }

  /**
   * Validates the translation quality based on accuracy
   * @returns {boolean}
   */
  isValid() {
    if (this.translationAccuracy === null) {
      // If no accuracy rating, consider it valid if reviewed
      return this.reviewed;
    }
    // Consider valid if accuracy is above 70%
    return this.translationAccuracy >= 70;
  }

  /**
   * Gets the translation data in a serializable format
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      sourceLanguage: this.sourceLanguage,
      targetLanguage: this.targetLanguage,
      contentType: this.contentType,
      contentId: this.contentId,
      originalText: this.originalText,
      translatedText: this.translatedText,
      translationAccuracy: this.translationAccuracy,
      reviewed: this.reviewed,
      reviewedBy: this.reviewedBy,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}

module.exports = Translation;