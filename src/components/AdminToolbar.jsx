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
}) {
  const [showDuplicate, setShowDuplicate] = useState(false);
  const [newName, setNewName] = useState('');

  if (clientPreview) {
    return (
      <div className="admin-toolbar no-print">
        <div className="admin-toolbar__row">
          <span className="tag tag--live">Visualizando como cliente</span>
          <span style={{ opacity: 0.75 }}>{activeProposalMeta?.nome}</span>
          <button className="btn btn-outline" style={{ marginLeft: 'auto' }} onClick={() => setClientPreview(false)}>
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
              <button className="btn btn-outline" onClick={() => setEditMode(true)}>
                <Pencil size={14} /> Editar proposta
              </button>
              <button className="btn btn-outline" onClick={() => setShowDuplicate((s) => !s)}>
                <Copy size={14} /> Duplicar proposta
              </button>
              {!activeProposalMeta?.isBase && (
                <button
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
              <button className="btn btn-outline" onClick={() => setClientPreview(true)}>
                <Eye size={14} /> Visualizar como cliente
              </button>
              <button className="btn btn-outline" onClick={() => window.print()}>
                <Printer size={14} /> Baixar / Salvar em PDF
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-primary" onClick={save}>
                <Save size={14} /> Salvar alterações
              </button>
              <button className="btn btn-outline" onClick={cancel}>
                <X size={14} /> Cancelar
              </button>
              <button
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
          <button className="btn btn-ghost" onClick={() => setShowDuplicate(false)}>
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}
