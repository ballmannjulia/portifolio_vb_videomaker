import { useState } from 'react';
import {
  Pencil,
  Save,
  X,
  Copy,
  Eye,
  EyeOff,
  Printer,
  RotateCcw,
  Trash2,
  Link2,
  Check,
} from 'lucide-react';

export default function AdminToolbar({
  editMode,
  setEditMode,
  clientPreview,
  setClientPreview,
  isDirty,
  save,
  cancel,
  resetToOriginal,
  duplicateProposal,
  switchProposal,
  deleteProposal,
  proposalsList,
  activeId,
  activeProposalMeta,
  publishForClient,
  publishState,
  cloudSharingConfigured,
}) {
  const [showDuplicate, setShowDuplicate] = useState(false);
  const [newName, setNewName] = useState('');
  const [copied, setCopied] = useState(false);

  const copyShareLink = async () => {
    if (!publishState.url) return;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(publishState.url);
      } else {
        const input = document.createElement('textarea');
        input.value = publishState.url;
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        input.remove();
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  if (clientPreview) {
    return (
      <div className="admin-toolbar no-print">
        <div className="admin-toolbar__row">
          <span className="tag tag--live">Visualizando como cliente</span>
          <span style={{ opacity: 0.75 }}>{activeProposalMeta?.nome}</span>
          <button type="button" className="btn btn-outline" style={{ marginLeft: 'auto' }} onClick={() => setClientPreview(false)}>
            <EyeOff size={14} /> Voltar ao modo admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-toolbar no-print">
      <div className="admin-toolbar__row">
        <span className="tag">{editMode ? 'Modo edição' : 'Modo visualização'}</span>

        <select value={activeId} onChange={(e) => switchProposal(e.target.value)} disabled={editMode}>
          {proposalsList.map((p) => (
            <option key={p.id} value={p.id}>
              {p.isBase ? '📄 ' : '📝 '}
              {p.nome}
            </option>
          ))}
        </select>

        {isDirty && !editMode && <span className="tag" style={{ background: 'var(--clay)' }}>Alterações não salvas</span>}

        <div style={{ display: 'flex', gap: 8, marginLeft: 'auto', flexWrap: 'wrap' }}>
          {!editMode ? (
            <>
              <button type="button" className="btn btn-outline" onClick={() => setEditMode(true)}>
                <Pencil size={14} /> Editar proposta
              </button>
              <button type="button" className="btn btn-outline" onClick={() => setShowDuplicate((s) => !s)}>
                <Copy size={14} /> Duplicar proposta
              </button>
              {!activeProposalMeta?.isBase && (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    if (confirm(`Excluir "${activeProposalMeta?.nome}"? Essa ação não pode ser desfeita.`)) {
                      deleteProposal(activeId);
                    }
                  }}
                >
                  <Trash2 size={14} /> Excluir
                </button>
              )}
              <button type="button" className="btn btn-outline" onClick={() => setClientPreview(true)}>
                <Eye size={14} /> Visualizar como cliente
              </button>
              <button type="button" className="btn btn-primary" onClick={publishForClient} disabled={publishState.loading}>
                <Link2 size={14} /> {publishState.loading ? 'Gerando link...' : 'Gerar link para cliente'}
              </button>
              <button type="button" className="btn btn-outline" onClick={() => window.print()}>
                <Printer size={14} /> Baixar / Salvar em PDF
              </button>
            </>
          ) : (
            <>
              <button type="button" className="btn btn-primary" onClick={save}>
                <Save size={14} /> Salvar alterações
              </button>
              <button type="button" className="btn btn-outline" onClick={cancel}>
                <X size={14} /> Cancelar
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  if (confirm('Restaurar os dados originais desta proposta? As alterações não salvas serão perdidas.')) {
                    resetToOriginal();
                  }
                }}
              >
                <RotateCcw size={14} /> Restaurar dados originais
              </button>
            </>
          )}
        </div>
      </div>

      {!editMode && publishState.url && (
        <div
          className="admin-toolbar__row"
          style={{ borderTop: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)' }}
        >
          <span style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>Link do cliente:</span>
          <input
            value={publishState.url}
            readOnly
            onFocus={(event) => event.target.select()}
            style={{
              flex: 1,
              minWidth: 260,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 4,
              padding: '8px 10px',
              color: 'var(--offwhite)',
            }}
          />
          <button type="button" className="btn btn-outline" onClick={copyShareLink}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copiado' : 'Copiar link'}
          </button>
          <a className="btn btn-outline" href={publishState.url} target="_blank" rel="noreferrer">
            <Eye size={14} /> Abrir link
          </a>
        </div>
      )}

      {!editMode && publishState.error && (
        <div
          className="admin-toolbar__row"
          style={{ borderTop: '1px solid rgba(255,255,255,0.12)', background: 'rgba(120,40,30,0.22)' }}
        >
          <span style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>{publishState.error}</span>
        </div>
      )}

      {!editMode && !cloudSharingConfigured && !publishState.error && (
        <div
          className="admin-toolbar__row"
          style={{ borderTop: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)' }}
        >
          <span style={{ fontSize: '0.78rem', opacity: 0.78 }}>
            Para o link funcionar em outro celular ou computador, configure o Supabase. O modo de visualização local continua funcionando normalmente.
          </span>
        </div>
      )}

      {showDuplicate && (
        <div
          className="admin-toolbar__row"
          style={{ borderTop: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)' }}
        >
          <input
            autoFocus
            placeholder="Nome da nova proposta, ex: Carolina & Lucas"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            style={{
              flex: 1,
              minWidth: 220,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 4,
              padding: '8px 10px',
              color: 'var(--offwhite)',
            }}
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              if (!newName.trim()) return;
              duplicateProposal(newName.trim());
              setNewName('');
              setShowDuplicate(false);
            }}
          >
            Criar proposta
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => setShowDuplicate(false)}>
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}
