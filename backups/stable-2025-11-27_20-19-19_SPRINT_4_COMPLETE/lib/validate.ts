// lib/validate.ts
export function validateString(value: unknown, min = 1, max = 255): boolean {
  return typeof value === "string" && value.length >= min && value.length <= max;
}

export function validateNumber(value: unknown, min = 0, max = 100000): boolean {
  return typeof value === "number" && value >= min && value <= max;
}

export function validateRequired(obj: Record<string, unknown>, fields: string[]): boolean {
  return fields.every(f => obj[f] !== undefined && obj[f] !== null);
}
