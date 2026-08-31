// Camada de armazenamento. Hoje usa LocalStorage; no futuro basta trocar
// as implementações destas funções por chamadas a uma API/banco de dados
// sem precisar alterar o restante da aplicação.

import { createDefaultData, PROPOSTA_BASE_ID, PROPOSTA_BASE_NOME } from '../data/portfolioData';

const KEYS = {
  proposals: 'storymaker:proposals', // { [id]: { id, nome, data, criadaEm, atualizadaEm } }
  activeId: 'storymaker:activeProposalId',
};

function safeParse(json, fallback) {
  try {
    const parsed = JSON.parse(json);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
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
