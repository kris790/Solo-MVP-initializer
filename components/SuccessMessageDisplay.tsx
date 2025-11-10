import React from 'react';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface SuccessMessageDisplayProps {
  message: string;
}

const SuccessMessageDisplay: React.FC<SuccessMessageDisplayProps> = ({ message }) => {
  return (
    <div className="bg-green-900/20 border border-green-500/50 rounded-2xl p-6 text-green-200">
      <div className="flex items-start gap-4">
        <CheckCircleIcon className="w-8 h-8 text-green-400 flex-shrink-0 mt-1" />
        <div>
          <h2 className="text-xl font-bold text-green-100">MVP Initialized Successfully!</h2>
          <pre className="mt-3 text-sm whitespace-pre-wrap font-mono text-green-200/90 leading-relaxed">
            {message}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default SuccessMessageDisplay;
