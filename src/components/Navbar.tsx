'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/wardrobe', label: 'Closet', icon: '👗' },
  { href: '/add', label: 'Add', icon: '✨', isCenter: true },
  { href: '/outfits', label: 'Outfits', icon: '💅' },
  { href: '/analytics', label: 'Stats', icon: '📊' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom glass-strong">
      <div className="max-w-lg mx-auto flex items-end justify-around px-2 pt-2 pb-1">
        {tabs.map(({ href, label, icon, isCenter }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 transition-all ${
                isCenter ? '-mt-4' : ''
              }`}
            >
              {isCenter ? (
                <span
                  className="w-12 h-12 rounded-2xl btn-pastel flex items-center justify-center text-xl shadow-lg mb-0.5"
                >
                  {icon}
                </span>
              ) : (
                <span className={`text-xl transition-transform ${active ? 'scale-110' : ''}`}>
                  {icon}
                </span>
              )}
              <span
                className={`text-[10px] font-medium transition-colors ${
                  active ? 'text-pink-dark' : 'text-muted'
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
