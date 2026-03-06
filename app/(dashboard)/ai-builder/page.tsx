'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { useToast } from '@/components/ui/use-toast';
import { useAuthStore } from '@/lib/stores/auth';
import { useWebsiteStore } from '@/lib/stores/website';
import { useSiteProfileStore } from '@/lib/stores/siteProfile';
import { useTemplateCatalogStore, getTemplateFromAsset } from '@/lib/stores/templateCatalog';
import { useListingsStore } from '@/lib/stores/listings';
import { BuilderBlueprint } from '@/lib/ai/builderBlueprint';
import { getDefaultHeaderConfig } from '@/lib/header-config';
import { getDefaultFooterConfig } from '@/lib/footer-config';
import {
  Check,
  Eye,
  Globe,
  LayoutGrid,
  Loader2,
  Plus,
  Save,
  Send,
  Undo2,
  X,
} from 'lucide-react';

type ChatRole = 'user' | 'assistant';

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

interface BuilderApiResponse {
  provider: 'claude';
  reply: string;
  blueprint: BuilderBlueprint;
  previewHtml: string;
  previewCss: string;
}

/* -------------------------------------------------------------------------- */
/*  INLINE EDITING SCRIPT — injected into the preview iframe                  */
/* -------------------------------------------------------------------------- */
const INLINE_EDIT_SCRIPT = `
<script>
(function(){
  function isCms(el){
    while(el&&el!==document){if(el.matches&&el.matches('[data-source]'))return el;el=el.parentElement;}
    return null;
  }
  function cmsLabel(el){
    var s=isCms(el);if(!s)return null;
    var v=s.getAttribute('data-source');
    if(v==='cms-listings')return 'Listings';
    if(v==='cms-blogs')return 'Blogs';
    return v;
  }

  var css=document.createElement('style');
  css.textContent=[
    '[data-editable]:hover{outline:2px solid rgba(0,35,73,.35);outline-offset:2px;cursor:text}',
    '[data-editable]:focus{outline:2px solid #002349;outline-offset:2px;background:rgba(0,35,73,.04)}',
    '[data-cms-text]:hover{outline:2px dashed rgba(124,58,237,.45);outline-offset:2px;cursor:pointer}',
    'img[data-cms]:hover{outline:2px dashed rgba(124,58,237,.45);outline-offset:2px;cursor:pointer}',
    '.img-wrap{position:relative;cursor:pointer}',
    '.img-wrap:hover img:not([data-cms]){outline:2px solid rgba(0,35,73,.35);outline-offset:2px}',
    '.img-edit-overlay{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;background:rgba(0,0,0,.55);color:#fff;font-size:13px;font-family:system-ui,sans-serif;pointer-events:none;opacity:0;transition:opacity .2s;z-index:2;border-radius:4px}',
    '.img-wrap:hover .img-edit-overlay{opacity:1}',
    '.ep{position:fixed;z-index:10000;background:#fff;border-radius:10px;box-shadow:0 4px 24px rgba(0,0,0,.15);font-family:system-ui,sans-serif;font-size:13px;color:#111;padding:12px;min-width:220px;max-width:280px}',
    '.ep-bk{position:fixed;inset:0;z-index:9999}',
    '.cms-badge{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;background:#F3F0FF;border:1px solid #E0D6FF;border-radius:6px;color:#7C3AED;font-size:12px;font-weight:500;margin-bottom:8px}',
    '.loop-badge{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;background:#FEF3C7;border:1px solid #FDE68A;border-radius:5px;color:#92400E;font-size:11px;font-weight:500;margin-bottom:6px}',
    '.unlink-btn{display:inline-flex;align-items:center;gap:4px;padding:5px 10px;border:1px solid #EBEBEB;border-radius:6px;background:#fff;font-size:12px;cursor:pointer;color:#888;transition:all .15s}',
    '.unlink-btn:hover{background:#FEE2E2;color:#DC2626;border-color:#FECACA}',
    '.ip-btn{display:flex;align-items:center;gap:8px;width:100%;padding:8px 12px;border:1px solid #EBEBEB;border-radius:8px;background:#fff;font-size:13px;cursor:pointer;color:#111;transition:background .15s}',
    '.ip-btn:hover{background:#F5F5F3}',
    '.ip-url{display:flex;gap:6px;margin-top:8px}',
    '.ip-url input{flex:1;padding:6px 8px;border:1px solid #EBEBEB;border-radius:6px;font-size:12px;outline:none}',
    '.ip-url input:focus{border-color:#DAFF07}',
    '.ip-url button{padding:6px 12px;background:#DAFF07;border:none;border-radius:6px;font-size:12px;font-weight:500;cursor:pointer}',
    '.cg{display:grid;grid-template-columns:repeat(8,1fr);gap:3px;margin-bottom:8px}',
    '.cs{width:24px;height:24px;border-radius:5px;cursor:pointer;border:2px solid transparent;transition:border-color .15s,transform .1s}',
    '.cs:hover{border-color:#002349;transform:scale(1.15)}',
    '.chi{width:100%;padding:6px 8px;border:1px solid #EBEBEB;border-radius:6px;font-size:12px;font-family:monospace;outline:none}',
    '.chi:focus{border-color:#DAFF07}',
    '.cmt{display:flex;gap:2px;margin-bottom:8px;background:#F5F5F3;border-radius:6px;padding:2px}',
    '.cmt button{flex:1;padding:4px 8px;border-radius:5px;font-size:12px;text-align:center;cursor:pointer;border:none;background:transparent;color:#888;font-weight:500}',
    '.cmt button.on{background:#fff;color:#111;box-shadow:0 1px 3px rgba(0,0,0,.08)}',
    '[data-loop-item]:hover{outline:2px dashed rgba(124,58,237,.25);outline-offset:2px}'
  ].join('\\n');
  document.head.appendChild(css);

  var pop=null,bk=null,pendImg=null,cTarget=null,cMode='text';

  var fi=document.createElement('input');
  fi.type='file';fi.accept='image/*';fi.style.display='none';
  document.body.appendChild(fi);
  fi.addEventListener('change',function(){
    if(!fi.files||!fi.files[0]||!pendImg)return;
    var r=new FileReader();
    r.onload=function(){if(pendImg&&typeof r.result==='string'){pendImg.src=r.result;sync();}pendImg=null;};
    r.readAsDataURL(fi.files[0]);fi.value='';
  });

  function dismiss(){
    if(pop){pop.parentNode.removeChild(pop);pop=null;}
    if(bk){bk.parentNode.removeChild(bk);bk=null;}
  }
  function showPop(html,x,y){
    dismiss();
    bk=document.createElement('div');bk.className='ep-bk';
    bk.addEventListener('click',function(e){e.stopPropagation();dismiss();});
    document.body.appendChild(bk);
    pop=document.createElement('div');pop.className='ep';pop.innerHTML=html;
    pop.style.left=Math.min(x,window.innerWidth-290)+'px';
    pop.style.top=Math.min(y,window.innerHeight-320)+'px';
    document.body.appendChild(pop);
    return pop;
  }

  document.querySelectorAll('[data-source]').forEach(function(sec){
    var containers=[sec];
    sec.querySelectorAll('*').forEach(function(el){
      var d=getComputedStyle(el).display;
      if((d==='grid'||d==='flex')&&el.children.length>1)containers.push(el);
    });
    containers.forEach(function(c){
      if(c.children.length<2)return;
      var tag=c.children[0].tagName,same=true;
      for(var i=1;i<c.children.length;i++){if(c.children[i].tagName!==tag){same=false;break;}}
      if(same){for(var j=0;j<c.children.length;j++)c.children[j].setAttribute('data-loop-item','');}
    });
  });

  var LINK_ICON='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>';
  var UNLINK_ICON='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18.84 12.25l1.72-1.71a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M5.16 11.75l-1.72 1.71a5 5 0 007.07 7.07l1.72-1.71"/><line x1="2" y1="2" x2="22" y2="22"/></svg>';
  var LOOP_ICON='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 2l4 4-4 4"/><path d="M3 11v-1a4 4 0 014-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v1a4 4 0 01-4 4H3"/></svg>';
  var UPLOAD_ICON='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>';
  var IMG_ICON='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>';

  var SEL='h1,h2,h3,h4,h5,h6,p,span,strong,em,li,blockquote,a,.listing-price,.listing-address,.listing-details,.listing-cta,.eyebrow,.subtitle,.brand,.footer-brand,label,button,td,th';
  document.querySelectorAll(SEL).forEach(function(el){
    if(el.closest('form'))return;
    if(el.querySelector('img'))return;
    var src=cmsLabel(el);
    if(src){
      el.setAttribute('data-cms-text',src);
      el.addEventListener('click',function(e){
        e.preventDefault();e.stopPropagation();
        var r=el.getBoundingClientRect();
        var isLoop=!!el.closest('[data-loop-item]');
        var h=(isLoop?'<div class="loop-badge">'+LOOP_ICON+'Repeating item \\u2014 shared layout</div>':'')+
          '<div class="cms-badge">'+LINK_ICON+'Linked to: '+src+'</div>'+
          '<p style="color:#888;font-size:12px;margin:0 0 8px">This content is populated from your '+src+' data.</p>'+
          '<button class="unlink-btn" data-act="unlink">'+UNLINK_ICON+'Unlink from '+src+'</button>';
        var p=showPop(h,r.left,r.bottom+8);
        p.querySelector('[data-act="unlink"]').addEventListener('click',function(){
          el.removeAttribute('data-cms-text');
          el.setAttribute('data-editable','');
          el.setAttribute('contenteditable','true');
          el.setAttribute('spellcheck','false');
          el.addEventListener('blur',function(){sync();});
          el.addEventListener('keydown',function(ev){if(ev.key==='Enter'&&!ev.shiftKey){ev.preventDefault();el.blur();}});
          dismiss();
        });
      });
    }else{
      el.setAttribute('data-editable','');
      el.setAttribute('contenteditable','true');
      el.setAttribute('spellcheck','false');
      el.addEventListener('blur',function(){sync();});
      el.addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();el.blur();}});
    }
  });

  document.querySelectorAll('img').forEach(function(img){
    img.addEventListener('error',function(){
      if(!img.getAttribute('data-filler'))
        {img.setAttribute('data-filler','1');img.src='https://placehold.co/800x600/e5e7eb/9ca3af?text=Image';}
    });
    if(img.hasAttribute('data-cms')){
      img.style.cursor='pointer';
      img.addEventListener('click',function(e){
        e.preventDefault();e.stopPropagation();
        var r=img.getBoundingClientRect();
        showPop('<div class="cms-badge">'+LINK_ICON+'CMS Image</div><p style="color:#888;font-size:12px;margin:0">This image is linked to your CMS content.</p>',r.left,r.bottom+8);
      });
      return;
    }
    var par=img.parentElement;if(!par)return;
    var w=document.createElement('div');w.className='img-wrap';
    w.style.display=getComputedStyle(par).display==='flex'?'flex':'block';
    if(img.style.position==='absolute'){
      w.style.position='absolute';w.style.inset=img.style.inset||'0';
      w.style.width=img.style.width||'100%';w.style.height=img.style.height||'100%';
      img.style.position='relative';img.style.inset='auto';
    }
    par.insertBefore(w,img);w.appendChild(img);
    var ov=document.createElement('div');ov.className='img-edit-overlay';
    ov.innerHTML=IMG_ICON+'<strong style="font-size:13px">Click to change</strong>';
    w.appendChild(ov);
    w.addEventListener('click',function(e){
      e.preventDefault();e.stopPropagation();
      var r=w.getBoundingClientRect();
      var h='<p style="font-weight:600;margin:0 0 10px">Change Image</p>'+
        '<button class="ip-btn" data-act="upload">'+UPLOAD_ICON+'Upload from device</button>'+
        '<div style="margin:8px 0 4px;font-size:11px;color:#888;text-align:center">or</div>'+
        '<div class="ip-url"><input placeholder="Paste image URL" /><button data-act="url">Apply</button></div>';
      var p=showPop(h,r.left,r.bottom+8);
      p.querySelector('[data-act="upload"]').addEventListener('click',function(){pendImg=img;fi.click();dismiss();});
      var inp=p.querySelector('.ip-url input');
      function applyUrl(){var u=inp.value.trim();if(u){img.src=u;sync();}dismiss();}
      p.querySelector('[data-act="url"]').addEventListener('click',applyUrl);
      inp.addEventListener('keydown',function(ev){if(ev.key==='Enter')applyUrl();});
    });
  });

  var COLORS=[
    '#000000','#1a1a1a','#333333','#555555','#777777','#999999','#cccccc','#ffffff',
    '#002349','#0D47A1','#1565C0','#1976D2','#1E88E5','#42A5F5','#64B5F6','#90CAF9',
    '#1B5E20','#2E7D32','#388E3C','#43A047','#4CAF50','#66BB6A','#81C784','#A5D6A7',
    '#B71C1C','#C62828','#D32F2F','#E53935','#F44336','#EF5350','#E57373','#EF9A9A',
    '#E65100','#EF6C00','#F57C00','#FB8C00','#FF9800','#FFA726','#FFB74D','#FFCC80',
    '#4A148C','#6A1B9A','#7B1FA2','#8E24AA','#9C27B0','#AB47BC','#BA68C8','#CE93D8',
    '#004D40','#00695C','#00796B','#00897B','#009688','#26A69A','#4DB6AC','#80CBC4',
    '#F57F17','#F9A825','#FBC02D','#FDD835','#FFEB3B','#FFF176','#FFF59D','#FFF9C4'
  ];
  function showColorPicker(el,x,y){
    cTarget=el;cMode='text';
    var sw='';for(var i=0;i<COLORS.length;i++){
      sw+='<div class="cs" data-c="'+COLORS[i]+'" style="background:'+COLORS[i]+(COLORS[i]==='#ffffff'?';border:1px solid #ddd':'')+'">';
      sw+='</div>';
    }
    var h='<p style="font-weight:600;margin:0 0 8px">Color</p>'+
      '<div class="cmt"><button class="on" data-m="text">Text</button><button data-m="background">Background</button></div>'+
      '<div class="cg">'+sw+'</div>'+
      '<input class="chi" placeholder="#000000" />';
    var p=showPop(h,x,y);
    var tabs=p.querySelectorAll('.cmt button');
    tabs.forEach(function(t){t.addEventListener('click',function(){
      tabs.forEach(function(b){b.classList.remove('on');});t.classList.add('on');
      cMode=t.getAttribute('data-m');
    });});
    p.querySelectorAll('.cs').forEach(function(s){s.addEventListener('click',function(){
      applyC(s.getAttribute('data-c'));dismiss();
    });});
    var hi=p.querySelector('.chi');
    hi.addEventListener('keydown',function(ev){
      if(ev.key==='Enter'){
        var v=hi.value.trim();if(v[0]!=='#')v='#'+v;
        if(/^#[0-9a-fA-F]{3,8}$/.test(v)){applyC(v);dismiss();}
      }
    });
  }
  function applyC(c){if(!cTarget)return;if(cMode==='text')cTarget.style.color=c;else cTarget.style.backgroundColor=c;sync();}

  document.addEventListener('click',function(e){
    var t=e.target;
    if(t.closest('.ep')||t.classList.contains('ep-bk'))return;
    if(t.hasAttribute('data-editable')||t.hasAttribute('data-cms-text'))return;
    if(t.tagName==='IMG'||t.closest('.img-wrap'))return;
    if(t.closest('form'))return;
    var m=t.closest('section,header,footer,div,nav,main,article,aside');
    if(m&&!isCms(m)){e.preventDefault();showColorPicker(m,e.clientX,e.clientY);}
  });

  document.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();});});
  document.querySelectorAll('form button,form input[type=submit]').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();});});

  function sync(){
    var root=document.querySelector('.site-root')||document.body;
    var cl=root.cloneNode(true);
    cl.querySelectorAll('.img-wrap').forEach(function(wr){
      var im=wr.querySelector('img');if(im){wr.parentNode.insertBefore(im.cloneNode(true),wr);}wr.parentNode.removeChild(wr);
    });
    cl.querySelectorAll('.img-edit-overlay,.ep,.ep-bk').forEach(function(o){o.parentNode.removeChild(o);});
    cl.querySelectorAll('[data-editable]').forEach(function(el){el.removeAttribute('data-editable');el.removeAttribute('contenteditable');el.removeAttribute('spellcheck');});
    cl.querySelectorAll('[data-cms-text]').forEach(function(el){el.removeAttribute('data-cms-text');});
    cl.querySelectorAll('[data-loop-item]').forEach(function(el){el.removeAttribute('data-loop-item');});
    cl.querySelectorAll('[data-filler]').forEach(function(el){el.removeAttribute('data-filler');});
    window.parent.postMessage({type:'preview-html-update',html:cl.outerHTML},'*');
  }
})();
<\/script>`;

const MAX_UNDO = 30;

/* -------------------------------------------------------------------------- */
/*  Page Component                                                            */
/* -------------------------------------------------------------------------- */
export default function AiBuilderPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { websites, addWebsite, updateWebsite, publishWebsite } = useWebsiteStore();
  const { hasCompletedOnboarding, getProfileForUser } = useSiteProfileStore();
  const { getAssetsForUser } = useTemplateCatalogStore();
  const { seedCountryTemplateListings: seedCountryListings } = useListingsStore();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Describe the real-estate website you want. I will generate a real-estate-only site with CMS Listings and CMS Blogs sections.',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [lastProvider, setLastProvider] = useState<'claude' | null>(null);
  const [lastBlueprint, setLastBlueprint] = useState<BuilderBlueprint | null>(null);
  const [previewHtml, setPreviewHtml] = useState('');
  const [previewCss, setPreviewCss] = useState('');
  const [savedWebsiteId, setSavedWebsiteId] = useState<string | null>(null);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [showStartingPoints, setShowStartingPoints] = useState(false);
  const hasHydrated = useRef(false);

  /* ---- undo history ---- */
  const [htmlHistory, setHtmlHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const pushHistory = useCallback((html: string) => {
    if (!html) return;
    setHtmlHistory((prev) => {
      const next = [...prev.slice(0, historyIndex + 1), html];
      if (next.length > MAX_UNDO) next.shift();
      return next;
    });
    setHistoryIndex((prev) => Math.min(prev + 1, MAX_UNDO - 1));
  }, [historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    setPreviewHtml(htmlHistory[newIndex]);
  }, [historyIndex, htmlHistory]);

  const canUndo = historyIndex > 0;

  /* ---- redirect to onboarding if not completed ---- */
  useEffect(() => {
    if (!user) return;
    if (!hasCompletedOnboarding(user.id)) {
      router.replace('/ai-builder/onboarding');
    }
  }, [user, hasCompletedOnboarding, router]);

  /* ---- auto-load saved site OR starting point template on mount ---- */
  const templateLoadAttempted = useRef(false);

  useEffect(() => {
    if (hasHydrated.current || !user) return;

    const saved = websites.find(
      (w) => w.userId === user.id && w.templateId === 'ai-builder' && w.aiPreviewHtml
    );
    if (saved) {
      setPreviewHtml(saved.aiPreviewHtml!);
      setPreviewCss(saved.aiPreviewCss || '');
      setSavedWebsiteId(saved.id);
      if (saved.aiBlueprint) {
        setLastBlueprint(saved.aiBlueprint as unknown as BuilderBlueprint);
      }
      if (saved.published && saved.domains?.platformUrl) {
        setPublishedUrl(saved.domains.platformUrl);
      }
      pushHistory(saved.aiPreviewHtml!);
      toast({ title: 'Site loaded', description: `"${saved.name}" has been restored from your last save.` });
      hasHydrated.current = true;
      return;
    }

    // No saved site — check if user selected a starting point template
    if (!templateLoadAttempted.current) {
      templateLoadAttempted.current = true;
      const siteProfile = getProfileForUser(user.id);
      const templateId = siteProfile?.preferredTemplateId;

      if (templateId && templateId.startsWith('starting-point-')) {
        setLoading(true);
        const profilePayload = siteProfile ? {
          agentName: siteProfile.agentName,
          brokerageName: siteProfile.brokerageName,
          teamName: siteProfile.teamName,
          contactName: siteProfile.contactName,
          email: siteProfile.email,
          phone: siteProfile.phone,
          officeAddress: siteProfile.officeAddress,
          aboutMe: siteProfile.aboutMe,
          targetAreas: siteProfile.targetAreas,
          social: siteProfile.social as Record<string, string>,
          personalLogo: siteProfile.personalLogo,
          brokerageLogo: siteProfile.brokerageLogo,
        } : undefined;

        fetch('/api/ai/builder/from-template', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ templateId, siteProfile: profilePayload }),
        })
          .then((res) => res.json())
          .then((payload) => {
            if (payload.previewHtml) {
              setPreviewHtml(payload.previewHtml);
              setPreviewCss(payload.previewCss || '');
              setLastBlueprint(payload.blueprint || null);
              pushHistory(payload.previewHtml);
              if (payload.seedListings && user) {
                seedCountryListings(user.id);
              }
              setMessages((prev) => [...prev, {
                id: `a_template_${Date.now()}`,
                role: 'assistant',
                content: payload.reply || 'Your template-based site is ready. You can edit text and images directly, or ask me to make changes.',
              }]);
            }
          })
          .catch(() => {
            toast({ variant: 'destructive', title: 'Template load failed', description: 'Could not load the starting point template.' });
          })
          .finally(() => setLoading(false));
      }
    }

    hasHydrated.current = true;
  }, [user, websites, toast, pushHistory, getProfileForUser, seedCountryListings]);

  /* ---- listen for edits from iframe ---- */
  const handlePreviewMessage = useCallback((event: MessageEvent) => {
    if (event.data?.type === 'preview-html-update' && typeof event.data.html === 'string') {
      setPreviewHtml((prev) => {
        if (prev) pushHistory(prev);
        return event.data.html;
      });
    }
  }, [pushHistory]);

  useEffect(() => {
    window.addEventListener('message', handlePreviewMessage);
    return () => window.removeEventListener('message', handlePreviewMessage);
  }, [handlePreviewMessage]);

  /* ---- AI chat prompt submission ---- */
  const submitPrompt = async () => {
    if (!prompt.trim()) return;
    const userMessage: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: prompt.trim(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    const siteProfile = user ? getProfileForUser(user.id) : null;
    const profilePayload = siteProfile
      ? {
          agentName: siteProfile.agentName,
          brokerageName: siteProfile.brokerageName,
          teamName: siteProfile.teamName,
          contactName: siteProfile.contactName,
          email: siteProfile.email,
          phone: siteProfile.phone,
          officeAddress: siteProfile.officeAddress,
          aboutMe: siteProfile.aboutMe,
          targetAreas: siteProfile.targetAreas,
          primaryColor: siteProfile.primaryColor,
          secondaryColor: siteProfile.secondaryColor,
          fontHeading: siteProfile.fonts?.heading,
          fontBody: siteProfile.fonts?.body,
          selectedPages: siteProfile.selectedPages,
          selectedFeatures: siteProfile.selectedFeatures,
          additionalNotes: siteProfile.additionalNotes,
          preferredTemplateId: siteProfile.preferredTemplateId,
          social: siteProfile.social as Record<string, string>,
        }
      : undefined;

    try {
      const response = await fetch('/api/ai/builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          conversation: [...messages, userMessage].map((message) => ({
            role: message.role,
            content: message.content,
          })),
          siteProfile: profilePayload,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error || 'Builder request failed');
      }
      const payload = (await response.json()) as BuilderApiResponse;
      setLastProvider(payload.provider);
      setLastBlueprint(payload.blueprint);
      if (previewHtml) pushHistory(previewHtml);
      setPreviewHtml(payload.previewHtml);
      setPreviewCss(payload.previewCss);
      setSavedWebsiteId(null);
      setJustSaved(false);

      setMessages((prev) => [
        ...prev,
        { id: `a_${Date.now()}`, role: 'assistant', content: payload.reply },
      ]);
      setPrompt('');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Could not generate site',
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  /* ---- save ---- */
  const handleSave = () => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Not logged in', description: 'Please log in to save your website.' });
      return;
    }
    if (!previewHtml) {
      toast({ variant: 'destructive', title: 'Nothing to save', description: 'Generate a website first.' });
      return;
    }

    setSaving(true);
    const now = new Date();
    const siteName = lastBlueprint?.siteName || 'My AI Website';

    if (savedWebsiteId) {
      const existing = websites.find((w) => w.id === savedWebsiteId);
      if (existing) {
        updateWebsite(savedWebsiteId, {
          name: siteName,
          aiPreviewHtml: previewHtml,
          aiPreviewCss: previewCss,
          aiBlueprint: lastBlueprint as unknown as Record<string, unknown>,
          updatedAt: now,
        });
        setSaving(false);
        setJustSaved(true);
        setTimeout(() => setJustSaved(false), 2000);
        toast({ title: 'Website updated', description: `"${siteName}" has been saved.` });
        return;
      }
    }

    const websiteId = `ai-site-${Date.now()}`;
    addWebsite({
      id: websiteId,
      name: siteName,
      userId: user.id,
      templateId: 'ai-builder',
      published: false,
      globalStyles: {
        colors: {
          primary: lastBlueprint?.primaryColor || '#002349',
          secondary: lastBlueprint?.accentColor || '#DAFF07',
          accent: lastBlueprint?.accentColor || '#DAFF07',
        },
        fontPair: {
          id: 'ai-custom',
          name: lastBlueprint?.fontHeading || 'Inter',
          heading: lastBlueprint?.fontHeading || 'Inter',
          body: lastBlueprint?.fontBody || 'Inter',
        },
        button: { variant: 'solid', rounded: 'md' },
        headings: {
          h1: { fontSize: '3rem', fontWeight: '700', lineHeight: '1.2' },
          h2: { fontSize: '2rem', fontWeight: '600', lineHeight: '1.3' },
          h3: { fontSize: '1.5rem', fontWeight: '600', lineHeight: '1.4' },
        },
        body: { fontSize: '1rem', fontWeight: '400', lineHeight: '1.6' },
      },
      header: getDefaultHeaderConfig(),
      footer: getDefaultFooterConfig(),
      pages: [{
        id: `page-${Date.now()}`,
        websiteId,
        name: 'Home',
        slug: '/',
        isHomepage: true,
        sections: [],
        headerSettings: { useCustomHeader: false },
        seo: { metaTitle: siteName, metaDescription: lastBlueprint?.heroSubtitle || '' },
        status: 'draft',
        createdAt: now,
        updatedAt: now,
      }],
      aiPreviewHtml: previewHtml,
      aiPreviewCss: previewCss,
      aiBlueprint: lastBlueprint as unknown as Record<string, unknown>,
      createdAt: now,
      updatedAt: now,
    });

    setSavedWebsiteId(websiteId);
    setSaving(false);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
    toast({ title: 'Website saved', description: `"${siteName}" has been saved to your account.` });
  };

  /* ---- preview ---- */
  const handlePreview = () => {
    if (!previewHtml) return;
    const cssStr = previewCss || 'body{font-family:Inter,system-ui,sans-serif;margin:0;padding:0;color:#111;background:#fff;}';
    const doc = `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><style>${cssStr}</style></head><body>${previewHtml}</body></html>`;
    const blob = new Blob([doc], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  /* ---- publish ---- */
  const handlePublish = () => {
    if (!savedWebsiteId) handleSave();
    setShowPublishDialog(true);
  };
  const confirmPublish = () => {
    const id = savedWebsiteId;
    if (!id) return;
    const url = publishWebsite(id);
    if (url) {
      setPublishedUrl(url);
      toast({ title: 'Website published!', description: 'Your site is now live.' });
    }
    setShowPublishDialog(false);
  };

  /* ---- starting points ---- */
  const templateAssets = useMemo(() => {
    if (!user) return [];
    return getAssetsForUser(user.id).filter((a) => a.kind === 'full_site');
  }, [user, getAssetsForUser]);

  /* ---- iframe document ---- */
  const iframeDoc = useMemo(() => {
    const css = previewCss || 'body{font-family:Inter,system-ui,sans-serif;margin:0;padding:24px;color:#111;background:#f7f7f5;}';
    const html = previewHtml || '<main><h1>No site generated yet</h1><p>Send a prompt to generate your real-estate website preview.</p></main>';
    return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>${css}</style>
  </head>
  <body>${html}${previewHtml ? INLINE_EDIT_SCRIPT : ''}</body>
</html>`;
  }, [previewCss, previewHtml]);

  const hasSomethingToSave = !!previewHtml;
  const isPublished = !!(savedWebsiteId && websites.find((w) => w.id === savedWebsiteId)?.published);

  return (
    <div className="min-h-screen bg-[#F5F5F3]" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>
      <div className="border-b border-[#EBEBEB] bg-white">
        <Header
          title="AI Website Builder"
          description="Chat on the left, live preview on the right. Click any text or image in the preview to edit it."
        />
      </div>

      <div className="grid gap-4 p-4 lg:grid-cols-[380px_minmax(0,1fr)]">
        {/* ---- Chat Panel ---- */}
        <section className="flex h-[calc(100vh-140px)] flex-col rounded-xl border border-[#EBEBEB] bg-white">
          <div className="border-b border-[#EBEBEB] p-3">
            <p className="text-[13px] font-medium text-black">Builder Chat</p>
            <p className="mt-1 text-[12px] text-[#888C99]">
              Describe your site, then edit text and images directly in the preview.
            </p>
          </div>

          <div className="flex-1 space-y-2 overflow-auto p-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`rounded-lg px-3 py-2 text-[13px] ${
                  message.role === 'user'
                    ? 'bg-black text-white'
                    : 'border border-[#EBEBEB] bg-[#F9F9F8] text-black'
                }`}
              >
                {message.content}
              </div>
            ))}
          </div>

          <div className="space-y-2 border-t border-[#EBEBEB] p-3">
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              rows={3}
              placeholder="Example: Build me a modern real-estate site focused on luxury condos in Austin."
              className="w-full resize-none rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] p-2 text-[13px] text-black placeholder:text-[#AAAAAA] focus:border-[#DAFF07] focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  void submitPrompt();
                }
              }}
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => void submitPrompt()}
                disabled={loading || !prompt.trim()}
                className="inline-flex h-[32px] flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#DAFF07] px-3 text-[13px] text-black hover:bg-[#C8ED00] disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                Generate
              </button>
            </div>
            {lastBlueprint && (
              <p className="text-[11px] text-[#888C99]">
                {lastBlueprint.siteName} ({lastBlueprint.market})
                {savedWebsiteId && <span className="ml-1 text-emerald-600">&bull; Saved</span>}
              </p>
            )}
          </div>
        </section>

        {/* ---- Preview Panel ---- */}
        <section className="flex h-[calc(100vh-140px)] flex-col overflow-hidden rounded-xl border border-[#EBEBEB] bg-white">
          {/* Toolbar */}
          <div className="flex items-center gap-2 border-b border-[#EBEBEB] px-3 py-2">
            <button
              type="button"
              onClick={handleUndo}
              disabled={!canUndo}
              title="Undo last edit"
              className="inline-flex h-[30px] items-center gap-1.5 rounded-lg border border-[#EBEBEB] bg-white px-2.5 text-[12px] text-black hover:bg-[#F5F5F3] disabled:opacity-40 disabled:pointer-events-none"
            >
              <Undo2 className="h-3.5 w-3.5" />
            </button>

            <div className="mx-0.5 h-4 w-px bg-[#EBEBEB]" />

            <button
              type="button"
              onClick={handleSave}
              disabled={!hasSomethingToSave || saving}
              className="inline-flex h-[30px] items-center gap-1.5 rounded-lg border border-[#EBEBEB] bg-white px-3 text-[12px] text-black hover:bg-[#F5F5F3] disabled:opacity-40 disabled:pointer-events-none"
            >
              {justSaved ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              ) : saving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              {justSaved ? 'Saved' : savedWebsiteId ? 'Update' : 'Save'}
            </button>

            <button
              type="button"
              onClick={handlePreview}
              disabled={!previewHtml}
              className="inline-flex h-[30px] items-center gap-1.5 rounded-lg border border-[#EBEBEB] bg-white px-3 text-[12px] text-black hover:bg-[#F5F5F3] disabled:opacity-40 disabled:pointer-events-none"
            >
              <Eye className="h-3.5 w-3.5" />
              Preview
            </button>

            <button
              type="button"
              onClick={handlePublish}
              disabled={!hasSomethingToSave}
              className="inline-flex h-[30px] items-center gap-1.5 rounded-lg bg-[#DAFF07] px-3 text-[12px] text-black hover:bg-[#C8ED00] disabled:opacity-40 disabled:pointer-events-none"
            >
              <Globe className="h-3.5 w-3.5" />
              {isPublished ? 'Published' : 'Publish'}
            </button>

            <div className="mx-0.5 h-4 w-px bg-[#EBEBEB]" />

            <button
              type="button"
              onClick={() => setShowStartingPoints(true)}
              className="inline-flex h-[30px] items-center gap-1.5 rounded-lg border border-[#EBEBEB] bg-white px-3 text-[12px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Starting Points
            </button>

            <button
              type="button"
              onClick={() => router.push('/ai-builder/onboarding')}
              className="inline-flex h-[30px] items-center gap-1.5 rounded-lg border border-[#EBEBEB] bg-white px-3 text-[12px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black"
            >
              <Plus className="h-3.5 w-3.5" />
              New Website
            </button>

            {publishedUrl && (
              <span className="ml-auto flex items-center gap-1.5 text-[11px] text-emerald-600">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Live at {publishedUrl}
              </span>
            )}
          </div>

          {/* Iframe */}
          <div className="flex-1">
            <iframe
              ref={iframeRef}
              title="AI website preview"
              srcDoc={iframeDoc}
              className="h-full w-full border-0"
              sandbox="allow-same-origin allow-scripts"
            />
          </div>
        </section>
      </div>

      {/* ---- Publish Dialog ---- */}
      {showPublishDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>
          <div className="relative mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <button type="button" onClick={() => setShowPublishDialog(false)} className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-md text-[#888C99] hover:bg-[#F5F5F3] hover:text-black">
              <X className="h-4 w-4" />
            </button>
            <div className="mb-1 flex items-center gap-2">
              <Globe className="h-5 w-5 text-[#002349]" />
              <h2 className="text-[15px] font-semibold text-black">Publish Your Website</h2>
            </div>
            <p className="mb-5 text-[13px] text-[#888C99]">
              Your site will be live on a platform-generated domain. You can connect a custom domain later in Settings.
            </p>
            {!savedWebsiteId && (
              <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] text-amber-800">
                Your site will be saved automatically before publishing.
              </p>
            )}
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setShowPublishDialog(false)} className="inline-flex h-[34px] items-center rounded-lg border border-[#EBEBEB] bg-white px-4 text-[13px] text-black hover:bg-[#F5F5F3]">Cancel</button>
              <button type="button" onClick={confirmPublish} className="inline-flex h-[34px] items-center gap-1.5 rounded-lg bg-[#DAFF07] px-4 text-[13px] font-medium text-black hover:bg-[#C8ED00]">
                <Globe className="h-3.5 w-3.5" />
                {isPublished ? 'Republish' : 'Publish Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---- Starting Points Dialog ---- */}
      {showStartingPoints && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>
          <div className="relative mx-4 w-full max-w-3xl rounded-xl bg-white p-6 shadow-2xl">
            <button type="button" onClick={() => setShowStartingPoints(false)} className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-md text-[#888C99] hover:bg-[#F5F5F3] hover:text-black">
              <X className="h-4 w-4" />
            </button>
            <div className="mb-1 flex items-center gap-2">
              <LayoutGrid className="h-5 w-5 text-[#002349]" />
              <h2 className="text-[15px] font-semibold text-black">Site Starting Points</h2>
            </div>
            <p className="mb-5 text-[13px] text-[#888C99]">
              Choose a template as your base. The AI will customize it based on your profile and preferences.
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {templateAssets.map((asset) => {
                const template = getTemplateFromAsset(asset);
                const previewImg = template?.previewImage || 'https://placehold.co/400x300/F5F5F3/888888?text=Template';
                return (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => {
                      const sourceId = asset.sourceTemplateId;
                      if (sourceId && sourceId.startsWith('starting-point-')) {
                        setShowStartingPoints(false);
                        setLoading(true);
                        const siteProfile = user ? getProfileForUser(user.id) : null;
                        const profilePayload = siteProfile ? {
                          agentName: siteProfile.agentName,
                          brokerageName: siteProfile.brokerageName,
                          teamName: siteProfile.teamName,
                          contactName: siteProfile.contactName,
                          email: siteProfile.email,
                          phone: siteProfile.phone,
                          officeAddress: siteProfile.officeAddress,
                          aboutMe: siteProfile.aboutMe,
                          targetAreas: siteProfile.targetAreas,
                          social: siteProfile.social as Record<string, string>,
                          personalLogo: siteProfile.personalLogo,
                          brokerageLogo: siteProfile.brokerageLogo,
                        } : undefined;
                        fetch('/api/ai/builder/from-template', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ templateId: sourceId, siteProfile: profilePayload }),
                        })
                          .then((res) => res.json())
                          .then((payload) => {
                            if (payload.previewHtml) {
                              if (previewHtml) pushHistory(previewHtml);
                              setPreviewHtml(payload.previewHtml);
                              setPreviewCss(payload.previewCss || '');
                              setLastBlueprint(payload.blueprint || null);
                              setSavedWebsiteId(null);
                              setJustSaved(false);
                              if (payload.seedListings && user) {
                                seedCountryListings(user.id);
                              }
                              setMessages((prev) => [...prev, { id: `a_sp_${Date.now()}`, role: 'assistant', content: payload.reply }]);
                            }
                          })
                          .catch(() => toast({ variant: 'destructive', title: 'Failed', description: 'Could not load template.' }))
                          .finally(() => setLoading(false));
                      } else {
                        toast({ title: `Starting from "${asset.name}"`, description: 'Ask the AI to build your site using this as a base.' });
                        setShowStartingPoints(false);
                      }
                    }}
                    className="group overflow-hidden rounded-xl border border-[#EBEBEB] text-left transition-colors hover:border-[#DAFF07]"
                  >
                    <img src={previewImg} alt={asset.name} className="h-28 w-full object-cover" />
                    <div className="p-2.5">
                      <p className="text-[13px] font-medium text-black">{asset.name}</p>
                      <p className="mt-0.5 text-[11px] text-[#888C99] line-clamp-2">{asset.description}</p>
                      {asset.scope === 'assigned_private' && (
                        <span className="mt-1.5 inline-block rounded-full bg-[#DAFF07]/20 px-2 py-0.5 text-[10px] text-black">Assigned to you</span>
                      )}
                    </div>
                  </button>
                );
              })}
              {templateAssets.length === 0 && (
                <div className="col-span-full py-8 text-center text-[13px] text-[#888C99]">
                  No starting points available yet. Templates will appear here once added by an admin.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
