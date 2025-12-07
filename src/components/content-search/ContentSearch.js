import React, { useState, useEffect, useMemo } from 'react';
import clsx from 'clsx';
import styles from './ContentSearch.module.css';

/**
 * Content Search Component
 * Provides search functionality across the Humanoid Robotics Book content
 */
function ContentSearch({ chapters, onResultClick }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Debounced search function
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowResults(false);
      setSelectedIndex(-1);
      return;
    }

    setIsLoading(true);
    setShowResults(true);

    // Simulate search delay for UX
    const timer = setTimeout(() => {
      performSearch(query);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Perform the actual search
  const performSearch = (searchQuery) => {
    if (!chapters || chapters.length === 0) {
      setResults([]);
      return;
    }

    const searchTerms = searchQuery.toLowerCase().split(/\s+/).filter(term => term.length > 0);
    const results = [];

    chapters.forEach((chapter, chapterIndex) => {
      // Search in chapter content (simulated)
      const chapterContent = chapter.content || '';
      const chapterTitle = chapter.title || '';
      const chapterDescription = chapter.description || '';

      let relevanceScore = 0;
      let matchedTerms = [];
      let snippets = [];

      // Check title matches
      searchTerms.forEach(term => {
        if (chapterTitle.toLowerCase().includes(term)) {
          relevanceScore += 10;
          matchedTerms.push(term);
        }
      });

      // Check description matches
      searchTerms.forEach(term => {
        if (chapterDescription.toLowerCase().includes(term)) {
          relevanceScore += 5;
          matchedTerms.push(term);
        }
      });

      // Check content matches (simulated with dummy content)
      searchTerms.forEach(term => {
        if (chapterContent.toLowerCase().includes(term)) {
          relevanceScore += 3;
          matchedTerms.push(term);

          // Create snippet with matched term highlighted
          const contentLower = chapterContent.toLowerCase();
          const termIndex = contentLower.indexOf(term);
          if (termIndex !== -1) {
            const start = Math.max(0, termIndex - 50);
            const end = Math.min(chapterContent.length, termIndex + term.length + 50);
            const before = chapterContent.substring(start, termIndex);
            const match = chapterContent.substring(termIndex, termIndex + term.length);
            const after = chapterContent.substring(termIndex + term.length, end);
            const snippet = `${before}...${match}...${after}`;
            snippets.push(snippet);
          }
        }
      });

      if (relevanceScore > 0) {
        results.push({
          id: chapter.id || `chapter-${chapterIndex}`,
          title: chapterTitle,
          description: chapterDescription,
          content: chapterContent,
          relevanceScore,
          matchedTerms: [...new Set(matchedTerms)], // Remove duplicates
          snippets: snippets.slice(0, 2), // Limit to 2 snippets
          chapterIndex,
          url: chapter.url || `/docs/chapter-${chapterIndex + 1}`
        });
      }
    });

    // Sort by relevance score (descending)
    results.sort((a, b) => b.relevanceScore - a.relevanceScore);

    setResults(results.slice(0, 10)); // Limit to top 10 results
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showResults) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultClick(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowResults(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  const handleResultClick = (result) => {
    if (onResultClick) {
      onResultClick(result);
    }
    setQuery('');
    setShowResults(false);
    setSelectedIndex(-1);
  };

  const highlightMatch = (text, query) => {
    if (!query) return text;

    const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0);
    let highlightedText = text;

    searchTerms.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<strong class="highlight">$1</strong>');
    });

    return { __html: highlightedText };
  };

  return (
    <div className={clsx(styles.searchContainer, 'search-container')}>
      <div className={styles.searchInputWrapper}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setShowResults(true)}
          placeholder="Search the Humanoid Robotics Book..."
          className={clsx(styles.searchInput, 'search-input')}
          aria-label="Search content"
        />
        {isLoading && (
          <div className={styles.loadingIndicator}>
            <div className={styles.spinner}></div>
          </div>
        )}
      </div>

      {showResults && (
        <div className={clsx(styles.searchResults, 'search-results')}>
          {results.length === 0 && !isLoading ? (
            <div className={styles.noResults}>
              No results found for "{query}"
            </div>
          ) : (
            <ul className={styles.resultsList}>
              {results.map((result, index) => (
                <li
                  key={result.id}
                  className={clsx(
                    styles.resultItem,
                    index === selectedIndex && styles.selected
                  )}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onClick={() => handleResultClick(result)}
                >
                  <div className={styles.resultHeader}>
                    <h3 className={styles.resultTitle}>
                      <span dangerouslySetInnerHTML={highlightMatch(result.title, query)} />
                    </h3>
                    <span className={styles.resultScore}>
                      Relevance: {result.relevanceScore}
                    </span>
                  </div>
                  <p className={styles.resultDescription}>
                    <span dangerouslySetInnerHTML={highlightMatch(result.description, query)} />
                  </p>
                  {result.snippets.length > 0 && (
                    <div className={styles.snippets}>
                      {result.snippets.map((snippet, snippetIndex) => (
                        <p
                          key={snippetIndex}
                          className={styles.snippet}
                          dangerouslySetInnerHTML={highlightMatch(snippet, query)}
                        />
                      ))}
                    </div>
                  )}
                  <div className={styles.resultMeta}>
                    <span className={styles.matchedTerms}>
                      Matches: {result.matchedTerms.join(', ')}
                    </span>
                    <span className={styles.chapterIndex}>
                      Chapter {result.chapterIndex + 1}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {query && !showResults && (
        <div className={styles.suggestions}>
          <p>Press Enter to search for "{query}"</p>
        </div>
      )}
    </div>
  );
}

export default ContentSearch;