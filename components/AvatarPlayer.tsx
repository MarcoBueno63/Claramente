"use client";
import React, { useState } from 'react';

export default function AvatarPlayer() {
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    try {
      // Example flow: request TTS then video
      const ttsRes = await fetch('/api/avatar/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'Olá, eu sou seu avatar.' }),
      });
      const ttsJson = await ttsRes.json();
      if (!ttsRes.ok) throw new Error(ttsJson.error || 'TTS failed');

      const videoRes = await fetch('/api/avatar/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioBase64: ttsJson.audioBase64, script: 'Olá, eu sou seu avatar.' }),
      });
      const videoJson = await videoRes.json();
      if (!videoRes.ok) throw new Error(videoJson.error || 'Video creation failed');

      // D-ID response shape may vary; attempt to extract a playable url
      const url = videoJson.result?.result_url || videoJson.result?.url || null;
      setVideoUrl(url);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      alert(message || 'Erro ao gerar avatar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4">
      <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={handleGenerate} disabled={loading}>
        {loading ? 'Gerando...' : 'Gerar Avatar'}
      </button>
      {videoUrl ? (
        <div className="mt-4">
          <video src={videoUrl} controls className="w-full rounded shadow" />
        </div>
      ) : null}
    </div>
  );
}
