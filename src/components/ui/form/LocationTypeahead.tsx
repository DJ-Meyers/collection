import { useState, useRef, useEffect, useMemo, useId } from 'react';
import { GAME_LOCATIONS } from '../../../data/constants';

interface LocationTypeaheadProps {
  value: string | null;
  onChange: (value: string | null) => void;
  className?: string;
  placeholder?: string;
}

const MAX_RESULTS = 20;

export function LocationTypeahead({
  value,
  onChange,
  className,
  placeholder = 'Search game titles...',
}: LocationTypeaheadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listboxId = useId();

  const filtered = useMemo(() => {
    const text = value ?? '';
    if (!text) return [...GAME_LOCATIONS].slice(0, MAX_RESULTS);
    const lower = text.toLowerCase();
    return GAME_LOCATIONS.filter((g) => g.name.toLowerCase().includes(lower)).slice(0, MAX_RESULTS);
  }, [value]);

  useEffect(() => {
    setHighlightIndex(0);
  }, [filtered]);

  useEffect(() => {
    if (listRef.current && isOpen) {
      const item = listRef.current.children[highlightIndex] as HTMLElement;
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen || filtered.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((i) => (i + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((i) => (i - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = filtered[highlightIndex];
      if (selected) {
        onChange(selected.name);
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }

  const selectedGame = useMemo(
    () => GAME_LOCATIONS.find((g) => g.name === value),
    [value],
  );

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        {selectedGame && (
          <img
            src={selectedGame.boxArt}
            alt=""
            className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded object-contain"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        )}
        <input
          type="text"
          className={className}
          style={selectedGame ? { paddingLeft: '2.25rem' } : undefined}
          value={value ?? ''}
          onChange={(e) => {
            onChange(e.target.value || null);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen && filtered.length > 0}
          aria-controls={listboxId}
          aria-activedescendant={isOpen && filtered.length > 0 ? `${listboxId}-option-${highlightIndex}` : undefined}
        />
      </div>
      {isOpen && filtered.length > 0 && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg"
        >
          {filtered.map((game, i) => (
            <li
              key={game.name}
              id={`${listboxId}-option-${i}`}
              role="option"
              aria-selected={i === highlightIndex}
              className={`flex items-center gap-2.5 cursor-pointer px-3 py-2 text-sm ${
                i === highlightIndex ? 'bg-blue-100 text-blue-900' : 'text-gray-900 hover:bg-gray-50'
              }`}
              onMouseEnter={() => setHighlightIndex(i)}
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(game.name);
                setIsOpen(false);
              }}
            >
              <img
                src={game.boxArt}
                alt=""
                className="w-7 h-7 rounded object-contain flex-shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <span className="font-medium">{game.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
