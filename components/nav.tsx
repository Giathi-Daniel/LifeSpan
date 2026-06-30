"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Timeline", href: "/timeline" },
  { label: "Milestones", href: "/milestones" },
  { label: "About", href: "/about" },
];

export function Nav() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const headerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  function toggleTheme() {
    setTheme(isDark ? "light" : "dark");
  }

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      
      if (
        mobileMenuOpen && 
        headerRef.current && 
        menuRef.current &&
        !headerRef.current.contains(target) &&
        !menuRef.current.contains(target)
      ) {
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <div className="overflow-x-hidden w-full">
        <header ref={headerRef} className="sticky top-0 z-50 backdrop-blur-sm bg-white/90 dark:bg-slate-950/80 border-b border-gray-200 dark:border-slate-800">
          <nav className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center gap-3" 
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">LifeSpan</span>
            </Link>

            <div className="flex items-center gap-6">
              
              {/* Desktop Links */}
              <div className="hidden md:flex items-center gap-8">
                {navLinks.map(({ label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`font-medium transition-colors ${
                      pathname === href
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>

              {/* Theme Toggle */}
              {mounted && (
                <button
                  onClick={toggleTheme}
                  aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                  {isDark ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="4"/>
                      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                    </svg>
                  )}
                </button>
              )}

              {/* Hamburger Menu Button */}
              <button
                className="md:hidden flex items-center justify-center w-10 h-10 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors z-50 relative"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </svg>
                )}
              </button>
            </div>
          </nav>

          <div 
            ref={menuRef}
            className={`fixed top-[72px] right-0 w-64 bg-white dark:bg-slate-950 border-l border-gray-200 dark:border-slate-800 shadow-xl transform transition-transform duration-300 ease-in-out z-40 md:hidden
              ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
            style={{ 
              visibility: mobileMenuOpen ? 'visible' : 'hidden',
              position: 'fixed'
            }}
          >
            <div className="flex flex-col pt-8 px-6 min-w-[16rem]">
              <div className="flex flex-col gap-4">
                {navLinks.map(({ label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-lg font-medium transition-colors py-2 ${
                      pathname === href
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </header>
      </div>
    </>
  );
}
