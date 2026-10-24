import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { useTranslation } from '../i18n/useTranslation.ts';
import { Compass, MessageCircle, Flame, UserCheck, Clock, FileText, Users, Radio, Mic, Headphones } from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab }) => {
  const { role, setRole, isPartnerAuthenticated } = useApp();
  const { t } = useTranslation();

  const items = [
    { id: 'astrologers', label: 'Pandits', icon: MessageCircle },
    { id: 'async-qa', label: 'Ask (Voice)', icon: Mic },
    { id: 'daily-audio', label: 'Audio Fal', icon: Headphones },
    { id: 'live-puja', label: 'Live Puja', icon: Radio },
    { id: 'family-vault', label: 'Vault', icon: Users },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-stone-950/95 backdrop-blur-md border-t border-orange-200/60 dark:border-stone-800 px-2 py-1.5 shadow-2xl">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id && role === 'user';
          return (
            <button
              key={item.id}
              onClick={() => {
                if (role === 'partner') setRole('user');
                setActiveTab(item.id);
              }}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
                isActive
                  ? 'text-orange-600 dark:text-orange-400 font-bold'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}

        {/* Partner Role Toggle / Console button */}
        <button
          onClick={() => {
            if (role === 'user') setRole('partner');
            else setRole('user');
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
            role === 'partner'
              ? 'text-orange-500 font-bold'
              : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <UserCheck className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">
            {role === 'partner' && isPartnerAuthenticated ? 'Console' : 'Partner'}
          </span>
        </button>
      </div>
    </div>
  );
};
