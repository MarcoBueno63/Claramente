import React from "react";

const personas = [
  { label: "Mulher", value: "woman" },
  { label: "Homem", value: "man" },
  { label: "Jovem", value: "young" },
  { label: "Maduro", value: "mature" },
  { label: "IA Neutra", value: "ai" },
];

export default function PersonaPicker({ selected, onSelect }: { selected: string; onSelect: (v: string) => void; }) {
  return (
    <div className="flex gap-2" data-testid="persona-picker">
      {personas.map(p => (
        <button
          key={p.value}
          className={`px-3 py-2 rounded border ${selected === p.value ? "bg-indigo-600 text-white" : "bg-white text-gray-700"}`}
          onClick={() => onSelect(p.value)}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
