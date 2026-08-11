const fs = require('fs');
const path = require('path');

const filesToFix = [
  {
    file: 'src/features/auth/components/ProtectedRoute.tsx',
    replacements: [[/useAppDispatch,\s*/, '']]
  },
  {
    file: 'src/features/job-tracker/components/JobFilters.tsx',
    replacements: [[/import { Button } from '@\/components\/ui\/button';/, '']]
  },
  {
    file: 'src/features/job-tracker/components/JobFormModal.tsx',
    replacements: [[/import { WORK_MODELS, SALARY_PERIODS, JobStatusEnum, PriorityEnum } from '\.\.\/api\/jobs\.api';/, "import { JobStatusEnum, PriorityEnum } from '../api/jobs.api';"]]
  },
  {
    file: 'src/features/mock-interview/api/mockInterview.api.ts',
    replacements: [
      [/, err/, ''],
      [/, newAnswer/, ''],
      [/\(data\) => {/, '() => {']
    ]
  },
  {
    file: 'src/features/mock-interview/components/AnswerInput.tsx',
    replacements: [[/import { motion } from 'framer-motion';/, '']]
  },
  {
    file: 'src/features/mock-interview/components/FeedbackPanel.tsx',
    replacements: [[/import { motion } from 'framer-motion';/, '']]
  },
  {
    file: 'src/features/mock-interview/components/InterviewSidebar.tsx',
    replacements: [[/ChevronRight,\s*/, '']]
  },
  {
    file: 'src/features/mock-interview/pages/InterviewHome.tsx',
    replacements: [[/import { useState } from 'react';/, '']]
  },
  {
    file: 'src/features/mock-interview/pages/InterviewResult.tsx',
    replacements: [[/, RefreshCcw/, '']]
  },
  {
    file: 'src/features/profile/components/AvatarUpload.tsx',
    replacements: [[/import { Button } from '@\/components\/ui\/button';/, '']]
  },
  {
    file: 'src/features/profile/pages/ProfilePage.tsx',
    replacements: [[/const tabToTitle = {[\s\S]*?};/, '']]
  }
];

const basePath = 'v:/CareerForge AI/apps/web';

filesToFix.forEach(({ file, replacements }) => {
  const fullPath = path.join(basePath, file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    replacements.forEach(([regex, replacement]) => {
      content = content.replace(regex, replacement);
    });
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Fixed ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});
