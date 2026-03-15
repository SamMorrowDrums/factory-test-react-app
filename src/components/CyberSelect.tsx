import { memo, useState, useCallback, useRef, useEffect } from 'react';
import './CyberSelect.css';

export interface CyberSelectOption<T extends string = string> {
  value: T;
  label: string;
}

interface CyberSelectProps<T extends string = string> {
  options: CyberSelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  'aria-label'?: string;
}

function CyberSelectInner<T extends string = string>({
  options,
  value,
  onChange,
  'aria-label': ariaLabel,
}: CyberSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find((o) => o.value === value);
  const selectedLabel = selectedOption?.label ?? value;

  const close = useCallback(() => {
    setOpen(false);
    setFocusedIndex(-1);
  }, []);

  const toggle = useCallback(() => {
    setOpen((prev) => {
      if (!prev) {
        const idx = options.findIndex((o) => o.value === value);
        setFocusedIndex(idx >= 0 ? idx : 0);
      }
      return !prev;
    });
  }, [options, value]);

  const selectOption = useCallback(
    (optionValue: T) => {
      onChange(optionValue);
      close();
    },
    [onChange, close],
  );

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, close]);

  // Scroll focused option into view
  useEffect(() => {
    if (!open || focusedIndex < 0 || !listRef.current) return;
    const items = listRef.current.children;
    if (items[focusedIndex] && (items[focusedIndex] as HTMLElement).scrollIntoView) {
      (items[focusedIndex] as HTMLElement).scrollIntoView({ block: 'nearest' });
    }
  }, [open, focusedIndex]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (open && focusedIndex >= 0) {
            selectOption(options[focusedIndex].value);
          } else {
            toggle();
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (!open) {
            toggle();
          } else {
            setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (open) {
            setFocusedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
          }
          break;
        case 'Escape':
          e.preventDefault();
          close();
          break;
        case 'Tab':
          close();
          break;
      }
    },
    [open, focusedIndex, options, toggle, selectOption, close],
  );

  const listId = `cyber-select-list-${ariaLabel?.replace(/\s+/g, '-') ?? 'default'}`;

  return (
    <div
      className={`cyber-select ${open ? 'cyber-select--open' : ''}`}
      ref={containerRef}
      role="combobox"
      aria-expanded={open}
      aria-haspopup="listbox"
      aria-label={ariaLabel}
      aria-owns={listId}
      tabIndex={0}
      onClick={toggle}
      onKeyDown={handleKeyDown}
    >
      <span
        className="cyber-select__trigger"
        aria-hidden
      >
        <span className="cyber-select__value">{selectedLabel}</span>
        <span className={`cyber-select__arrow ${open ? 'cyber-select__arrow--open' : ''}`}>
          ▾
        </span>
      </span>

      {open && (
        <ul
          className="cyber-select__dropdown"
          role="listbox"
          id={listId}
          ref={listRef}
        >
          {options.map((option, idx) => (
            <li
              key={option.value}
              className={`cyber-select__option ${
                option.value === value ? 'cyber-select__option--selected' : ''
              } ${idx === focusedIndex ? 'cyber-select__option--focused' : ''}`}
              role="option"
              aria-selected={option.value === value}
              onClick={(e) => { e.stopPropagation(); selectOption(option.value); }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export const CyberSelect = memo(CyberSelectInner) as typeof CyberSelectInner;
