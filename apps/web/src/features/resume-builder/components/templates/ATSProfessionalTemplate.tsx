import React from 'react';
import { TemplateProps } from './ModernTemplate';

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'Present';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export const ATSProfessionalTemplate: React.FC<TemplateProps> = ({ resume }) => {
  return (
    <div className="font-serif text-black bg-white p-8 h-full shadow-lg" style={{ fontFamily: 'Times New Roman' }}>
      <header className="text-center pb-4 mb-4 border-b border-black">
        <h1 className="text-3xl font-bold uppercase">
          {resume?.sections?.find((s: any) => s.type === 'PERSONAL' && s.isVisible)?.data?.fullName || resume?.title || 'Untitled Resume'}
        </h1>
        {resume?.sections?.find((s: any) => s.type === 'SUMMARY' && s.isVisible)?.data?.headline && (
          <p className="text-base mt-1">{resume.sections.find((s: any) => s.type === 'SUMMARY').data.headline}</p>
        )}
        
        {resume?.sections?.find((s: any) => s.type === 'PERSONAL' && s.isVisible)?.data && (
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2 text-sm">
            {resume.sections.find((s: any) => s.type === 'PERSONAL').data.email && (
              <span>{resume.sections.find((s: any) => s.type === 'PERSONAL').data.email}</span>
            )}
            {resume.sections.find((s: any) => s.type === 'PERSONAL').data.phone && (
              <span>• {resume.sections.find((s: any) => s.type === 'PERSONAL').data.phone}</span>
            )}
            {resume.sections.find((s: any) => s.type === 'PERSONAL').data.location && (
              <span>• {resume.sections.find((s: any) => s.type === 'PERSONAL').data.location}</span>
            )}
            {resume.sections.find((s: any) => s.type === 'PERSONAL').data.linkedin && (
              <span>• {resume.sections.find((s: any) => s.type === 'PERSONAL').data.linkedin}</span>
            )}
            {resume.sections.find((s: any) => s.type === 'PERSONAL').data.website && (
              <span>• {resume.sections.find((s: any) => s.type === 'PERSONAL').data.website}</span>
            )}
          </div>
        )}
      </header>
      
      <div className="space-y-4">
        {resume?.sections?.map((section: any) => {
          if (!section.isVisible) return null;
          return (
            <div key={section._id || section.type}>
              <h2 className="text-lg font-bold uppercase mb-1 border-b border-gray-300">
                {section.type}
              </h2>
              <div className="text-sm mt-2">
                {section.type === 'SUMMARY' && (
                  <p className="whitespace-pre-wrap leading-tight">{section.data?.summary || ''}</p>
                )}
                {section.type === 'EXPERIENCE' && (
                  <div className="space-y-3">
                    {section.data?.items?.map((item: any, i: number) => (
                      <div key={i}>
                        <div className="flex justify-between font-bold">
                          <span>{item.position}</span>
                          <span>{formatDate(item.startDate)} - {item.current ? 'Present' : formatDate(item.endDate)}</span>
                        </div>
                        <div className="italic">{item.company} {item.location ? `— ${item.location}` : ''}</div>
                        {item.description && <p className="mt-1 leading-tight">{item.description}</p>}
                      </div>
                    ))}
                  </div>
                )}
                {section.type === 'EDUCATION' && (
                  <div className="space-y-3">
                    {section.data?.items?.map((item: any, i: number) => (
                      <div key={i}>
                        <div className="flex justify-between font-bold">
                          <span>{item.school}</span>
                          <span>{formatDate(item.startDate)} - {item.current ? 'Present' : formatDate(item.endDate)}</span>
                        </div>
                        <div>{item.degree} in {item.fieldOfStudy}</div>
                        {item.description && <p className="mt-1 leading-tight">{item.description}</p>}
                      </div>
                    ))}
                  </div>
                )}
                {section.type === 'SKILLS' && (
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {section.data?.items?.map((item: any, i: number) => (
                      <span key={i} className="list-item ml-4">
                        {item.name || item}
                      </span>
                    ))}
                  </div>
                )}
                {section.type === 'PROJECTS' && (
                  <div className="space-y-3">
                    {section.data?.items?.map((item: any, i: number) => (
                      <div key={i}>
                        <div className="flex justify-between font-bold">
                          <span>{item.title}</span>
                          {item.startDate && (
                            <span>{formatDate(item.startDate)} {item.endDate ? `- ${formatDate(item.endDate)}` : ''}</span>
                          )}
                        </div>
                        {item.url && <div className="italic text-xs">{item.url}</div>}
                        <p className="mt-1 leading-tight">{item.description}</p>
                        {item.technologies && item.technologies.length > 0 && (
                          <div className="italic text-xs mt-0.5">Technologies: {item.technologies.join(', ')}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {!['SUMMARY', 'EXPERIENCE', 'EDUCATION', 'SKILLS', 'PROJECTS'].includes(section.type) && (
                  <pre className="text-xs">{JSON.stringify(section.data, null, 2)}</pre>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
