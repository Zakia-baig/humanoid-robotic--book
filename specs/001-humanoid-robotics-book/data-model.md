# Data Model: Humanoid Robotics Book

## Overview
This document defines the data structures and relationships for the Humanoid Robotics Book project, based on the entities identified in the feature specification.

## 1. User Entity

### Attributes:
- **id**: Unique identifier (string, required)
- **email**: User's email address (string, required, unique)
- **name**: User's full name (string, required)
- **createdAt**: Account creation timestamp (datetime, required)
- **updatedAt**: Last update timestamp (datetime, required)
- **isAuthenticated**: Authentication status (boolean, required, default: false)

### Background Information (Profile):
- **roboticsExperience**: User's experience level (string, optional: "beginner", "intermediate", "advanced", "expert")
- **learningGoals**: User's learning objectives (string, optional)
- **technicalBackground**: User's technical background (string, optional)
- **interests**: Specific interests in robotics topics (array of strings, optional)
- **preferredContentLevel**: Preferred content complexity (string, optional: "basic", "intermediate", "advanced")

### Relationships:
- One-to-many with UserPreferences
- One-to-many with UserProgress (if implemented)

### Validation Rules:
- Email must be valid email format
- Name must be 2-100 characters
- Experience level must be one of the allowed values

## 2. Chapter Entity

### Attributes:
- **id**: Unique identifier (string, required)
- **title**: Chapter title (string, required)
- **slug**: URL-friendly identifier (string, required, unique)
- **content**: Chapter content in MDX format (string, required)
- **topicArea**: Main topic of the chapter (string, required)
- **difficultyLevel**: Content difficulty (string: "basic", "intermediate", "advanced")
- **estimatedReadingTime**: Estimated time to read (integer, minutes, required)
- **createdAt**: Creation timestamp (datetime, required)
- **updatedAt**: Last update timestamp (datetime, required)

### Content Versions:
- **contentEn**: English content (string, required)
- **contentUr**: Urdu content (string, required)

### Relationships:
- One-to-many with ChapterTranslations
- Many-to-many with UserProgress (if implemented)

### Validation Rules:
- Title must be 5-200 characters
- Slug must be URL-friendly (alphanumeric, hyphens, underscores)
- Content must be valid MDX format
- Difficulty level must be one of the allowed values

## 3. Translation Entity

### Attributes:
- **id**: Unique identifier (string, required)
- **sourceLanguage**: Original language (string, required: "en")
- **targetLanguage**: Translation language (string, required: "ur")
- **contentType**: Type of content being translated (string, required: "chapter", "ui", "metadata")
- **contentId**: Reference to the content being translated (string, required)
- **originalText**: Original text in source language (string, required)
- **translatedText**: Translated text in target language (string, required)
- **translationAccuracy**: Quality rating (number, 0-100, optional)
- **reviewed**: Whether translation has been reviewed (boolean, default: false)
- **reviewedBy**: User who reviewed translation (string, optional)
- **createdAt**: Creation timestamp (datetime, required)
- **updatedAt**: Last update timestamp (datetime, required)

### Relationships:
- Many-to-one with User (reviewed by)
- One-to-one with Chapter (if content type is chapter)

### Validation Rules:
- Source and target languages must be different
- Content ID must reference a valid content item
- Translation accuracy must be between 0-100 if provided

## 4. Personalization Profile Entity

### Attributes:
- **id**: Unique identifier (string, required)
- **userId**: Reference to the user (string, required, unique)
- **personalizationSettings**: JSON object for personalization options (object, required)
- **contentRecommendations**: Array of recommended content IDs (array of strings, optional)
- **learningPath**: Customized learning sequence (array of strings, optional)
- **createdAt**: Creation timestamp (datetime, required)
- **updatedAt**: Last update timestamp (datetime, required)

### Personalization Settings:
- **difficultyPreference**: Preferred content difficulty (string: "basic", "intermediate", "advanced")
- **topicPreferences**: Preferred topics (array of strings)
- **contentFormatPreference**: Preferred content format (string: "text", "visual", "interactive")
- **readingSpeed**: Reading speed preference (string: "slow", "normal", "fast")
- **notificationPreferences**: Notification settings (object)

### Relationships:
- One-to-one with User (userId)
- Many-to-many with Chapter (through contentRecommendations)

### Validation Rules:
- User ID must reference a valid user
- Topic preferences must be from predefined list
- Content format preference must be one of allowed values

## 5. User Preferences Entity

### Attributes:
- **id**: Unique identifier (string, required)
- **userId**: Reference to the user (string, required, unique)
- **languagePreference**: Preferred display language (string, default: "en")
- **themePreference**: UI theme preference (string: "light", "dark", "auto", default: "auto")
- **readingPreferences**: Reading settings (object)
- **privacySettings**: Privacy configuration (object)
- **createdAt**: Creation timestamp (datetime, required)
- **updatedAt**: Last update timestamp (datetime, required)

### Reading Preferences:
- **fontSize**: Preferred font size (string: "small", "normal", "large")
- **readingMode**: Reading mode (string: "default", "focus", "distraction-free")
- **autoTranslate**: Auto-translation preference (boolean, default: false)

### Relationships:
- One-to-one with User (userId)

### Validation Rules:
- User ID must reference a valid user
- Language preference must be supported language ("en", "ur")
- Theme preference must be one of allowed values

## 6. Chapter Translation Mapping

### Attributes:
- **id**: Unique identifier (string, required)
- **chapterId**: Reference to the chapter (string, required)
- **language**: Target language (string, required)
- **translatedContentId**: Reference to translation entity (string, required)
- **isCurrent**: Whether this is the current translation (boolean, default: true)
- **version**: Translation version number (integer, required, default: 1)
- **createdAt**: Creation timestamp (datetime, required)
- **updatedAt**: Last update timestamp (datetime, required)

### Relationships:
- Many-to-one with Chapter (chapterId)
- Many-to-one with Translation (translatedContentId)

### Validation Rules:
- Chapter ID must reference a valid chapter
- Language must be supported language
- Only one translation per chapter-language pair should be current