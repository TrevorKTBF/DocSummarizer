import React, { useState, useCallback } from 'react';
import { FolderList } from './components/FolderList';
import { InputSection } from './components/InputSection';
import { ResultView } from './components/ResultView';
import { analyzeContent } from './services/geminiService';
import { Folder, NoteItem, ProcessedData, ProcessingStatus } from './types';
import { BrainCircuit, Search } from 'lucide-react';

export default function App() {
  // --- State ---
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>(ProcessingStatus.IDLE);
  const [currentResult, setCurrentResult] = useState<ProcessedData | null>(null);
  const [pendingImage, setPendingImage] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  // --- Actions ---

  const handleProcess = useCallback(async (text: string, image: string | undefined) => {
    setProcessingStatus(ProcessingStatus.PROCESSING);
    setError(null);
    setPendingImage(image);

    try {
      const result = await analyzeContent(text, image);
      setCurrentResult(result);
      setProcessingStatus(ProcessingStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to process content. Please check your API key and try again.");
      setProcessingStatus(ProcessingStatus.ERROR);
    }
  }, []);

  const handleSave = useCallback(() => {
    if (!currentResult) return;

    const newNote: NoteItem = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      originalImage: pendingImage,
      data: currentResult,
    };

    setFolders(prevFolders => {
      const targetFolderName = currentResult.folderName;
      const existingFolderIndex = prevFolders.findIndex(
        f => f.name.toLowerCase() === targetFolderName.toLowerCase()
      );

      if (existingFolderIndex >= 0) {
        // Add to existing folder
        const updatedFolders = [...prevFolders];
        updatedFolders[existingFolderIndex] = {
          ...updatedFolders[existingFolderIndex],
          items: [newNote, ...updatedFolders[existingFolderIndex].items],
        };
        setSelectedFolderId(updatedFolders[existingFolderIndex].id);
        return updatedFolders;
      } else {
        // Create new folder
        const newFolder: Folder = {
          id: crypto.randomUUID(),
          name: targetFolderName,
          items: [newNote],
        };
        setSelectedFolderId(newFolder.id);
        return [...prevFolders, newFolder];
      }
    });

    // Reset UI
    setCurrentResult(null);
    setPendingImage(undefined);
    setProcessingStatus(ProcessingStatus.IDLE);
  }, [currentResult, pendingImage]);

  const handleCancel = useCallback(() => {
    setCurrentResult(null);
    setPendingImage(undefined);
    setProcessingStatus(ProcessingStatus.IDLE);
    setError(null);
  }, []);

  // --- Render Helpers ---

  const getSelectedFolder = () => folders.find(f => f.id === selectedFolderId);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex-shrink-0 h-auto md:h-screen sticky top-0 z-10 overflow-y-auto">
        <div className="p-5 border-b border-slate-100 flex items-center gap-2 text-brand-700">
          <div className="bg-brand-600 p-1.5 rounded-lg text-white">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <h1 className="font-bold text-xl tracking-tight">DocSummarizer</h1>
        </div>
        
        <div className="p-3">
          <FolderList 
            folders={folders} 
            selectedFolderId={selectedFolderId}
            onSelectFolder={setSelectedFolderId}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen flex flex-col">
        <div className="max-w-4xl mx-auto space-y-8 w-full flex-grow">
          
          {/* Header for Content Area */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">
                    {processingStatus === ProcessingStatus.SUCCESS 
                        ? "Review Analysis" 
                        : selectedFolderId 
                            ? getSelectedFolder()?.name 
                            : "Dashboard"}
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                    {processingStatus === ProcessingStatus.SUCCESS
                        ? "Verify the extracted summary before organizing."
                        : "Upload documents or type notes to let AI organize them."}
                </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
             <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
             </div>
          )}

          {/* Active Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Input or Details */}
            <div className="lg:col-span-1">
                {currentResult ? (
                    // Preview of original input when reviewing result
                    <div className="space-y-4">
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Original Input</h4>
                            {pendingImage && (
                                <img src={pendingImage} alt="Original" className="w-full rounded-lg mb-3 border border-slate-100" />
                            )}
                            {!pendingImage && (
                                <div className="h-24 flex items-center justify-center bg-slate-50 rounded-lg text-slate-400 italic text-xs">
                                    Text only input
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    // Default Input
                    <InputSection onProcess={handleProcess} isProcessing={processingStatus === ProcessingStatus.PROCESSING} />
                )}
            </div>

            {/* Right Column: Results or List */}
            <div className="lg:col-span-2">
                {currentResult ? (
                    <ResultView 
                        data={currentResult} 
                        onSave={handleSave} 
                        onCancel={handleCancel} 
                    />
                ) : selectedFolderId ? (
                    // Folder Contents View
                    <div className="space-y-6">
                         {getSelectedFolder()?.items.map(note => (
                             <div key={note.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                                <div className="flex items-start gap-4">
                                    {note.originalImage && (
                                        <img src={note.originalImage} alt="Thumbnail" className="w-20 h-20 object-cover rounded-lg bg-slate-100 border border-slate-100 flex-shrink-0" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs text-slate-400">{new Date(note.createdAt).toLocaleDateString()}</span>
                                            <span className="text-xs font-medium px-2 py-1 bg-brand-50 text-brand-600 rounded-full">{note.data.folderName}</span>
                                        </div>
                                        <ul className="space-y-1.5 mb-4">
                                            {note.data.summaryPoints.map((p, i) => (
                                                <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                                                     <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-400 flex-shrink-0" />
                                                    <span className="line-clamp-2">{p}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <details className="group">
                                            <summary className="text-xs text-slate-400 cursor-pointer hover:text-brand-600 transition-colors list-none flex items-center gap-1">
                                                Show extracted text
                                                <div className="w-0 h-0 border-l-[3px] border-l-transparent border-t-[4px] border-t-slate-400 border-r-[3px] border-r-transparent group-open:-rotate-180 transition-transform" />
                                            </summary>
                                            <p className="mt-2 text-xs text-slate-500 bg-slate-50 p-2 rounded font-mono whitespace-pre-wrap">
                                                {note.data.extractedText}
                                            </p>
                                        </details>
                                    </div>
                                </div>
                             </div>
                         ))}
                         {getSelectedFolder()?.items.length === 0 && (
                             <div className="text-center py-20">
                                 <Search className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                 <p className="text-slate-400">This folder is empty.</p>
                             </div>
                         )}
                    </div>
                ) : (
                    // Empty State / Dashboard Welcome
                    <div className="bg-white rounded-xl p-8 border border-slate-200 text-center">
                        <div className="max-w-md mx-auto">
                            <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <BrainCircuit className="w-8 h-8 text-brand-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Welcome to DocSummarizer</h3>
                            <p className="text-slate-500 mb-8">
                                Upload images of documents, whiteboards, or paste text notes. 
                                We'll automatically extract the text, create a bullet-point summary, and file it into a smart folder for you.
                            </p>
                            <div className="grid grid-cols-3 gap-4 text-left">
                                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                                    <span className="text-2xl mb-2 block">📷</span>
                                    <p className="text-xs font-semibold text-slate-700">Image Analysis</p>
                                </div>
                                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                                    <span className="text-2xl mb-2 block">📝</span>
                                    <p className="text-xs font-semibold text-slate-700">Auto Summary</p>
                                </div>
                                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                                    <span className="text-2xl mb-2 block">📂</span>
                                    <p className="text-xs font-semibold text-slate-700">Smart Folders</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
          </div>
        </div>
        
        <footer className="py-6 text-center text-slate-400 text-xs mt-auto">
          &copy; 2026 DocSummarizer
        </footer>
      </main>
    </div>
  );
}