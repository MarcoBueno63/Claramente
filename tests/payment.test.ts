// tests/payment.test.ts
import { NextRequest } from 'next/server';
import paymentHandler from './bootstrap/paymentHandler';

describe('API - Pagamento', () => {
  it('deve criar um pagamento válido', async () => {
    const body = { userId: 'test-user', plan: 'premium' };
    const req = new NextRequest('http://localhost/api/payment', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'content-type': 'application/json' }
    });
    const res = await paymentHandler(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.status).toBe('pending');
    expect(data.provider).toBe('stripe');
  });

  it('deve retornar erro para dados inválidos', async () => {
    const body = { userId: '', plan: '' };
    const req = new NextRequest('http://localhost/api/payment', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'content-type': 'application/json' }
    });
    const res = await paymentHandler(req);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data).toHaveProperty('error');
  });
});
