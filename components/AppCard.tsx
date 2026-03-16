
import React, { useState } from 'react';
import { AppItem } from '../types';
import { CATEGORY_GRADIENTS } from '../constants';

// Helper: Optimize images using wsrv.nl (Global CDN + Compression)
const getOptimizedIconUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('data:') || url.startsWith('blob:')) return url;
    // Resize to 128x128 (2x retina for 64px container), convert to WebP, 80% quality
    return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=128&h=128&output=webp&q=80&l=1`;
};

interface AppCardProps {
  app: AppItem;
  onClick: (app: AppItem) => void;
  localVersion?: string;
  hasUpdateNotification?: boolean; 
  downloadProgress?: number;
  downloadStatus?: string;
  isReadyToInstall?: boolean;
  isActivated?: boolean;
}

// WRAPPED IN MEMO: This prevents the card from re-rendering if its props haven't changed.
// This is critical when "App.tsx" updates state (like another app's download progress).
const AppCard: React.FC<AppCardProps> = React.memo(({ app, onClick, localVersion, hasUpdateNotification, downloadProgress, downloadStatus, isReadyToInstall, isActivated = true }) => {
  const [imgStatus, setImgStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  const isInstalled = !!localVersion;
  const isUpdateAvailable = hasUpdateNotification || false;
  const isDownloading = downloadStatus === 'RUNNING';
  const bgGradient = CATEGORY_GRADIENTS[app.category] || CATEGORY_GRADIENTS['Default'];
  const optimizedUrl = getOptimizedIconUrl(app.icon);

  // Stable handler
  const handleClick = () => onClick(app);

  return (
    <div 
      onClick={handleClick}
      className="app-card-optimized app-card group relative bg-card rounded-[2rem] p-4 flex items-center gap-4 cursor-pointer border border-theme-border hover:border-primary/30 active:scale-[0.97] transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
    >
      <div className="relative shrink-0 w-16 h-16">
        {/* Subtle Icon Reflection for Premium Look */}
        <div className="absolute inset-2 bg-gradient-to-br from-primary/20 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {imgStatus === 'loading' && (
            <div className="absolute inset-0 bg-theme-element rounded-2xl animate-pulse" />
        )}

        {imgStatus === 'error' ? (
           <div className={`w-full h-full rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-inner ${bgGradient}`}>
               {app.name.charAt(0).toUpperCase()}
           </div>
        ) : (
           <img 
             src={optimizedUrl} 
             alt={app.name} 
             onLoad={() => setImgStatus('loaded')}
             onError={() => setImgStatus('error')}
             className={`w-full h-full object-contain rounded-2xl transition-all duration-500 ${imgStatus === 'loaded' ? 'opacity-100' : 'opacity-0'} group-hover:scale-105 group-hover:drop-shadow-lg`} 
             style={{ background: "transparent" }}
             loading="lazy"
             decoding="async"
           />
        )}

        {isUpdateAvailable && !isDownloading && !isReadyToInstall && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 z-10">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-acid opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-acid border-2 border-card"></span>
          </span>
        )}

        {isDownloading && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[4px] rounded-2xl flex items-center justify-center z-10 animate-fade-in overflow-hidden border border-white/10">
                <svg className="w-12 h-12 transform -rotate-90 scale-75">
                    <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/10" />
                    <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="4" fill="transparent" 
                        strokeDasharray={100} strokeDashoffset={100 - (downloadProgress || 0)} 
                        strokeLinecap="round" className="text-acid transition-all duration-300 shadow-[0_0_8px_rgba(200,255,0,0.5)]" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[9px] font-black text-white">{downloadProgress || 0}%</span>
                </div>
            </div>
        )}

        {isReadyToInstall && (
            <div className="absolute inset-0 bg-primary/30 backdrop-blur-[2px] rounded-2xl flex items-center justify-center z-10 animate-pulse border-2 border-primary/50 shadow-lg shadow-primary/20">
                <i className="fas fa-box-open text-white text-xl"></i>
            </div>
        )}

        {isInstalled && !isUpdateAvailable && !isDownloading && !isReadyToInstall && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-card flex items-center justify-center text-white text-[10px] z-10 shadow-md">
                <i className="fas fa-check"></i>
            </div>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <h3 className="text-[17px] font-black text-theme-text truncate tracking-tight leading-snug group-hover:text-primary transition-colors">{app.name}</h3>
        <p className="text-[11px] font-bold text-theme-sub opacity-70 truncate">{app.author}</p>
        
        <div className="flex items-center gap-2 mt-1.5">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                app.category === 'Media' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' :
                app.category === 'Social' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                'bg-theme-element text-theme-sub border border-theme-border'
             }`}>
            {app.category}
          </span>
          
          {isDownloading ? (
             <span className="text-[9px] font-black text-primary animate-pulse">DOWNLOADING...</span>
          ) : isReadyToInstall ? (
             <span className="text-[9px] font-black text-primary flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-ping"></span>
                INSTALL
             </span>
          ) : isUpdateAvailable ? (
             <span className="text-[9px] font-black text-acid flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-acid rounded-full"></span>
                UPDATE Available
             </span>
          ) : isInstalled ? (
             <span className="text-[9px] font-bold text-green-500/60 leading-none">v{localVersion}</span>
          ) : null}
        </div>
      </div>

      <div className="flex items-center shrink-0">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border ${
            !isActivated ? 'bg-orange-500/10 text-orange-500 border-orange-500/20 group-hover:bg-orange-500 group-hover:text-white' : 
            isReadyToInstall ? 'bg-primary text-white scale-110 shadow-xl shadow-primary/30 border-primary' : 
            isDownloading ? 'bg-theme-element text-primary border-primary/20' :
            'bg-theme-element text-theme-sub border-theme-border group-hover:border-primary/50 group-hover:text-primary'
        }`}>
            <i className={`fas ${!isActivated ? 'fa-lock' : isDownloading ? 'fa-spinner fa-spin' : isReadyToInstall ? 'fa-download animate-bounce' : 'fa-chevron-right'} text-xs`}></i>
        </div>
      </div>
    </div>
  );
}, (prev, next) => {
    return (
        prev.localVersion === next.localVersion &&
        prev.hasUpdateNotification === next.hasUpdateNotification &&
        prev.downloadProgress === next.downloadProgress &&
        prev.downloadStatus === next.downloadStatus &&
        prev.isReadyToInstall === next.isReadyToInstall &&
        prev.app.id === next.app.id &&
        prev.app.name === next.app.name &&
        prev.isActivated === next.isActivated
    );
});

export default AppCard;
