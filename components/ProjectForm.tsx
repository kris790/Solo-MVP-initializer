import React from 'react';
import { ProjectType } from '../types';

interface ProjectFormProps {
  projectName: string;
  setProjectName: (name: string) => void;
  projectType: ProjectType;
  setProjectType: (type: ProjectType) => void;
  onInitialize: () => void;
  isLoading: boolean;
  error: string;
}

const projectOptions = [
  { value: ProjectType.YouTubeAutomation, label: 'YouTube Automation' },
  { value: ProjectType.MicroSaaS, label: 'Micro SaaS' },
  { value: ProjectType.AITool, label: 'AI Productivity Tool' },
  { value: ProjectType.PairProgramming, label: 'Pair Programmer' },
];

const ProjectForm: React.FC<ProjectFormProps> = ({
  projectName,
  setProjectName,
  projectType,
  setProjectType,
  onInitialize,
  isLoading,
  error,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="projectName" className="block text-sm font-medium text-dark-text-secondary mb-2">
          Project Name
        </label>
        <input
          type="text"
          id="projectName"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="e.g., QuickCast"
          className="w-full bg-gray-800 border border-dark-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary focus:outline-none transition-all"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-dark-text-secondary mb-2">
          Project Type
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {projectOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setProjectType(option.value)}
              className={`text-center p-4 border rounded-lg transition-all text-sm sm:text-base flex items-center justify-center h-full ${
                projectType === option.value
                  ? 'bg-brand-primary border-brand-primary font-bold shadow-lg'
                  : 'bg-dark-card border-dark-border hover:border-brand-secondary'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      
      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        onClick={onInitialize}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Initializing...
          </>
        ) : (
          'Initialize MVP'
        )}
      </button>
    </div>
  );
};

export default ProjectForm;