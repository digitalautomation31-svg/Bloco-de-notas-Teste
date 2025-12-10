import React from 'react';
import { Note } from '../types';
import { Plus, Search, Trash2 } from 'lucide-react';

interface NoteListProps {
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (id: string) => void;
  onCreateNote: () => void;
  onDeleteNote: (e: React.MouseEvent, id: string) => void;
  className?: string;
}

export const NoteList: React.FC<NoteListProps> = ({
  notes,
  activeNoteId,
  onSelectNote,
  onCreateNote,
  onDeleteNote,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredNotes = notes
    .filter(n => 
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      n.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => b.lastModified - a.lastModified);

  return (
    <div className={`flex flex-col h-full bg-white border-r border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50/50">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
            Gemini Notes
          </h1>
          <button
            onClick={onCreateNote}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-md transition-all hover:scale-105"
            aria-label="New Note"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filteredNotes.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <p className="text-sm">No notes found.</p>
            {notes.length === 0 && (
              <p className="text-xs mt-2">Click + to create one.</p>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filteredNotes.map((note) => (
              <li key={note.id}>
                <button
                  onClick={() => onSelectNote(note.id)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition-colors group relative ${
                    activeNoteId === note.id ? 'bg-blue-50 border-l-4 border-blue-600' : 'border-l-4 border-transparent'
                  }`}
                >
                  <h3 className={`font-semibold text-sm truncate pr-8 ${
                    activeNoteId === note.id ? 'text-blue-900' : 'text-slate-700'
                  }`}>
                    {note.title || 'Untitled Note'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 truncate h-4 leading-4">
                    {note.content || 'No content'}
                  </p>
                  <span className="text-[10px] text-gray-400 mt-2 block">
                    {new Date(note.lastModified).toLocaleDateString()}
                  </span>

                  <div 
                    onClick={(e) => onDeleteNote(e, note.id)}
                    className="absolute right-2 top-2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all"
                    role="button"
                    aria-label="Delete note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
