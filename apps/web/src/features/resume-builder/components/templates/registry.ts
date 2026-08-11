import { ModernTemplate } from './ModernTemplate';
import { ATSProfessionalTemplate } from './ATSProfessionalTemplate';
import React from 'react';
import { TemplateProps } from './ModernTemplate';

export interface ITemplate {
  id: string;
  name: string;
  component: React.FC<TemplateProps>;
}

// Registry pattern allows easy addition of new templates
export const TemplateRegistry: Record<string, ITemplate> = {
  modern: {
    id: 'modern',
    name: 'Modern (Creative)',
    component: ModernTemplate,
  },
  ats_professional: {
    id: 'ats_professional',
    name: 'ATS Professional',
    component: ATSProfessionalTemplate,
  },
};
