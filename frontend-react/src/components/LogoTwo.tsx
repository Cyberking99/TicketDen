import React from 'react';

const Logo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width="200"
      height="60"
      viewBox="0 0 200 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="10" y="10" width="180" height="40" rx="20" fill="#4A5568" />
      <path d="M10 30H190" stroke="#CBD5E0" strokeWidth="2" strokeDasharray="5 5" />
      <circle cx="30" cy="30" r="10" fill="#CBD5E0" />
      <circle cx="170" cy="30" r="10" fill="#CBD5E0" />
      <text x="50" y="38" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="#CBD5E0">
        TicketDen
      </text>
    </svg>
  );
};

export default Logo;