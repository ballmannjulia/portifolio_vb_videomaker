import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createDefaultData,
  PROPOSTA_BASE_ID,
} from '../data/portfolioData';
import {
  loadProposalsMap,
  saveProposalsMap,
  getActiveProposalId,
  setActiveProposalId,
  generateId,
  publishSharedProposal,
  loadSharedProposal,
  isCloudSharingConfigured,
} from '../utils/storage';

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function setPath(obj, path, value) {
  const clone = deepClone(obj);
  const keys = path.split('.');
  let ref = clone;
  for (let i = 0; i < keys.length - 1; i++) {
    ref = ref[keys[i]];
  }
  ref[keys[keys.length - 1]] = value;
  return clone;
}

function getShareIdFromUrl() {
  if (typeof window === 'undefined') return '';
  return new URLSearchParams(window.location.search).get('share') || '';
}

export function usePortfolio() {
  const shareIdFromUrl = useMemo(() => getShareIdFromUrl(), []);
  const isSharedView = Boolean(shareIdFromUrl);

  const [proposalsMap, setProposalsMap] = useState(() => loadProposalsMap());
  const [activeId, setActiveId] = useState(() => {
    const id = getActiveProposalId();
    const map = loadProposalsMap();
    return map[id] ? id : PROPOSTA_BASE_ID;
  });
  const [editMode, setEditMode] = useState(false);
  const [clientPreview, setClientPreview] = useState(false);
  const [sharedLoading, setSharedLoading] = useState(isSharedView);
  const [sharedError, setSharedError] = useState('');
  const [sharedMeta, setSharedMeta] = useState(null);
  const [publishState, setPublishState] = useState({ loading: false, url: '', error: '' });
  const [draft, setDraft] = useState(() => {
    const map = loadProposalsMap();
    const id = map[getActiveProposalId()] ? getActiveProposalId() : PROPOSTA_BASE_ID;
    return deepClone(map[id].data);
  });

  const savedData = proposalsMap[activeId]?.data;
  const isDirty = useMemo(
    () => !isSharedView && JSON.stringify(draft) !== JSON.stringify(savedData),
    [draft, savedData, isSharedView]
  );

  useEffect(() => {
    if (!isSharedView) setActiveProposalId(activeId);
  }, [activeId, isSharedView]);

  useEffect(() => {
    if (!isSharedView) return undefined;

    let active = true;
    setSharedLoading(true);
    setSharedError('');

    loadSharedProposal(shareIdFromUrl)
      .then((proposal) => {
        if (!active) return;
        setDraft(deepClone(proposal.data));
        setSharedMeta(proposal);
      })
      .catch((error) => {
        if (!active) return;
        setSharedError(error?.message || 'Não foi possível carregar esta proposta.');
      })
      .finally(() => {
        if (active) setSharedLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isSharedView, shareIdFromUrl]);

  const persist = useCallback((nextMap) => {
    setProposalsMap(nextMap);
    saveProposalsMap(nextMap);
  }, []);

  const updateField = useCallback((path, value) => {
    setDraft((prev) => setPath(prev, path, value));
  }, []);

  const updateArrayItem = useCallback((listName, id, field, value) => {
    setDraft((prev) => {
      const clone = deepClone(prev);
      const list = clone[listName];
      const item = list.find((i) => i.id === id);
      if (item) item[field] = value;
      return clone;
    });
  }, []);

  const updateExperienceItem = useCallback((expId, itemIndex, field, value) => {
    setDraft((prev) => {
      const clone = deepClone(prev);
      const exp = clone.experiencias.find((e) => e.id === expId);
      if (exp && exp.itens[itemIndex]) exp.itens[itemIndex][field] = value;
      return clone;
    });
  }, []);

  const addVideo = useCallback(() => {
    setDraft((prev) => {
      const clone = deepClone(prev);
      clone.videos.push({
        id: generateId('vid'),
        titulo: 'Novo casal',
        categoria: 'Making Of',
        orientacao: 'vertical',
        capa: '',
        url: '',
        visivel: true,
      });
      return clone;
    });
  }, []);

  const removeVideo = useCallback((id) => {
    setDraft((prev) => {
      const clone = deepClone(prev);
      clone.videos = clone.videos.filter((v) => v.id !== id);
      return clone;
    });
  }, []);

  const addExperience = useCallback(() => {
    setDraft((prev) => {
      const clone = deepClone(prev);
      clone.experiencias.push({
        id: generateId('exp'),
        nome: 'Nova experiência',
        valor: 0,
        resumo: '',
        equipe: '',
        entrega: '',
        destaque: false,
        itens: [{ titulo: 'Novo item', descricao: '' }],
        visivel: true,
      });
      return clone;
    });
  }, []);

  const removeExperience = useCallback((id) => {
    setDraft((prev) => {
      const clone = deepClone(prev);
      clone.experiencias = clone.experiencias.filter((e) => e.id !== id);
      return clone;
    });
  }, []);

  const addExperienceItem = useCallback((expId) => {
    setDraft((prev) => {
      const clone = deepClone(prev);
      const exp = clone.experiencias.find((e) => e.id === expId);
      if (exp) exp.itens.push({ titulo: 'Novo item', descricao: '' });
      return clone;
    });
  }, []);

  const removeExperienceItem = useCallback((expId, index) => {
    setDraft((prev) => {
      const clone = deepClone(prev);
      const exp = clone.experiencias.find((e) => e.id === expId);
      if (exp) exp.itens.splice(index, 1);
      return clone;
    });
  }, []);

  const addTestimonial = useCallback(() => {
    setDraft((prev) => {
      const clone = deepClone(prev);
      clone.depoimentos.push({
        id: generateId('dep'),
        noivos: 'Novo casal',
        local: '',
        data: '',
        foto: '',
        texto: '',
        visivel: true,
      });
      return clone;
    });
  }, []);

  const removeTestimonial = useCallback((id) => {
    setDraft((prev) => {
      const clone = deepClone(prev);
      clone.depoimentos = clone.depoimentos.filter((d) => d.id !== id);
      return clone;
    });
  }, []);

  const moveItem = useCallback((listName, id, direction) => {
    setDraft((prev) => {
      const clone = deepClone(prev);
      const list = clone[listName];
      const idx = list.findIndex((i) => i.id === id);
      const newIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (idx < 0 || newIdx < 0 || newIdx >= list.length) return prev;
      [list[idx], list[newIdx]] = [list[newIdx], list[idx]];
      return clone;
    });
  }, []);

  const toggleItemVisibility = useCallback((listName, id) => {
    setDraft((prev) => {
      const clone = deepClone(prev);
      const item = clone[listName].find((i) => i.id === id);
      if (item) item.visivel = !item.visivel;
      return clone;
    });
  }, []);

  const toggleSection = useCallback((key) => {
    setDraft((prev) => {
      const clone = deepClone(prev);
      clone.configuracoes.sectionsVisibility[key] = !clone.configuracoes.sectionsVisibility[key];
      return clone;
    });
  }, []);

  const moveSection = useCallback((key, direction) => {
    setDraft((prev) => {
      const clone = deepClone(prev);
      const order = clone.configuracoes.sectionOrder;
      const idx = order.indexOf(key);
      const newIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (idx < 0 || newIdx < 0 || newIdx >= order.length) return prev;
      [order[idx], order[newIdx]] = [order[newIdx], order[idx]];
      return clone;
    });
  }, []);

  const save = useCallback(() => {
    if (isSharedView) return;
    setProposalsMap((prevMap) => {
      const nextMap = deepClone(prevMap);
      if (!nextMap[activeId]) return prevMap;
      nextMap[activeId].data = deepClone(draft);
      nextMap[activeId].atualizadaEm = new Date().toISOString();
      saveProposalsMap(nextMap);
      return nextMap;
    });
    setEditMode(false);
    setPublishState((prev) => ({ ...prev, url: '', error: '' }));
  }, [activeId, draft, isSharedView]);

  const cancel = useCallback(() => {
    if (!proposalsMap[activeId]) return;
    setDraft(deepClone(proposalsMap[activeId].data));
    setEditMode(false);
  }, [proposalsMap, activeId]);

  const resetToOriginal = useCallback(() => {
    setDraft(createDefaultData());
  }, []);

  const duplicateProposal = useCallback(
    (nome) => {
      const id = generateId('proposta');
      const nextMap = deepClone(proposalsMap);
      nextMap[id] = {
        id,
        nome: nome?.trim() || 'Nova proposta',
        isBase: false,
        data: deepClone(draft),
        criadaEm: new Date().toISOString(),
        atualizadaEm: new Date().toISOString(),
        shareId: '',
      };
      persist(nextMap);
      setActiveId(id);
      setDraft(deepClone(nextMap[id].data));
      setEditMode(true);
      setPublishState({ loading: false, url: '', error: '' });
      return id;
    },
    [proposalsMap, draft, persist]
  );

  const switchProposal = useCallback(
    (id) => {
      if (!proposalsMap[id]) return;
      setActiveId(id);
      setDraft(deepClone(proposalsMap[id].data));
      setEditMode(false);
      setClientPreview(false);
      setPublishState({ loading: false, url: '', error: '' });
    },
    [proposalsMap]
  );

  const deleteProposal = useCallback(
    (id) => {
      if (id === PROPOSTA_BASE_ID) return;
      const nextMap = deepClone(proposalsMap);
      delete nextMap[id];
      persist(nextMap);
      if (activeId === id) {
        setActiveId(PROPOSTA_BASE_ID);
        setDraft(deepClone(nextMap[PROPOSTA_BASE_ID].data));
      }
      setPublishState({ loading: false, url: '', error: '' });
    },
    [proposalsMap, activeId, persist]
  );

  const renameProposal = useCallback(
    (id, nome) => {
      const nextMap = deepClone(proposalsMap);
      if (nextMap[id]) {
        nextMap[id].nome = nome;
        persist(nextMap);
      }
    },
    [proposalsMap, persist]
  );

  const publishForClient = useCallback(async () => {
    if (isSharedView) return null;

    const meta = proposalsMap[activeId];
    if (!meta) return null;

    setPublishState({ loading: true, url: '', error: '' });

    try {
      const result = await publishSharedProposal({
        shareId: meta.shareId || '',
        name: meta.nome,
        data: draft,
      });

      const nextMap = deepClone(proposalsMap);
      nextMap[activeId].shareId = result.shareId;
      nextMap[activeId].data = deepClone(draft);
      nextMap[activeId].atualizadaEm = new Date().toISOString();
      persist(nextMap);
      setPublishState({ loading: false, url: result.url, error: '' });
      return result.url;
    } catch (error) {
      const message = error?.message || 'Não foi possível gerar o link.';
      setPublishState({ loading: false, url: '', error: message });
      return null;
    }
  }, [activeId, draft, isSharedView, proposalsMap, persist]);

  const proposalsList = useMemo(
    () =>
      Object.values(proposalsMap).sort((a, b) =>
        a.isBase ? -1 : b.isBase ? 1 : new Date(b.atualizadaEm) - new Date(a.atualizadaEm)
      ),
    [proposalsMap]
  );

  return {
    data: draft,
    activeId,
    activeProposalMeta: isSharedView ? sharedMeta : proposalsMap[activeId],
    proposalsList,
    editMode,
    clientPreview,
    isDirty,
    isSharedView,
    sharedLoading,
    sharedError,
    cloudSharingConfigured: isCloudSharingConfigured(),
    publishState,
    setEditMode,
    setClientPreview,
    updateField,
    updateArrayItem,
    updateExperienceItem,
    addVideo,
    removeVideo,
    addExperience,
    removeExperience,
    addExperienceItem,
    removeExperienceItem,
    addTestimonial,
    removeTestimonial,
    moveItem,
    toggleItemVisibility,
    toggleSection,
    moveSection,
    save,
    cancel,
    resetToOriginal,
    duplicateProposal,
    switchProposal,
    deleteProposal,
    renameProposal,
    publishForClient,
  };
}
