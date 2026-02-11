import { TypographyConfig, FontSizeValue, ButtonStyleConfig } from './types';

/**
 * Converts a FontSizeValue to a CSS string
 */
export function fontSizeToCSS(fontSize: FontSizeValue | number | undefined): string {
  if (typeof fontSize === 'number') {
    return `${fontSize}px`;
  }
  if (!fontSize) return '16px';
  return `${fontSize.value}${fontSize.unit}`;
}

/**
 * Converts a TypographyConfig to CSS style object
 */
export function typographyToCSS(typography: TypographyConfig | undefined): React.CSSProperties {
  if (!typography) return {};
  
  return {
    fontFamily: typography.fontFamily || 'Inter',
    fontSize: fontSizeToCSS(typography.fontSize),
    fontWeight: typography.fontWeight || '400',
    lineHeight: typography.lineHeight || '1.5',
    textTransform: typography.textTransform || 'none',
    letterSpacing: typography.letterSpacing || '0em',
    color: typography.color || '#000000',
  };
}

/**
 * Converts a ButtonStyleConfig to CSS style object
 */
export function buttonToCSS(button: ButtonStyleConfig | undefined, isHover: boolean = false): React.CSSProperties {
  if (!button) return {};

  const baseStyles: React.CSSProperties = {
    backgroundColor: button.backgroundColor || '#3b82f6',
    color: button.textColor || '#ffffff',
    borderRadius: `${button.borderRadius || 8}px`,
    borderWidth: `${button.borderWidth || 0}px`,
    borderStyle: button.borderWidth && button.borderWidth > 0 ? 'solid' : 'none',
    borderColor: button.borderColor || 'transparent',
    opacity: (button.backgroundOpacity || 100) / 100,
    fontFamily: button.fontFamily || 'Inter',
    fontSize: fontSizeToCSS(button.fontSize),
    fontWeight: button.fontWeight || '500',
    lineHeight: button.lineHeight || '1.2',
    textTransform: button.textTransform || 'none',
    boxShadow: button.dropShadow && button.shadowAmount 
      ? `0 ${button.shadowAmount}px ${button.shadowAmount * 2}px rgba(0, 0, 0, 0.1)`
      : 'none',
    filter: button.blurEffect ? `blur(${button.blurEffect}px)` : 'none',
  };

  // Apply hover styles if in hover state
  if (isHover && button.hover) {
    return {
      ...baseStyles,
      backgroundColor: button.hover.backgroundColor || baseStyles.backgroundColor,
      color: button.hover.textColor || baseStyles.color,
      borderColor: button.hover.borderColor || baseStyles.borderColor,
      opacity: button.hover.backgroundOpacity !== undefined ? button.hover.backgroundOpacity / 100 : baseStyles.opacity,
      boxShadow: button.hover.dropShadow && button.hover.shadowAmount
        ? `0 ${button.hover.shadowAmount}px ${button.hover.shadowAmount * 2}px rgba(0, 0, 0, 0.15)`
        : baseStyles.boxShadow,
      filter: button.hover.blurEffect ? `blur(${button.hover.blurEffect}px)` : baseStyles.filter,
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
