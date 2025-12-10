import React, { useState, useEffect } from 'react';
import { Note } from './types';
import { getNotes, saveNotes, createNote } from './services/storageService';
import { NoteList } from './components/NoteList';
import { NoteEditor } from './components/NoteEditor';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  
  // Load notes on mount
  useEffect(() => {
    const loadedNotes = getNotes();
    setNotes(loadedNotes);
    if (loadedNotes.length > 0 && window.innerWidth > 768) {
        // Automatically select first note on desktop
        setActiveNoteId(loadedNotes[0].id);
    }
  }, []);

  // Save notes whenever they change
  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  const handleCreateNote = () => {
    const newNote = createNote();
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const handleDeleteNote = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updatedNotes = notes.filter(n => n.id !== id);
    setNotes(updatedNotes);
    if (activeNoteId === id) {
      setActiveNoteId(null);
    }
  };

  const handleUpdateNote = (updatedNote: Note) => {
    setNotes(notes.map(n => n.id === updatedNote.id ? updatedNote : n));
  };

  const activeNote = notes.find(n => n.id === activeNoteId);

  return (
    <div className="flex h-screen w-screen bg-gray-50 overflow-hidden text-slate-900 font-sans">
      {/* Sidebar - Hidden on mobile if note selected */}
      <div 
        className={`
          absolute inset-y-0 left-0 z-20 w-full md:w-80 lg:w-96 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
          ${activeNoteId ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}
        `}
      >
        <NoteList 
          notes={notes}
          activeNoteId={activeNoteId}
          onSelectNote={setActiveNoteId}
          onCreateNote={handleCreateNote}
          onDeleteNote={handleDeleteNote}
          className="h-full shadow-xl md:shadow-none"
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 h-full relative bg-white">
        {activeNote ? (
          <NoteEditor 
            note={activeNote}
            onUpdate={handleUpdateNote}
            onBack={() => setActiveNoteId(null)}
            className="h-full animate-fade-in"
          />
        ) : (
          <div className="hidden md:flex flex-col items-center justify-center h-full text-gray-300 bg-gray-50">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Menu className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-lg font-medium text-gray-400">Select a note to view</p>
            <button 
              onClick={handleCreateNote}
              className="mt-4 px-6 py-2 bg-white border border-gray-200 text-blue-600 rounded-lg hover:bg-blue-50 font-medium transition-colors shadow-sm"
            >
              Create New Note
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
