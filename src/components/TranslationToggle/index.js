import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

/**
 * Translation Toggle Component
 * Allows users to switch between English and Urdu translations
 */
function TranslationToggle({
  currentLanguage = 'en',
  onLanguageChange,
  showLabel = true
}) {
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

  useEffect(() => {
    setSelectedLanguage(currentLanguage);
  }, [currentLanguage]);

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ur', name: 'اردو', flag: '🇵🇰' }
  ];

  return (
    <div className={clsx(styles.translationToggle, 'translation-toggle')}>
      {showLabel && (
        <div className={styles.label}>Select Language:</div>
      )}
      <div className={styles.languageSelector}>
        {languages.map((lang) => (
          <button
            key={lang.code}
            className={clsx(
              styles.languageButton,
              selectedLanguage === lang.code && styles.active
            )}
            onClick={() => handleLanguageChange(lang.code)}
            aria-label={`Switch to ${lang.name}`}
            title={`Switch to ${lang.name}`}
          >
            <span className={styles.flag}>{lang.flag}</span>
            <span className={styles.languageName}>{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default TranslationToggle;