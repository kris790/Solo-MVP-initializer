import React from 'react';
import { RocketIcon } from './icons/RocketIcon';

const Header: React.FC = () => {
  return (
    <header className="text-center">
      <div className="inline-flex items-center justify-center bg-dark-card p-4 rounded-full border border-dark-border mb-4">
        <RocketIcon className="h-10 w-10 text-brand-primary" />
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
        Solo MVP Initializer
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-dark-text-secondary">
        Generate specifications, AI prompts, and development plans for your next big idea.
      </p>
    </header>
  );
};

export default Header;
