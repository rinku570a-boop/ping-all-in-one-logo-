
import React from 'react';

export const APP_NAME = "Ping Online";
export const CURRENCY = "৳";

export const ZONES = ['BR', 'DG', 'ME', 'AG'];

export const CATEGORIES = [
  "অফিস ভাড়া",
  "ব্যান্ডউইথ খরচ",
  "বিদ্যুৎ বিল",
  "রক্ষণাবেক্ষণ",
  "মার্কেটিং",
  "স্টাফ নাস্তা/আপ্যায়ন",
  "অন্যান্য"
];

export const Logo = ({ className = "w-12 h-12", textColor = "text-slate-900", iconOnly = false }: { className?: string, textColor?: string, iconOnly?: boolean }) => (
  <div className={`flex flex-col items-center justify-center ${className}`}>
    <svg viewBox="0 0 240 240" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 3-Line Interlocking Arcs based on the image */}
      <g className="stroke-current text-blue-600" strokeWidth="4" strokeLinecap="round">
        {/* Arc Group 1 */}
        <path d="M120 40 C160 40, 190 70, 190 110" strokeWidth="3" opacity="0.4" />
        <path d="M120 50 C155 50, 180 75, 180 110" strokeWidth="4" opacity="0.7" />
        <path d="M120 60 C150 60, 170 80, 170 110" strokeWidth="5" />

        {/* Arc Group 2 (Rotated 120 deg) */}
        <g transform="rotate(120 120 110)">
          <path d="M120 40 C160 40, 190 70, 190 110" strokeWidth="3" opacity="0.4" />
          <path d="M120 50 C155 50, 180 75, 180 110" strokeWidth="4" opacity="0.7" />
          <path d="M120 60 C150 60, 170 80, 170 110" strokeWidth="5" />
        </g>

        {/* Arc Group 3 (Rotated 240 deg) */}
        <g transform="rotate(240 120 110)">
          <path d="M120 40 C160 40, 190 70, 190 110" strokeWidth="3" opacity="0.4" />
          <path d="M120 50 C155 50, 180 75, 180 110" strokeWidth="4" opacity="0.7" />
          <path d="M120 60 C150 60, 170 80, 170 110" strokeWidth="5" />
        </g>
      </g>
      
      {!iconOnly && (
        <>
          <text x="120" y="195" textAnchor="middle" className={`fill-current ${textColor} font-black text-[42px] tracking-tight`}>PING</text>
          <text x="120" y="225" textAnchor="middle" className={`fill-current ${textColor} font-bold text-[18px] tracking-[0.4em]`}>ONLINE</text>
        </>
      )}
    </svg>
  </div>
);

export const ICONS = {
  Dashboard: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>,
  Users: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Billing: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>,
  Invoice: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>,
  Expense: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Report: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>,
  Staff: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Help: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
};
