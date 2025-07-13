
import React, { useState, useEffect } from 'react';
import XIcon from './icons/XIcon';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
  currentApiKey: string;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, currentApiKey }) => {
  const [inputValue, setInputValue] = useState(currentApiKey);

  useEffect(() => {
    setInputValue(currentApiKey);
  }, [currentApiKey, isOpen]);

  const handleSave = () => {
    onSave(inputValue);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-brand-surface/70 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl w-full max-w-md m-4 p-6 animate-fade-in-up">
        <div className="flex items-start justify-between">
          <div>
            <h2 id="modal-title" className="text-2xl font-bold text-brand-text">API Key Settings</h2>
            <p className="text-brand-text-secondary mt-1">Enter your Gemini API key to continue.</p>
          </div>
          <button
            onClick={onClose}
            className="text-brand-text-secondary hover:text-brand-text transition-colors"
            aria-label="Close settings"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="mt-6">
          <label htmlFor="api-key-input" className="block text-sm font-medium text-brand-text-secondary mb-2">
            Gemini API Key
          </label>
          <input
            id="api-key-input"
            type="password"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full bg-brand-surface-light border border-brand-border rounded-md px-3 py-2 text-brand-text placeholder-brand-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary"
            placeholder="Enter your API key here"
          />
        </div>
        
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={!inputValue}
            className="bg-brand-primary text-white font-bold py-2 px-6 rounded-lg shadow-primary hover:bg-brand-primary-hover transition-all duration-300 disabled:bg-brand-surface-lighter disabled:text-brand-text-secondary disabled:shadow-none disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
