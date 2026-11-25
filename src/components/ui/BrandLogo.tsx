import React from 'react';

interface BrandLogoProps {
  variant?: 'light' | 'dark';
  showWordmark?: boolean;
  size?: 'sm' | 'md';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'light',
  showWordmark = true,
  size = 'md',
}) => {
  const isDark = variant === 'dark';
  const cStroke = isDark ? '#FFFFFF' : '#0A0A0A';
  const wordColor = isDark ? 'text-white' : 'text-[#0A0A0A]';
  const iconSize = size === 'sm' ? 'w-9 h-9' : 'w-10 h-10';
  const textSize = size === 'sm' ? 'text-lg' : 'text-lg sm:text-xl';

  return (
    <span className="inline-flex items-center gap-2 select-none">
      <svg
        viewBox="0 0 64 58"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${iconSize} shrink-0 transition-transform duration-150 group-hover:scale-105`}
        aria-hidden="true"
      >
        {/* Speed streaks */}
        <path d="M4 29H15L13.5 32.5H2L4 29Z" fill="#EA580C" />
        <path d="M2 35.5H13L11.5 39H0.5L2 35.5Z" fill="#EA580C" />

        {/* Shopping bag handles */}
        <path
          d="M25 18.5C25 12.2 29.2 8 34.5 8C39.8 8 44 12.2 44 18.5"
          stroke="#EA580C"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M29.5 18.5C29.5 14.5 31.8 11.5 35.2 11.5C38.6 11.5 41 14.5 41 18.5"
          stroke="#C2410C"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Shopping bag silhouette */}
        <path
          d="M17.5 19.5H50.5L55 50H13L17.5 19.5Z"
          fill="#EA580C"
          fillOpacity="0.14"
          stroke="#EA580C"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="M16.2 28L13 50H23L20.5 28H16.2Z" fill="#EA580C" />

        {/* Bold stylized C */}
        <path
          d="M42.5 26.5C40.5 24.4 37.8 23.2 34.5 23.2C27.8 23.2 23.2 28 23.2 35C23.2 42 27.8 46.8 34.5 46.8C38 46.8 40.8 45.6 42.8 43.4"
          stroke={cStroke}
          strokeWidth="6.2"
          strokeLinecap="round"
        />

        {/* Cart nested inside C */}
        <path
          d="M32 31.8H48L45.5 39.8H34.5L32 31.8Z"
          fill="#EA580C"
          stroke="#EA580C"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M29.2 30H31.8L34.5 39.8"
          stroke="#EA580C"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <circle cx="36" cy="43.2" r="2" fill="#EA580C" />
        <circle cx="44" cy="43.2" r="2" fill="#EA580C" />
      </svg>

      {showWordmark && (
        <span className={`font-display font-bold italic tracking-tight ${textSize} ${wordColor}`}>
          CAPOSTORE<span className="text-[#EA580C]">221</span>
        </span>
      )}
    </span>
  );
};
