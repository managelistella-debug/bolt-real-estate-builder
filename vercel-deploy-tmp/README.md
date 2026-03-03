# Website Builder + CRM - UI Prototype

A full-featured UI prototype for a website builder and CRM platform built with Next.js 14, TypeScript, Tailwind CSS, and Shadcn/ui.

## 🚀 Quick Start

### 1. Fix NPM Permission Issue (Required First)

Your npm cache has permission issues. Run this command in your terminal:

```bash
sudo chown -R $(id -u):$(id -g) "$HOME/.npm"
```

This fixes the npm cache permissions. You only need to do this once.

### 2. Install Dependencies

```bash
cd /Users/derek/BuilderWebsiteSaas
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 What's Included (Phases 1-6)

### ✅ Phase 1: Foundation
- Next.js 14 with TypeScript
- Tailwind CSS configured
- Shadcn/ui components
- Type-safe Zustand stores
- Mock data layer

### ✅ Phase 2: Authentication
- Login page (`/login`)
- Register page (`/register`)
- Mock authentication system
- Role-based access (Super Admin, Internal Admin, Business User)
- **Demo accounts:**
  - Super Admin: `admin@superadmin.com` / `admin123`
  - Support: `support@company.com` / `support123`
  - Business: `john@plumbing.com` / `john123`

### ✅ Phase 3: Dashboard
- Main dashboard with stats
- Notion-style sidebar navigation
- Role-based menu items
- Recent leads and tasks overview

### ✅ Phase 4: Template System
- Template gallery (`/templates`)
- 3 pre-built templates
- Template preview modal
- One-click website creation

### ✅ Phase 5: Page Management
- Websites list (`/sites`)
- Page manager (`/sites/[id]/pages`)
- Create, duplicate, delete pages
- Set homepage
- WordPress-style interface

### ✅ Phase 6: Website Builder
- Visual builder (`/sites/[id]/builder`)
- Section management (Hero, About, Services, Contact)
- Widget editors for each section type
- Live preview panel
- Device view toggle (Desktop/Tablet/Mobile)
- Undo/Redo functionality
- Drag-and-drop section reordering

## 📁 Project Structure

```
/app
  /(auth)
    /login                    # Login page
    /register                 # Registration page
  /(dashboard)
    /dashboard                # Main dashboard
    /sites                    # Website list
      /[siteId]
        /pages                # Page management
        /builder              # Visual builder
    /templates                # Template gallery
    /leads                    # CRM (coming soon)
/components
  /ui                         # Shadcn/ui base components
  /builder                    # Builder components
    - BuilderToolbar.tsx      # Device view + undo/redo
    - SectionsList.tsx        # Section management
    - SectionEditor.tsx       # Widget editors
    - LivePreview.tsx         # Real-time preview
  /layout                     # Layout components
    - Sidebar.tsx             # Navigation sidebar
    - Header.tsx              # Page header
/lib
  /types                      # TypeScript definitions
  /stores                     # Zustand state stores
  /mock-data                  # Mock data generators
  /validation                 # Zod schemas
```

## 🎨 Features Showcase

### Authentication
- Clean, minimal login/register forms
- Form validation with Zod
- Persistent sessions (localStorage)
- Role-based routing

### Dashboard
- Overview stats (websites, leads, tasks)
- Quick actions
- Recent activity feed
- Mobile-responsive cards

### Template System
- Visual template gallery
- Industry tags
- Full template preview
- Instant website creation

### Page Management
- List view of all pages
- Create/duplicate/delete pages
- Set homepage
- Status badges (published/draft)
- Direct edit links

### Website Builder
- **Split-screen interface**
  - Left: Section/widget controls
  - Right: Live preview
- **Section Types:**
  - Hero (headline, subheadline, CTA, background)
  - About (content, image, optional CTA)
  - Services (2-6 service cards)
  - Contact (configurable form)
- **Editing Features:**
  - Add/remove sections
  - Reorder sections (up/down buttons)
  - Edit widget content in real-time
  - Device preview (desktop/tablet/mobile)
  - Visual selection highlighting
- **Live Preview:**
  - Real-time updates
  - Responsive layouts
  - Styled with global theme

## 🛠 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** Shadcn/ui + Radix UI
- **State Management:** Zustand
- **Forms:** React Hook Form
- **Validation:** Zod
- **Icons:** Lucide React

## 🔒 Security Notes (For Backend Integration)

This is a UI prototype with mock data. When building the backend, implement:

- ✅ Rate limiting on all endpoints
- ✅ Server-side input validation
- ✅ Environment variables for API keys
- ✅ Proper password encryption
- ✅ Secure session management
- ✅ Generic error messages (no info leakage)

Comments are placed throughout the code (marked with `TODO`) indicating where backend integration is needed.

## 🧪 Testing the Prototype

1. **Login** with a demo account
2. **Dashboard** - View overview stats
3. **Create Website:**
   - Click "New Website" → Browse Templates
   - Select a template → Create Website
4. **Manage Pages:**
   - Go to "Websites" → Select site → "Manage"
   - Create new pages
   - Duplicate/delete pages
   - Set homepage
5. **Build Website:**
   - Click "Edit" on any page
   - Add sections (Hero, About, Services, Contact)
   - Edit widget content in the left panel
   - Watch live preview update in real-time
   - Toggle device views
   - Reorder sections
   - Save changes

## 📱 Mobile Support

The entire interface is mobile-responsive:
- Touch-optimized controls
- Collapsible navigation
- Responsive preview in builder
- Mobile-first forms

## ⚠️ Known Limitations (Prototype Phase)

- No actual data persistence (uses Zustand + localStorage)
- No backend API calls
- No real file uploads (uses placeholder URLs)
- No actual email sending
- No domain management
- No website publishing (mock status only)

## 🎯 Next Steps (After Review)

### Backend Integration (Phase 7+)
1. PostgreSQL database schema (multi-tenant)
2. Authentication (NextAuth.js or Clerk)
3. API routes for CRUD operations
4. S3/CloudFlare R2 for media storage
5. Resend API for email delivery
6. Rate limiting middleware
7. Server-side validation
8. Role-based permissions (API level)
9. SSL certificates
10. Domain management

### Additional Features (Future Phases)
- Media library with upload
- CRM interface (leads, tasks, notes)
- SEO tools per page
- Global styling customization
- Header/footer editors
- Form builder with custom fields
- Analytics dashboard
- Custom domain connection
- Website publishing workflow

## 💡 Tips

- **Save often** - Changes are in-memory until you click Save
- **Use demo accounts** - Try different roles to see permission differences
- **Mobile testing** - Use device view toggle in builder
- **Template exploration** - Check out all 3 templates for different styles

## 🐛 Issues?

If you encounter any issues after running `npm install`:
1. Make sure you fixed the npm cache permissions
2. Try clearing cache: `npm cache clean --force`
3. Delete `node_modules` and `.next` folders, then reinstall
4. Check Node.js version (requires v18+)

---

**Built with ❤️ using Next.js 14 and Shadcn/ui**
