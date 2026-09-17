import { useEffect, useState } from 'react';
import { resolveUploadedMediaUrl } from '../utils/storage.js';

export function useMediaUrl(source) {
  const [resolvedUrl, setResolvedUrl] = useState('');

  useEffect(() => {
    let active = true;
    let objectUrlToRevoke = '';

    if (!source) {
      setResolvedUrl('');
      return undefined;
    }

    resolveUploadedMediaUrl(source)
      .then((url) => {
        if (!active) {
          if (url?.startsWith('blob:') && url !== source) URL.revokeObjectURL(url);
          return;
        }

        setResolvedUrl(url || '');
        if (url?.startsWith('blob:') && url !== source) {
          objectUrlToRevoke = url;
        }
      })
      .catch((error) => {
        console.error('Não foi possível carregar a mídia salva:', error);
        if (active) setResolvedUrl('');
      });

    return () => {
      active = false;
      if (objectUrlToRevoke) URL.revokeObjectURL(objectUrlToRevoke);
    };
  }, [source]);

  return resolvedUrl;
}
