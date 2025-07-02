import { useState } from "react";

interface AccordionItemProps {
  title: string;
  text: string;
}

export default function AccordionItem({ title, text }: AccordionItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-light-card dark:bg-dark-card rounded-3xl shadow-lg p-6 border border-light-border dark:border-dark-border flex flex-col gap-2 transition-all duration-300">
      <span
        className="text-lg font-bold text-light-accent dark:text-dark-accent mb-2 cursor-pointer hover:opacity-80 transition-opacity select-none"
        onClick={() => setOpen((o) => !o)}
      >
        {title}
        <span
          className={`ml-2 transform transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </span>
      {open && (
        <div className="text-light-fg dark:text-dark-fg text-base leading-relaxed animate-[fadeIn_0.3s_ease-out]">
          {text}
        </div>
      )}
    </div>
  );
}
