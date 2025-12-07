/**
 * Content Versioning and Change Tracking Utilities
 * Provides version control and change tracking for MDX content in the Humanoid Robotics Book
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Content versioning system
 */
class ContentVersioning {
  constructor(options = {}) {
    this.storagePath = options.storagePath || './versions';
    this.maxVersions = options.maxVersions || 10;
    this.autoTrack = options.autoTrack || true;

    // Ensure storage directory exists
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
    }
  }

  /**
   * Creates a version hash for content
   * @param {string} content - The content to hash
   * @returns {string} SHA-256 hash of the content
   */
  createContentHash(content) {
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * Saves a new version of content
   * @param {string} contentId - Unique identifier for the content
   * @param {string} content - The content to save
   * @param {Object} metadata - Metadata about the version
   * @returns {Object} Version information
   */
  saveVersion(contentId, content, metadata = {}) {
    const timestamp = new Date().toISOString();
    const contentHash = this.createContentHash(content);
    const versionId = `${timestamp}-${contentHash.substring(0, 8)}`;

    const versionData = {
      id: versionId,
      contentId,
      content,
      hash: contentHash,
      timestamp,
      metadata: {
        ...metadata,
        size: content.length,
        wordCount: this.countWords(content),
        changeType: metadata.changeType || 'unknown'
      }
    };

    // Save version file
    const versionPath = path.join(this.storagePath, `${contentId}_${versionId}.json`);
    fs.writeFileSync(versionPath, JSON.stringify(versionData, null, 2));

    // Update version history
    this.updateHistory(contentId, versionData);

    return versionData;
  }

  /**
   * Updates the version history for a content item
   * @param {string} contentId - The content identifier
   * @param {Object} versionData - The version data to add to history
   */
  updateHistory(contentId, versionData) {
    const historyPath = path.join(this.storagePath, `${contentId}_history.json`);
    let history = [];

    // Load existing history if it exists
    if (fs.existsSync(historyPath)) {
      const historyContent = fs.readFileSync(historyPath, 'utf8');
      try {
        history = JSON.parse(historyContent);
      } catch (e) {
        // If parsing fails, start with empty array
        history = [];
      }
    }

    // Add new version to history
    history.unshift({
      id: versionData.id,
      hash: versionData.hash,
      timestamp: versionData.timestamp,
      metadata: versionData.metadata
    });

    // Keep only the most recent versions
    if (history.length > this.maxVersions) {
      history = history.slice(0, this.maxVersions);
    }

    // Save updated history
    fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
  }

  /**
   * Gets the current version of content
   * @param {string} contentId - The content identifier
   * @returns {Object|null} Current version data or null if not found
   */
  getCurrentVersion(contentId) {
    const history = this.getVersionHistory(contentId);
    if (history.length === 0) {
      return null;
    }

    const latestVersion = history[0];
    const versionPath = path.join(this.storagePath, `${contentId}_${latestVersion.id}.json`);

    if (fs.existsSync(versionPath)) {
      const content = fs.readFileSync(versionPath, 'utf8');
      return JSON.parse(content);
    }

    return null;
  }

  /**
   * Gets a specific version of content
   * @param {string} contentId - The content identifier
   * @param {string} versionId - The specific version to retrieve
   * @returns {Object|null} Version data or null if not found
   */
  getVersion(contentId, versionId) {
    const versionPath = path.join(this.storagePath, `${contentId}_${versionId}.json`);

    if (fs.existsSync(versionPath)) {
      const content = fs.readFileSync(versionPath, 'utf8');
      return JSON.parse(content);
    }

    return null;
  }

  /**
   * Gets the version history for content
   * @param {string} contentId - The content identifier
   * @returns {Array} Array of version history objects
   */
  getVersionHistory(contentId) {
    const historyPath = path.join(this.storagePath, `${contentId}_history.json`);

    if (fs.existsSync(historyPath)) {
      const historyContent = fs.readFileSync(historyPath, 'utf8');
      try {
        return JSON.parse(historyContent);
      } catch (e) {
        return [];
      }
    }

    return [];
  }

  /**
   * Compares two versions of content
   * @param {string} contentId - The content identifier
   * @param {string} version1Id - First version to compare
   * @param {string} version2Id - Second version to compare
   * @returns {Object} Comparison results
   */
  compareVersions(contentId, version1Id, version2Id) {
    const version1 = this.getVersion(contentId, version1Id);
    const version2 = this.getVersion(contentId, version2Id);

    if (!version1 || !version2) {
      return null;
    }

    return {
      version1: version1.id,
      version2: version2.id,
      differences: this.calculateDifferences(version1.content, version2.content),
      metadata: {
        version1: version1.metadata,
        version2: version2.metadata
      }
    };
  }

  /**
   * Calculates differences between two content versions
   * @param {string} content1 - First version of content
   * @param {string} content2 - Second version of content
   * @returns {Object} Difference analysis
   */
  calculateDifferences(content1, content2) {
    const lines1 = content1.split('\n');
    const lines2 = content2.split('\n');

    const addedLines = [];
    const removedLines = [];
    const modifiedLines = [];

    // Simple line-by-line comparison (in a real implementation, use a proper diff algorithm)
    const maxLines = Math.max(lines1.length, lines2.length);

    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i];
      const line2 = lines2[i];

      if (line1 === undefined) {
        addedLines.push({ line: i + 1, content: line2 });
      } else if (line2 === undefined) {
        removedLines.push({ line: i + 1, content: line1 });
      } else if (line1 !== line2) {
        modifiedLines.push({
          line: i + 1,
          oldContent: line1,
          newContent: line2
        });
      }
    }

    return {
      addedLines,
      removedLines,
      modifiedLines,
      totalLinesAdded: addedLines.length,
      totalLinesRemoved: removedLines.length,
      totalLinesModified: modifiedLines.length,
      similarity: this.calculateSimilarity(content1, content2)
    };
  }

  /**
   * Calculates similarity between two content versions
   * @param {string} content1 - First version of content
   * @param {string} content2 - Second version of content
   * @returns {number} Similarity score (0-1)
   */
  calculateSimilarity(content1, content2) {
    // Simple similarity calculation based on character overlap
    const len1 = content1.length;
    const len2 = content2.length;
    const maxLen = Math.max(len1, len2);

    if (maxLen === 0) return 1;

    // Calculate longest common substring
    let lcsLength = 0;
    for (let i = 0; i < Math.min(len1, len2); i++) {
      if (content1[i] === content2[i]) {
        lcsLength++;
      } else {
        break;
      }
    }

    // For a more sophisticated algorithm, use something like Levenshtein distance
    return lcsLength / maxLen;
  }

  /**
   * Counts words in content
   * @param {string} content - Content to analyze
   * @returns {number} Word count
   */
  countWords(content) {
    return content.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  /**
   * Tracks a content change
   * @param {string} contentId - The content identifier
   * @param {string} content - The content that changed
   * @param {Object} changeMetadata - Metadata about the change
   * @returns {Object} Change tracking information
   */
  trackChange(contentId, content, changeMetadata = {}) {
    const version = this.saveVersion(contentId, content, changeMetadata);

    // Log the change for monitoring
    this.logChange(version);

    return {
      contentId,
      versionId: version.id,
      timestamp: version.timestamp,
      changeMetadata: version.metadata
    };
  }

  /**
   * Logs a change for monitoring
   * @param {Object} version - Version data to log
   */
  logChange(version) {
    const logEntry = {
      timestamp: version.timestamp,
      contentId: version.contentId,
      versionId: version.id,
      action: 'content_update',
      metadata: version.metadata
    };

    // In a real implementation, this might write to a centralized logging system
    console.log(`Content change tracked: ${JSON.stringify(logEntry)}`);
  }

  /**
   * Reverts content to a previous version
   * @param {string} contentId - The content identifier
   * @param {string} versionId - The version to revert to
   * @returns {Object|null} Reverted version data or null if failed
   */
  revertToVersion(contentId, versionId) {
    const version = this.getVersion(contentId, versionId);

    if (!version) {
      console.error(`Version ${versionId} not found for content ${contentId}`);
      return null;
    }

    // Create a revert entry with appropriate metadata
    const revertMetadata = {
      changeType: 'revert',
      revertedFrom: this.getCurrentVersion(contentId)?.id || 'unknown',
      revertedTo: versionId,
      ...version.metadata
    };

    // Save the reverted content as a new version
    return this.saveVersion(contentId, version.content, revertMetadata);
  }

  /**
   * Gets all tracked content items
   * @returns {Array} List of content IDs that are being tracked
   */
  getAllTrackedContent() {
    const files = fs.readdirSync(this.storagePath);
    const contentIds = new Set();

    files.forEach(file => {
      if (file.endsWith('_history.json')) {
        const contentId = file.replace('_history.json', '');
        contentIds.add(contentId);
      }
    });

    return Array.from(contentIds);
  }

  /**
   * Cleans up old versions based on retention policy
   * @param {number} daysToRetain - Number of days to retain versions
   * @returns {number} Number of versions deleted
   */
  cleanupOldVersions(daysToRetain = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToRetain);

    const files = fs.readdirSync(this.storagePath);
    let deletedCount = 0;

    files.forEach(file => {
      if (file.endsWith('.json') && !file.endsWith('_history.json')) {
        const filePath = path.join(this.storagePath, file);
        const stat = fs.statSync(filePath);

        if (stat.mtime < cutoffDate) {
          fs.unlinkSync(filePath);
          deletedCount++;
        }
      }
    });

    return deletedCount;
  }
}

/**
 * Content Change Tracker - Singleton instance
 */
const contentTracker = new ContentVersioning({
  storagePath: './content-versions',
  maxVersions: 20
});

module.exports = {
  ContentVersioning,
  contentTracker
};