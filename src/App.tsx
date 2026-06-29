import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import ParallaxHero from "./components/ParallaxHero";
import BrandStats from "./components/BrandStats";
import ProductSpecs from "./components/ProductSpecs";
import PremiumBenefits from "./components/PremiumBenefits";
import CompanyAdvantages from "./components/CompanyAdvantages";
import ProductCatalog from "./components/ProductCatalog";
import InquiryForm from "./components/InquiryForm";
import AdminPanel from "./components/AdminPanel";

import { MenuSection, Inquiry } from "./types";
import { IMAGES } from "./assets";
import { Flame, Award, ShieldCheck } from "lucide-react";

export default function App() {
  const [activeSection, setActiveSection] = useState<MenuSection>("hero");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  // Function to scan localStorage and count pending inbox items
  const updatePendingCount = () => {
    try {
      const existingStr = localStorage.getItem("son_inquiries");
      if (existingStr) {
        const inquiries: Inquiry[] = JSON.parse(existingStr);
        const pending = inquiries.filter((inq) => inq.status === "pending").length;
        setPendingCount(pending);
      } else {
        setPendingCount(0);
      }
    } catch (e) {
      console.error("Local storage lookup triggered an error", e);
    }
  };

  // Sync count on boot
  useEffect(() => {
    updatePendingCount();
    
    // Setup observer to change active tab in header during scroll
    const handleScrollSpy = () => {
      const scrollPosition = window.scrollY + 200;
      const heroEl = document.getElementById("parallax-container");
      const brandEl = document.getElementById("brand");
      const productsEl = document.getElementById("products");
      const inquiryEl = document.getElementById("inquiry");

      if (inquiryEl && scrollPosition >= inquiryEl.offsetTop) {
        setActiveSection("inquiry");
      } else if (productsEl && scrollPosition >= productsEl.offsetTop) {
        setActiveSection("products");
      } else if (brandEl && scrollPosition >= brandEl.offsetTop) {
        setActiveSection("brand");
      } else {
        setActiveSection("hero");
      }
    };

    window.addEventListener("scroll", handleScrollSpy, { passive: true });
    return () => window.removeEventListener("scroll", handleScrollSpy);
  }, []);

  // Soft trigger for parallax hero button
  const handleScrollToSection = (section: MenuSection) => {
    setActiveSection(section);
    const targetId = section === "hero" ? "parallax-container" : section;
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleProductSelection = (productName: string) => {
    setSelectedProduct(productName);
  };

  return (
    <div id="app-root" className="min-h-screen bg-[#0F0F0F] text-slate-100 flex flex-col font-sans antialiased overflow-x-hidden selection:bg-[#FF4D00] selection:text-black">
      
      {/* Dynamic Navigation Bar Header */}
      <Header
        activeSection={activeSection}
        onNavigate={handleScrollToSection}
        onOpenAdmin={() => setIsAdminOpen(true)}
        pendingInquiriesCount={pendingCount}
      />

      {/* Main Sections */}
      <main className="flex-grow">
        
        {/* Parallax Hero section with interactive Snowflake canvas */}
        <ParallaxHero onExploreClick={() => handleScrollToSection("brand")} />

        {/* Step 1: 평점 통계 (Ratings & statistics of Coupons & Smart Store) */}
        <BrandStats />

        {/* Step 2: 제품 장점 (Superior high temp, hours, components, line-up specs) */}
        <ProductSpecs />

        {/* Step 3: 고객 3대 독점 혜택 (Pouch, express delivery, and fast care) */}
        <PremiumBenefits />

        {/* Step 4: 회사 장점 (Production capacity, direct warehouse logistics, next-morning shipping) */}
        <CompanyAdvantages />

        {/* Step 5: 카탈로그 (High clarity grid showcasing all certified products) */}
        <ProductCatalog onSelectProductForInquiry={handleProductSelection} />

        {/* Section 3: Quotation & Bulk Ordering form */}
        <InquiryForm
          selectedProductName={selectedProduct}
          onInquirySubmitted={updatePendingCount}
        />

      </main>

      {/* ROK military defense certified footer with geometric layout */}
      <footer id="brand-footer" className="bg-[#0F0F0F] border-t border-white/10 py-16 text-white/50 text-xs sm:text-sm font-sans select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 border-b border-white/10 pb-12 items-start text-left">
            
            {/* Signature logo and desc with strict geometric S box */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={IMAGES.sonLogoWh}
                  alt="손일병 핫팩"
                  className="h-8 w-auto object-contain"
                />
              </div>
              <p className="text-white/40 text-xs leading-relaxed max-w-sm">
                '손일병 핫팩' 은 대한민국의 추운 겨울을 막아주는 방한용 보온대로서 낚시전문 브랜드 '손피싱'의 핫팩 브랜드입니다.
              </p>
              
              <div className="flex items-center gap-2 pt-2">
                <span className="inline-flex items-center px-2 py-1 bg-white/5 border border-white/10 text-white text-[9px] font-black uppercase tracking-wider rounded-none">
                  <ShieldCheck className="w-3 h-3 mr-1 text-[#FF4D00]" /> 군납 조달 등급 우수
                </span>
                <span className="inline-flex items-center px-2 py-1 bg-[#FF4D00]/10 border border-[#FF4D00]/25 text-[#FF4D00] text-[9px] font-black uppercase tracking-wider rounded-none">
                  <Award className="w-3 h-3 mr-1" /> 100% 국산 명품선언
                </span>
              </div>
            </div>

            {/* Quick specifications lists link */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-black text-white uppercase tracking-wider font-mono">회사 안내</h4>
              <ul className="space-y-1.5 text-xs text-white/40">
                <li>판매처 : (주)손피싱</li>
                <li>대표이메일 : <a href="mailto:sonfishing@naver.com" className="text-[#FF4D00] hover:underline">sonfishing@naver.com</a></li>
                <li>대표연락처 : 010-4345-2755</li>
                <li>사업자번호 : 459-81-00986</li>
              </ul>
            </div>

            {/* Legal guidelines and disclaimer */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="text-xs font-black text-white uppercase tracking-wider font-mono">사용자 취급 규격 주의서</h4>
              <p className="text-white/40 text-[11px] leading-relaxed">
                저온 화상을 원천 방지하기 위해 반드시 양말이나 내의 위에 부착하여 주시고 피부에 직접 오랜 시간 접촉되지 않도록 지도 바랍니다.
              </p>
            </div>
            
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-white/30 text-[11px] space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left leading-normal">
              <p>© 2026 손피싱(Son Fishing) Corp. All Rights Reserved. '손일병 핫팩' 브랜드 공식 포털.</p>
              <p className="mt-1 text-[10px] text-white/20">본 웹사이트에 기재된 군부대 납품 일례와 접수처는 가상 조달 모의 시뮬레이터로 구성되어 상시 테스트가 가능합니다.</p>
            </div>
            
            <div className="flex items-center gap-4 shrink-0 font-bold">
              <button
                onClick={() => setIsAdminOpen(true)}
                className="text-[#FF4D00] hover:underline transition-colors cursor-pointer text-xs uppercase tracking-wider font-mono font-black"
              >
                <span>가상 CRM 현황 관리자 패널 [OPEN]</span>
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive CRM Sales database drawer */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onInquiryChange={updatePendingCount}
      />
      
    </div>
  );
}
