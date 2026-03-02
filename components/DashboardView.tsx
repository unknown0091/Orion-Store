import React from 'react';
import { UserAccount, PackageTier, AppItem } from '../types';

interface DashboardProps {
    userAccount: UserAccount;
    apps: AppItem[];
    onNavigateToTab: (tab: any) => void;
    onOpenPricing: () => void;
    installedCount: number;
    updateCount: number;
}

const DashboardView: React.FC<DashboardProps> = ({ 
    userAccount, apps, onNavigateToTab, onOpenPricing, installedCount, updateCount 
}) => {
    const isPro = userAccount.isActivated;
    const tier = userAccount.tier;
    
    // Quick Stats
    const totalApps = apps.length;
    const progress = Math.min((userAccount.downloadCount / (isPro ? 1000 : 5)) * 100, 100);

    return (
        <div className="px-6 py-6 space-y-8 animate-fade-in pb-28">
            {/* Header / Greet */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-theme-text tracking-tighter">My Dashboard</h2>
                    <p className="text-theme-sub text-sm font-medium">Manage your pro experience</p>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${isPro ? 'bg-primary/10 border-primary/30 text-primary shadow-lg shadow-primary/15' : 'bg-theme-element border-theme-border text-theme-sub'}`}>
                    {isPro ? `${tier} License` : 'Free Tier'}
                </div>
            </div>

            {/* Main Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Account Card */}
                <div 
                    onClick={!isPro ? onOpenPricing : undefined}
                    className={`col-span-1 md:col-span-2 p-6 rounded-[2.5rem] border transition-all relative overflow-hidden group cursor-pointer ${
                        isPro 
                        ? 'bg-gradient-to-br from-primary to-indigo-600 border-primary/20 text-white shadow-2xl shadow-primary/20 hover:scale-[1.01]' 
                        : 'bg-card border-theme-border hover:border-primary/50 text-theme-text'
                    }`}
                >
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${isPro ? 'bg-white/20' : 'bg-primary/10 text-primary'}`}>
                                    <i className={`fas ${isPro ? 'fa-gem' : 'fa-lock'}`}></i>
                                </div>
                                {!isPro && (
                                    <span className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-primary/30 animate-pulse">Activate</span>
                                )}
                            </div>
                            <h3 className="text-2xl font-black tracking-tight mb-1">
                                {isPro ? `${tier} Status` : 'Activation Required'}
                            </h3>
                            <p className={`text-sm font-medium ${isPro ? 'text-white/80' : 'text-theme-sub'}`}>
                                {isPro ? 'Permanent Lifetime License Unlocked' : 'Unlock unlimited downloads & pro features.'}
                            </p>
                        </div>
                        
                        <div className="mt-8 flex items-baseline gap-2">
                            <span className="text-4xl font-black tracking-tighter">{userAccount.downloadCount}</span>
                            <span className={`text-xs font-bold uppercase tracking-widest ${isPro ? 'text-white/60' : 'text-theme-sub opacity-50'}`}>Downloads</span>
                        </div>
                    </div>

                    {/* Background Glare */}
                    <div className={`absolute top-0 right-0 w-64 h-64 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3 ${isPro ? 'bg-white/20' : 'bg-primary/5'}`}></div>
                </div>

                {/* Storage Saved Card */}
                <div className="p-6 rounded-[2.5rem] bg-card border border-theme-border flex flex-col items-center justify-center text-center group hover:border-acid transition-all duration-500 hover:shadow-xl hover:shadow-acid/5 shadow-sm">
                    <div className="w-14 h-14 bg-acid/10 text-acid-dark dark:text-acid rounded-[1.5rem] flex items-center justify-center text-2xl mb-4 group-hover:rotate-12 transition-transform shadow-inner">
                        <i className="fas fa-broom"></i>
                    </div>
                    <span className="text-3xl font-black text-theme-text tracking-tighter mb-0.5">{userAccount.totalSavingsMb || 0} MB</span>
                    <span className="text-[10px] text-theme-sub font-black uppercase tracking-widest">Storage Cleaned</span>
                </div>

                {/* Updates/Health Card */}
                <div 
                    onClick={() => onNavigateToTab('about')}
                    className="p-6 rounded-[2.5rem] bg-card border border-theme-border flex flex-col items-center justify-center text-center group hover:border-primary transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 shadow-sm cursor-pointer"
                >
                    <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center text-2xl mb-4 transition-all shadow-inner ${updateCount > 0 ? 'bg-primary/20 text-primary animate-pulse' : 'bg-blue-500/10 text-blue-500'}`}>
                        <i className={`fas ${updateCount > 0 ? 'fa-arrow-up-z-a' : 'fa-check-circle'}`}></i>
                    </div>
                    <span className="text-3xl font-black text-theme-text tracking-tighter mb-0.5">{updateCount || installedCount}</span>
                    <span className="text-[10px] text-theme-sub font-black uppercase tracking-widest">
                        {updateCount > 0 ? 'Updates Pending' : 'Apps Up-to-Date'}
                    </span>
                </div>

            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
                <h4 className="text-[10px] text-theme-sub font-black uppercase tracking-[0.2em] ml-2">App Store Insights</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <div 
                        onClick={() => onNavigateToTab('android')}
                        className=" dark:bg-card border border-theme-border p-5 rounded-3xl flex items-center justify-between group cursor-pointer hover:bg-theme-element transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform"><i className="fab fa-android"></i></div>
                            <div>
                                <h5 className="font-black text-theme-text">Android Library</h5>
                                <p className="text-[10px] text-theme-sub font-bold">{totalApps} Verified Apps</p>
                            </div>
                        </div>
                        <i className="fas fa-chevron-right text-theme-sub/40 group-hover:translate-x-1 transition-transform"></i>
                    </div>

                    <div 
                        onClick={() => onNavigateToTab('pc')}
                        className=" dark:bg-card border border-theme-border p-5 rounded-3xl flex items-center justify-between group cursor-pointer hover:bg-theme-element transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform"><i className="fab fa-windows"></i></div>
                            <div>
                                <h5 className="font-black text-theme-text">Windows Depot</h5>
                                <p className="text-[10px] text-theme-sub font-bold">Desktop Ready Software</p>
                            </div>
                        </div>
                        <i className="fas fa-chevron-right text-theme-sub/40 group-hover:translate-x-1 transition-transform"></i>
                    </div>

                </div>
            </div>

            {/* Pro Perks Spotlight */}
            {!isPro && (
                <div className="bg-primary/5 border border-primary/20 p-8 rounded-[3rem] relative overflow-hidden">
                    <div className="relative z-10">
                        <h4 className="text-2xl font-black text-primary tracking-tighter mb-2">Upgrade Your Store</h4>
                        <p className="text-theme-sub text-sm font-medium mb-6 max-w-sm">Ditch the limits. Get unrestricted background updates, direct apk installs, and exclusive elite branding.</p>
                        <div className="flex gap-4">
                            <button onClick={onOpenPricing} className="bg-primary text-white font-black text-xs uppercase tracking-widest px-6 py-3 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">See Premium Plans</button>
                            <button className="text-theme-sub font-black text-[10px] uppercase tracking-widest hover:text-theme-text transition-colors">Compare Tiers</button>
                        </div>
                    </div>
                    {/* Abstract Sparkle */}
                    <div className="absolute top-0 right-10 bottom-0 flex items-center justify-center opacity-10 animate-pulse scale-150 rotate-12">
                        <i className="fas fa-gem text-9xl"></i>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardView;
