import { createHmac, timingSafeEqual } from 'crypto';

type AuthPayload = {
  sub: string;
  exp: number;
};

function getSecret(): string {
  const secret = process.env.APP_AUTH_SECRET;
  if (secret && secret.trim().length > 0) return secret;

  if (process.env.NODE_ENV !== 'production') {
    return 'dev-insecure-secret-change-in-production';
  }

  throw new Error('APP_AUTH_SECRET não configurado para produção.');
}

function sign(value: string): string {
  return createHmac('sha256', getSecret()).update(value).digest('hex');
}

export function issueAuthToken(userId: string, ttlSeconds = 60 * 60 * 12): string {
  const payload: AuthPayload = {
    sub: userId,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function verifyAuthToken(token: string): AuthPayload | null {
  const [encodedPayload, providedSignature] = token.split('.');
  if (!encodedPayload || !providedSignature) return null;

  const expectedSignature = sign(encodedPayload);
  const provided = Buffer.from(providedSignature);
  const expected = Buffer.from(expectedSignature);

  if (provided.length !== expected.length) return null;
  if (!timingSafeEqual(provided, expected)) return null;

  const decoded = Buffer.from(encodedPayload, 'base64url').toString('utf8');
  const payload = JSON.parse(decoded) as AuthPayload;
  if (!payload.sub || !payload.exp) return null;
  if (payload.exp < Math.floor(Date.now() / 1000)) return null;

  return payload;
}
