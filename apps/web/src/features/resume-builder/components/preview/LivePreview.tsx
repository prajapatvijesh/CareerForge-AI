import React, { useRef } from 'react';
import { TemplateRegistry } from '../templates/registry';
import { Button } from '@/components/ui/button';
import { useExportPdf } from '../../api/resume.api';
import { Loader2, Download, Maximize2 } from 'lucide-react';

interface LivePreviewProps {
  resume: any;
}

export const LivePreview: React.FC<LivePreviewProps> = ({ resume }) => {
  const exportMutation = useExportPdf();
  const previewRef = useRef<HTMLDivElement>(null);
  
  const templateId = resume?.templateId || 'modern';
  const TemplateComponent = TemplateRegistry[templateId]?.component || TemplateRegistry['modern'].component;

  const handleExport = () => {
    if (previewRef.current && resume?._id) {
      const htmlContent = `
        <html>
          <head>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              * { box-sizing: border-box; }
            </style>
          </head>
          <body>
            ${previewRef.current.outerHTML}
          </body>
        </html>
      `;
      exportMutation.mutate({ id: resume._id, htmlContent });
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-200/50 dark:bg-slate-900 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
      
      {/* Action Bar */}
      <div className="flex justify-between items-center p-4 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-10">
        <div className="flex items-center space-x-2 text-sm text-slate-500 font-medium">
          <Maximize2 className="w-4 h-4" />
          <span>Live Preview</span>
        </div>
        <Button 
          onClick={handleExport} 
          disabled={exportMutation.isPending}
          className="shadow-md bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 transition-all duration-300"
        >
          {exportMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
          Download PDF
        </Button>
      </div>
      
      {/* Scrollable Canvas area */}
      <div className="flex-1 overflow-y-auto p-8 flex justify-center pb-24">
        {/* A4 sized document wrapper with realistic styling */}
        <div className="relative group w-full max-w-[850px]">
          {/* Subtle glow behind document */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-indigo-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <div 
            ref={previewRef}
            className="relative w-full min-h-[141.4vw] md:min-h-[1190px] bg-white ring-1 ring-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-transform duration-300 origin-top"
          >
            <TemplateComponent resume={resume} />
          </div>
        </div>
      </div>
    </div>
  );
};
