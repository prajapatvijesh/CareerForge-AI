import React from 'react';

// Common prop type for all templates
export interface TemplateProps {
  resume: any; // Using any for MVP, should be IResume
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'Present';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export const ModernTemplate: React.FC<TemplateProps> = ({ resume }) => {
  return (
    <div className="font-sans text-gray-900 bg-white p-8 h-full shadow-lg" style={{ fontFamily: resume?.theme?.font || 'Inter' }}>
      <header className="border-b-2 border-primary pb-4 mb-6">
        <h1 className="text-4xl font-bold" style={{ color: resume?.theme?.primaryColor || '#0f172a' }}>
          {resume?.sections?.find((s: any) => s.type === 'PERSONAL' && s.isVisible)?.data?.fullName || resume?.title || 'Untitled Resume'}
        </h1>
        {resume?.sections?.find((s: any) => s.type === 'SUMMARY' && s.isVisible)?.data?.headline && (
          <p className="text-xl text-gray-600 mt-1">{resume.sections.find((s: any) => s.type === 'SUMMARY').data.headline}</p>
        )}
        
        {resume?.sections?.find((s: any) => s.type === 'PERSONAL' && s.isVisible)?.data && (
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-sm text-gray-600">
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
      
      <div className="space-y-6">
        {resume?.sections?.map((section: any) => {
          if (!section.isVisible) return null;
          return (
            <div key={section._id || section.type} className="mb-4">
              <h2 className="text-xl font-semibold uppercase tracking-wider mb-2" style={{ color: resume?.theme?.primaryColor || '#0f172a' }}>
                {section.type}
              </h2>
              <div className="text-sm text-gray-700 mt-3">
                {/* Render specific data based on section.type */}
                {section.type === 'SUMMARY' && (
                  <p className="whitespace-pre-wrap leading-relaxed">{section.data?.summary || ''}</p>
                )}
                {section.type === 'EXPERIENCE' && (
                  <div className="space-y-4">
                    {section.data?.items?.map((item: any, i: number) => (
                      <div key={i}>
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className="text-base font-semibold text-gray-900">{item.title || item.position}</h3>
                          <span className="text-xs font-medium text-gray-500 whitespace-nowrap ml-4">
                            {formatDate(item.startDate)} - {item.current ? 'Present' : formatDate(item.endDate)}
                          </span>
                        </div>
                        <div className="text-gray-600 font-medium mb-1">{item.company} {item.location ? `• ${item.location}` : ''}</div>
                        {item.description && <p className="text-gray-600 mt-1">{item.description}</p>}
                      </div>
                    ))}
                  </div>
                )}
                {section.type === 'EDUCATION' && (
                  <div className="space-y-4">
                    {section.data?.items?.map((item: any, i: number) => (
                      <div key={i}>
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className="text-base font-semibold text-gray-900">{item.school}</h3>
                          <span className="text-xs font-medium text-gray-500 whitespace-nowrap ml-4">
                            {formatDate(item.startDate)} - {item.current ? 'Present' : formatDate(item.endDate)}
                          </span>
                        </div>
                        <div className="text-gray-600 font-medium">
                          {item.degree} {item.fieldOfStudy ? `in ${item.fieldOfStudy}` : ''}
                        </div>
                        {item.description && <p className="text-gray-600 mt-1">{item.description}</p>}
                      </div>
                    ))}
                  </div>
                )}
                {section.type === 'SKILLS' && (
                  <div className="flex flex-wrap gap-2">
                    {section.data?.items?.map((item: any, i: number) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium border border-gray-200">
                        {item.name || item}
                      </span>
                    ))}
                  </div>
                )}
                {section.type === 'PROJECTS' && (
                  <div className="space-y-4">
                    {section.data?.items?.map((item: any, i: number) => (
                      <div key={i}>
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className="text-base font-semibold text-gray-900">{item.name || item.title}</h3>
                          {item.startDate && (
                            <span className="text-xs font-medium text-gray-500 whitespace-nowrap ml-4">
                              {formatDate(item.startDate)} {item.endDate ? `- ${formatDate(item.endDate)}` : ''}
                            </span>
                          )}
                        </div>
                        {item.url && <a href={item.url} target="_blank" rel="noreferrer" className="text-primary hover:underline text-xs mb-1 inline-block">{item.url}</a>}
                        <p className="text-gray-600 mt-1">{item.description}</p>
                        {item.technologies && item.technologies.length > 0 && (
                          <div className="text-xs text-gray-500 mt-1 font-medium">Tech: {item.technologies.join(', ')}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {/* Fallback for unhandled sections */}
                {!['SUMMARY', 'EXPERIENCE', 'EDUCATION', 'SKILLS', 'PROJECTS'].includes(section.type) && (
                  <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">{JSON.stringify(section.data, null, 2)}</pre>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
