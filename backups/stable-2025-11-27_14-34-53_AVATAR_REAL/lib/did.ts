
const DID_API = 'https://api.d-id.com/v1';

export async function createVideoFromAudio(base64Audio: string, script?: string) {
  const key = process.env.DID_API_KEY;
  if (!key) throw new Error('DID_API_KEY not set');

  // D-ID APIs vary by plan; below is a generic call pattern. If your D-ID
  // account uses a different endpoint, adapt as needed.
  const res = await fetch(`${DID_API}/talks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      script: {
        type: 'text',
        input: script || ' ',
      },
      // If the API supports raw audio upload, you would reference it here.
      // For many accounts you need to provide a voice or use their TTS.
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`D-ID error: ${res.status} ${txt}`);
  }

  const data = await res.json();
  // The response usually contains an id or a result URL; return it raw.
  return data;
}
