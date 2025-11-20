import React, { useState, useRef, ChangeEvent } from 'react';
import { Upload, Image as ImageIcon, X, Zap } from 'lucide-react';

interface InputSectionProps {
  onProcess: (text: string, image: string | undefined) => void;
  isProcessing: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onProcess, isProcessing }) => {
  const [text, setText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    if (!text.trim() && !selectedImage) return;
    onProcess(text, selectedImage);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 transition-all">
      <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-brand-500" />
        New Entry
      </h2>
      
      <div className="space-y-4">
        {/* Text Area */}
        <textarea
          className="w-full h-32 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none text-slate-700 placeholder-slate-400 text-sm"
          placeholder="Paste text, notes, or type instructions here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isProcessing}
        />

        {/* Image Preview Area */}
        {selectedImage ? (
          <div className="relative inline-block group">
            <img 
              src={selectedImage} 
              alt="Preview" 
              className="h-32 w-auto rounded-lg border border-slate-200 object-cover shadow-sm"
            />
            <button
              onClick={clearImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* File Input Trigger */
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-50 hover:border-brand-300 transition-colors ${isProcessing ? 'pointer-events-none opacity-50' : ''}`}
          >
            <ImageIcon className="w-8 h-8 mb-2 text-slate-400" />
            <p className="text-sm font-medium">Click to upload an image or file</p>
            <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG, WebP</p>
          </div>
        )}
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {/* Action Button */}
        <button
          onClick={handleSubmit}
          disabled={isProcessing || (!text.trim() && !selectedImage)}
          className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-all ${
            isProcessing || (!text.trim() && !selectedImage)
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-brand-600 hover:bg-brand-700 text-white shadow-md hover:shadow-lg'
          }`}
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Process & Organize
            </>
          )}
        </button>
      </div>
    </div>
  );
};