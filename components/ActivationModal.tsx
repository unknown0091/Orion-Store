
import React from 'react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

interface ActivationModalProps {
  onClose: () => void;
  onGoToPricing: () => void;
}

const ActivationModal: React.FC<ActivationModalProps> = ({ onClose, onGoToPricing }) => {
  const handlePricingClick = () => {
    Haptics.impact({ style: ImpactStyle.Medium });
    onGoToPricing();
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

            <div className="flex flex-col gap-4">
                <button 
                    onClick={handlePricingClick}
                    className="w-full py-5 bg-primary text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all transform flex items-center justify-center gap-3"
                >
                    <i className="fas fa-shopping-cart text-sm"></i>
                    <span>Get Lifetime Access</span>
                </button>
                
                <button 
                    onClick={onClose}
                    className="w-full py-4 bg-theme-element text-theme-sub rounded-[1.5rem] font-bold text-sm hover:bg-theme-hover transition-colors"
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
