import React, { useState } from 'react';
import CopyIcon from './icons/CopyIcon';
import CheckIcon from './icons/CheckIcon';

interface MetadataDisplayProps {
  name: string;
  tags: string[];
}

const MetadataDisplay: React.FC<MetadataDisplayProps> = ({ name, tags }) => {
  const [nameCopied, setNameCopied] = useState(false);
  const [tagsCopied, setTagsCopied] = useState(false);

  const handleCopyName = () => {
    if (nameCopied) return;
    navigator.clipboard.writeText(name);
    setNameCopied(true);
    setTimeout(() => setNameCopied(false), 2500);
  };

  const handleCopyTags = () => {
    if (tagsCopied) return;
    const tagsText = tags.join(', ');
    navigator.clipboard.writeText(tagsText);
    setTagsCopied(true);
    setTimeout(() => setTagsCopied(false), 2500);
  };

  return (
    <div className="w-full animate-fade-in-up text-left space-y-6">
      {/* Name Section */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-brand-text-secondary">Image Name</label>
          <button
            onClick={handleCopyName}
            className="bg-brand-surface-lighter text-brand-text-secondary text-xs font-semibold py-1 px-3 rounded-md hover:bg-zinc-600 transition-all duration-200 flex items-center justify-center disabled:opacity-50"
            aria-label="Copy image name"
            disabled={nameCopied}
          >
            {nameCopied ? (
              <>
                <CheckIcon className="w-4 h-4 mr-1.5 text-green-400" />
                Copied
              </>
            ) : (
              <>
                <CopyIcon className="w-4 h-4 mr-1.5" />
                Copy
              </>
            )}
          </button>
        </div>
        <div className="bg-brand-surface-light p-3 rounded-lg">
          <h3 className="text-xl font-bold text-brand-text break-words">{name}</h3>
        </div>
      </div>

      {/* Tags Section */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-brand-text-secondary">Generated Tags</label>
           <button
            onClick={handleCopyTags}
            className="bg-brand-surface-lighter text-brand-text-secondary text-xs font-semibold py-1 px-3 rounded-md hover:bg-zinc-600 transition-all duration-200 flex items-center justify-center disabled:opacity-50"
            aria-label="Copy generated tags"
            disabled={tagsCopied}
          >
            {tagsCopied ? (
              <>
                <CheckIcon className="w-4 h-4 mr-1.5 text-green-400" />
                Copied
              </>
            ) : (
              <>
                <CopyIcon className="w-4 h-4 mr-1.5" />
                Copy
              </>
            )}
          </button>
        </div>
        <div className="bg-brand-surface-light p-3 rounded-lg">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span key={index} className="bg-brand-surface-lighter text-brand-text text-sm font-medium px-3 py-1 rounded-full transition-colors hover:bg-zinc-600">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetadataDisplay;