import React, { useEffect, useState } from "react";

export default function SessionTimer({ max = 30, onExpire }: { max?: number; onExpire: () => void; }) {
  const [min, setMin] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setMin(m => {
      if (m + 1 >= max) { clearInterval(id); onExpire(); }
      return m + 1;
    }), 60_000);
    return () => clearInterval(id);
  }, [max, onExpire]);
  const pct = Math.min(100, Math.round((min / max) * 100));
  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="w-40 h-2 bg-gray-200 rounded">
        <div className="h-2 bg-indigo-500 rounded" style={{ width: `${pct}%` }} />
      </div>
      <span>{min} / {max} min</span>
    </div>
  );
}
