import React from "react";
import DigitalProTemplate from "./templates/DigitalProTemplate";
import ModernTemplate from "./templates/ModernTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import MinimalImageTemplate from "./templates/MinimalImageTemplate";
import GeometricBlueTemplate from "./templates/GeometricBlueTemplate";
import ModernSidebarTemplate from "./templates/ModernSidebarTemplate";
import GeometricTemplate from "./templates/GeometricTemplate";
import StylishTemplate from "./templates/StylishTemplate";
import CleanModernTemplate from "./templates/CleanModernTemplate";
import SoftMinimalTemplate from "./templates/SoftMinimalTemplate";
import ModernTwoColumnTemplate from "./templates/ModernTwoColumnTemplate";
import ProfessionalResume from "./templates/ProfessionalResume";
import ProfessionalResumeTemplate from "./templates/ProfessionalResumeTemplate";
import SoftStylishTemplate from "./templates/SoftStylishTemplate";
import ProfessionalModernTemplate from "./templates/ProfessionalModernTemplate";
import ProfessionalTemplate from "./templates/ProfessionalTemplate";
import CreativeTemplate from "./templates/CreativeTemplate";
import ExecutiveTemplate from "./templates/ExecutiveTemplate";
import TechTemplate from "./templates/TechTemplate";
import TechnicalTemplate from "./templates/TechnicalTemplate";
import EliteTemplate from "./templates/EliteTemplate";
import ProfileTemplate from "./templates/ProfileTemplate";
import EmberCreativeTemplate from "./templates/EmberCreativeTemplate";
import SmartResumeTemplate from "./templates/SmartResumeTemplate";
import MinimalCVTemplate from "./templates/MinimalCVTemplate";
import PrimeEdgeTemplate from "./templates/PrimeEdgeTemplate";
import EliteCraftTemplate from "./templates/EliteCraftTemplate";
import ExecutiveCvTemplate from "./templates/ExecutiveCvTemplate";
import PureFormTemplate from "./templates/PureFormTemplate";
import MeridianCvTemplate from "./templates/MeridianCvTemplate";
import ElevareCvTemplate from "./templates/ElevareCvTemplate";
import TalentraCvTemplate from "./templates/TalentraCvTemplate";
import BoardlineCvTemplate from "./templates/BoardlineCvTemplate";
import ApexResume from "./templates/ApexResume";
import BlueprintResume from "./templates/BlueprintResume";
import TechNexaResume from "./templates/TechNexaResume";
import StackProCV from "./templates/StackProCV";
import VisualCraftCV from "./templates/VisualCraftCV";
import DesignFluxResume from "./templates/DesignFluxResume";
import ElitePathCV from "./templates/ElitePathCV";
import ImperialCV from "./templates/ImperialCV";
import CorporateAtlas from "./templates/CorporateAtlas";
import ExecutiveCV from "./templates/ExecutiveCV";
import ArtistryResume from "./templates/ArtistryResume";
import PixelAura from "./templates/PixelAura";
import ClassicTemplate from "./templates/ClassicTemplate";
import BeginnerProTemplate from "./templates/BeginnerProTemplate";
import DesignSmartTemplate from "./templates/DesignSmartTemplate";
import CareerEliteTemplate from "./templates/CareerEliteTemplate";
import CodeProResumeTemplate from "./templates/CodeProResumeTemplate";
import { ResumeData } from "../types/resume";

interface ResumePreviewProps {
  data: ResumeData;
  template: string;
  accentColor: string;
  classes?: string;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({
  data,
  template,
  accentColor,
  classes = "",
}) => {
  // Default to 'digital-pro' if template is empty or invalid
  const activeTemplate = template && template.trim() !== '' ? template : 'digital-pro';
  
  // Pass data directly - templates handle undefined checks internally
 const safeData: ResumeData = {
    ...data,
    personal_info: data.personal_info || {},
    professional_summary: data.professional_summary || "",
    experience: data.experience || [],
    education: data.education || [],
    projects: data.projects || [],
    skills: data.skills || [],
    additional_info: data.additional_info || {},
    template: data.template || activeTemplate,
    accent_color: data.accent_color || accentColor || '#3B82F6',
  };

  const renderTemplate = () => {
    switch (activeTemplate) {
      case "digital-pro":
        return <DigitalProTemplate data={safeData} accentColor={accentColor} />;
      case "modern":
        return <ModernTemplate data={safeData} accentColor={accentColor} />;
      case "minimal":
        return <MinimalTemplate data={safeData} accentColor={accentColor} />;
      case "minimal-image":
        return <MinimalImageTemplate data={safeData} accentColor={accentColor} />;
      case "geometric-blue":
        return <GeometricBlueTemplate data={safeData} accentColor={accentColor} />;
      case "modern-sidebar":
        return <ModernSidebarTemplate data={safeData} accentColor={accentColor} />;
      case "geometric":
        return <GeometricTemplate data={safeData} accentColor={accentColor} />;
      case "stylish":
        return <StylishTemplate data={safeData} accentColor={accentColor} />;
      case "clean-modern":
        return <CleanModernTemplate data={safeData} accentColor={accentColor} />;
      case "soft-minimal":
        return <SoftMinimalTemplate data={safeData} accentColor={accentColor} />;
      case "modern-two-column":
        return <ModernTwoColumnTemplate data={safeData} accentColor={accentColor} />;
      case "professional-resume":
        return <ProfessionalResume data={safeData} accentColor={accentColor} />;
      case "professional-resume-template":
        return <ProfessionalResumeTemplate data={safeData} accentColor={accentColor} />;
      case "professional-modern":
        return <ProfessionalModernTemplate data={safeData} accentColor={accentColor} />;
      case "soft-stylish":
        return <SoftStylishTemplate data={safeData} accentColor={accentColor} />;
      case "professional":
        return <ProfessionalTemplate data={safeData} accentColor={accentColor} />;
      case "creative":
        return <CreativeTemplate data={safeData} accentColor={accentColor} />;
      case "executive":
        return <ExecutiveTemplate data={safeData} accentColor={accentColor} />;
      case "tech":
        return <TechTemplate data={safeData} accentColor={accentColor} />;
      case "technical":
        return <TechnicalTemplate data={safeData} accentColor={accentColor} />;
      case "elite":
        return <EliteTemplate data={safeData} accentColor={accentColor} />;
      case "profile":
        return <ProfileTemplate data={safeData} accentColor={accentColor} />;
      case "ember-creative":
        return <EmberCreativeTemplate data={safeData} accentColor={accentColor} />;
      case "smart-resume":
        return <SmartResumeTemplate data={safeData} accentColor={accentColor} />;
      case "minimal-cv":
        return <MinimalCVTemplate data={safeData} accentColor={accentColor} />;
      case "prime-edge":
        return <PrimeEdgeTemplate data={safeData} accentColor={accentColor} />;
      case "elitecraft-cv":
        return <EliteCraftTemplate data={safeData} accentColor={accentColor} />;
      case "executive-cv":
        return <ExecutiveCvTemplate data={safeData} accentColor={accentColor} />;
      case "pureform-resume":
        return <PureFormTemplate data={safeData} accentColor={accentColor} />;
      case "meridian-cv":
        return <MeridianCvTemplate data={safeData} accentColor={accentColor} />;
      case "elevare-cv":
        return <ElevareCvTemplate data={safeData} accentColor={accentColor} />;
      case "talentra-cv":
        return <TalentraCvTemplate data={safeData} accentColor={accentColor} />;
      case "boardline-cv":
        return <BoardlineCvTemplate data={safeData} accentColor={accentColor} />;
      case "apex-resume":
        return <ApexResume data={safeData} accentColor={accentColor} />;
      case "blueprint-resume":
        return <BlueprintResume data={safeData} accentColor={accentColor} />;
      case "technexa-resume":
        return <TechNexaResume data={safeData} accentColor={accentColor} />;
      case "stackpro-cv":
        return <StackProCV data={safeData} accentColor={accentColor} />;
      case "visualcraft-cv":
        return <VisualCraftCV data={safeData} accentColor={accentColor} />;
      case "designflux-resume":
        return <DesignFluxResume data={safeData} accentColor={accentColor} />;
      case "elitepath-cv":
        return <ElitePathCV data={safeData} accentColor={accentColor} />;
      case "imperial-cv":
        return <ImperialCV data={safeData} accentColor={accentColor} />;
      case "corporate-atlas":
        return <CorporateAtlas data={safeData} accentColor={accentColor} />;
      case "executive_cv":
        return <ExecutiveCV data={safeData} accentColor={accentColor} />;
      case "artistry-resume":
        return <ArtistryResume data={safeData} accentColor={accentColor} />;
      case "pixel-aura":
        return <PixelAura data={safeData} accentColor={accentColor} />;
      case "beginner-pro":
        return <BeginnerProTemplate data={safeData} accentColor={accentColor} />;
      case "design-smart":
        return <DesignSmartTemplate data={safeData} accentColor={accentColor} />;
      case "career-elite":
        return <CareerEliteTemplate data={safeData} accentColor={accentColor} />;
      case "codepro-resume":
        return <CodeProResumeTemplate data={safeData} accentColor={accentColor} />;
      case "classic":
        return <ClassicTemplate data={safeData} accentColor={accentColor} />;
      default:
        return <DigitalProTemplate data={safeData} accentColor={accentColor} />;
    }
  };

  return (
    <div className="w-full bg-gray-100">
      <div
        id="resume-preview"
        className={
          "border border-gray-200 print:shadow-none print:border-none " + classes
        }
      >
        {renderTemplate()}
      </div>

      <style>{`
        @page {
          size: letter;
          margin: 0;
        }
        @media print {
          html, body {
            width: 8.5in;
            height: 11in;
            overflow: hidden;
          }
          body * { visibility: hidden; }
          #resume-preview, #resume-preview * { visibility: visible; }
          #resume-preview {
            position: absolute;
            left: 0; top: 0;
            width: 100%;
            height: auto;
            margin: 0;
            padding: 0;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ResumePreview;