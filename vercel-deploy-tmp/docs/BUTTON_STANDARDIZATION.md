# Button Standardization Rule

## Overview
All buttons across all sections in the website builder **MUST** use the centralized `renderStandardButton` function defined in `components/builder/LivePreview.tsx`. This ensures 100% consistency in appearance, behavior, and functionality across the entire application.

## Why This Rule Exists
Previously, different sections had their own button rendering logic, leading to:
- Inconsistent styling and behavior between sections
- Bugs that only appeared in certain sections
- Duplicated code that was hard to maintain
- Missing features in some sections but not others

The standardized approach solves all these issues by providing a single source of truth.

## The Standardized Button Function

### Location
`components/builder/LivePreview.tsx` - `renderStandardButton()` function

### Features
The standardized button provides:

1. **Width Control**
   - Auto: Button width fits content
   - Standard: Fixed standard width
   - Wide: Wider fixed width
   - Full: 100% width within container (never goes off screen)
   - Custom: User-defined pixel width

2. **Perfect Border Alignment**
   - Inner background radius automatically calculated to prevent gaps
   - Border width properly accounted for in radius calculations

3. **Typography Control**
   - Font family
   - Font size
   - Font weight
   - Line height
   - Text transform
   - Letter spacing
   - **Text is always centered within button**

4. **Visual Effects**
   - Border (width, color, radius)
   - Drop shadow with amount control
   - Blur effect (applied only to background, not text)
   - Background opacity

5. **Hover Effects**
   - Background color change
   - Text color change
   - Border color change
   - Scale transformation
   - Smooth transitions (0.3s ease)

6. **Special Modes**
   - Submit button mode (for forms)
   - Disabled state (for loading states)

### Usage

```typescript
renderStandardButton(
  buttonConfig,      // Button configuration object
  buttonText,        // Text to display
  buttonUrl,         // URL to navigate to (if not submit button)
  {                  // Optional parameters
    isSubmitButton?: boolean;   // Default: false
    isDisabled?: boolean;       // Default: false  
    containerClassName?: string; // Default: ''
  }
)
```

### Example

```typescript
// Link button
{renderStandardButton(buttonForRendering, 'Click Me', '/page')}

// Submit button
{renderStandardButton(
  buttonConfig, 
  'Submit', 
  '', 
  { isSubmitButton: true, isDisabled: isSubmitting }
)}
```

## Sections Using Standardized Buttons

All sections with buttons use `renderStandardButton`:

✅ **Hero Section**
✅ **Image+Text Section**
✅ **Text Section**
✅ **Contact Form Section**
✅ **Sticky Form Section**

## Rules for Developers

### ✅ DO
- Always use `renderStandardButton` for any button in any section
- Update `renderStandardButton` if you need to change button behavior globally
- Test all sections with buttons when modifying `renderStandardButton`
- Ensure button config follows the `ButtonStyleConfig` type

### ❌ DON'T
- Create custom button rendering in individual sections
- Copy/paste button JSX between sections
- Add section-specific button logic outside of `renderStandardButton`
- Use different button structures in different sections

## Button Configuration Structure

All buttons use the unified `ButtonStyleConfig` structure:

```typescript
{
  text: string;
  url: string;
  width: 'auto' | 'standard' | 'wide' | 'full' | 'custom';
  customWidth?: number;
  backgroundColor: string;
  textColor: string;
  borderRadius: number;
  borderWidth: number;
  borderColor: string;
  backgroundOpacity: number;
  dropShadow: boolean;
  shadowAmount: number;
  blurEffect: number;
  fontFamily: string;
  fontSize: FontSizeValue;
  fontWeight: string;
  lineHeight: string;
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  letterSpacing: string;
  hover: {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    backgroundOpacity?: number;
    scale?: number;
  };
  useGlobalStyle?: boolean;
  globalStyleId?: string;
}
```

## Migration Pattern

When adding button support to a section or updating an existing section:

1. **Editor Migration**: Add a `useEffect` migration in the section's editor to consolidate old button properties into `widget.button`

```typescript
useEffect(() => {
  if (!(widget as any).button && widget.buttonText) {
    onChange({
      button: {
        // Consolidate all button properties here
      }
    });
  }
}, []);
```

2. **Fallback Function**: Create a `getButtonForRendering()` helper that reads from `widget.button` first, then falls back to old properties

```typescript
const getButtonForRendering = () => {
  if (widget.button) return widget.button;
  
  // Fallback to old structure
  return {
    // Build config from old properties
  };
};
```

3. **Use Standard Renderer**: Replace all custom button JSX with `renderStandardButton()`

## Testing Checklist

When modifying button functionality, test:

- [ ] Button width controls work in all sections
- [ ] Border displays correctly with no gaps
- [ ] Drop shadow appears when enabled
- [ ] Blur effect only affects background, not text
- [ ] Hover effects work smoothly
- [ ] Text is centered in button
- [ ] Full width buttons don't go off screen
- [ ] Submit buttons handle disabled state correctly
- [ ] Typography controls work
- [ ] Background opacity works

## Future Additions

When adding buttons to new sections:
1. Follow the migration pattern above
2. Use `renderStandardButton` for all button rendering
3. Add the section to the "Sections Using Standardized Buttons" list in this document
4. Update the comment at the top of `LivePreview.tsx`

## Questions?

If you need to add new button functionality:
1. First, check if `renderStandardButton` already supports it
2. If not, update `renderStandardButton` to add the feature globally
3. Test the feature across all sections with buttons

This ensures the feature is available everywhere and maintains consistency.
