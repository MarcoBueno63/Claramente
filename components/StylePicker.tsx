import React from "react";

const styles = [
  { label: "Conservador", value: "conservative" },
  { label: "Integrativo", value: "integrative" },
];

export default function StylePicker({ selected, onSelect }: { selected: string; onSelect: (v: string) => void; }) {
  return (
    <div className="flex gap-2" data-testid="style-picker">
      {styles.map(s => (
        <button
          key={s.value}
          className={`px-3 py-2 rounded border ${selected === s.value ? "bg-indigo-600 text-white" : "bg-white text-gray-700"}`}
          onClick={() => onSelect(s.value)}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
