import React, { useState } from 'react';
import JSZip from 'jszip';
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
    const [isZipping, setIsZipping] = useState(false);

    const handleDownloadZip = async () => {
        setIsZipping(true);
        try {
            const zip = new JSZip();
            
            // Add root files
            zip.file("README.md", files.readme);
            zip.file("PRD.md", files.prd);
            zip.file("spec.md", files.spec);
            zip.file("structure.json", files.structure);
            zip.file("DEVELOPMENT_PLAN.md", files.devPlan);
            zip.file(".gitignore", files.gitignore);
            zip.file("solo-workflow.md", files.workflowDoc);

            if (files.packageJson) zip.file("package.json", files.packageJson);
            if (files.progressTracker) zip.file("progress-tracker.json", files.progressTracker);
            if (files.workflowScript) zip.file("solo-workflow.js", files.workflowScript);

            // Add folders
            const promptsFolder = zip.folder("ai-prompts");
            if (promptsFolder) {
                Object.entries(files.prompts).forEach(([fileName, content]) => {
                    promptsFolder.file(fileName, content);
                });
            }

            const specFolder = zip.folder("specs");
            if (specFolder) {
                specFolder.file("mvp-specification.json", JSON.stringify(files.spec, null, 2)); 
            }

            // Create structure folders (empty)
            try {
                const structureObj = JSON.parse(files.structure);
                if (structureObj.directories) {
                     Object.entries(structureObj.directories).forEach(([dir, subdirs]) => {
                        zip.folder(dir);
                        if (Array.isArray(subdirs)) {
                            subdirs.forEach((sub: any) => zip.folder(`${dir}/${sub}`));
                        }
                     });
                }
            } catch (e) {
                console.warn("Could not parse structure to create folders", e);
            }
            
            const blob = await zip.generateAsync({ type: "blob" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "mvp-blueprint.zip";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error("Failed to generate zip", e);
            alert("Failed to generate ZIP file. Please try again.");
        } finally {
            setIsZipping(false);
        }
    };

  return (
    <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-3xl font-bold text-center sm:text-left">Your MVP Blueprint</h2>
            <button
                onClick={handleDownloadZip}
                disabled={isZipping}
                className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-6 rounded-lg flex items-center transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isZipping ? (
                    <>
                         <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Zipping...
                    </>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Download as ZIP
                    </>
                )}
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <FileContentCard title="README" fileName="README.md" content={files.readme} icon={<FileTextIcon className="w-6 h-6"/>} />
            </div>

            <FileContentCard title="Product Requirements Doc" fileName="PRD.md" content={files.prd} icon={<FileTextIcon className="w-6 h-6"/>} />
            
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
            
            <FileContentCard title="Git Ignore" fileName=".gitignore" content={files.gitignore} icon={<CodeIcon className="w-6 h-6" />} />

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