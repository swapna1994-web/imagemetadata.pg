import React, { useState, useRef, useEffect } from 'react';
import SettingsIcon from './icons/SettingsIcon';
import CheckIcon from './icons/CheckIcon';

type MetadataLength = 'short' | 'detailed';

interface MetadataSettingsProps {
  selectedLength: MetadataLength;
  onLengthChange: (length: MetadataLength) => void;
}

const MetadataSettings: React.FC<MetadataSettingsProps> = ({ selectedLength, onLengthChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleOptionClick = (length: MetadataLength) => {
    onLengthChange(length);
    setIsOpen(false);
  };

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);


  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-brand-text-secondary hover:text-brand-primary transition-colors duration-300"
        aria-label="Open metadata settings"
      >
        <SettingsIcon className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right bg-brand-surface-light rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-30 animate-fade-in"
             role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
          <div className="py-1" role="none">
            <button
              onClick={() => handleOptionClick('short')}
              className="w-full text-left text-brand-text flex justify-between items-center px-4 py-2 text-sm hover:bg-brand-surface-lighter transition-colors"
              role="menuitem"
            >
              <span>Short Metadata</span>
              {selectedLength === 'short' && <CheckIcon className="w-4 h-4 text-brand-primary" />}
            </button>
            <button
              onClick={() => handleOptionClick('detailed')}
              className="w-full text-left text-brand-text flex justify-between items-center px-4 py-2 text-sm hover:bg-brand-surface-lighter transition-colors"
              role="menuitem"
            >
              <span>Detailed Metadata</span>
              {selectedLength === 'detailed' && <CheckIcon className="w-4 h-4 text-brand-primary" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetadataSettings;
