
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

      {/* Activation Section */}
      <div className="mt-20 max-w-lg mx-auto bg-card border-2 border-theme-border rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 text-6xl">
              <i className="fas fa-key"></i>
          </div>
          
          <div className="relative text-center">
              <h3 className="text-2xl font-black text-theme-text mb-2">Already Purchased?</h3>
              <p className="text-theme-sub text-xs font-medium mb-8">
                  Enter the email address you used during checkout to activate your lifetime license.
              </p>

              <div className="space-y-4">
                  <div className="relative">
                      <i className="fas fa-envelope absolute left-5 top-1/2 -translate-y-1/2 text-theme-sub"></i>
                      <input 
                          type="email" 
                          placeholder="purchase@email.com"
                          className={`w-full bg-theme-input border-2 ${verifyError ? 'border-red-500/50' : 'border-theme-border'} rounded-2xl pl-12 pr-5 py-4 text-sm font-bold focus:border-primary outline-none transition-all`}
                          value={emailField}
                          onChange={(e) => setEmailField(e.target.value)}
                      />
                  </div>

                  {verifyError && (
                      <p className="text-red-500 text-[10px] font-black uppercase tracking-wider animate-shake">
                          <i className="fas fa-exclamation-circle mr-1"></i>
                          {verifyError}
                      </p>
                  )}

                  <button 
                      onClick={verifyPurchase}
                      disabled={isVerifying}
                      className="w-full py-4 bg-theme-text text-surface rounded-2xl font-black text-sm shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                      {isVerifying ? (
                          <i className="fas fa-circle-notch animate-spin"></i>
                      ) : (
                          <i className="fas fa-shield-check"></i>
                      )}
                      <span>{isVerifying ? 'Verifying Order...' : 'Verify & Activate'}</span>
                  </button>
              </div>

              <div className="mt-8 pt-8 border-t border-theme-border/50">
                  <div className="flex items-center justify-center gap-4 text-theme-sub text-[10px] font-black uppercase tracking-widest opacity-40">
                      <span>Instant Activation</span>
                      <span className="w-1 h-1 bg-theme-sub rounded-full"></span>
                      <span>Secure Verification</span>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default PricingView;
