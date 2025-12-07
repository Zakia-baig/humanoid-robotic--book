import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import clsx from 'clsx';

import styles from './styles.module.css';

/**
 * Navigation component for the Humanoid Robotics Book
 * Provides chapter navigation and previous/next buttons
 */
function Navigation({ currentChapter, chapters }) {
  const { siteConfig } = useDocusaurusContext();

  // Find current chapter index
  const currentIndex = chapters.findIndex(ch => ch.slug === currentChapter.slug);
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  return (
    <nav className={clsx('menu', 'menu--responsive', styles.navigation)}>
      <div className={styles.navContainer}>
        <div className={styles.navSection}>
          <h3 className={styles.navTitle}>Table of Contents</h3>
          <ul className={styles.chapterList}>
            {chapters.map((chapter, index) => (
              <li
                key={chapter.slug}
                className={clsx(
                  styles.chapterItem,
                  currentChapter.slug === chapter.slug && styles.currentChapter
                )}
              >
                <Link
                  to={useBaseUrl(`/docs/${chapter.slug}`)}
                  className={clsx(
                    'menu__link',
                    currentChapter.slug === chapter.slug && 'menu__link--active'
                  )}
                >
                  <span className={styles.chapterNumber}>{index + 1}.</span>
                  <span className={styles.chapterTitle}>{chapter.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {(prevChapter || nextChapter) && (
          <div className={styles.navButtons}>
            {prevChapter && (
              <Link
                to={useBaseUrl(`/docs/${prevChapter.slug}`)}
                className={clsx('button', 'button--outline', 'button--secondary', styles.navButton)}
              >
                ← Previous: {prevChapter.title}
              </Link>
            )}
            {nextChapter && (
              <Link
                to={useBaseUrl(`/docs/${nextChapter.slug}`)}
                className={clsx('button', 'button--primary', styles.navButton)}
              >
                Next: {nextChapter.title} →
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;