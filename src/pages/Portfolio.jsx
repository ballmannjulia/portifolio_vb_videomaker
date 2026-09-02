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

  const showAdmin = !clientPreview;
  const isEditingSections = editMode;

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
    hero: <Hero data={data} editMode={editMode} updateField={p.updateField} />,
    about: <About data={data} editMode={editMode} updateField={p.updateField} />,
    gallery: <VideoGallery data={data} editMode={editMode} actions={listActions} />,
    experiences: <Experiences data={data} editMode={editMode} actions={listActions} />,
    realtime: <RealTime data={data} editMode={editMode} updateField={p.updateField} />,
    howItWorks: <HowItWorks data={data} editMode={editMode} updateField={p.updateField} />,
    testimonials: <Testimonials data={data} editMode={editMode} actions={listActions} />,
    contact: <Contact data={data} editMode={editMode} updateField={p.updateField} />,
  };

  const order = data.configuracoes.sectionOrder;
  const visibility = data.configuracoes.sectionsVisibility;

  return (
    <>
      {showAdmin && (
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
      )}
      {showAdmin && isEditingSections && (
        <div className="admin-toolbar no-print">
          <SectionManager order={order} visibility={visibility} moveSection={p.moveSection} toggleSection={p.toggleSection} />
        </div>
      )}

      <Header data={data} editMode={editMode} updateField={p.updateField} />

      <main>
        {order.map((key) => {
          if (!editMode && !visibility[key]) return null;
          return (
            <div key={key} style={{ opacity: editMode && !visibility[key] ? 0.4 : 1 }}>
              {SECTION_COMPONENTS[key]}
            </div>
          );
        })}
      </main>

      <Footer data={data} />
    </>
  );
}
