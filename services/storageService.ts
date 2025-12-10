import { Note } from '../types';

const STORAGE_KEY = 'gemini_notes_app_v1';

export const getNotes = (): Note[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load notes", error);
    return [];
  }
};

export const saveNotes = (notes: Note[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error("Failed to save notes", error);
  }
};

export const createNote = (): Note => {
  return {
    id: crypto.randomUUID(),
    title: '',
    content: '',
    lastModified: Date.now(),
  };
};
