import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
  text: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ text }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block ml-1.5 group pointer-events-auto">
      <div 
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="cursor-help transition-colors text-slate-400 hover:text-primary"
      >
        <Info className="w-4 h-4" />
      </div>
      
      {isVisible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 md:w-80 p-3 bg-on-surface text-surface text-xs rounded-xl shadow-2xl z-[60] animate-in fade-in zoom-in duration-200 pointer-events-none">
          <div className="relative">
            {text}
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-on-surface"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoTooltip;
