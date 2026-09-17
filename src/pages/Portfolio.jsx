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
  const { data, editMode, clientPreview } = p;

  const isEditingSections = editMode && !clientPreview;

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

  const effectiveEditMode = editMode && !clientPreview;

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
      />

      {isEditingSections && (
        <div className="admin-toolbar no-print">
          <SectionManager order={order} visibility={visibility} moveSection={p.moveSection} toggleSection={p.toggleSection} />
        </div>
      )}

      <Header data={data} editMode={effectiveEditMode} updateField={p.updateField} />

      <main>
        {order.map((key) => {
          if (!effectiveEditMode && !visibility[key]) return null;
          return (
            <div key={key} style={{ opacity: effectiveEditMode && !visibility[key] ? 0.4 : 1 }}>
              {SECTION_COMPONENTS[key]}
            </div>
          );
        })}
      </main>

      <Footer data={data} />
    </>
  );
}
