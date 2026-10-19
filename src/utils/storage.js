// Camada de armazenamento local + publicação opcional no Supabase.
// Sem Supabase configurado, o editor continua funcionando no navegador.
// Com Supabase configurado, mídias são enviadas para a nuvem e propostas
// podem ser publicadas em um link compartilhável.

import { createClient } from '@supabase/supabase-js';
import { createDefaultData, PROPOSTA_BASE_ID, PROPOSTA_BASE_NOME } from '../data/portfolioData';

const KEYS = {
  proposals: 'storymaker:proposals',
  activeId: 'storymaker:activeProposalId',
  uploadedMedia: 'storymaker:uploadedMedia',
};

const MAX_LOCAL_FILE_BYTES = 200 * 1024 * 1024;
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const SUPABASE_BUCKET = import.meta.env.VITE_SUPABASE_BUCKET || 'portfolio-media';
const PUBLIC_SITE_URL = import.meta.env.VITE_PUBLIC_SITE_URL || 'https://ballmannjulia.github.io/portifolio_vb_videomaker/';
const MEDIA_DB_NAME = 'storymaker-media-db';
const MEDIA_STORE_NAME = 'media';
const MEDIA_REFERENCE_PREFIX = 'indexeddb-media:';

const supabaseConfigured = Boolean(
  SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    /^https:\/\/.+\.supabase\.co$/i.test(SUPABASE_URL) &&
    !SUPABASE_URL.includes('SEU_PROJETO') &&
    !SUPABASE_ANON_KEY.includes('sua_chave')
);

const supabase = supabaseConfigured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

function safeParse(json, fallback) {
  try {
    const parsed = JSON.parse(json);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function sanitizeFileName(name = 'arquivo') {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .slice(-100);
}

function randomToken() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID().replace(/-/g, '');
  }
  const random = Math.random().toString(36).slice(2);
  return `${Date.now().toString(36)}${random}${Math.random().toString(36).slice(2)}`;
}

function containsLocalMediaReference(value) {
  return (
    typeof value === 'string' &&
    (value.startsWith(MEDIA_REFERENCE_PREFIX) || value.startsWith('blob:') || value.startsWith('data:'))
  );
}

export function isCloudSharingConfigured() {
  return supabaseConfigured;
}

export function loadUploadedMediaMap() {
  const raw = localStorage.getItem(KEYS.uploadedMedia);
  const map = safeParse(raw, null);
  return map && Object.keys(map).length > 0 ? map : {};
}

export function saveUploadedMediaMap(map) {
  localStorage.setItem(KEYS.uploadedMedia, JSON.stringify(map));
}

function openMediaDatabase() {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB não está disponível neste navegador.'));
      return;
    }

    const request = window.indexedDB.open(MEDIA_DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(MEDIA_STORE_NAME)) {
        db.createObjectStore(MEDIA_STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Não foi possível abrir o banco de mídia.'));
  });
}

function getFileFromIndexedDb(id) {
  return openMediaDatabase().then(
    (db) =>
      new Promise((resolve, reject) => {
        const transaction = db.transaction(MEDIA_STORE_NAME, 'readonly');
        const store = transaction.objectStore(MEDIA_STORE_NAME);
        const request = store.get(id);

        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error || new Error('Não foi possível carregar o arquivo salvo.'));
      })
  );
}

async function saveFileToIndexedDb(file) {
  const id = generateId('upload');
  const db = await openMediaDatabase();
  const persistentReference = `${MEDIA_REFERENCE_PREFIX}${id}`;

  await new Promise((resolve, reject) => {
    const transaction = db.transaction(MEDIA_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(MEDIA_STORE_NAME);
    const request = store.put({
      id,
      name: file.name,
      type: file.type,
      size: file.size,
      createdAt: new Date().toISOString(),
      blob: file,
    });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error || new Error('Não foi possível guardar o arquivo no armazenamento local.'));
  });

  const record = {
    id,
    name: file.name,
    type: file.type,
    size: file.size,
    dataUrl: persistentReference,
    createdAt: new Date().toISOString(),
    storage: 'indexeddb',
  };

  const map = loadUploadedMediaMap();
  map[id] = record;
  saveUploadedMediaMap(map);

  return { id, dataUrl: persistentReference, record };
}

async function uploadFileToSupabase(file) {
  const id = randomToken();
  const safeName = sanitizeFileName(file.name);
  const path = `uploads/${new Date().toISOString().slice(0, 10)}/${id}-${safeName}`;

  const { error } = await supabase.storage.from(SUPABASE_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || undefined,
  });

  if (error) {
    throw new Error(`Falha ao enviar arquivo para a nuvem: ${error.message}`);
  }

  const { data } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(path);
  if (!data?.publicUrl) {
    throw new Error('O arquivo foi enviado, mas não foi possível gerar a URL pública. Verifique se o bucket é público.');
  }

  return {
    id,
    dataUrl: data.publicUrl,
    record: {
      id,
      name: file.name,
      type: file.type,
      size: file.size,
      dataUrl: data.publicUrl,
      createdAt: new Date().toISOString(),
      storage: 'supabase',
      path,
    },
  };
}

export async function resolveUploadedMediaUrl(value) {
  if (!value) return '';

  let mediaId = null;

  if (value.startsWith(MEDIA_REFERENCE_PREFIX)) {
    mediaId = value.slice(MEDIA_REFERENCE_PREFIX.length);
  } else if (value.startsWith('blob:')) {
    const map = loadUploadedMediaMap();
    const legacyRecord = Object.values(map).find(
      (record) => record?.storage === 'indexeddb' && record?.dataUrl === value
    );
    mediaId = legacyRecord?.id || null;
  }

  if (!mediaId) return value;

  const storedFile = await getFileFromIndexedDb(mediaId);
  if (!storedFile?.blob) return '';

  return URL.createObjectURL(storedFile.blob);
}

export function isPersistentMediaReference(value) {
  return typeof value === 'string' && value.startsWith(MEDIA_REFERENCE_PREFIX);
}

export async function saveUploadedFile(file) {
  if (!file) return null;

  if (file.size > MAX_LOCAL_FILE_BYTES) {
    throw new Error('Arquivo muito grande. Use um arquivo menor que 200 MB ou um link do vídeo.');
  }

  if (file.type?.startsWith('video/')) {
    const lowerName = file.name.toLowerCase();
    const supported = lowerName.endsWith('.mp4') || lowerName.endsWith('.webm');
    if (!supported) {
      throw new Error('Para evitar tela preta no navegador, envie o vídeo em MP4 (H.264/AAC) ou WebM. Arquivos MOV podem não ser reproduzidos no Chrome.');
    }
  }

  if (supabaseConfigured) {
    return uploadFileToSupabase(file);
  }

  try {
    return await saveFileToIndexedDb(file);
  } catch (error) {
    console.warn('IndexedDB falhou, usando fallback em data URL:', error);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const dataUrl = String(reader.result);
        const map = loadUploadedMediaMap();
        const id = generateId('upload');
        const record = {
          id,
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl,
          createdAt: new Date().toISOString(),
          storage: 'localstorage',
        };
        map[id] = record;
        saveUploadedMediaMap(map);
        resolve({ id, dataUrl, record });
      } catch {
        reject(new Error('Não foi possível salvar este arquivo no navegador. Tente um arquivo menor.'));
      }
    };
    reader.onerror = () => reject(new Error('Não foi possível ler este arquivo.'));
    reader.readAsDataURL(file);
  });
}

export function getUnshareableMedia(data) {
  const items = [];
  const videos = Array.isArray(data?.videos) ? data.videos : [];
  const depoimentos = Array.isArray(data?.depoimentos) ? data.depoimentos : [];

  videos.forEach((video) => {
    if (containsLocalMediaReference(video?.url)) items.push(`vídeo: ${video?.titulo || 'sem título'}`);
    if (containsLocalMediaReference(video?.capa)) items.push(`capa: ${video?.titulo || 'sem título'}`);
  });

  depoimentos.forEach((dep) => {
    if (containsLocalMediaReference(dep?.foto)) items.push(`foto do depoimento: ${dep?.noivos || 'sem nome'}`);
  });

  return items;
}

export async function publishSharedProposal({ shareId, name, data }) {
  if (!supabaseConfigured) {
    throw new Error('O compartilhamento ainda não está configurado. Configure o Supabase para gerar um link que funcione em outros dispositivos.');
  }

  const localMedia = getUnshareableMedia(data);
  if (localMedia.length > 0) {
    throw new Error(
      `Esta proposta ainda contém arquivos salvos apenas neste computador (${localMedia.slice(0, 3).join(', ')}${localMedia.length > 3 ? '...' : ''}). Depois de configurar o Supabase, envie esses arquivos novamente antes de gerar o link.`
    );
  }

  const token = shareId || randomToken();
  const { data: result, error } = await supabase.rpc('publish_shared_proposal', {
    p_share_id: token,
    p_name: name || 'Proposta',
    p_payload: data,
  });

  if (error) {
    throw new Error(`Não foi possível publicar a proposta: ${error.message}`);
  }

  const returnedToken = typeof result === 'string' && result ? result : token;
  const url = new URL(PUBLIC_SITE_URL, window.location.href);
  url.search = '';
  url.hash = '';
  url.searchParams.set('share', returnedToken);

  return { shareId: returnedToken, url: url.toString() };
}

export async function loadSharedProposal(shareId) {
  if (!supabaseConfigured) {
    throw new Error('Este link precisa da configuração do Supabase para carregar a proposta.');
  }

  const { data, error } = await supabase.rpc('get_shared_proposal', { p_share_id: shareId });
  if (error) {
    throw new Error(`Não foi possível carregar a proposta: ${error.message}`);
  }

  const row = Array.isArray(data) ? data[0] : data;
  if (!row?.payload) {
    throw new Error('Proposta não encontrada ou link inválido.');
  }

  return {
    id: shareId,
    nome: row.proposal_name || 'Proposta',
    data: row.payload,
    atualizadaEm: row.updated_at || null,
  };
}

export function loadProposalsMap() {
  const raw = localStorage.getItem(KEYS.proposals);
  const map = safeParse(raw, null);
  if (map && Object.keys(map).length > 0) return map;

  const base = {
    id: PROPOSTA_BASE_ID,
    nome: PROPOSTA_BASE_NOME,
    isBase: true,
    data: createDefaultData(),
    criadaEm: new Date().toISOString(),
    atualizadaEm: new Date().toISOString(),
  };
  const initial = { [PROPOSTA_BASE_ID]: base };
  localStorage.setItem(KEYS.proposals, JSON.stringify(initial));
  return initial;
}

export function saveProposalsMap(map) {
  localStorage.setItem(KEYS.proposals, JSON.stringify(map));
}

export function getActiveProposalId() {
  return localStorage.getItem(KEYS.activeId) || PROPOSTA_BASE_ID;
}

export function setActiveProposalId(id) {
  localStorage.setItem(KEYS.activeId, id);
}

export function generateId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}
