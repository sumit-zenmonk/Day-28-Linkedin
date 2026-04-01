"use client";

import React, { useState } from 'react';

interface MoodEmojiReactionPanelProps {
  showCounters?: boolean;
  onReaction?: (emoji: string) => void;
  className?: string;
  initialReactions?: Record<string, number>;
}

const MoodEmojiReactionPanel: React.FC<MoodEmojiReactionPanelProps> = ({
  showCounters = true,
  onReaction = () => {},
  className = '',
  initialReactions = {}
}) => {
  const emojis = ['😄', '😢', '😲', '👍', '❤️'];
  const [reactions, setReactions] = useState<Record<string, number>>(
    emojis.reduce((acc, emoji) => ({ ...acc, [emoji]: initialReactions[emoji] || 0 }), {})
  );
  const [animating, setAnimating] = useState<Record<string, boolean>>({});

  const handleReaction = (emoji: string) => {
    setReactions(prev => ({
      ...prev,
      [emoji]: prev[emoji] + 1
    }));
    setAnimating(prev => ({ ...prev, [emoji]: true }));
    onReaction(emoji);

    // Remove animation after 500ms
    setTimeout(() => {
      setAnimating(prev => ({ ...prev, [emoji]: false }));
    }, 50000);
  };

  return (
    <div className={`flex flex-wrap gap-2 p-2 bg-white  rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      {emojis.map(emoji => (
        <button
          key={emoji}
          onClick={() => handleReaction(emoji)}
          className={`relative flex items-center justify-center w-10 h-10 text-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
            animating[emoji] ? 'animate-bounce' : ''
          }`}
          aria-label={`React with ${emoji}`}
        >
          <span className="select-none">{emoji}</span>
          {showCounters && reactions[emoji] > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
              {reactions[emoji]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default MoodEmojiReactionPanel;
