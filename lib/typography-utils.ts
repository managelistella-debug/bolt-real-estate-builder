import { TypographyConfig, FontSizeValue, ButtonStyleConfig, Breakpoint } from './types';
import { resolveResponsiveValue } from './responsive';

/**
 * Converts a FontSizeValue to a CSS string
 */
export function fontSizeToCSS(fontSize: FontSizeValue | string | number | undefined): string {
  if (typeof fontSize === 'number') {
    return `${fontSize}px`;
  }
  if (typeof fontSize === 'string') {
    return fontSize;
  }
  if (!fontSize) return '16px';
  return `${fontSize.value}${fontSize.unit}`;
}

/**
 * Converts a TypographyConfig to CSS style object
 */
export function typographyToCSS(
  typography: TypographyConfig | undefined,
  breakpoint: Breakpoint = 'desktop',
): React.CSSProperties {
  if (!typography) return {};
  const fontSize = resolveResponsiveValue(
    typography.fontSizeResponsive,
    breakpoint,
    typography.fontSize,
  );
  
  return {
    fontFamily: typography.fontFamily || 'Inter',
    fontSize: fontSizeToCSS(fontSize as any),
    fontWeight: typography.fontWeight || '400',
    lineHeight: typography.lineHeight || '1.5',
    textTransform: typography.textTransform || 'none',
    letterSpacing: typography.letterSpacing || '0em',
    color: typography.color || '#000000',
  };
}

/**
 * Converts a ButtonStyleConfig to CSS style object
 * Note: Returns styles split into container and background for proper blur/opacity handling
 */
export function buttonToCSS(button: ButtonStyleConfig | undefined, isHover: boolean = false): React.CSSProperties {
  if (!button) return {};

  // Convert hex color with opacity to rgba
  const colorWithOpacity = (color: string, opacity: number) => {
    if (/^#([0-9a-f]{6})$/i.test(color)) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
    }
    if (opacity >= 100) return color;
    // Works with CSS variables such as var(--global-color-primary)
    return `color-mix(in srgb, ${color} ${opacity}%, transparent)`;
  };

  const bgColor = button.backgroundColor || '#3b82f6';
  const bgOpacity = button.backgroundOpacity || 100;

  const baseStyles: React.CSSProperties = {
    backgroundColor: colorWithOpacity(bgColor, bgOpacity),
    color: button.textColor || '#ffffff',
    borderRadius: `${button.borderRadius || 8}px`,
    borderWidth: `${button.borderWidth || 0}px`,
    borderStyle: button.borderWidth && button.borderWidth > 0 ? 'solid' : 'none',
    borderColor: button.borderColor || 'transparent',
    fontFamily: button.fontFamily || 'Inter',
    fontSize: fontSizeToCSS(button.fontSize),
    fontWeight: button.fontWeight || '500',
    lineHeight: button.lineHeight || '1.2',
    textTransform: button.textTransform || 'none',
    textDecoration: 'none',
    boxShadow: button.dropShadow && button.shadowAmount 
      ? `0 ${button.shadowAmount}px ${button.shadowAmount * 2}px rgba(0, 0, 0, 0.1)`
      : 'none',
    // Note: blur is handled separately via backdrop-filter on a pseudo-element
  };

  // Apply hover styles if in hover state
  if (isHover && button.hover) {
    const hoverBgColor = button.hover.backgroundColor || bgColor;
    const hoverBgOpacity = button.hover.backgroundOpacity !== undefined ? button.hover.backgroundOpacity : bgOpacity;
    
    return {
      ...baseStyles,
      backgroundColor: colorWithOpacity(hoverBgColor, hoverBgOpacity),
      color: button.hover.textColor || baseStyles.color,
      borderColor: button.hover.borderColor || baseStyles.borderColor,
      boxShadow: button.hover.dropShadow && button.hover.shadowAmount
        ? `0 ${button.hover.shadowAmount}px ${button.hover.shadowAmount * 2}px rgba(0, 0, 0, 0.15)`
        : baseStyles.boxShadow,
    };
  }

  return baseStyles;
}

/**
 * Gets the appropriate width class/style for a button
 */
export function getButtonWidthStyle(button: ButtonStyleConfig | undefined): React.CSSProperties {
  if (!button) return {};
  
  if (button.width === 'full') {
    return { width: '100%' };
  } else if (button.width === 'custom' && button.customWidth) {
    return { width: `${button.customWidth}px` };
  }
  
  return {}; // standard width - auto
}

/**
 * Calculate inner border radius for button background (outer radius - border width)
 * This ensures the background perfectly aligns with the inner edge of the border
 */
export function getInnerBorderRadius(button: ButtonStyleConfig | undefined): string {
  if (!button) return '8px';
  const outerRadius = button.borderRadius || 8;
  const borderWidth = button.borderWidth || 0;
  const innerRadius = Math.max(0, outerRadius - borderWidth);
  return `${innerRadius}px`;
}
