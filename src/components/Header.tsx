import React, { useState, useEffect } from "react";
import { Menu, X, Flame, ShieldCheck, Mail } from "lucide-react";
import { MenuSection } from "../types";
import { IMAGES } from "../assets";

interface HeaderProps {
  activeSection: MenuSection;
  onNavigate: (section: MenuSection) => void;
  onOpenAdmin: () => void;
  pendingInquiriesCount: number;
}

export default function Header({
  activeSection,
  onNavigate,
  onOpenAdmin,
  pendingInquiriesCount,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "brand" as MenuSection, label: "브랜드 소개" },
    { id: "products" as MenuSection, label: "제품 소개" },
    { id: "inquiry" as MenuSection, label: "견적 및 대량주문 문의" },
  ];

  const handleNavClick = (section: MenuSection) => {
    onNavigate(section);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md border-b border-[#1F3821]/10 py-3"
          : "bg-gradient-to-b from-black/85 via-black/50 to-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            id="header-logo"
            onClick={() => handleNavClick("hero")}
            className="flex items-center cursor-pointer group"
          >
            <img
              src={isScrolled ? IMAGES.sonLogo : IMAGES.sonLogoWh}
              alt="손일병 핫팩"
              className="h-10 w-auto object-contain transition-transform group-hover:scale-105 duration-300"
            />
          </div>

          {/* Desktop Navigation */}
          <div id="desktop-nav" className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm font-bold tracking-tight transition-colors relative py-1.5 cursor-pointer ${
                  activeSection === item.id
                    ? "text-[#FF4D00]"
                    : isScrolled
                    ? "text-black hover:text-[#1F3821]"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF4D00]" />
                )}
              </button>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 border transition-colors cursor-pointer ${
                isScrolled
                  ? "bg-stone-100 border-stone-200 text-black hover:bg-stone-200"
                  : "bg-white/10 border-white/25 text-white/80 hover:text-white"
              }`}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div id="mobile-nav-panel" className={`md:hidden border-b transition-colors ${
          isScrolled ? "bg-white border-stone-200" : "bg-[#1F3821] border-white/10"
        } animate-slide-in`}>
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`block w-full text-left px-4 py-3 text-base font-bold transition-colors ${
                  activeSection === item.id
                    ? isScrolled
                      ? "bg-stone-100 text-[#FF4D00] border-l-4 border-[#FF4D00]"
                      : "bg-white/10 text-[#FF4D00] border-l-4 border-[#FF4D00]"
                    : isScrolled
                    ? "text-black hover:bg-stone-50"
                    : "text-white/80 hover:bg-white/5"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
