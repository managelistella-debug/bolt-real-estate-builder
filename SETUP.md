# Setup Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Step-by-Step Setup

### 1. Fix NPM Cache Permissions

Run this command in your terminal:

```bash
sudo chown -R $(id -u):$(id -g) "$HOME/.npm"
```

**Why?** Your npm cache has permission issues that prevent package installation.

### 2. Install Dependencies

```bash
npm install
```

This will install:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Shadcn/ui components
- Zustand (state management)
- React Hook Form & Zod (forms & validation)
- Lucide React (icons)
- And more...

### 3. Start Development Server

```bash
npm run dev
```

The app will start on **http://localhost:3005**

### 4. Login & Explore

Use one of these demo accounts:

| Role | Email | Password |
|------|-------|----------|
| **Super Admin** | admin@superadmin.com | admin123 |
| **Support Staff** | support@company.com | support123 |
| **Business User** | john@plumbing.com | john123 |

## What to Test

### 1. Authentication Flow
- Try logging in with different accounts
- Test registration (creates new user)
- Logout and login again

### 2. Dashboard
- View stats and recent activity
- Click through quick actions

### 3. Template Gallery
- Browse 3 different templates
- Preview template details
- Create a website from a template

### 4. Website Management
- View your websites list
- Navigate to page manager
- Create new pages
- Duplicate existing pages
- Set a different homepage

### 5. Visual Builder (The Main Feature!)
- Open a page in the builder
- **Add Sections:**
  - Click "Hero" to add a hero section
  - Click "Services" to add service cards
  - Click "Contact" to add a contact form
  - Click "About" to add an about section
- **Edit Content:**
  - Click the edit button on any section
  - Modify headlines, text, images
  - Update button text and URLs
  - Add/remove service cards (2-6 allowed)
- **Preview:**
  - Watch changes update in real-time
  - Toggle between Desktop/Tablet/Mobile views
  - See responsive layout changes
- **Manage Sections:**
  - Reorder sections with Up/Down buttons
  - Delete sections you don't need
  - Visual selection highlighting

## Troubleshooting

### "npm install" fails
1. Did you run the permission fix command?
2. Try: `npm cache clean --force`
3. Delete `node_modules` folder and try again

### "Module not found" errors
- Make sure all packages installed successfully
- Check that you're in the project directory
- Restart the dev server

### Page not loading
- Check console for errors
- Make sure you're on http://localhost:3005
- Try clearing browser cache

### Builder not saving changes
- This is a prototype - changes save to memory
- Refresh will reset to mock data
- Backend integration needed for persistence

## File Structure Quick Reference

```
Important files you might want to explore:

📁 app/
  └─ (auth)/login/page.tsx          # Login page
  └─ (dashboard)/
      └─ dashboard/page.tsx          # Main dashboard
      └─ templates/page.tsx          # Template gallery
      └─ sites/[siteId]/
          └─ pages/page.tsx          # Page manager
          └─ builder/page.tsx        # Visual builder

📁 components/
  └─ ui/                             # Base UI components
  └─ builder/
      └─ BuilderToolbar.tsx          # Device toggle, undo/redo
      └─ SectionsList.tsx            # Add/manage sections
      └─ SectionEditor.tsx           # Edit section content
      └─ LivePreview.tsx             # Real-time preview
  └─ layout/
      └─ Sidebar.tsx                 # Navigation sidebar
      └─ Header.tsx                  # Page header

📁 lib/
  └─ types/index.ts                  # TypeScript definitions
  └─ stores/                         # State management
  └─ mock-data/                      # Sample data
  └─ validation/schemas.ts           # Form validation

📁 Configuration:
  └─ tailwind.config.ts              # Tailwind settings
  └─ next.config.js                  # Next.js config
  └─ tsconfig.json                   # TypeScript config
```

## Next Steps After Testing

Once you've tested the UI and are happy with it, you can:

1. **Provide Feedback** - Let me know what works and what needs changes
2. **Request Features** - Ask for additional functionality
3. **Backend Planning** - Discuss database schema and API design

## Need Help?

If you run into any issues:
1. Check this guide again
2. Read error messages carefully
3. Check the browser console (F12)
4. Review the README.md for more details

---

Happy building! 🚀
