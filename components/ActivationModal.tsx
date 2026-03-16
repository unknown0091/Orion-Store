
import React from 'react';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { STORE_PACKAGES, WOO_API_ENDPOINT } from '../constants';
import { StorePackage } from '../types';

interface ActivationModalProps {
  onClose: () => void;
  onGoToPricing: () => void;
  onActivate: (pkg: StorePackage) => void;
}

const ActivationModal: React.FC<ActivationModalProps> = ({ onClose, onGoToPricing, onActivate }) => {
  const [emailField, setEmailField] = React.useState('');
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [verifyError, setVerifyError] = React.useState<string | null>(null);

  const handlePricingClick = () => {
    Haptics.impact({ style: ImpactStyle.Medium });
    onGoToPricing();
  };

  const verifyPurchase = async () => {
    if (!emailField || !emailField.includes('@')) {
      setVerifyError("Enter a valid email.");
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
          onClose();
        }
      } else {
        setVerifyError(data.message || "No order found.");
        Haptics.notification({ type: NotificationType.Error });
      }
    } catch (e) {
      // Mock logic for demo
      if (emailField === 'demo@orion.com') {
          const pkg = STORE_PACKAGES.find(p => p.id === 'pkg_pro');
          if (pkg) { onActivate(pkg); onClose(); }
      } else {
          setVerifyError("Verification failed.");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div 
        className="bg-card w-full max-w-sm rounded-[3.5rem] p-10 border border-theme-border shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] text-center relative overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Visual Decoration */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-acid/5 rounded-full blur-3xl"></div>

        <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-600 text-white rounded-[2rem] flex items-center justify-center text-5xl mb-8 mx-auto shadow-2xl shadow-amber-500/30 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                <i className="fas fa-lock-open-alt"></i>
            </div>

            <h3 className="text-3xl font-black text-theme-text mb-4 tracking-tight leading-tight">
                Activation <span className="text-primary italic">Required!</span>
            </h3>
            
            <p className="text-theme-sub text-sm mb-10 leading-relaxed font-semibold">
                To keep <span className="text-theme-text font-black">Pretub Store</span> serverless and high-performance, downloading apps requires a one-time lifetime activation.
                <br /><br />
                Support the developers and unlock all premium features forever.
            </p>

            <div className="flex flex-col gap-3">
                <button 
                    onClick={handlePricingClick}
                    className="w-full py-5 bg-primary text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all transform flex items-center justify-center gap-3"
                >
                    <i className="fas fa-shopping-cart text-sm"></i>
                    <span>Get Lifetime Access</span>
                </button>

                <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-theme-border"></div></div>
                    <div className="relative flex justify-center text-[10px] uppercase font-black text-theme-sub"><span className="bg-card px-2">Or Verify Email</span></div>
                </div>

                <div className="space-y-3">
                    <input 
                        type="email"
                        placeholder="Your purchase email"
                        className={`w-full bg-theme-input border-2 ${verifyError ? 'border-red-500/50' : 'border-theme-border'} rounded-2xl px-5 py-3 text-sm font-bold focus:border-primary outline-none transition-all`}
                        value={emailField}
                        onChange={(e) => setEmailField(e.target.value)}
                    />
                    <button 
                        onClick={verifyPurchase}
                        disabled={isVerifying}
                        className="w-full py-4 bg-theme-text text-surface rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        {isVerifying ? <i className="fas fa-circle-notch animate-spin"></i> : <i className="fas fa-shield-check"></i>}
                        <span>{isVerifying ? 'Checking...' : 'Activate via Email'}</span>
                    </button>
                    {verifyError && <p className="text-red-500 text-[9px] font-black uppercase text-center mt-1">{verifyError}</p>}
                </div>
                
                <button 
                    onClick={onClose}
                    className="w-full py-3 text-theme-sub rounded-[1.5rem] font-bold text-xs hover:bg-theme-element transition-colors"
                >
                    Maybe Later
                </button>
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-theme-sub font-black uppercase tracking-widest opacity-50">
                <i className="fas fa-shield-check text-green-500"></i>
                <span>One-time Payment • Life-time Access</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ActivationModal;
