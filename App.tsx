
import React, { useState, useCallback, useEffect } from 'react';
import { generateImageMetadata } from './services/geminiService';
import { ImageMetadata } from './types';
import ImageUploader from './components/ImageUploader';
import MetadataDisplay from './components/MetadataDisplay';
import Spinner from './components/Spinner';
import SettingsModal from './components/SettingsModal';
import SettingsIcon from './components/icons/SettingsIcon';
import PixelGearIcon from './components/icons/PixelGearIcon';
import MetadataSettings from './components/MetadataSettings';

function App() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [metadataLength, setMetadataLength] = useState<'short' | 'detailed'>('short');

  useEffect(() => {
    const storedApiKey = localStorage.getItem('gemini_api_key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    } else {
      setIsSettingsOpen(true); // Prompt for key if not found
    }
  }, []);

  const handleImageChange = (file: File) => {
    setImageFile(file);
    setMetadata(null);
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveApiKey = (newApiKey: string) => {
    setApiKey(newApiKey);
    localStorage.setItem('gemini_api_key', newApiKey);
    setIsSettingsOpen(false);
    setError(null); // Clear previous errors
  };
  
  const handleGenerateMetadata = useCallback(async () => {
    if (!imageFile) {
      setError("Please upload an image first.");
      return;
    }

    if (!apiKey) {
      setError("API Key is not set. Please add your key in the settings.");
      setIsSettingsOpen(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setMetadata(null);

    try {
      const result = await generateImageMetadata(imageFile, apiKey, metadataLength);
      setMetadata(result);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, apiKey, metadataLength]);

  return (
    <div className="min-h-screen font-sans p-4 flex items-center justify-center">
      <div className="w-full max-w-6xl mx-auto bg-brand-surface/60 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 p-6 md:p-8 animate-fade-in-up">
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="absolute top-4 right-4 text-brand-text-secondary hover:text-brand-primary transition-colors duration-300 z-20"
          aria-label="Open settings"
        >
          <SettingsIcon className="w-6 h-6" />
        </button>
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-brand-text mb-3">Image Metadata AI</h1>
          <div className="flex items-center justify-center space-x-2 text-md text-brand-text-secondary">
            <PixelGearIcon className="w-5 h-5 text-brand-primary" />
            <span>Powered by Pixel Gear</span>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col space-y-6">
            <ImageUploader onImageChange={handleImageChange} imagePreviewUrl={imagePreviewUrl} />
            <button
              onClick={handleGenerateMetadata}
              disabled={!imageFile || isLoading}
              className="w-full bg-brand-primary text-white font-bold text-lg py-3 px-4 rounded-lg shadow-primary hover:bg-brand-primary-hover transition-all duration-300 disabled:bg-brand-surface-lighter disabled:text-brand-text-secondary disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Spinner />
                  Generating...
                </>
              ) : '✨ Generate Metadata'}
            </button>
          </div>

          <div className="bg-black/30 p-6 rounded-lg shadow-inner min-h-[300px] flex flex-col border border-white/5">
             <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                <h2 className="text-2xl font-bold text-brand-text">Generated Metadata</h2>
                <MetadataSettings 
                  selectedLength={metadataLength}
                  onLengthChange={setMetadataLength}
                />
             </div>
            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-300 p-3 rounded-lg text-center animate-fade-in">
                <p className="font-semibold">Error</p>
                <p>{error}</p>
              </div>
            )}
             <div className="flex-grow flex items-center justify-center">
                {isLoading && (
                  <div className="flex flex-col items-center justify-center text-center animate-fade-in">
                    <Spinner />
                    <p className="text-brand-text-secondary mt-2">Analyzing image with Gemini...</p>
                  </div>
                )}
                {!isLoading && !error && metadata && (
                  <MetadataDisplay name={metadata.name} tags={metadata.tags} />
                )}
                {!isLoading && !error && !metadata && (
                  <div className="text-brand-text-secondary text-center">
                    <p>Your generated name and tags will appear here.</p>
                  </div>
                )}
            </div>
          </div>
        </main>
      </div>
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveApiKey}
        currentApiKey={apiKey}
      />
    </div>
  );
}

export default App;