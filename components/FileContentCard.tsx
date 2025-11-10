import React, { useState, ReactNode } from 'react';

interface FileContentCardProps {
  title: string;
  fileName: string;
  content: string;
  icon: ReactNode;
}

const FileContentCard: React.FC<FileContentCardProps> = ({ title, fileName, content, icon }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="bg-dark-card rounded-lg border border-dark-border shadow-lg flex flex-col h-full">
      <div className="p-4 border-b border-dark-border flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-brand-secondary">{icon}</span>
          <div>
            <h3 className="font-bold text-lg">{title}</h3>
            <p className="text-xs text-dark-text-secondary">{fileName}</p>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="bg-gray-700 hover:bg-gray-600 text-xs font-mono px-3 py-1 rounded-md transition-colors"
        >
          {isCopied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="p-4 overflow-auto h-96">
        <pre className="text-sm whitespace-pre-wrap font-mono text-dark-text-secondary leading-relaxed">
          <code>{content.trim()}</code>
        </pre>
      </div>
    </div>
  );
};

export default FileContentCard;
