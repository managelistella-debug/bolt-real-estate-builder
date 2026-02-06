# Editor Fixes & Completion Plan

## Current Status Analysis

### ✅ Completed Sections (Phases 0-4)
These sections already have the full 3-tab structure (Content/Layout/Style):
- Hero Section ✓
- Headline Section ✓
- Image + Text Section ✓
- Text Section ✓
- Image Gallery ✓
- Icon + Text ✓
- Steps ✓
- Testimonials ✓
- FAQ ✓
- Reviews Slider ✓
- Contact Form ✓
- Sticky Form ✓
- Image Navigation ✓

### ⚠️ Still Needs Work
These sections need to be addressed before Phase 5:

1. **Image Text Columns (image-text-columns)**
   - Currently: Using `ImageTextColumnsEditorWrapped` (partial implementation)
   - Needs: Full 3-tab editor like other sections
   - Status: NEEDS REBUILD

2. **Custom Code (custom-code)**
   - Currently: Using basic `CustomCodeEditorNew` 
   - Needs: Simplified structure (just HTML/CSS/JS fields, no complex tabs needed)
   - Status: NEEDS SIMPLIFICATION

### 🐛 Critical Bug: Keyboard Input Lag

**Problem:** Every keystroke in text inputs causes noticeable lag and sometimes drops characters.

**Root Cause:** 
- Every `onChange` directly updates Zustand store
- This triggers full builder re-render
- Preview re-renders on every keystroke
- No debouncing or optimization

**Impact:** Makes editor frustrating to use, especially for longer text inputs.

---

## Phase 5: Fix Remaining Issues

### Task 5.1: Fix Keyboard Input Lag (CRITICAL - DO FIRST)

**Problem Details:**
```typescript
// Current implementation - causes lag
<Input 
  value={widget.title} 
  onChange={(e) => onChange({ title: e.target.value })} // Instant store update
/>
```

**Solution Options:**

**Option A: Debounced Updates (Recommended)**
- Use local state for text inputs
- Debounce store updates (300ms)
- Update immediately on blur
- Pros: Smooth typing, preserves undo/redo
- Cons: Slight delay before preview updates

**Option B: Optimistic UI with Memo**
- Use React.memo on preview components
- Implement shallow comparison for widgets
- Only re-render changed sections
- Pros: No delay, better UX
- Cons: More complex implementation

**Recommendation:** Implement Option A first (simpler, faster to implement)

**Implementation Steps:**
1. Create a `useDebouncedInput` hook
2. Apply to all text Input and Textarea components in editors
3. Keep immediate updates for:
   - Dropdowns/Selects (no lag issue)
   - Color pickers (visual feedback needed)
   - Sliders (visual feedback needed)
4. Test typing performance across all sections

**Files to Update:**
- Create: `components/builder/hooks/useDebouncedInput.ts`
- Update: All editor files (ContactFormEditorNew, HeroSectionEditorNew, etc.)
- Priority: Start with most commonly used editors (Hero, Headline, Text)

---

### Task 5.2: Create ImageTextColumnsEditorNew

**Current State:** Using wrapped version with basic structure

**Requirements:**
- Full 3-tab layout (Content, Layout, Style)
- Match organizational structure of other editors
- Content Tab:
  - Section header (optional, with tag selector)
  - Items management (add/remove/reorder)
  - Per-item: Image upload, Subtitle, Description
- Layout Tab:
  - Columns (Desktop/Tablet/Mobile)
  - Image aspect ratio
  - Gap control
  - Text alignment
  - Section dimensions & padding
- Style Tab:
  - Typography (Section header, Subtitle, Description) with full controls
  - Image border radius
  - Background

**File to Create:**
- `components/builder/section-editors/ImageTextColumnsEditorNew.tsx`

**File to Update:**
- `components/builder/SectionEditor.tsx` (import and use new editor)

---

### Task 5.3: Simplify Custom Code Editor

**Current State:** Has 3-tab structure (overkill for code embed)

**New Structure:** Single scrollable editor with sections
- No tabs needed
- Simple collapsible sections:
  1. **HTML Code**
     - Textarea with syntax hint
     - Character count
  2. **CSS Code** (optional)
     - Textarea with syntax hint
     - "Wrap in <style> tags" checkbox
  3. **JavaScript Code** (optional)
     - Textarea with syntax hint
     - "Wrap in <script> tags" checkbox
  4. **Section Settings**
     - Section width (Container/Full)
     - Padding controls
  5. **Preview Warning**
     - Note: "Custom code preview is limited. Test on published site."

**Features:**
- Monospace font in textareas
- Basic syntax validation (check for unclosed tags)
- No complex typography or styling options needed

**File to Update:**
- `components/builder/SimplifiedEditors.tsx` (update CustomCodeEditorNew)

---

## Phase 6: Final Polish & Testing

### Task 6.1: Verify All Sections
- [ ] Test each section editor opens correctly
- [ ] Verify all 3 tabs work in each editor
- [ ] Check collapsible sections expand/collapse
- [ ] Ensure all inputs update preview correctly
- [ ] Test responsive breakpoint switching

### Task 6.2: Consistency Check
- [ ] All section editors use same CollapsibleSection component
- [ ] Font size inputs all use FontSizeInput component
- [ ] SEO tag selectors consistent across all sections
- [ ] Color pickers have consistent layout (color input + text input)
- [ ] Typography controls match Headline editor standard

### Task 6.3: Performance Optimization
- [ ] Verify debounced inputs work smoothly
- [ ] Check preview render performance
- [ ] Test with 10+ sections on a page
- [ ] Ensure no memory leaks (unmount cleanup)

### Task 6.4: Edge Case Testing
- [ ] Empty sections (no content)
- [ ] Very long text inputs (1000+ characters)
- [ ] Special characters in text fields
- [ ] Rapid tab switching
- [ ] Rapid section switching

---

## Implementation Order (Recommended)

### Sprint 1: Critical Fixes
**Priority: HIGH - User can't type properly**
1. ✅ Fix keyboard input lag (Task 5.1)
   - Create debounced input hook
   - Apply to Hero, Headline, Text editors first
   - Test typing performance
   - Roll out to remaining editors

**Estimated Time:** 2-3 hours

### Sprint 2: Complete Remaining Editors
**Priority: MEDIUM - Missing functionality**
2. ✅ Create ImageTextColumnsEditorNew (Task 5.2)
   - Build full 3-tab editor
   - Test all functionality
   - Update SectionEditor.tsx

3. ✅ Simplify Custom Code Editor (Task 5.3)
   - Remove unnecessary tabs
   - Create simple single-view editor
   - Add helpful hints/warnings

**Estimated Time:** 3-4 hours

### Sprint 3: Polish & Validation
**Priority: LOW - Quality assurance**
4. ✅ Run through all verification tasks (Phase 6)
   - Test every section
   - Check consistency
   - Performance testing
   - Edge case testing

**Estimated Time:** 2-3 hours

---

## Success Criteria

Before moving to any new phases, all of the following must be true:

✅ **Functionality:**
- All 13+ section types have proper 3-tab editors (or simplified for custom code)
- No sections using "wrapped" versions
- All editor controls work as expected
- Preview updates correctly for all changes

✅ **Performance:**
- No keyboard lag when typing in text fields
- Preview renders smoothly
- Section switching is instant

✅ **Consistency:**
- All editors follow same organizational pattern
- Typography controls match across sections
- Collapsible sections work uniformly
- UI patterns are consistent

✅ **Quality:**
- No linter errors
- No console errors/warnings
- All TypeScript types correct
- Code is clean and maintainable

---

## Notes

### Why Keyboard Lag Happens
The current implementation updates the Zustand store on every keystroke:
```
User types "H" → onChange fires → Store updates → Builder re-renders → 
Preview re-renders → All editors re-render → Slight delay → 
User types "e" → (repeat cycle)
```

With debouncing:
```
User types "Hello" → Local state updates instantly (no lag) → 
After 300ms pause → Store updates once → Preview updates → Clean!
```

### Why Custom Code Doesn't Need Tabs
- Custom code is simple: just HTML/CSS/JS text
- No complex typography or layout options needed
- Users familiar with code editors expect simple textarea
- Tabs would add unnecessary complexity

### Testing Priority
1. Test typing performance FIRST (most critical UX issue)
2. Then test Image Text Columns editor (missing functionality)
3. Finally test Custom Code editor (nice-to-have simplification)
