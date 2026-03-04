// ============================================
// justBeat - Genre 选择器组件
// ============================================

import { useDrumMachine } from '@/context/DrumMachineContext';
import { useDrumMachine as useDrumMachineControl } from '@/hooks/useDrumMachine';
import { GENRES } from '@/constants/config';
import type { Genre } from '@/types';

export function GenreSelector() {
  const { state } = useDrumMachine();
  const { changeGenre } = useDrumMachineControl();
  const { genre } = state;

  const handleGenreChange = (newGenre: Genre) => {
    if (newGenre !== genre) {
      changeGenre(newGenre);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 uppercase tracking-wider">Genre</span>
      <div className="flex bg-industrial-600 rounded-md p-1">
        {GENRES.map((g) => (
          <button
            key={g.id}
            onClick={() => handleGenreChange(g.id as Genre)}
            className={`
              px-3 py-1.5 rounded text-sm font-medium transition-all duration-150
              flex items-center gap-1.5
              ${genre === g.id
                ? 'bg-neon-green text-industrial-900 shadow-md'
                : 'text-gray-400 hover:text-gray-200 hover:bg-industrial-500'
              }
            `}
          >
            <span>{g.icon}</span>
            <span>{g.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
