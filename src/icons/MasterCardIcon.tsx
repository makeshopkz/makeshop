import React from 'react';

export const MasterCardIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
  >
    <circle cx="8" cy="12" r="7" fill="#EB001B" fillOpacity="0.8"/>
    <circle cx="16" cy="12" r="7" fill="#F79E1B" fillOpacity="0.8"/>
    <path d="M12 17.4c1.9-1.3 3.1-3.5 3.1-5.9s-1.2-4.6-3.1-5.9c-1.9 1.3-3.1 3.5-3.1 5.9s1.2 4.6 3.1 5.9z" fill="#FF5F00"/>
  </svg>
);