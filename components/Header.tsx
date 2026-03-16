
import React from 'react';
import { Tab } from '../types';

interface HeaderProps {
  onTitleClick: () => void;


  theme: 'light' | 'dusk' | 'dark' | 'oled';
  toggleTheme: () => void;
  activeTab: Tab;
  onOpenSettings: () => void;
  updateCount?: number;
  activeDownloadCount?: number;
  userAccount?: { isActivated: boolean; tier: string };
}

const Header: React.FC<HeaderProps> = ({ 
  onTitleClick, 
 
 
  theme, 
  toggleTheme,
  activeTab,
  onOpenSettings,
  updateCount = 0,
  activeDownloadCount = 0,
  userAccount = { isActivated: false, tier: 'None' }
}) => {
  const hasNotifications = updateCount > 0 || activeDownloadCount > 0;

  return (
    <header className="sticky top-0 z-30 w-full bg-surface/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
      <div className="max-w-5xl mx-auto w-full px-6 pb-4 pt-[calc(1rem+env(safe-area-inset-top))] flex justify-between items-center">
        <div className="flex items-center gap-3 select-none relative group">
            <div className="relative">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/10 transition-transform hover:rotate-6 active:scale-95 overflow-hidden">
                    <img 
                        src="assets/pretub-icon.png" 
                        alt="Pretub Logo" 
                        className="w-full h-full object-cover p-1"
                    />
                </div>
            </div>
            
            <div className="relative">
                <h1 
                    onClick={onTitleClick}
                    className="text-2xl font-black tracking-tighter text-theme-text cursor-pointer active:scale-95 transition-transform relative z-10"
                >
                    Pretub<span className="text-primary">.store</span>
                </h1>

                {userAccount.isActivated && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-600 dark:from-amber-600 dark:to-orange-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/20 transform hover:-translate-y-0.5 transition-transform cursor-default">
                        <i className={`fas ${userAccount.tier === 'Elite' ? 'fa-crown animate-pulse' : 'fa-gem'}`}></i>
                        <span>{userAccount.tier}</span>
                    </div>
                )}
            </div>
        </div>
        
        <div className="flex items-center gap-3">


            <div className="relative hidden">
                <button 
                    onClick={onOpenSettings}
                    className={`w-10 h-10 rounded-full bg-theme-element hover:bg-theme-hover flex items-center justify-center text-theme-sub hover:text-primary transition-all hover:scale-110 active:scale-95 shadow-sm ${activeDownloadCount > 0 ? 'animate-pulse text-primary' : ''}`}
                    title="Settings & Updates"
                >
                    <i className={`fas ${activeDownloadCount > 0 ? 'fa-spinner fa-spin' : 'fa-cog'} text-lg`}></i>
                </button>
                {hasNotifications && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${activeDownloadCount > 0 ? 'bg-primary' : 'bg-acid'}`}></span>
                        <span className={`relative inline-flex rounded-full h-4 w-4 border-2 border-surface flex items-center justify-center text-[8px] font-black text-white ${activeDownloadCount > 0 ? 'bg-primary' : 'bg-acid text-black'}`}>
                            {activeDownloadCount > 0 ? activeDownloadCount : updateCount > 0 ? updateCount : '!'}
                        </span>
                    </span>
                )}
            </div>

            {activeTab !== 'about' && (
                <button 
                    onClick={toggleTheme}
                    className="w-10 h-10 rounded-full bg-theme-element hover:bg-theme-hover flex items-center justify-center text-theme-sub hover:text-acid transition-all hover:scale-110 active:scale-95"
                    title={`Theme: ${theme}`}
                >
                    <i className={`fas ${theme === 'light' ? 'fa-sun' : theme === 'dusk' ? 'fa-cloud-sun' : 'fa-moon'}`}></i>
                </button>
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;
