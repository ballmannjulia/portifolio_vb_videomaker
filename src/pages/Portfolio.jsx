import { usePortfolio } from '../hooks/usePortfolio.js';
import Header from '../components/Header.jsx';
import AdminToolbar from '../components/AdminToolbar.jsx';
import SectionManager from '../components/SectionManager.jsx';
import Hero from '../components/Hero.jsx';
import About from '../components/About.jsx';
import VideoGallery from '../components/VideoGallery.jsx';
import Experiences from '../components/Experiences.jsx';
import RealTime from '../components/RealTime.jsx';
import HowItWorks from '../components/HowItWorks.jsx';
import Testimonials from '../components/Testimonials.jsx';
import Contact from '../components/Contact.jsx';
import Footer from '../components/Footer.jsx';

export default function Portfolio() {
  const p = usePortfolio();
  const { data, editMode, clientPreview, isSharedView, sharedLoading, sharedError } = p;

  if (isSharedView && sharedLoading) {
    return (
      <main style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', padding: 32 }}>
        <p style={{ color: 'var(--ink-soft)' }}>Carregando proposta...</p>
      </main>
    );
  }

  if (isSharedView && sharedError) {
    return (
      <main style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', padding: 32 }}>
        <div style={{ maxWidth: 560, textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: 16 }}>Não foi possível abrir esta proposta</h1>
          <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7 }}>{sharedError}</p>
        </div>
      </main>
    );
  }

  const isEditingSections = editMode && !clientPreview && !isSharedView;
  const effectiveEditMode = editMode && !clientPreview && !isSharedView;

  const listActions = {
    updateArrayItem: p.updateArrayItem,
    updateExperienceItem: p.updateExperienceItem,
    addVideo: p.addVideo,
    removeVideo: p.removeVideo,
    addExperience: p.addExperience,
    removeExperience: p.removeExperience,
    addExperienceItem: p.addExperienceItem,
    removeExperienceItem: p.removeExperienceItem,
    addTestimonial: p.addTestimonial,
    removeTestimonial: p.removeTestimonial,
    moveItem: p.moveItem,
    toggleItemVisibility: p.toggleItemVisibility,
  };

  const SECTION_COMPONENTS = {
    hero: <Hero data={data} editMode={effectiveEditMode} updateField={p.updateField} />,
    about: <About data={data} editMode={effectiveEditMode} updateField={p.updateField} />,
    gallery: <VideoGallery data={data} editMode={effectiveEditMode} actions={listActions} />,
    experiences: <Experiences data={data} editMode={effectiveEditMode} actions={listActions} />,
    realtime: <RealTime data={data} editMode={effectiveEditMode} updateField={p.updateField} />,
    howItWorks: <HowItWorks data={data} editMode={effectiveEditMode} updateField={p.updateField} />,
    testimonials: <Testimonials data={data} editMode={effectiveEditMode} actions={listActions} />,
    contact: <Contact data={data} editMode={effectiveEditMode} updateField={p.updateField} />,
  };

  const order = data.configuracoes.sectionOrder;
  const visibility = data.configuracoes.sectionsVisibility;

  return (
    <>
      {!isSharedView && (
        <AdminToolbar
          editMode={editMode}
          setEditMode={p.setEditMode}
          clientPreview={clientPreview}
          setClientPreview={p.setClientPreview}
          isDirty={p.isDirty}
          save={p.save}
          cancel={p.cancel}
          resetToOriginal={p.resetToOriginal}
          duplicateProposal={p.duplicateProposal}
          switchProposal={p.switchProposal}
          deleteProposal={p.deleteProposal}
          proposalsList={p.proposalsList}
          activeId={p.activeId}
          activeProposalMeta={p.activeProposalMeta}
          publishForClient={p.publishForClient}
          publishState={p.publishState}
          cloudSharingConfigured={p.cloudSharingConfigured}
        />
      )}

      {isEditingSections && (
        <div className="admin-toolbar no-print">
          <SectionManager order={order} visibility={visibility} moveSection={p.moveSection} toggleSection={p.toggleSection} />
        </div>
      )}

      <Header data={data} editMode={effectiveEditMode} updateField={p.updateField} />

      <main>
        {order.map((key) => {
          if (!effectiveEditMode && !visibility[key]) return null;
          const component = SECTION_COMPONENTS[key];
          if (!component) return null;
          return (
            <div key={key} style={{ opacity: effectiveEditMode && !visibility[key] ? 0.4 : 1 }}>
              {component}
            </div>
          );
        })}
      </main>

      <Footer data={data} />
    </>
  );
}
