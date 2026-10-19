import { useEffect, useMemo, useState } from 'react';
import { X, Film, AlertCircle } from 'lucide-react';
import { useMediaUrl } from '../hooks/useMediaUrl.js';

function toEmbedUrl(rawUrl) {
  if (!rawUrl) return null;

  try {
    const url = new URL(rawUrl);
    const host = url.hostname.replace(/^www\./, '').toLowerCase();

    if (host === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0];
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : null;
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const parts = url.pathname.split('/').filter(Boolean);
      let id = url.searchParams.get('v');
      if (!id && ['shorts', 'embed', 'live'].includes(parts[0])) id = parts[1];
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : null;
    }

    if (host === 'vimeo.com' || host === 'player.vimeo.com') {
      const id = url.pathname.split('/').filter(Boolean).find((part) => /^\d+$/.test(part));
      return id ? `https://player.vimeo.com/video/${id}?autoplay=1` : null;
    }
  } catch {
    return null;
  }

  return null;
}

function isDirectVideoUrl(url) {
  if (!url) return false;
  return (
    url.startsWith('data:video/') ||
    url.startsWith('blob:') ||
    /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url)
  );
}

export default function VideoModal({ video, onClose }) {
  const resolvedUrl = useMediaUrl(video?.url);
  const [playbackError, setPlaybackError] = useState(false);

  useEffect(() => {
    setPlaybackError(false);
  }, [video?.id, resolvedUrl]);

  useEffect(() => {
    if (!video) return undefined;

    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [video, onClose]);

  const directUrl = resolvedUrl || video?.url || '';
  const embed = useMemo(() => toEmbedUrl(directUrl), [directUrl]);
  const directFile = isDirectVideoUrl(directUrl);

  if (!video) return null;

  const vertical = video.orientacao !== 'horizontal';

  return (
    <div
      className="no-print"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(20, 20, 16, 0.92)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar"
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.3)',
          background: 'rgba(255,255,255,0.08)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <X size={18} />
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: vertical ? 420 : 960,
          aspectRatio: vertical ? '9 / 16' : '16 / 9',
          background: '#000',
          borderRadius: 8,
          overflow: 'hidden',
          boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
        }}
      >
        {embed ? (
          <iframe
            src={embed}
            title={video.titulo}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        ) : directFile && !playbackError ? (
          <video
            key={directUrl}
            src={directUrl}
            controls
            autoPlay
            playsInline
            preload="metadata"
            onError={() => setPlaybackError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              color: 'rgba(255,255,255,0.72)',
              textAlign: 'center',
              padding: 24,
            }}
          >
            {playbackError ? <AlertCircle size={34} /> : <Film size={32} />}
            <p style={{ fontSize: '0.85rem', lineHeight: 1.6, maxWidth: 360 }}>
              {playbackError
                ? 'O navegador não conseguiu reproduzir este arquivo. Use MP4 codificado em H.264/AAC ou WebM.'
                : 'Nenhum vídeo compatível foi vinculado. Use um link do YouTube/Vimeo ou envie um arquivo MP4/WebM.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
