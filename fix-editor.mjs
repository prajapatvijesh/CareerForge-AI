import fs from 'fs';

const filePath = 'V:/CareerForge AI/apps/web/src/features/resume-builder/components/editor/SectionEditor.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const topPart = `export const SectionEditor: React.FC<SectionEditorProps> = ({ resume, sectionType, onBack }) => {
  const updateMutation = useUpdateResume(resume._id);
  const section = resume.sections?.find((s: any) => s.type === sectionType) || { type: sectionType, isVisible: true, data: {} };

  const updateSectionData = (newData: any) => {
    const updatedSections = [...(resume.sections || [])];
    const index = updatedSections.findIndex(s => s.type === sectionType);
    
    if (index >= 0) {
      updatedSections[index] = { ...updatedSections[index], data: newData };
    } else {
      updatedSections.push({ type: sectionType, isVisible: true, order: updatedSections.length, data: newData });
    }
    
    updateMutation.mutate({ sections: updatedSections });
  };`;

const newTopPart = `export const SectionEditor: React.FC<SectionEditorProps> = ({ resume, sectionType, onBack }) => {
  const updateMutation = useUpdateResume(resume._id);
  const section = resume.sections?.find((s: any) => s.type === sectionType) || { type: sectionType, isVisible: true, data: {} };
  
  const [localData, setLocalData] = React.useState(section.data || {});

  React.useEffect(() => {
    setLocalData(section.data || {});
  }, [sectionType]); // Reset local data when switching sections

  React.useEffect(() => {
    const timer = setTimeout(() => {
      const updatedSections = [...(resume.sections || [])];
      const index = updatedSections.findIndex(s => s.type === sectionType);
      
      if (index >= 0) {
        updatedSections[index] = { ...updatedSections[index], data: localData };
      } else {
        updatedSections.push({ type: sectionType, isVisible: true, order: updatedSections.length, data: localData });
      }
      
      updateMutation.mutate({ sections: updatedSections });
    }, 500);
    return () => clearTimeout(timer);
  }, [localData, sectionType, resume._id]);`;

content = content.replace(topPart, newTopPart);
content = content.replace(/section\.data/g, 'localData');
content = content.replace(/updateSectionData/g, 'setLocalData');

fs.writeFileSync(filePath, content);
console.log('Fixed SectionEditor.tsx');
