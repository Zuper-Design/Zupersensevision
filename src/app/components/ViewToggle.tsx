import React from 'react';

interface ViewToggleProps {
  activeView: 'chat' | 'radar' | 'build';
  onToggle: (view: 'chat' | 'radar' | 'build') => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ activeView, onToggle }) => {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      
    </div>
  );
};