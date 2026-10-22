import React from 'react';

export const KaspiIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
  >
    <rect width="24" height="24" rx="6" fill="#F14635"/>
    <path d="M7 7H17V9H9V11H16V13H9V17H7V7Z" fill="white"/>
  </svg>
);