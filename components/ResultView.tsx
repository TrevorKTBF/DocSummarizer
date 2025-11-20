import React from 'react';
import { ProcessedData } from '../types';
import { Check, FolderInput, X } from 'lucide-react';

interface ResultViewProps {
  data: ProcessedData;
  onSave: () => void;
  onCancel: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ data, onSave, onCancel }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-brand-100 overflow-hidden animate-fade-in-up">
      <div className="bg-gradient-to-r from-brand-50 to-white p-4 border-b border-brand-100 flex items-center justify-between">
        <div>
            <h3 className="text-brand-900 font-semibold">Analysis Complete</h3>
            <p className="text-xs text-brand-600 mt-0.5">Review before saving to library</p>
        </div>
        <div className="flex gap-2">
            <button onClick={onCancel} className="p-2 hover:bg-white rounded-full text-slate-500 transition-colors">
                <X className="w-5 h-5" />
            </button>
        </div>
      </div>

      <div className="p-5 space-y-6">
        
        {/* Suggested Folder */}
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div className="bg-white p-2 rounded-md shadow-sm text-brand-500">
                <FolderInput className="w-5 h-5" />
            </div>
            <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wide">Suggested Folder</p>
                <p className="font-medium text-slate-800">{data.folderName}</p>
            </div>
        </div>

        {/* Summary */}
        <div>
            <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">Smart Summary</h4>
            <ul className="space-y-2">
                {data.summaryPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-700 text-sm leading-relaxed">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />
                        <span>{point}</span>
                    </li>
                ))}
            </ul>
        </div>

        {/* Extracted Text */}
        <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Original Extracted Text</h4>
            <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-500 font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
                {data.extractedText}
            </div>
        </div>

        <button 
            onClick={onSave}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg flex items-center justify-center gap-2 font-medium transition-all shadow-lg shadow-brand-500/20"
        >
            <Check className="w-5 h-5" />
            Save to Folder
        </button>
      </div>
    </div>
  );
};