import React from 'react';
import { Folder as FolderType, NoteItem } from '../types';
import { Folder as FolderIcon, FileText, ChevronRight } from 'lucide-react';

interface FolderListProps {
  folders: FolderType[];
  selectedFolderId: string | null;
  onSelectFolder: (id: string) => void;
}

export const FolderList: React.FC<FolderListProps> = ({
  folders,
  selectedFolderId,
  onSelectFolder,
}) => {
  if (folders.length === 0) {
    return (
      <div className="text-center py-10 px-4 text-slate-400">
        <FolderIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
        <p className="text-sm">No folders yet.</p>
        <p className="text-xs opacity-60 mt-1">Process items to auto-create folders.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 mb-2">
        AI Library
      </h3>
      <ul className="space-y-1">
        {folders.map((folder) => (
          <li key={folder.id}>
            <button
              onClick={() => onSelectFolder(folder.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedFolderId === folder.id
                  ? 'bg-brand-100 text-brand-900 font-medium'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <FolderIcon
                  className={`w-4 h-4 ${
                    selectedFolderId === folder.id ? 'text-brand-600' : 'text-slate-400'
                  }`}
                />
                <span>{folder.name}</span>
              </div>
              <span className="bg-white/50 px-2 py-0.5 rounded text-xs text-slate-500">
                {folder.items.length}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};