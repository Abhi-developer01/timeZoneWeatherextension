import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FaPlus } from 'react-icons/fa';
import StickyNote from './StickyNote';
import { StickyNotesProps, StickyNote as StickyNoteType } from '../types';

function StickyNotes({ isExtension, fixedLayout = true }: StickyNotesProps): React.ReactElement {
  const [notes, setNotes] = useState<StickyNoteType[]>([]);

  // Load notes from storage when component mounts
  useEffect(() => {
    const loadNotes = async (): Promise<void> => {
      if (isExtension) {
        // Use Chrome storage API
        chrome.storage.local.get(['notes'], (result: { notes?: StickyNoteType[] }) => {
          if (result.notes) {
            setNotes(result.notes);
          }
        });
      } else {
        // Fallback to localStorage for development
        const savedNotes = localStorage.getItem('notes');
        if (savedNotes) {
          setNotes(JSON.parse(savedNotes));
        }
      }
    };
    
    loadNotes();
  }, [isExtension]);

  // Save notes whenever they change
  useEffect(() => {
    if (notes.length > 0) {
      if (isExtension) {
        // Use Chrome storage API
        chrome.storage.local.set({ notes });
      } else {
        // Fallback to localStorage for development
        localStorage.setItem('notes', JSON.stringify(notes));
      }
    }
  }, [notes, isExtension]);

  // Add a new note
  const addNote = (): void => {
    const newNote: StickyNoteType = {
      id: uuidv4(),
      content: '',
      color: getRandomColor(),
      position: {
        x: Math.random() * (window.innerWidth - 220),
        y: Math.random() * (window.innerHeight - 220)
      },
      createdAt: Date.now()
    };
    setNotes([...notes, newNote]);
  };

  // Delete a note
  const deleteNote = (id: string): void => {
    setNotes(notes.filter(note => note.id !== id));
  };

  // Update note content
  const updateNoteContent = (id: string, content: string): void => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, content } : note
    ));
  };

  // Update note position
  const updateNotePosition = (id: string, position: { x: number; y: number }): void => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, position } : note
    ));
  };

  // Update note color
  const updateNoteColor = (id: string, color: string): void => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, color } : note
    ));
  };

  // Get random dark color for notes
  const getRandomColor = (): string => {
    const colors = [
      '#2d3748', '#1a202c', '#2c3e50',
      '#1e293b', '#334155', '#1e3a8a',
      '#312e81', '#3b0764'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <section className="relative w-full" aria-labelledby="sticky-notes-heading">
      <div className="flex justify-between items-center mb-4">
        <h2 id="sticky-notes-heading" className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="bg-purple-500/30 p-2 rounded-full">
            <FaPlus className="text-purple-300" size={14} />
          </span>
          Sticky Notes
        </h2>
        <button 
          className="p-2 bg-purple-500/30 hover:bg-purple-500/50 rounded-full text-white transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400/50"
          onClick={addNote}
          aria-label="Add new note"
        >
          <FaPlus className="text-lg" aria-hidden="true" />
        </button>
      </div>

      {/* Sticky Notes Container */}
      <div 
        className="w-full p-2 rounded-lg bg-white/5 backdrop-blur-sm h-full overflow-y-auto"
        role="region"
        aria-label="Sticky notes container"
      >
        {notes.length === 0 ? (
          <p className="text-center py-8 text-white/70 italic">
            No notes yet. Click the + button to add one.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {notes.map(note => (
              <div key={note.id} className="bg-opacity-90 rounded-lg shadow-md" style={{ backgroundColor: note.color }}>
                <StickyNote 
                  note={{...note, position: { x: 0, y: 0 }}} 
                  onDelete={deleteNote} 
                  onUpdate={updateNoteContent}
                  onDragEnd={() => {}} // Disable dragging in fixed layout
                  onColorChange={updateNoteColor}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default StickyNotes;
