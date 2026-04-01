import React from "react";

const languages = [
  { label: "Português", value: "pt-BR" },
  { label: "English", value: "en" },
  { label: "Español", value: "es" },
];

export default function LanguageSwitcher({ selected, onSelect }: { selected: string; onSelect: (v: string) => void; }) {
  return (
    <div className="flex gap-2" data-testid="language-switcher">
      {languages.map(l => (
        <button
          key={l.value}
          className={`px-3 py-2 rounded border ${selected === l.value ? "bg-indigo-600 text-white" : "bg-white text-gray-700"}`}
          onClick={() => onSelect(l.value)}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
