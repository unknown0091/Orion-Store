
import React, { useState } from 'react';
import { StorePackage, PackageTier, UserAccount } from '../types';
import { STORE_PACKAGES } from '../constants';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

interface PricingViewProps {
  userAccount: UserAccount;
  onActivate: (pkg: StorePackage) => void;
  theme: 'light' | 'dusk' | 'dark' | 'oled';
}

const PricingView: React.FC<PricingViewProps> = ({ userAccount, onActivate, theme }) => {
  const [selectedPkg, setSelectedPkg] = useState<string | null>(null);
  const [showPayModal, setShowPayModal] = useState<StorePackage | null>(null);
  const [licenseKeyField, setLicenseKeyField] = useState('');

  const handleSelect = (pkg: StorePackage) => {
    setSelectedPkg(pkg.id);
    setShowPayModal(pkg);
    Haptics.impact({ style: ImpactStyle.Medium });
  };

  const confirmPurchase = () => {
    if (showPayModal) {
        onActivate(showPayModal);
        setShowPayModal(null);
        Haptics.notification({ type: NotificationType.Success });
    }
  };

  return (
    <div className="p-6 pb-20 animate-fade-in max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-theme-text mb-4 tracking-tight">
          Choose Your <span className="text-primary italic">Power-Up 🚀</span>
        </h2>
        <p className="text-theme-sub max-w-md mx-auto font-medium">
          Unlock the full potential of Pretub Store. One-time payment, lifetime access. No hidden fees, ever.
        </p>
      </div>

      {userAccount.isActivated && (
        <div className="mb-10 p-5 rounded-[2rem] bg-emerald-500/10 border-2 border-emerald-500/20 flex flex-col items-center gap-2 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xl shadow-lg shadow-emerald-500/20 mb-2">
                <i className="fas fa-check-circle"></i>
            </div>
            <h3 className="font-black text-emerald-600 dark:text-emerald-400 text-xl">Account Activated!</h3>
            <p className="text-emerald-600/80 dark:text-emerald-400/80 text-sm max-w-xs">
                You are on the <span className="font-bold underline">{userAccount.tier} Tier</span>. 
                <br />
                Downloads: <span className="font-bold">{userAccount.downloadCount}</span> / {userAccount.tier === 'Starter' ? '10' : userAccount.tier === 'Pro' ? '100' : '∞'}
            </p>
            <span className="mt-2 text-[10px] font-mono opacity-50">License: {userAccount.licenseKey}</span>
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STORE_PACKAGES.map((pkg) => (
          <div 
            key={pkg.id}
            className={`relative group rounded-[2.5rem] p-8 border-2 transition-all duration-300 transform hover:-translate-y-2 ${
              pkg.recommended 
                ? 'bg-card border-primary shadow-2xl shadow-primary/20 z-10' 
                : 'bg-theme-element border-theme-border opacity-90'
            } ${userAccount.tier === pkg.tier ? 'ring-4 ring-emerald-500 ring-offset-4 ring-offset-surface' : ''}`}
          >
            {pkg.recommended && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                Most Popular
              </div>
            )}

            <div className="mb-6">
              <span className={`text-xs font-black uppercase tracking-widest ${pkg.recommended ? 'text-primary' : 'text-theme-sub'}`}>
                {pkg.tier}
              </span>
              <h3 className="text-2xl font-black text-theme-text mt-1">{pkg.name}</h3>
              <p className="text-theme-sub text-xs mt-2 leading-relaxed min-h-[3rem]">{pkg.description}</p>
            </div>

            <div className="mb-8">
              <span className="text-4xl font-black text-theme-text">{pkg.price}</span>
              <span className="text-theme-sub text-sm font-bold opacity-60 ml-1">/ one-time</span>
            </div>

            <ul className="space-y-4 mb-10">
              {pkg.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-semibold text-theme-text/80">
                  <i className="fas fa-check-circle text-primary mt-0.5"></i>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSelect(pkg)}
              disabled={userAccount.isActivated && userAccount.tier === pkg.tier}
              className={`w-full py-4 rounded-2xl font-black transition-all ${
                userAccount.tier === pkg.tier
                  ? 'bg-emerald-500 text-white cursor-default'
                  : pkg.recommended
                    ? 'bg-primary text-white shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95'
                    : 'bg-theme-text text-theme-element hover:scale-[1.02] active:scale-95'
              }`}
            >
              {userAccount.tier === pkg.tier ? 'Owned' : 'Select Plan'}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
            <h4 className="text-sm font-black text-theme-sub uppercase tracking-widest mb-6">Secure Activation</h4>
            <div className="flex flex-wrap justify-center gap-6 opacity-30">
                <i className="fab fa-stripe fa-3x"></i>
                <i className="fab fa-cc-visa fa-3x"></i>
                <i className="fab fa-cc-mastercard fa-3x"></i>
                <i className="fab fa-google-pay fa-3x"></i>
                <i className="fab fa-apple-pay fa-3x"></i>
            </div>
      </div>

      {/* Payment Simulation Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-fade-in">
            <div className="bg-card w-full max-w-sm rounded-[3rem] p-8 shadow-3xl border border-theme-border relative">
                <h3 className="text-2xl font-black text-center mb-2">Simulate Purchase</h3>
                <p className="text-theme-sub text-sm text-center mb-8">Confirm your payment for the <span className="text-primary font-bold">{showPayModal.name}</span></p>
                
                <div className="space-y-4 mb-8">
                    <div className="p-4 rounded-2xl bg-theme-element border border-theme-border">
                        <div className="flex justify-between text-xs font-black text-theme-sub uppercase mb-1">
                            <span>Package</span>
                            <span>Price</span>
                        </div>
                        <div className="flex justify-between font-black text-theme-text">
                            <span>{showPayModal.name}</span>
                            <span>{showPayModal.price}</span>
                        </div>
                    </div>

                    <div className="text-center">
                         <p className="text-[10px] text-theme-sub font-bold uppercase mb-4">Or Enter License Key</p>
                         <input 
                            type="text" 
                            placeholder="PRETUB-XXXX-XXXX"
                            className="w-full bg-theme-input border-2 border-theme-border rounded-xl px-4 py-3 text-center text-sm font-mono focus:border-primary outline-none transition-all"
                            value={licenseKeyField}
                            onChange={(e) => setLicenseKeyField(e.target.value)}
                         />
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <button 
                        onClick={confirmPurchase}
                        className="w-full py-4 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        Confirm & Pay
                    </button>
                    <button 
                         onClick={() => setShowPayModal(null)}
                         className="w-full py-4 bg-theme-element text-theme-sub rounded-2xl font-bold hover:bg-theme-hover transition-all"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default PricingView;
