import React from 'react';

const Logo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width="300"
      height="80"
      viewBox="0 0 300 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* First ticket */}
      <rect x="10" y="20" width="80" height="40" rx="5" fill="#3B82F6" />
      <circle cx="20" cy="40" r="3" fill="white" />
      <circle cx="80" cy="40" r="3" fill="white" />
      <line x1="10" y1="40" x2="90" y2="40" stroke="white" strokeWidth="2" strokeDasharray="4 4" />

      {/* Second ticket */}
      <rect x="25" y="15" width="80" height="40" rx="5" fill="#10B981" />
      <circle cx="35" cy="35" r="3" fill="white" />
      <circle cx="95" cy="35" r="3" fill="white" />
      <line x1="25" y1="35" x2="105" y2="35" stroke="white" strokeWidth="2" strokeDasharray="4 4" />

      {/* Third ticket */}
      <rect x="40" y="10" width="80" height="40" rx="5" fill="#F59E0B" />
      <circle cx="50" cy="30" r="3" fill="white" />
      <circle cx="110" cy="30" r="3" fill="white" />
      <line x1="40" y1="30" x2="120" y2="30" stroke="white" strokeWidth="2" strokeDasharray="4 4" />

      {/* TicketDen text */}
      <text x="130" y="50" fontFamily="Poppins, sans-serif" fontSize="32" fontWeight="700" fill="#1F2937">
        Ticket
        <tspan fill="#3B82F6">Den</tspan>
      </text>

      {/* Decorative elements */}
      <circle cx="125" cy="45" r="2" fill="#3B82F6" />
      <circle cx="285" cy="45" r="2" fill="#3B82F6" />
      <line x1="130" y1="55" x2="280" y2="55" stroke="#3B82F6" strokeWidth="2" />
    </svg>
  );
};

export default Logo;

