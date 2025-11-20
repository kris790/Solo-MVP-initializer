import React, { useState, ReactNode } from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

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
        <div className="flex items-center gap-3 overflow-hidden">
          <span className="text-brand-secondary flex-shrink-0">{icon}</span>
          <div className="min-w-0">
            <h3 className="font-bold text-lg truncate">{title}</h3>
            <p className="text-xs text-dark-text-secondary truncate">{fileName}</p>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all text-xs font-bold shadow-sm flex-shrink-0 ${
            isCopied 
              ? 'bg-green-900/30 text-green-400 border border-green-500/30' 
              : 'bg-dark-bg hover:bg-gray-800 border border-dark-border text-dark-text hover:border-dark-text-secondary'
          }`}
          title="Copy to Clipboard"
        >
          {isCopied ? (
            <>
              <CheckCircleIcon className="w-3.5 h-3.5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <ClipboardIcon className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
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