export interface IconProps {
  className?: string;
  color?: string;
}

// Check / Checkmark Icon
export const CheckIcon = ({ className = 'w-6 h-6', color = 'currentColor' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

// Star Icon
export const StarIcon = ({ className = 'w-6 h-6', color = 'currentColor' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

// Leaf / Plant Icon
export const LeafIcon = ({ className = 'w-6 h-6', color = 'currentColor' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v16h16M5 19C5 9 11 4 19 3L7 15l-2 4z" />
  </svg>
);

// Tools / Wrench Icon
export const ToolsIcon = ({ className = 'w-6 h-6', color = 'currentColor' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
  </svg>
);

// Truck / Vehicle Icon
export const TruckIcon = ({ className = 'w-6 h-6', color = 'currentColor' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8h4l3 3v5h-2m-2 0a2 2 0 11-4 0m4 0H7m0 0a2 2 0 11-4 0m-3-5V4h14v12" />
  </svg>
);

// Building / House Icon
export const BuildingIcon = ({ className = 'w-6 h-6', color = 'currentColor' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

// Calendar Icon
export const CalendarIcon = ({ className = 'w-6 h-6', color = 'currentColor' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

// Clock Icon
export const ClockIcon = ({ className = 'w-6 h-6', color = 'currentColor' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Phone Icon
export const PhoneIcon = ({ className = 'w-6 h-6', color = 'currentColor' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

// Email Icon
export const EmailIcon = ({ className = 'w-6 h-6', color = 'currentColor' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

// Location / Pin Icon
export const LocationIcon = ({ className = 'w-6 h-6', color = 'currentColor' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

// Users / People Icon
export const UsersIcon = ({ className = 'w-6 h-6', color = 'currentColor' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

// Shield / Security Icon
export const ShieldIcon = ({ className = 'w-6 h-6', color = 'currentColor' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

// Heart Icon
export const HeartIcon = ({ className = 'w-6 h-6', color = 'currentColor' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
);

// Settings / Gear Icon
export const SettingsIcon = ({ className = 'w-6 h-6', color = 'currentColor' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

// Document Icon
export const DocumentIcon = ({ className = 'w-6 h-6', color = 'currentColor' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

// Image Icon
export const ImageIconSvg = ({ className = 'w-6 h-6', color = 'currentColor' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

// Video Icon
export const VideoIcon = ({ className = 'w-6 h-6', color = 'currentColor' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

// Money / Dollar Icon
export const MoneyIcon = ({ className = 'w-6 h-6', color = 'currentColor' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Award / Badge Icon
export const AwardIcon = ({ className = 'w-6 h-6', color = 'currentColor' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

// Icon Library Registry
export const ICON_LIBRARY = {
  check: CheckIcon,
  star: StarIcon,
  leaf: LeafIcon,
  tools: ToolsIcon,
  truck: TruckIcon,
  building: BuildingIcon,
  calendar: CalendarIcon,
  clock: ClockIcon,
  phone: PhoneIcon,
  email: EmailIcon,
  location: LocationIcon,
  users: UsersIcon,
  shield: ShieldIcon,
  heart: HeartIcon,
  settings: SettingsIcon,
  document: DocumentIcon,
  image: ImageIconSvg,
  video: VideoIcon,
  money: MoneyIcon,
  award: AwardIcon,
};

export type IconName = keyof typeof ICON_LIBRARY;

// Helper function to get icon component by name
export function getIcon(name: string): React.ComponentType<IconProps> {
  return ICON_LIBRARY[name as IconName] || CheckIcon;
}

// Get all icon names for the picker
export function getAllIconNames(): IconName[] {
  return Object.keys(ICON_LIBRARY) as IconName[];
}
