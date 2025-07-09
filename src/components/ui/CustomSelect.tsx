import React, { useState, useRef, useEffect } from "react";

interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  label?: string;
  placeholder?: string;
  id?: string;
  className?: string;
}

export default function CustomSelect({ value, onChange, options, label, placeholder, id, className }: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState<number>(-1);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) setHighlighted(-1);
  }, [open]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(options.length - 1, h + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(0, h - 1));
    } else if (e.key === "Enter" && highlighted >= 0) {
      e.preventDefault();
      if (!options[highlighted].disabled) {
        onChange(options[highlighted].value);
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className={`relative min-w-[180px] ${className || ""}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {label && <label htmlFor={id} className="block mb-1 text-sm font-medium text-light-fg dark:text-dark-fg">{label}</label>}
      <button
        type="button"
        id={id}
        className={`w-full min-h-[42px] px-4 py-2 pr-10 rounded-full border border-light-border dark:border-dark-border bg-white dark:bg-dark-card text-base font-medium text-left focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent transition-all cursor-pointer flex items-center relative ${open ? "ring-2 ring-light-accent dark:ring-dark-accent" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={selected ? "" : "opacity-50"}>
          {selected ? selected.label : placeholder || "Выберите..."}
        </span>
        <span className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform flex items-center justify-center h-5 w-5 ${open ? "rotate-180" : ""}`} style={{margin:0,padding:0}}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-light-accent dark:text-dark-accent"/></svg>
        </span>
      </button>
      {open && (
        <ul className="absolute z-30 mt-1 w-full bg-white dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl shadow-lg max-h-60 overflow-auto animate-fade-in" role="listbox">
          {options.map((opt, i) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={value === opt.value}
              className={`px-4 py-2 cursor-pointer select-none flex items-center gap-2 transition-colors
                ${opt.disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-light-accent/10 dark:hover:bg-dark-accent/10"}
                ${value === opt.value ? "bg-light-accent/20 dark:bg-dark-accent/20 font-semibold" : ""}
                ${highlighted === i ? "bg-light-accent/10 dark:bg-dark-accent/10" : ""}
              `}
              onClick={() => { if (!opt.disabled) { onChange(opt.value); setOpen(false); } }}
              onMouseEnter={() => setHighlighted(i)}
            >
              {opt.label}
              {value === opt.value && (
                <svg width="16" height="16" fill="none" viewBox="0 0 20 20"><path d="M5 10l4 4 6-6" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 