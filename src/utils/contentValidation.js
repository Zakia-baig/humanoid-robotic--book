/**
 * Content Validation Utilities
 * Provides validation functions for MDX content in the Humanoid Robotics Book
 */

/**
 * Validates MDX content for structural correctness
 * @param {string} content - The MDX content to validate
 * @returns {Object} Validation results with errors and warnings
 */
function validateMDXContent(content) {
  const errors = [];
  const warnings = [];

  // Check for frontmatter
  if (!content.startsWith('---')) {
    errors.push({
      type: 'missing-frontmatter',
      message: 'MDX content should start with frontmatter (---)',
      severity: 'error'
    });
  } else {
    // Extract frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1];
      validateFrontmatter(frontmatter, errors, warnings);
    } else {
      errors.push({
        type: 'invalid-frontmatter',
        message: 'Invalid frontmatter format',
        severity: 'error'
      });
    }
  }

  // Check for proper headings structure
  validateHeadings(content, errors, warnings);

  // Check for proper MDX syntax
  validateMDXSyntax(content, errors, warnings);

  // Check for proper image references
  validateImages(content, errors, warnings);

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    hasErrors: errors.length > 0,
    hasWarnings: warnings.length > 0
  };
}

/**
 * Validates frontmatter content
 * @param {string} frontmatter - The frontmatter content to validate
 * @param {Array} errors - Array to collect errors
 * @param {Array} warnings - Array to collect warnings
 */
function validateFrontmatter(frontmatter, errors, warnings) {
  try {
    const parsed = parseFrontmatter(frontmatter);

    // Required fields
    const requiredFields = ['title', 'sidebar_position', 'description'];
    for (const field of requiredFields) {
      if (!(field in parsed)) {
        errors.push({
          type: 'missing-required-field',
          message: `Missing required frontmatter field: ${field}`,
          severity: 'error',
          field: field
        });
      }
    }

    // Validate field types
    if (parsed.sidebar_position && typeof parsed.sidebar_position !== 'number') {
      errors.push({
        type: 'invalid-field-type',
        message: 'sidebar_position must be a number',
        severity: 'error',
        field: 'sidebar_position'
      });
    }

    if (parsed.title && typeof parsed.title !== 'string') {
      errors.push({
        type: 'invalid-field-type',
        message: 'title must be a string',
        severity: 'error',
        field: 'title'
      });
    }

    if (parsed.description && typeof parsed.description !== 'string') {
      errors.push({
        type: 'invalid-field-type',
        message: 'description must be a string',
        severity: 'error',
        field: 'description'
      });
    }

    // Validate description length
    if (parsed.description && parsed.description.length > 160) {
      warnings.push({
        type: 'long-description',
        message: 'Description is longer than recommended 160 characters',
        severity: 'warning',
        field: 'description'
      });
    }
  } catch (e) {
    errors.push({
      type: 'parse-error',
      message: `Could not parse frontmatter: ${e.message}`,
      severity: 'error'
    });
  }
}

/**
 * Validates headings structure
 * @param {string} content - The content to validate
 * @param {Array} errors - Array to collect errors
 * @param {Array} warnings - Array to collect warnings
 */
function validateHeadings(content, errors, warnings) {
  // Extract all headings
  const headingRegex = /^(\#{1,6})\s+(.+)$/gm;
  let match;
  const headings = [];

  while ((match = headingRegex.exec(content)) !== null) {
    headings.push({
      level: match[1].length,
      content: match[2],
      line: content.substring(0, match.index).split('\n').length
    });
  }

  // Check for proper heading hierarchy
  for (let i = 1; i < headings.length; i++) {
    const current = headings[i];
    const previous = headings[i - 1];

    // Headings should not skip levels (e.g., ## followed by #### is invalid)
    if (current.level > previous.level + 1) {
      warnings.push({
        type: 'heading-skipped-level',
        message: `Heading level skipped from ${previous.level} to ${current.level} at line ${current.line}`,
        severity: 'warning',
        line: current.line
      });
    }
  }

  // Check for main title
  if (headings.length > 0 && headings[0].level !== 1) {
    warnings.push({
      type: 'missing-main-title',
      message: 'Consider starting with a main title (h1) heading',
      severity: 'warning'
    });
  }
}

/**
 * Validates MDX syntax
 * @param {string} content - The content to validate
 * @param {Array} errors - Array to collect errors
 * @param {Array} warnings - Array to collect warnings
 */
function validateMDXSyntax(content, errors, warnings) {
  // Check for unclosed JSX tags
  const jsxTags = content.match(/<(\w+)([^>]*)>/g);
  if (jsxTags) {
    for (const tag of jsxTags) {
      const tagName = tag.match(/<(\w+)/)[1];
      const closingTag = `</${tagName}>`;
      if (!content.includes(closingTag)) {
        errors.push({
          type: 'unclosed-jsx-tag',
          message: `JSX tag <${tagName}> is not properly closed`,
          severity: 'error'
        });
      }
    }
  }

  // Check for proper code block syntax
  const codeBlockMatches = content.match(/```/g);
  if (codeBlockMatches && codeBlockMatches.length % 2 !== 0) {
    errors.push({
      type: 'unclosed-code-block',
      message: 'Unclosed code block found',
      severity: 'error'
    });
  }

  // Check for proper link syntax
  const linkRegex = /\[([^\]]+)\]\(([^\)]+)\)/g;
  let linkMatch;
  while ((linkMatch = linkRegex.exec(content)) !== null) {
    const linkText = linkMatch[1];
    const linkUrl = linkMatch[2];

    if (!linkUrl || linkUrl.trim() === '') {
      errors.push({
        type: 'empty-link-url',
        message: `Link with text "${linkText}" has empty URL`,
        severity: 'error',
        position: content.substring(0, linkMatch.index).split('\n').length
      });
    }
  }
}

/**
 * Validates image references
 * @param {string} content - The content to validate
 * @param {Array} errors - Array to collect errors
 * @param {Array} warnings - Array to collect warnings
 */
function validateImages(content, errors, warnings) {
  const imageRegex = /!\[([^\]]*)\]\(([^\)]+)\)/g;
  let imageMatch;
  while ((imageMatch = imageRegex.exec(content)) !== null) {
    const altText = imageMatch[1];
    const imageUrl = imageMatch[2];

    // Check for relative image paths
    if (imageUrl.startsWith('./') || imageUrl.startsWith('../')) {
      // This is a relative path, check if it's valid
      // In a real implementation, we'd check if the file exists
      continue;
    }

    // Check for missing alt text
    if (!altText || altText.trim() === '') {
      warnings.push({
        type: 'missing-alt-text',
        message: `Image at "${imageUrl}" is missing alt text`,
        severity: 'warning',
        position: content.substring(0, imageMatch.index).split('\n').length
      });
    }
  }
}

/**
 * Parses frontmatter from a string
 * @param {string} frontmatter - The frontmatter content
 * @returns {Object} Parsed frontmatter object
 */
function parseFrontmatter(frontmatter) {
  // This is a simplified parser - in production, use a proper YAML parser
  const lines = frontmatter.split('\n');
  const result = {};

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();

      // Handle quoted values
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.substring(1, value.length - 1);
      }

      // Try to parse as number if it looks like one
      if (/^\d+$/.test(value)) {
        value = parseInt(value, 10);
      } else if (/^\d*\.\d+$/.test(value)) {
        value = parseFloat(value);
      } else if (value.toLowerCase() === 'true') {
        value = true;
      } else if (value.toLowerCase() === 'false') {
        value = false;
      }

      result[key] = value;
    }
  }

  return result;
}

/**
 * Validates chapter content for the Humanoid Robotics Book
 * @param {string} content - The chapter content to validate
 * @param {string} chapterId - The chapter identifier
 * @returns {Object} Validation results
 */
function validateChapterContent(content, chapterId) {
  const mdxValidation = validateMDXContent(content);
  const errors = [...mdxValidation.errors];
  const warnings = [...mdxValidation.warnings];

  // Additional chapter-specific validations
  if (!content.includes('# Chapter')) {
    warnings.push({
      type: 'missing-chapter-title',
      message: `Chapter ${chapterId} should have a main title starting with '# Chapter'`,
      severity: 'warning'
    });
  }

  // Check for author attribution
  if (!content.includes('## Author:') && !content.includes('## Author: Zakia Baig')) {
    warnings.push({
      type: 'missing-author',
      message: `Chapter ${chapterId} should include author attribution`,
      severity: 'warning'
    });
  }

  // Check for estimated reading time
  if (!content.includes('Estimated Reading Time')) {
    warnings.push({
      type: 'missing-reading-time',
      message: `Chapter ${chapterId} should include estimated reading time`,
      severity: 'warning'
    });
  }

  // Check for chapter summary
  if (!content.includes('## Chapter Summary')) {
    warnings.push({
      type: 'missing-summary',
      message: `Chapter ${chapterId} should include a summary section`,
      severity: 'warning'
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    hasErrors: errors.length > 0,
    hasWarnings: warnings.length > 0,
    chapterId
  };
}

/**
 * Validates translation content for consistency
 * @param {string} originalContent - Original content in source language
 * @param {string} translatedContent - Translated content
 * @param {string} sourceLanguage - Source language code
 * @param {string} targetLanguage - Target language code
 * @returns {Object} Validation results for translation consistency
 */
function validateTranslationConsistency(originalContent, translatedContent, sourceLanguage, targetLanguage) {
  const errors = [];
  const warnings = [];

  // Check that both contents exist
  if (!originalContent || !translatedContent) {
    errors.push({
      type: 'missing-content',
      message: 'Both original and translated content must be provided',
      severity: 'error'
    });
    return { isValid: false, errors, warnings };
  }

  // Check for similar structure
  const originalHeadings = (originalContent.match(/^#+\s+/gm) || []).length;
  const translatedHeadings = (translatedContent.match(/^#+\s+/gm) || []).length;

  if (originalHeadings !== translatedHeadings) {
    warnings.push({
      type: 'heading-count-mismatch',
      message: `Heading count mismatch: ${originalHeadings} in ${sourceLanguage} vs ${translatedHeadings} in ${targetLanguage}`,
      severity: 'warning'
    });
  }

  // Check for similar word count (as a rough measure of completeness)
  const originalWords = originalContent.split(/\s+/).length;
  const translatedWords = translatedContent.split(/\s+/).length;

  const wordRatio = translatedWords / originalWords;
  if (wordRatio < 0.7 || wordRatio > 1.3) {
    warnings.push({
      type: 'content-length-mismatch',
      message: `Significant content length difference: ${originalWords} words in ${sourceLanguage} vs ${translatedWords} in ${targetLanguage}`,
      severity: 'warning'
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    sourceLanguage,
    targetLanguage,
    consistencyScore: calculateConsistencyScore(originalContent, translatedContent)
  };
}

/**
 * Calculates a consistency score between original and translated content
 * @param {string} originalContent - Original content
 * @param {string} translatedContent - Translated content
 * @returns {number} Consistency score (0-1)
 */
function calculateConsistencyScore(originalContent, translatedContent) {
  // This is a simplified implementation
  // A full implementation would use more sophisticated NLP techniques

  const originalWords = originalContent.split(/\s+/).filter(word => word.trim());
  const translatedWords = translatedContent.split(/\s+/).filter(word => word.trim());

  // For now, return a simple ratio based on content length similarity
  const lengthRatio = Math.min(originalWords.length, translatedWords.length) /
                     Math.max(originalWords.length, translatedWords.length);

  return Math.max(0, Math.min(1, lengthRatio));
}

module.exports = {
  validateMDXContent,
  validateChapterContent,
  validateTranslationConsistency,
  validateFrontmatter,
  validateHeadings,
  validateMDXSyntax,
  validateImages,
  calculateConsistencyScore
};