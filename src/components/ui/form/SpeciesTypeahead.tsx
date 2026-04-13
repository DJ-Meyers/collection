import { useState, useRef, useEffect, useMemo, useId } from 'react';
import { getAllSpecies } from '../../../data/pokemon-dex';

interface SpeciesTypeaheadProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (species: { name: string; num: number }) => void;
  className?: string;
  placeholder?: string;
}

const MAX_RESULTS = 20;

export function SpeciesTypeahead({
  value,
  onChange,
  onSelect,
  className,
  placeholder,
}: SpeciesTypeaheadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listboxId = useId();

  const allSpecies = useMemo(() => getAllSpecies(), []);

  const filtered = useMemo(() => {
    if (!value) return [];
    const lower = value.toLowerCase();
    return allSpecies
      .filter(
        (s) =>
          s.name.toLowerCase().includes(lower) ||
          s.num.toString() === value.trim(),
      )
      .slice(0, MAX_RESULTS);
  }, [value, allSpecies]);

  // Reset highlight when results change
  useEffect(() => {
    setHighlightIndex(0);
  }, [filtered]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (listRef.current && isOpen) {
      const item = listRef.current.children[highlightIndex] as HTMLElement;
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightIndex, isOpen]);

  // Close on outside click
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
        onSelect(selected);
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        className={className}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => {
          if (value) setIsOpen(true);
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={isOpen && filtered.length > 0}
        aria-controls={listboxId}
        aria-activedescendant={isOpen && filtered.length > 0 ? `${listboxId}-option-${highlightIndex}` : undefined}
      />
      {isOpen && filtered.length > 0 && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg"
        >
          {filtered.map((s, i) => (
            <li
              key={s.num}
              id={`${listboxId}-option-${i}`}
              role="option"
              aria-selected={i === highlightIndex}
              className={`cursor-pointer px-3 py-2 text-sm ${
                i === highlightIndex ? 'bg-blue-100 text-blue-900' : 'text-gray-900 hover:bg-gray-50'
              }`}
              onMouseEnter={() => setHighlightIndex(i)}
              onMouseDown={(e) => {
                e.preventDefault();
                onSelect(s);
                setIsOpen(false);
              }}
            >
              <span className="font-medium">{s.name}</span>
              <span className="ml-2 text-gray-500">#{s.num}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
