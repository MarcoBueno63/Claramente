// lib/env-validation.ts
export function validateApiKeys() {
  const validations = {
    database: !!process.env.DATABASE_URL,
    openai: !!process.env.OPENAI_API_KEY,
    elevenlabs: !!process.env.ELEVENLABS_API_KEY,
    did: !!process.env.DID_API_KEY
  };

  const missing = Object.entries(validations)
    .filter(([, isValid]) => !isValid)
    .map(([key]) => key);

  return {
    isValid: missing.length === 0,
    missing,
    validations
  };
}

export function checkApiKeyOrThrow(keyName: string, keyValue: string | undefined): string {
  if (!keyValue || keyValue.trim() === '') {
    throw new Error(`${keyName} não está configurado nas variáveis de ambiente`);
  }
  return keyValue;
}