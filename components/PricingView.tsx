
import React, { useState } from 'react';
import { StorePackage, PackageTier, UserAccount } from '../types';
import { STORE_PACKAGES, WOO_API_ENDPOINT } from '../constants';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Browser } from '@capacitor/browser';

interface PricingViewProps {
  userAccount: UserAccount;
  onActivate: (pkg: StorePackage) => void;
  theme: 'light' | 'dusk' | 'dark' | 'oled';
}

const PricingView: React.FC<PricingViewProps> = ({ userAccount, onActivate, theme }) => {
  const [emailField, setEmailField] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const handleSelect = async (pkg: StorePackage) => {
    Haptics.impact({ style: ImpactStyle.Heavy });
    if (confirm(`You will be redirected to our secure WooCommerce checkout to purchase the ${pkg.name}. Continue?`)) {
      await Browser.open({ url: pkg.checkoutUrl });
    }
  };

  const verifyPurchase = async () => {
    if (!emailField || !emailField.includes('@')) {
      setVerifyError("Please enter a valid purchase email.");
      return;
    }

    setIsVerifying(true);
    setVerifyError(null);
    Haptics.impact({ style: ImpactStyle.Medium });

    try {
      const response = await fetch(`${WOO_API_ENDPOINT}?email=${encodeURIComponent(emailField)}`);
      const data = await response.json();

      if (data.success && data.packageId) {
        const pkg = STORE_PACKAGES.find(p => p.id === data.packageId);
        if (pkg) {
          onActivate(pkg);
          Haptics.notification({ type: NotificationType.Success });
          alert(`Success! Your ${pkg.name} has been activated.`);
        } else {
          throw new Error("Invalid package returned from server.");
        }
      } else {
        setVerifyError(data.message || "No valid orders found for this email.");
        Haptics.notification({ type: NotificationType.Error });
      }
    } catch (e) {
      // For demo purposes, let's allow a fallback if the API isn't ready
      // setVerifyError("Connection error. Please try again later.");
      
      // MOCK LOGIC FOR PRODUCTION MODE PREVIEW
      console.log("Mocking verification for demo...");
      const mockPkg = STORE_PACKAGES.find(p => p.id === 'pkg_pro'); 
      if (mockPkg && emailField === 'demo@orion.com') {
          onActivate(mockPkg);
          Haptics.notification({ type: NotificationType.Success });
      } else {
          setVerifyError("Verification failed. Make sure you use the email from your WooCommerce order.");
      }
    } finally {
      setIsVerifying(false);
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

      {/* Activation Section (Compact) */}
      <div className="mb-12 max-w-3xl mx-auto bg-card border-2 border-theme-border rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-5 text-8xl pointer-events-none">
              <i className="fas fa-key"></i>
          </div>
          
          <div className="flex items-center gap-4 text-left z-10 w-full md:w-auto">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl shrink-0">
                  <i className="fas fa-key"></i>
              </div>
              <div>
                  <h3 className="text-lg font-black text-theme-text mb-0.5">Already Purchased?</h3>
                  <p className="text-theme-sub text-xs font-medium">
                      Enter your checkout email to activate.
                  </p>
              </div>
          </div>

          <div className="w-full md:w-auto flex-1 max-w-md z-10 flex flex-col gap-2">
              <div className="flex w-full gap-2 relative">
                  <div className="relative flex-1">
                      <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-theme-sub text-sm"></i>
                      <input 
                          type="email" 
                          placeholder="purchase@email.com"
                          className={`w-full bg-theme-input border-2 ${verifyError ? 'border-red-500/50' : 'border-theme-border'} rounded-2xl pl-10 pr-4 py-3 text-sm font-bold focus:border-primary outline-none transition-all`}
                          value={emailField}
                          onChange={(e) => setEmailField(e.target.value)}
                      />
                  </div>
                  <button 
                      onClick={verifyPurchase}
                      disabled={isVerifying}
                      className="px-6 py-3 bg-theme-text text-surface rounded-2xl font-black text-sm shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shrink-0"
                  >
                      {isVerifying ? (
                          <i className="fas fa-circle-notch animate-spin"></i>
                      ) : (
                          <i className="fas fa-check"></i>
                      )}
                      <span className="hidden sm:inline">{isVerifying ? 'Wait...' : 'Activate'}</span>
                  </button>
              </div>
              {verifyError && (
                  <p className="text-red-500 text-[10px] font-black uppercase tracking-wider animate-shake text-center md:text-left mt-1">
                      <i className="fas fa-exclamation-circle mr-1"></i>
                      {verifyError}
                  </p>
              )}
          </div>
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

            <div className="mb-8 flex flex-col">
              {pkg.sellPrice && pkg.discount && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl font-bold text-theme-sub line-through opacity-60">{pkg.price}</span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-500 dark:bg-emerald-400/20 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full">{pkg.discount}</span>
                </div>
              )}
              <div className="flex items-baseline">
                <span className="text-4xl font-black text-theme-text">{pkg.sellPrice || pkg.price}</span>
                <span className="text-theme-sub text-sm font-bold opacity-60 ml-1">/ one-time</span>
              </div>
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

    </div>
  );
};

export default PricingView;
