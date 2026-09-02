import { useEffect } from 'react';
import { X, Film } from 'lucide-react';

function toEmbedUrl(url) {
  if (!url) return null;
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const idMatch = url.match(/(?:v=|youtu\.be\/)([\w-]{6,})/);
    return idMatch ? `https://www.youtube.com/embed/${idMatch[1]}?autoplay=1` : null;
  }
  if (url.includes('vimeo.com')) {
    const idMatch = url.match(/vimeo\.com\/(\d+)/);
    return idMatch ? `https://player.vimeo.com/video/${idMatch[1]}?autoplay=1` : null;
  }
  return null;
}

export default function VideoModal({ video, onClose }) {
  useEffect(() => {
    if (!video) return undefined;

    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!video) return null;

  const embed = toEmbedUrl(video.url);
  const isDirectFile =
    !!video.url &&
    (video.url.startsWith('data:video/') ||
      video.url.startsWith('blob:') ||
      /\.(mp4|webm|mov)(\?.*)?$/i.test(video.url));
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
        ) : isDirectFile ? (
          <video src={video.url} controls autoPlay style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
              color: 'rgba(255,255,255,0.6)',
              textAlign: 'center',
              padding: 24,
            }}
          >
            <Film size={32} />
            <p style={{ fontSize: '0.85rem' }}>
              Nenhum vídeo vinculado ainda.
              <br />
              Adicione o link no modo de edição.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
