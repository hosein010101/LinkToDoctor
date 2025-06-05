// Custom SVG Icons for LinkToDoctor Dashboard
// Modern, minimalist, and professional medical UI icons

interface IconProps {
  className?: string;
  size?: number;
}

// Red Bell Notification Icon - Based on provided design
export const NotificationBellIcon = ({ className = "", size = 20, notificationCount = 0 }: IconProps & { notificationCount?: number }) => (
  <div className="relative inline-block">
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none"
      className={className}
    >
      {/* Bell top knob */}
      <circle cx="12" cy="4" r="2" fill="#FF0000" />
      
      {/* Main bell body */}
      <path 
        d="M6 11C6 7.134 8.686 4 12 4C15.314 4 18 7.134 18 11V16C18 17.105 18.895 18 20 18H4C5.105 18 6 17.105 6 16V11Z" 
        fill="#FF0000"
      />
      
      {/* Bell bottom clapper */}
      <ellipse cx="12" cy="20" rx="2" ry="1.2" fill="#FF0000" />
    </svg>
    
    {/* Notification count badge */}
    {notificationCount > 0 && (
      <div className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center border-2 border-white shadow-lg">
        {notificationCount > 99 ? '99+' : notificationCount}
      </div>
    )}
  </div>
);

// Sample Collection Queue/List Icon - Colorful and modern
export const SampleCollectionIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
  >
    {/* Background circle with gradient */}
    <defs>
      <linearGradient id="sampleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0ea5e9" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" fill="url(#sampleGradient)" opacity="0.1" />
    
    {/* Test tube with sample */}
    <rect x="8" y="6" width="3" height="12" rx="1.5" fill="#0ea5e9" stroke="#0369a1" strokeWidth="1.5" />
    <rect x="8.5" y="8" width="2" height="4" fill="#06b6d4" />
    
    {/* Queue indicators */}
    <circle cx="15" cy="8" r="2" fill="#10b981" />
    <circle cx="15" cy="12" r="2" fill="#f59e0b" />
    <circle cx="15" cy="16" r="2" fill="#ef4444" />
    
    {/* Connecting lines */}
    <path d="M11 10h2M11 12h2M11 14h2" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Top Doctors Icon - Colorful award/star design
export const TopDoctorsIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
  >
    {/* Award background */}
    <defs>
      <linearGradient id="awardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
      <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
    </defs>
    
    {/* Award circle */}
    <circle cx="12" cy="10" r="8" fill="url(#awardGradient)" opacity="0.15" />
    
    {/* Medical cross */}
    <path d="M12 6v8M8 10h8" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
    
    {/* Star overlay */}
    <path 
      d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2L12 17.6l-6 3.6 2.4-7.2-6-4.8h7.6L12 2z" 
      fill="url(#starGradient)" 
      stroke="#d97706" 
      strokeWidth="1"
      transform="scale(0.4) translate(18, 18)"
    />
    
    {/* Ribbon elements */}
    <path d="M8 18l4-2 4 2v4l-4-2-4 2v-4z" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1" />
  </svg>
);

// User Profile/Settings Icon
export const UserProfileIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M20 21a8 8 0 0 0-16 0" />
    <circle cx="18" cy="18" r="2" />
  </svg>
);

// Modern Settings Icon
export const SettingsIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v6m0 6v6M1 12h6m6 0h6" />
    <circle cx="12" cy="12" r="10" />
  </svg>
);

// Language/Region Selector Icon
export const LanguageIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

// Theme Toggle Icon (Light/Dark Mode)
export const ThemeToggleIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

// Messages/Support Icon
export const MessagesIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <circle cx="9" cy="10" r="1" fill="currentColor" />
    <circle cx="15" cy="10" r="1" fill="currentColor" />
  </svg>
);

// System Status/Quick Link Icon
export const SystemStatusIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);

// Medical Cross Icon (for healthcare context)
export const MedicalIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <rect x="6" y="2" width="12" height="20" rx="2" />
    <path d="M12 6v12M6 12h12" />
  </svg>
);

// Search Icon - Enhanced for medical context
export const SearchIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
    <circle cx="11" cy="11" r="3" />
  </svg>
);