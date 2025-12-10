import React, { useState, useCallback, useEffect } from 'react';
import { Note, AIServiceAction } from '../types';
import { Button } from './Button';
import { processWithAI } from '../services/geminiService';
import { 
  Sparkles, 
  Wand2, 
  Type, 
  FileText, 
  ArrowLeft,
  Check,
  AlertCircle,
  Copy
} from 'lucide-react';

interface NoteEditorProps {
  note: Note;
  onUpdate: (updatedNote: Note) => void;
  onBack: () => void;
  className?: string;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ 
  note, 
  onUpdate, 
  onBack,
  className = '' 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Clear messages after 3 seconds
  useEffect(() => {
    if (successMsg || aiError) {
      const timer = setTimeout(() => {
        setSuccessMsg(null);
        setAiError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg, aiError]);

  const handleChange = useCallback((field: keyof Note, value: string) => {
    onUpdate({
      ...note,
      [field]: value,
      lastModified: Date.now(),
    });
  }, [note, onUpdate]);

  const handleAIAction = async (action: AIServiceAction) => {
    if (!note.content && action !== AIServiceAction.CONTINUE_WRITING) {
      setAiError("Write something first!");
      return;
    }

    setIsProcessing(true);
    setAiError(null);

    try {
      const result = await processWithAI(action, note.content);
      
      if (action === AIServiceAction.AUTO_TITLE) {
        handleChange('title', result);
        setSuccessMsg("Title generated!");
      } else if (action === AIServiceAction.FIX_GRAMMAR) {
        handleChange('content', result);
        setSuccessMsg("Grammar fixed!");
      } else if (action === AIServiceAction.CONTINUE_WRITING) {
        const spacer = note.content.length > 0 && !note.content.endsWith(' ') ? ' ' : '';
        handleChange('content', note.content + spacer + result);
        setSuccessMsg("Added new content!");
      } else if (action === AIServiceAction.SUMMARIZE) {
         // For summary, we append it to the bottom or could show a modal. 
         // Appending is simplest for this UX.
         handleChange('content', note.content + '\n\n### Summary\n' + result);
         setSuccessMsg("Summary added to bottom!");
      }
    } catch (err) {
      setAiError("Failed to process with AI. Try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-2">
          <button 
            onClick={onBack}
            className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs text-gray-400 font-mono hidden sm:inline-block">
            {new Date(note.lastModified).toLocaleString()}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleAIAction(AIServiceAction.AUTO_TITLE)}
            disabled={isProcessing}
            title="Auto Title"
            className="text-xs"
          >
             <Type className="w-4 h-4 mr-1 text-blue-500" />
             <span className="hidden sm:inline">Title</span>
          </Button>

          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleAIAction(AIServiceAction.FIX_GRAMMAR)}
            disabled={isProcessing}
            title="Fix Grammar"
            className="text-xs"
          >
             <Check className="w-4 h-4 mr-1 text-green-500" />
             <span className="hidden sm:inline">Fix</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleAIAction(AIServiceAction.CONTINUE_WRITING)}
            disabled={isProcessing}
            title="Continue Writing"
            className="text-xs"
          >
             <Wand2 className="w-4 h-4 mr-1 text-purple-500" />
             <span className="hidden sm:inline">Continue</span>
          </Button>

          <Button 
            variant="secondary" 
            onClick={() => handleAIAction(AIServiceAction.SUMMARIZE)}
            isLoading={isProcessing}
            disabled={isProcessing}
            className="text-xs px-3 py-1.5 h-8"
          >
            <Sparkles className="w-3 h-3 mr-1 text-amber-500" />
            Summarize
          </Button>
        </div>
      </div>

      {/* Notifications */}
      {aiError && (
        <div className="bg-red-50 text-red-600 px-4 py-2 text-xs flex items-center justify-center animate-fade-in">
          <AlertCircle className="w-3 h-3 mr-2" />
          {aiError}
        </div>
      )}
      {successMsg && (
        <div className="bg-green-50 text-green-600 px-4 py-2 text-xs flex items-center justify-center animate-fade-in">
          <Check className="w-3 h-3 mr-2" />
          {successMsg}
        </div>
      )}

      {/* Inputs */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        <input
          type="text"
          value={note.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Note Title"
          className="w-full px-6 pt-6 pb-2 text-2xl md:text-3xl font-bold text-slate-800 placeholder-gray-300 border-none focus:ring-0 outline-none bg-transparent"
        />
        <textarea
          value={note.content}
          onChange={(e) => handleChange('content', e.target.value)}
          placeholder="Start typing or use AI tools..."
          className="flex-1 w-full px-6 py-4 text-base md:text-lg text-slate-600 leading-relaxed resize-none border-none focus:ring-0 outline-none bg-transparent"
        />
      </div>
    </div>
  );
};
