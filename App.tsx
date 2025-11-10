import React, { useState, useCallback } from 'react';
import { ProjectType, GeneratedFiles } from './types';
import { initializeMvp } from './services/initializer';
import Header from './components/Header';
import ProjectForm from './components/ProjectForm';
import OutputDisplay from './components/OutputDisplay';
import SuccessMessageDisplay from './components/SuccessMessageDisplay';

const App: React.FC = () => {
  const [projectName, setProjectName] = useState<string>('');
  const [projectType, setProjectType] = useState<ProjectType>(ProjectType.YouTubeAutomation);
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFiles | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleInitialize = useCallback(() => {
    if (!projectName.trim()) {
      setError('Project name is required.');
      return;
    }
    setError('');
    setIsLoading(true);
    setGeneratedFiles(null);
    setSuccessMessage(null);

    // Simulate async operation for better UX
    setTimeout(() => {
      try {
        const { files, successMessage } = initializeMvp(projectName, projectType);
        setGeneratedFiles(files);
        setSuccessMessage(successMessage);
      } catch (e) {
        if (e instanceof Error) {
            setError(e.message);
        } else {
            setError('An unknown error occurred.');
        }
      } finally {
        setIsLoading(false);
      }
    }, 500);
  }, [projectName, projectType]);

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        <main className="mt-8">
          <div className="max-w-3xl mx-auto bg-dark-card p-6 sm:p-8 rounded-2xl shadow-2xl border border-dark-border">
            <ProjectForm
              projectName={projectName}
              setProjectName={setProjectName}
              projectType={projectType}
              setProjectType={setProjectType}
              onInitialize={handleInitialize}
              isLoading={isLoading}
              error={error}
            />
          </div>

          {isLoading && (
            <div className="text-center mt-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
              <p className="mt-4 text-dark-text-secondary">Generating your MVP blueprint...</p>
            </div>
          )}
          
          {successMessage && (
            <div className="mt-12">
              <SuccessMessageDisplay message={successMessage} />
            </div>
          )}

          {generatedFiles && (
            <div className={successMessage ? "mt-8" : "mt-12"}>
              <OutputDisplay files={generatedFiles} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;