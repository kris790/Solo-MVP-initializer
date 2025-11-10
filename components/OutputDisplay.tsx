import React from 'react';
import { GeneratedFiles } from '../types';
import FileContentCard from './FileContentCard';
import { CodeIcon } from './icons/CodeIcon';
import { FileTextIcon } from './icons/FileTextIcon';

interface OutputDisplayProps {
  files: GeneratedFiles;
}

const generatePromptTitle = (fileName: string): string => {
    if (fileName.includes('core')) {
        return 'AI Prompt: Core MVP';
    }
    if (fileName.includes('week1-2')) {
        return 'AI Prompt: Weeks 1-2';
    }
    if (fileName.includes('week3-4')) {
        return 'AI Prompt: Weeks 3-4';
    }
    return `AI Prompt: ${fileName.replace('.md', '')}`;
};

const OutputDisplay: React.FC<OutputDisplayProps> = ({ files }) => {
  return (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold text-center">Your MVP Blueprint</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <FileContentCard title="README" fileName="README.md" content={files.readme} icon={<FileTextIcon className="w-6 h-6"/>} />
            </div>

            <FileContentCard title="MVP Specification" fileName="spec.md" content={files.spec} icon={<FileTextIcon className="w-6 h-6"/>} />
            
            {Object.entries(files.prompts).sort(([a], [b]) => a.localeCompare(b)).map(([fileName, content]) => (
                 <FileContentCard 
                    key={fileName}
                    title={generatePromptTitle(fileName)} 
                    fileName={fileName} 
                    content={content} 
                    icon={<CodeIcon className="w-6 h-6"/>} 
                />
            ))}

            <FileContentCard title="Project Structure" fileName="structure.json" content={files.structure} icon={<CodeIcon className="w-6 h-6"/>} />
            <FileContentCard title="Development Plan" fileName="DEVELOPMENT_PLAN.md" content={files.devPlan} icon={<FileTextIcon className="w-6 h-6"/>} />
            
            {files.packageJson && (
              <FileContentCard title="Package Config" fileName="package.json" content={files.packageJson} icon={<CodeIcon className="w-6 h-6" />} />
            )}
            {files.progressTracker && (
              <FileContentCard title="Progress Tracker" fileName="progress-tracker.json" content={files.progressTracker} icon={<FileTextIcon className="w-6 h-6" />} />
            )}
            
            <FileContentCard title="Solo Workflow Doc" fileName="solo-workflow.md" content={files.workflowDoc} icon={<FileTextIcon className="w-6 h-6"/>} />

            {files.workflowScript && (
              <FileContentCard title="Workflow Script" fileName="solo-workflow.js" content={files.workflowScript} icon={<CodeIcon className="w-6 h-6" />} />
            )}
        </div>
    </div>
  );
};

export default OutputDisplay;
