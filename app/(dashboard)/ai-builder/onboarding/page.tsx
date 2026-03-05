'use client';

import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth';
import { useSiteProfileStore } from '@/lib/stores/siteProfile';
import { useToast } from '@/components/ui/use-toast';
import {
  SiteProfile,
  DEFAULT_SITE_PROFILE,
  AVAILABLE_PAGES,
  AVAILABLE_FEATURES,
  SOCIAL_PLATFORMS,
} from '@/lib/types/siteProfile';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ImageIcon,
  Plus,
  Search,
  Upload,
  X,
} from 'lucide-react';
import { getVisibleStartingPointTemplates } from '@/lib/templates/registry';

const TOTAL_STEPS = 8;

const STYLE_OPTIONS = [
  {
    id: 'luxury-classic',
    name: 'Luxury Classic',
    image: 'https://placehold.co/600x400/002349/ffffff?text=Luxury+Classic',
    description: 'Elegant serif fonts, navy palette, full-width hero imagery',
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    image: 'https://placehold.co/600x400/111827/ffffff?text=Modern+Minimal',
    description: 'Clean sans-serif, dark tones, rounded corners, lots of whitespace',
  },
  {
    id: 'warm-traditional',
    name: 'Warm Traditional',
    image: 'https://placehold.co/600x400/3d2b1f/f5e6d3?text=Warm+Traditional',
    description: 'Warm copper accents, classic typography, inviting feel',
  },
  {
    id: 'bold-contemporary',
    name: 'Bold Contemporary',
    image: 'https://placehold.co/600x400/0B0F19/C9A96E?text=Bold+Contemporary',
    description: 'High contrast, bold headings, strong visual impact',
  },
];

const BROKERAGE_LIBRARY = [
  { id: 'kw', name: 'Keller Williams', logo: 'https://placehold.co/120x60/cc0000/ffffff?text=KW' },
  { id: 'remax', name: 'RE/MAX', logo: 'https://placehold.co/120x60/003da5/ffffff?text=RE/MAX' },
  { id: 'cb', name: 'Coldwell Banker', logo: 'https://placehold.co/120x60/002D72/ffffff?text=CB' },
  { id: 'century21', name: 'Century 21', logo: 'https://placehold.co/120x60/b5985a/ffffff?text=C21' },
  { id: 'exp', name: 'eXp Realty', logo: 'https://placehold.co/120x60/1a1a2e/00b4d8?text=eXp' },
  { id: 'compass', name: 'Compass', logo: 'https://placehold.co/120x60/000000/ffffff?text=Compass' },
  { id: 'bhhs', name: 'Berkshire Hathaway', logo: 'https://placehold.co/120x60/4b2d5e/ffffff?text=BHHS' },
  { id: 'sothebys', name: "Sotheby's Intl", logo: 'https://placehold.co/120x60/002349/ffffff?text=SIR' },
];

const inputClass =
  'h-[38px] w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none';
const labelClass = 'block text-[13px] font-medium text-black mb-1';
const subtextClass = 'text-[11px] text-[#888C99]';

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { saveProfile } = useSiteProfileStore();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<SiteProfile>({ ...DEFAULT_SITE_PROFILE });
  const [brokerageSearch, setBrokerageSearch] = useState('');
  const [showBrokerageLibrary, setShowBrokerageLibrary] = useState(false);
  const [visibleSocials, setVisibleSocials] = useState<string[]>([]);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const brokerageLogoInputRef = useRef<HTMLInputElement>(null);

  const set = useCallback(
    <K extends keyof SiteProfile>(key: K, value: SiteProfile[K]) => {
      setProfile((p) => ({ ...p, [key]: value }));
    },
    []
  );

  const handleFileUpload = (field: 'personalLogo' | 'brokerageLogo', file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        set(field, reader.result);
        if (field === 'brokerageLogo') set('brokerageLogoSource', 'upload');
      }
    };
    reader.readAsDataURL(file);
  };

  const togglePage = (pageId: string) => {
    if (pageId === 'homepage') return;
    setProfile((p) => ({
      ...p,
      selectedPages: p.selectedPages.includes(pageId)
        ? p.selectedPages.filter((id) => id !== pageId)
        : [...p.selectedPages, pageId],
    }));
  };

  const toggleFeature = (featureId: string) => {
    setProfile((p) => ({
      ...p,
      selectedFeatures: p.selectedFeatures.includes(featureId)
        ? p.selectedFeatures.filter((id) => id !== featureId)
        : [...p.selectedFeatures, featureId],
    }));
  };

  const canContinue = () => {
    if (step === 1) return !!profile.agentName.trim();
    if (step === 3) return !!profile.contactName.trim() && !!profile.email.trim();
    return true;
  };

  const handleComplete = () => {
    if (!user) return;
    saveProfile(user.id, { ...profile, completedAt: new Date().toISOString() });
    toast({ title: 'Profile saved', description: 'Redirecting to the website builder...' });
    router.push('/ai-builder');
  };

  const filteredBrokerages = BROKERAGE_LIBRARY.filter((b) =>
    b.name.toLowerCase().includes(brokerageSearch.toLowerCase())
  );

  return (
    <div
      className="flex min-h-screen flex-col bg-[#F5F5F3]"
      style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}
    >
      {/* Progress */}
      <div className="border-b border-[#EBEBEB] bg-white px-6 py-4">
        <div className="mx-auto max-w-2xl">
          <div className="mb-2 flex items-center justify-between text-[12px] text-[#888C99]">
            <span>Step {step} of {TOTAL_STEPS}</span>
            <span>{Math.round((step / TOTAL_STEPS) * 100)}% complete</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#EBEBEB]">
            <div
              className="h-full rounded-full bg-[#DAFF07] transition-all duration-300"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="flex flex-1 items-start justify-center px-4 py-8">
        <div className="w-full max-w-2xl rounded-xl border border-[#EBEBEB] bg-white p-6 shadow-sm">
          {/* Step 1: Your Info */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-[18px] font-semibold text-black">Your Information</h2>
                <p className={subtextClass}>Tell us about yourself so we can personalize your website.</p>
              </div>
              <div>
                <label className={labelClass}>Agent Name *</label>
                <input className={inputClass} placeholder="Jane Smith" value={profile.agentName} onChange={(e) => set('agentName', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Brokerage Name <span className={subtextClass}>(optional)</span></label>
                <input className={inputClass} placeholder="Luxury Homes Realty" value={profile.brokerageName || ''} onChange={(e) => set('brokerageName', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Team Name <span className={subtextClass}>(optional)</span></label>
                <input className={inputClass} placeholder="The Smith Team" value={profile.teamName || ''} onChange={(e) => set('teamName', e.target.value)} />
              </div>
            </div>
          )}

          {/* Step 2: Logos */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-[18px] font-semibold text-black">Logos</h2>
                <p className={subtextClass}>Upload your personal and brokerage logos. SVG is ideal, PNG with transparent background recommended. JPEG and WebP are also accepted.</p>
              </div>
              <div>
                <label className={labelClass}>Personal / Team Logo</label>
                <input ref={logoInputRef} type="file" accept=".svg,.png,.jpg,.jpeg,.webp" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleFileUpload('personalLogo', e.target.files[0]); }} />
                {profile.personalLogo ? (
                  <div className="relative inline-block rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] p-4">
                    <img src={profile.personalLogo} alt="Logo preview" className="h-16 max-w-[200px] object-contain" />
                    <button type="button" onClick={() => set('personalLogo', undefined)} className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-white"><X className="h-3 w-3" /></button>
                  </div>
                ) : (
                  <button type="button" onClick={() => logoInputRef.current?.click()} className="flex h-24 w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#EBEBEB] text-[13px] text-[#888C99] hover:border-[#DAFF07] hover:text-black">
                    <Upload className="h-4 w-4" /> Upload logo
                  </button>
                )}
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className={labelClass}>Brokerage Logo</label>
                  <button type="button" onClick={() => setShowBrokerageLibrary((v) => !v)} className="text-[12px] text-[#888C99] hover:text-black flex items-center gap-1">
                    <Search className="h-3 w-3" /> {showBrokerageLibrary ? 'Upload instead' : 'Search library'}
                  </button>
                </div>
                <input ref={brokerageLogoInputRef} type="file" accept=".svg,.png,.jpg,.jpeg,.webp" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleFileUpload('brokerageLogo', e.target.files[0]); }} />
                {showBrokerageLibrary ? (
                  <div className="space-y-2">
                    <input className={inputClass} placeholder="Search brokerages..." value={brokerageSearch} onChange={(e) => setBrokerageSearch(e.target.value)} />
                    <div className="grid grid-cols-4 gap-2">
                      {filteredBrokerages.map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => { set('brokerageLogo', b.logo); set('brokerageLogoSource', 'library'); setShowBrokerageLibrary(false); }}
                          className={`flex flex-col items-center gap-1 rounded-lg border p-2 text-[11px] transition-colors ${profile.brokerageLogo === b.logo ? 'border-[#DAFF07] bg-[#DAFF07]/10' : 'border-[#EBEBEB] hover:border-[#DAFF07]'}`}
                        >
                          <img src={b.logo} alt={b.name} className="h-8 w-full object-contain" />
                          <span className="text-[#888C99]">{b.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : profile.brokerageLogo ? (
                  <div className="relative inline-block rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] p-4">
                    <img src={profile.brokerageLogo} alt="Brokerage logo" className="h-16 max-w-[200px] object-contain" />
                    <button type="button" onClick={() => set('brokerageLogo', undefined)} className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-white"><X className="h-3 w-3" /></button>
                  </div>
                ) : (
                  <button type="button" onClick={() => brokerageLogoInputRef.current?.click()} className="flex h-24 w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#EBEBEB] text-[13px] text-[#888C99] hover:border-[#DAFF07] hover:text-black">
                    <Upload className="h-4 w-4" /> Upload brokerage logo
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Contact */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-[18px] font-semibold text-black">Contact Information</h2>
                <p className={subtextClass}>This will appear in your website header, footer, and contact page.</p>
              </div>
              <div>
                <label className={labelClass}>Contact Name *</label>
                <input className={inputClass} placeholder="Jane Smith" value={profile.contactName} onChange={(e) => set('contactName', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Email *</label>
                <input className={inputClass} type="email" placeholder="jane@example.com" value={profile.email} onChange={(e) => set('email', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Phone <span className={subtextClass}>(optional)</span></label>
                <input className={inputClass} type="tel" placeholder="(555) 123-4567" value={profile.phone || ''} onChange={(e) => set('phone', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Office Address <span className={subtextClass}>(optional)</span></label>
                <input className={inputClass} placeholder="123 Market St, Austin, TX 78701" value={profile.officeAddress || ''} onChange={(e) => set('officeAddress', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Website URL <span className={subtextClass}>(optional)</span></label>
                <input className={inputClass} placeholder="https://janesmith.com" value={profile.websiteUrl || ''} onChange={(e) => set('websiteUrl', e.target.value)} />
              </div>
            </div>
          )}

          {/* Step 4: Social Media */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-[18px] font-semibold text-black">Social Media</h2>
                <p className={subtextClass}>Add your social media profiles. These will be linked in your website footer and header.</p>
              </div>
              <div className="space-y-3">
                {SOCIAL_PLATFORMS.map((platform) => {
                  const isVisible = visibleSocials.includes(platform.id);
                  const value = profile.social[platform.id as keyof typeof profile.social] || '';
                  if (!isVisible && !value) return null;
                  return (
                    <div key={platform.id} className="flex items-center gap-2">
                      <span className="w-24 text-[13px] text-[#888C99]">{platform.label}</span>
                      <input
                        className={inputClass + ' flex-1'}
                        placeholder={platform.placeholder}
                        value={value}
                        onChange={(e) =>
                          setProfile((p) => ({
                            ...p,
                            social: { ...p.social, [platform.id]: e.target.value },
                          }))
                        }
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setVisibleSocials((v) => v.filter((id) => id !== platform.id));
                          setProfile((p) => {
                            const next = { ...p.social };
                            delete next[platform.id as keyof typeof next];
                            return { ...p, social: next };
                          });
                        }}
                        className="flex h-[38px] w-[38px] items-center justify-center rounded-lg border border-[#EBEBEB] text-[#888C99] hover:text-black"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
              {SOCIAL_PLATFORMS.filter(
                (p) => !visibleSocials.includes(p.id) && !profile.social[p.id as keyof typeof profile.social]
              ).length > 0 && (
                <div>
                  <p className="mb-2 text-[12px] text-[#888C99]">Add a platform:</p>
                  <div className="flex flex-wrap gap-2">
                    {SOCIAL_PLATFORMS.filter(
                      (p) => !visibleSocials.includes(p.id) && !profile.social[p.id as keyof typeof profile.social]
                    ).map((platform) => (
                      <button
                        key={platform.id}
                        type="button"
                        onClick={() => setVisibleSocials((v) => [...v, platform.id])}
                        className="inline-flex h-[30px] items-center gap-1 rounded-lg border border-[#EBEBEB] bg-white px-3 text-[12px] text-[#888C99] hover:border-[#DAFF07] hover:text-black"
                      >
                        <Plus className="h-3 w-3" /> {platform.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 5: About */}
          {step === 5 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-[18px] font-semibold text-black">About You</h2>
                <p className={subtextClass}>Tell potential clients about yourself. This will be used in your About section.</p>
              </div>
              <div>
                <label className={labelClass}>About Me</label>
                <textarea
                  className="w-full resize-none rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] p-3 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none"
                  rows={5}
                  placeholder="With over 10 years of experience in luxury real estate, I specialize in helping clients find their dream homes..."
                  value={profile.aboutMe}
                  onChange={(e) => set('aboutMe', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Target Areas / Neighborhoods</label>
                <input
                  className={inputClass}
                  placeholder="Austin, Westlake, Lakeway, Bee Cave"
                  value={profile.targetAreas}
                  onChange={(e) => set('targetAreas', e.target.value)}
                />
                <p className={subtextClass + ' mt-1'}>Cities or neighborhoods you specialize in, separated by commas.</p>
              </div>
            </div>
          )}

          {/* Step 6: Brand */}
          {step === 6 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-[18px] font-semibold text-black">Brand Colors & Fonts</h2>
                <p className={subtextClass}>Set your brand identity. You can always change these later.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={profile.primaryColor}
                      onChange={(e) => set('primaryColor', e.target.value)}
                      className="h-[38px] w-[38px] cursor-pointer rounded-lg border border-[#EBEBEB]"
                    />
                    <input
                      className={inputClass + ' flex-1'}
                      value={profile.primaryColor}
                      onChange={(e) => set('primaryColor', e.target.value)}
                      placeholder="#002349"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Secondary Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={profile.secondaryColor}
                      onChange={(e) => set('secondaryColor', e.target.value)}
                      className="h-[38px] w-[38px] cursor-pointer rounded-lg border border-[#EBEBEB]"
                    />
                    <input
                      className={inputClass + ' flex-1'}
                      value={profile.secondaryColor}
                      onChange={(e) => set('secondaryColor', e.target.value)}
                      placeholder="#DAFF07"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className={labelClass}>Custom Fonts <span className={subtextClass}>(optional)</span></label>
                <p className={subtextClass + ' mb-2'}>Enter Google Font names or upload your own font files.</p>
                <div className="space-y-2">
                  <div>
                    <span className="text-[12px] text-[#888C99]">Heading Font</span>
                    <input className={inputClass} placeholder="e.g. Playfair Display" value={profile.fonts?.heading || ''} onChange={(e) => set('fonts', { ...profile.fonts, heading: e.target.value })} />
                  </div>
                  <div>
                    <span className="text-[12px] text-[#888C99]">Body Font</span>
                    <input className={inputClass} placeholder="e.g. DM Sans" value={profile.fonts?.body || ''} onChange={(e) => set('fonts', { ...profile.fonts, body: e.target.value })} />
                  </div>
                  <div>
                    <span className="text-[12px] text-[#888C99]">Subheading Font</span>
                    <input className={inputClass} placeholder="e.g. Inter" value={profile.fonts?.subheading || ''} onChange={(e) => set('fonts', { ...profile.fonts, subheading: e.target.value })} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 7: Pages & Features */}
          {step === 7 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-[18px] font-semibold text-black">Pages & Features</h2>
                <p className={subtextClass}>Select which pages and features you want on your website.</p>
              </div>
              <div>
                <label className={labelClass}>Pages</label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {AVAILABLE_PAGES.map((page) => {
                    const checked = profile.selectedPages.includes(page.id);
                    return (
                      <button
                        key={page.id}
                        type="button"
                        disabled={'locked' in page && page.locked}
                        onClick={() => togglePage(page.id)}
                        className={`flex h-[38px] items-center gap-2 rounded-lg border px-3 text-[13px] transition-colors ${
                          checked
                            ? 'border-[#DAFF07] bg-[#DAFF07]/10 text-black'
                            : 'border-[#EBEBEB] text-[#888C99] hover:border-[#DAFF07]'
                        } ${'locked' in page && page.locked ? 'opacity-70' : ''}`}
                      >
                        <div className={`flex h-4 w-4 items-center justify-center rounded border ${checked ? 'border-[#DAFF07] bg-[#DAFF07]' : 'border-[#CCCCCC]'}`}>
                          {checked && <Check className="h-3 w-3 text-black" />}
                        </div>
                        {page.label}
                        {'locked' in page && page.locked && <span className="text-[10px] text-[#888C99]">(required)</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className={labelClass}>Additional Features</label>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_FEATURES.map((feature) => {
                    const checked = profile.selectedFeatures.includes(feature.id);
                    return (
                      <button
                        key={feature.id}
                        type="button"
                        onClick={() => toggleFeature(feature.id)}
                        className={`flex h-[38px] items-center gap-2 rounded-lg border px-3 text-[13px] transition-colors ${
                          checked
                            ? 'border-[#DAFF07] bg-[#DAFF07]/10 text-black'
                            : 'border-[#EBEBEB] text-[#888C99] hover:border-[#DAFF07]'
                        }`}
                      >
                        <div className={`flex h-4 w-4 items-center justify-center rounded border ${checked ? 'border-[#DAFF07] bg-[#DAFF07]' : 'border-[#CCCCCC]'}`}>
                          {checked && <Check className="h-3 w-3 text-black" />}
                        </div>
                        {feature.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 8: Choose a Starting Point */}
          {step === 8 && (() => {
            const startingPoints = getVisibleStartingPointTemplates();
            return (
              <div className="space-y-5">
                <div>
                  <h2 className="text-[18px] font-semibold text-black">Choose Your Starting Point</h2>
                  <p className={subtextClass}>Pick a fully-built template to start from, or choose an AI style to generate from scratch.</p>
                </div>

                {startingPoints.length > 0 && (
                  <div>
                    <p className="mb-2 text-[13px] font-medium text-black">Built-Out Templates</p>
                    <p className="mb-3 text-[11px] text-[#888C99]">Start with a complete website. Your info and branding will be applied automatically.</p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {startingPoints.map((spt) => (
                        <button
                          key={spt.id}
                          type="button"
                          onClick={() => set('preferredTemplateId', spt.id)}
                          className={`overflow-hidden rounded-xl border-2 text-left transition-colors ${
                            profile.preferredTemplateId === spt.id
                              ? 'border-[#DAFF07] ring-2 ring-[#DAFF07]/30'
                              : 'border-[#EBEBEB] hover:border-[#DAFF07]'
                          }`}
                        >
                          <img src={spt.previewImage} alt={spt.name} className="h-36 w-full object-cover" />
                          <div className="p-3">
                            <div className="flex items-center gap-2">
                              <p className="text-[13px] font-medium text-black">{spt.name}</p>
                              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">Ready to use</span>
                            </div>
                            <p className="mt-0.5 text-[11px] text-[#888C99]">{spt.description}</p>
                            <div className="mt-2 flex flex-wrap gap-1">
                              <span className="rounded-full bg-[#F5F5F3] px-2 py-0.5 text-[10px] text-[#888C99]">{spt.pages.length} pages</span>
                              <span className="rounded-full bg-[#F5F5F3] px-2 py-0.5 text-[10px] text-[#888C99]">{spt.sampleListingsCount} listings</span>
                              <span className="rounded-full bg-[#F5F5F3] px-2 py-0.5 text-[10px] text-[#888C99]">{spt.sampleBlogPostsCount} blog posts</span>
                            </div>
                            <div className="mt-2 flex items-center gap-1.5">
                              {Object.values(spt.colors).slice(0, 3).map((color, i) => (
                                <span key={i} className="inline-block h-3.5 w-3.5 rounded-full border border-[#EBEBEB]" style={{ backgroundColor: color }} />
                              ))}
                              <span className="text-[10px] text-[#888C99]">{spt.fonts.heading} / {spt.fonts.body}</span>
                            </div>
                          </div>
                          {profile.preferredTemplateId === spt.id && (
                            <div className="flex items-center gap-1 border-t border-[#EBEBEB] bg-[#DAFF07]/10 px-3 py-1.5">
                              <Check className="h-3.5 w-3.5 text-black" />
                              <span className="text-[12px] font-medium text-black">Selected</span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <div className="my-3 flex items-center gap-3">
                    <div className="h-px flex-1 bg-[#EBEBEB]" />
                    <span className="text-[11px] text-[#888C99]">or generate with AI</span>
                    <div className="h-px flex-1 bg-[#EBEBEB]" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {STYLE_OPTIONS.map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => set('preferredTemplateId', style.id)}
                        className={`overflow-hidden rounded-xl border-2 text-left transition-colors ${
                          profile.preferredTemplateId === style.id
                            ? 'border-[#DAFF07] ring-2 ring-[#DAFF07]/30'
                            : 'border-[#EBEBEB] hover:border-[#DAFF07]'
                        }`}
                      >
                        <img src={style.image} alt={style.name} className="h-24 w-full object-cover" />
                        <div className="p-2.5">
                          <p className="text-[13px] font-medium text-black">{style.name}</p>
                          <p className="text-[11px] text-[#888C99]">{style.description}</p>
                        </div>
                        {profile.preferredTemplateId === style.id && (
                          <div className="flex items-center gap-1 border-t border-[#EBEBEB] bg-[#DAFF07]/10 px-3 py-1.5">
                            <Check className="h-3.5 w-3.5 text-black" />
                            <span className="text-[12px] font-medium text-black">Selected</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Additional Notes <span className={subtextClass}>(optional)</span></label>
                  <textarea
                    className="w-full resize-none rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] p-3 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none"
                    rows={3}
                    placeholder="Any other details about your website preferences..."
                    value={profile.additionalNotes || ''}
                    onChange={(e) => set('additionalNotes', e.target.value)}
                  />
                </div>
              </div>
            );
          })()}

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between border-t border-[#EBEBEB] pt-4">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="inline-flex h-[36px] items-center gap-1.5 rounded-lg border border-[#EBEBEB] bg-white px-4 text-[13px] text-black hover:bg-[#F5F5F3]"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </button>
            ) : (
              <div />
            )}
            {step < TOTAL_STEPS ? (
              <button
                type="button"
                disabled={!canContinue()}
                onClick={() => setStep((s) => s + 1)}
                className="inline-flex h-[36px] items-center gap-1.5 rounded-lg bg-[#DAFF07] px-4 text-[13px] font-medium text-black hover:bg-[#C8ED00] disabled:opacity-40"
              >
                Continue <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleComplete}
                className="inline-flex h-[36px] items-center gap-1.5 rounded-lg bg-[#DAFF07] px-4 text-[13px] font-medium text-black hover:bg-[#C8ED00]"
              >
                <Check className="h-3.5 w-3.5" /> Complete Setup
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
