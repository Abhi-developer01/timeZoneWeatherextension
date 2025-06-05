import React, { useState } from "react";
import { FaTrash, FaPalette } from "react-icons/fa";
import { StickyNoteProps } from "../types";

function StickyNote({ note, onDelete, onUpdate, onDragEnd, onColorChange }: StickyNoteProps): React.ReactElement {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  
  // Handle drag start
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>): void => {
    setIsDragging(true);
    // Store the initial mouse position relative to the note
    const rect = e.currentTarget.getBoundingClientRect();
    e.dataTransfer.setData('offsetX', (e.clientX - rect.left).toString());
    e.dataTransfer.setData('offsetY', (e.clientY - rect.top).toString());
  };
  
  // Handle drag end
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>): void => {
    setIsDragging(false);
    
    // Calculate new position
    const offsetX = parseInt(e.dataTransfer.getData('offsetX')) || 0;
    const offsetY = parseInt(e.dataTransfer.getData('offsetY')) || 0;
    
    // Update position when drag ends
    onDragEnd(note.id, {
      x: e.clientX - offsetX,
      y: e.clientY - offsetY
    });
  };
  
  // Handle content change
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    onUpdate(note.id, e.target.value);
  };

  // Color options
  const colorOptions = [
    '#2d3748', '#1a202c', '#2c3e50',
    '#1e293b', '#334155', '#1e3a8a',
    '#312e81', '#3b0764'
  ];
  
  return (
    <div 
      className="p-3 rounded-md transition-all cursor-pointer" 
      style={{
        backgroundColor: note.color,
        width: '100%',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}
      role="note"
      aria-label="Sticky note"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex justify-between mb-2" onClick={(e) => e.stopPropagation()}>
        <button 
          className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/40"
          onClick={(e) => {
            e.stopPropagation();
            setShowColorPicker(!showColorPicker);
          }}
          aria-label="Change note color"
          aria-expanded={showColorPicker}
          aria-controls="color-picker"
        >
          <FaPalette size={14} aria-hidden="true" />
        </button>
        <button 
          className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/40"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note.id);
          }}
          aria-label="Delete note"
        >
          <FaTrash size={14} aria-hidden="true" />
        </button>
      </div>
      
      {showColorPicker && (
        <div 
          id="color-picker"
          className="absolute top-10 left-0 p-2 bg-gray-800/90 backdrop-blur-sm rounded-md shadow-lg flex flex-wrap gap-1 z-10 border border-white/20"
          role="menu"
          aria-label="Color options"
          onClick={(e) => e.stopPropagation()}
        >
          {colorOptions.map((color) => (
            <button
              key={color}
              className="w-6 h-6 rounded-full border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              onClick={(e) => {
                e.stopPropagation();
                onColorChange(note.id, color);
                setShowColorPicker(false);
              }}
              aria-label={`Select ${color} color`}
              role="menuitem"
            />
          ))}
        </div>
      )}
      
      <div onClick={(e) => e.stopPropagation()}>
        <textarea
          className={`w-full p-2 bg-transparent border-none resize-none focus:outline-none focus:ring-2 focus:ring-white/40 rounded-sm text-white placeholder-white/60 transition-all duration-300 ${isExpanded ? 'h-32' : 'h-12 line-clamp-2 overflow-hidden'}`}
          value={note.content}
          onChange={handleContentChange}
          placeholder="Write your note here..."
          aria-label="Note content"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(true);
          }}
          onBlur={() => setIsExpanded(false)}
        />
        {!isExpanded && note.content.length > 60 && (
          <div className="text-right mt-1">
            <span className="text-white/60 text-xs italic">Click to expand</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default StickyNote;
