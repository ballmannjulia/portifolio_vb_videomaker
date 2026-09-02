// Camada de armazenamento. Prioriza upload em nuvem (Supabase) quando
// as variáveis de ambiente estiverem configuradas; se não estiver, cai para
// LocalStorage para manter o projeto funcionando sem backend.

import { createClient } from '@supabase/supabase-js';
import { createDefaultData, PROPOSTA_BASE_ID, PROPOSTA_BASE_NOME } from '../data/portfolioData';

const KEYS = {
  proposals: 'storymaker:proposals', // { [id]: { id, nome, data, criadaEm, atualizadaEm } }
  activeId: 'storymaker:activeProposalId',
  uploadedMedia: 'storymaker:uploadedMedia',
};

const MAX_LOCAL_FILE_BYTES = 200 * 1024 * 1024;
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const SUPABASE_BUCKET = import.meta.env.VITE_SUPABASE_BUCKET || 'portfolio-media';
const MEDIA_DB_NAME = 'storymaker-media-db';
const MEDIA_STORE_NAME = 'media';

function safeParse(json, fallback) {
  try {
    const parsed = JSON.parse(json);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
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

async function saveFileToIndexedDb(file) {
  const id = generateId('upload');
  const db = await openMediaDatabase();
  const blobUrl = URL.createObjectURL(file);

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
    dataUrl: blobUrl,
    createdAt: new Date().toISOString(),
    storage: 'indexeddb',
  };

  const map = loadUploadedMediaMap();
  map[id] = record;
  saveUploadedMediaMap(map);

  return { id, dataUrl: blobUrl, record };
}

export async function saveUploadedFile(file) {
  if (!file) return null;

  if (file.size > MAX_LOCAL_FILE_BYTES) {
    throw new Error('Arquivo muito grande para guardar no navegador. Use um vídeo menor que 200 MB ou um link do vídeo.');
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
      } catch (error) {
        reject(new Error('Não foi possível salvar este arquivo no navegador. Tente um arquivo menor.'));
      }
    };
    reader.onerror = () => reject(new Error('Não foi possível ler este arquivo.'));
    reader.readAsDataURL(file);
  });
}

export function loadProposalsMap() {
  const raw = localStorage.getItem(KEYS.proposals);
  const map = safeParse(raw, null);
  if (map && Object.keys(map).length > 0) return map;

  // Primeira execução: cria a proposta base.
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
