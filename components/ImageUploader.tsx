import React, { useCallback, useState } from 'react';
import UploadIcon from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageChange: (file: File) => void;
  imagePreviewUrl: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange, imagePreviewUrl }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageChange(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      if (e.dataTransfer.files[0].type.startsWith('image/')) {
        onImageChange(e.dataTransfer.files[0]);
      } else {
        console.error("File is not an image.");
      }
    }
  }, [onImageChange]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
     if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-2 text-center transition-all duration-300 group cursor-pointer aspect-video flex flex-col items-center justify-center bg-slate-900/50
        ${isDragging ? 'border-brand-primary scale-105' : 'border-brand-border hover:border-brand-primary'}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onClick={() => document.getElementById('file-upload')?.click()}
    >
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      {imagePreviewUrl ? (
        <>
          <img src={imagePreviewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover rounded-md z-0" />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <span className="text-white font-semibold text-lg">Change Image</span>
          </div>
        </>
      ) : (
        <div className="text-brand-text-secondary z-10 flex flex-col items-center">
          <UploadIcon className="w-12 h-12 mb-2 text-brand-text-secondary group-hover:text-brand-primary transition-colors" />
          <p className="text-sm">
            <span className="font-semibold text-brand-primary">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs mt-1">PNG, JPG, WEBP, GIF</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;